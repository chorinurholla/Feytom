#!/usr/bin/env node
/**
 * Feytom — content guard.
 *
 * §16 makes "no invented business facts or safety claims" a non-negotiable
 * build check. As written it depends on whoever edited content last
 * remembering the rule. This makes it mechanical: the build FAILS if a
 * restricted claim reaches a publishable file.
 *
 * Comments are stripped before scanning — the guard polices what ships to a
 * visitor, not what the team writes to each other in the source.
 *
 * Every exception lives in content-guard.allow.json with a written reason, so
 * the list of things we deliberately permit is one reviewable file.
 */
import { readFileSync, existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative, extname } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "..");
const SCAN_DIRS = ["src"];
const SCAN_EXT = new Set([".astro", ".md", ".mdx", ".json", ".yaml", ".yml", ".ts", ".html"]);

/* ------------------------------------------------------------------ rules */
const RULES = [
  // --- Safety and compliance: forbidden until manufacturer docs are supplied (§2, §5.3)
  { id: "wll", re: /\bworking[\s-]load[\s-]limits?\b|\bWLL\b/gi, why: "Working load limit — requires manufacturer documentation (§19)" },
  { id: "breaking-strength", re: /\bbreaking[\s-]strengths?\b|\btensile[\s-]strengths?\b/gi, why: "Strength claim — requires manufacturer documentation" },
  { id: "rated-capacity", re: /\brated[\s-]capacit(y|ies)\b|\bload[\s-]ratings?\b/gi, why: "Capacity claim — requires manufacturer documentation" },
  { id: "certified", re: /\bcertified\b|\bcertifications?\b|\bcertificates? of\b/gi, why: "Certification claim — none are verified (§2)" },
  { id: "regulator", re: /\bOSHA\b|\bDOT[\s-]approved\b|\bFMCSA\b|\bcompliant with\b/gi, why: "Regulatory approval claim — unverified" },
  { id: "superlative", re: /\bguaranteed?\b|\bsafest\b|\bstrongest\b|\bunbreakable\b|\bbest[\s-]in[\s-]class\b|\bworld[\s-]class\b|\bindustry[\s-]leading\b/gi, why: "Unsupported superlative (§3.6)" },

  // --- Commerce: no price, cart or inventory in the MVP (§6)
  { id: "price", re: /(?<![\w#])\$\s?\d/g, why: "Price — no pricing is approved for publication (§6)" },
  { id: "cart", re: /\badd to cart\b|\bbuy now\b|\bcheckout\b|\bshopping cart\b/gi, why: "Transactional UI — MVP is catalog + RFQ, not ecommerce (§6)" },
  { id: "inventory", re: /\bin stock\b|\bout of stock\b|\b\d+\s+(?:units?|rolls?|drums?|bags?)\s+available\b/gi, why: "Inventory claim — no stock data is approved (§19)" },

  // --- Fulfilment promises (§2, §19)
  { id: "delivery", re: /\bsame[\s-]day\b|\bnext[\s-]day\b|\bfree shipping\b|\bships? (?:in|within)\b|\b\d+[\s-]day delivery\b|\bimmediate nationwide delivery\b/gi, why: "Delivery promise — shipping policy is unapproved (§19)" },

  // --- Generic marketing language the brand voice forbids (§3.6)
  { id: "filler", re: /\bwelcome to our website\b|\bwe are passionate about\b|\byour trusted partner\b|\bone[\s-]stop shop\b|\bquality is our priority\b|\bgo above and beyond\b|\binnovative solutions\b|\belevate your (?:experience|business)\b|\btransform your journey\b|\bunlock your\b/gi, why: "Generic marketing filler (§3.6)" },
];

/* -------------------------------------------------------------- allowlist */
const allowPath = resolve(ROOT, "content-guard.allow.json");
const allow = existsSync(allowPath)
  ? JSON.parse(readFileSync(allowPath, "utf8"))
  : { exceptions: [] };

const isAllowed = (file, ruleId, matched) =>
  allow.exceptions.some(
    (e) =>
      file === e.file &&
      e.rule === ruleId &&
      (!e.match || matched.toLowerCase().includes(e.match.toLowerCase()))
  );

/* ------------------------------------------------------------ comment strip */
const stripComments = (src, ext) => {
  let out = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  out = out.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));
  if (ext !== ".json") {
    // only line-leading // — never a protocol in a URL
    out = out.replace(/^(\s*)\/\/.*$/gm, (m, s) => s + " ".repeat(m.length - s.length));
  }
  return out;
};

/* ------------------------------------------------------------------- walk */
const files = [];
const walk = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "dist", ".astro"].includes(entry.name)) continue;
      await walk(p);
    } else if (SCAN_EXT.has(extname(entry.name))) {
      files.push(p);
    }
  }
};
for (const d of SCAN_DIRS) {
  const p = resolve(ROOT, d);
  if (existsSync(p)) await walk(p);
}

/* ------------------------------------------------------------------- scan */
const findings = [];
for (const abs of files) {
  const rel = relative(ROOT, abs);
  const ext = extname(abs);
  const text = stripComments(readFileSync(abs, "utf8"), ext);
  const lines = text.split("\n");

  for (const rule of RULES) {
    rule.re.lastIndex = 0;
    let m;
    while ((m = rule.re.exec(text)) !== null) {
      const before = text.slice(0, m.index);
      const line = before.split("\n").length;
      const col = m.index - before.lastIndexOf("\n");
      if (isAllowed(rel, rule.id, m[0])) continue;
      findings.push({
        file: rel,
        line,
        col,
        rule: rule.id,
        matched: m[0].trim(),
        why: rule.why,
        context: (lines[line - 1] ?? "").trim().slice(0, 110),
      });
    }
  }
}

/* ----------------------------------------------------------------- report */
if (findings.length === 0) {
  console.log(
    `Content guard: ${files.length} file(s) scanned, ${RULES.length} rules, 0 violations.`
  );
  if (allow.exceptions.length) {
    console.log(`  ${allow.exceptions.length} documented exception(s) in content-guard.allow.json`);
  }
  process.exit(0);
}

console.error(`\nContent guard FAILED — ${findings.length} restricted claim(s):\n`);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}:${f.col}  [${f.rule}]  "${f.matched}"`);
  console.error(`    ${f.why}`);
  console.error(`    → ${f.context}\n`);
}
console.error(
  "Remove the claim, or add a documented exception to content-guard.allow.json.\n"
);
process.exit(1);
