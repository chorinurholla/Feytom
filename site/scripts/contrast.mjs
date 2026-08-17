#!/usr/bin/env node
/**
 * Feytom — contrast gate.
 * Parses src/styles/tokens.css, resolves var() aliases, and measures every
 * declared foreground/background pairing against WCAG 2.x.
 *
 * Exits non-zero if any pairing marked `required` fails its target.
 * This is a build gate, not a report.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "../src/styles/tokens.css"), "utf8")
  // strip block comments first — they contain colons and semicolons
  .replace(/\/\*[\s\S]*?\*\//g, "");

/* ---------- token resolution ---------- */
const raw = {};
for (const [, name, value] of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
  raw[name] = value.trim();
}
const resolveToken = (name, seen = new Set()) => {
  if (seen.has(name)) throw new Error(`Circular token: ${name}`);
  seen.add(name);
  const v = raw[name];
  if (!v) throw new Error(`Unknown token: ${name}`);
  const alias = v.match(/^var\((--[\w-]+)\)$/);
  return alias ? resolveToken(alias[1], seen) : v;
};

/* ---------- WCAG 2.x ---------- */
const srgb = (hex) => {
  const h = hex.replace("#", "");
  const n =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
};
const luminance = (hex) => {
  const [r, g, b] = srgb(hex).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

/* ---------- the pairings this design system actually uses ---------- */
// role: 'text'       → AA 4.5:1 (SC 1.4.3)
//       'large'      → AA 3:1  (SC 1.4.3, >=24px or >=18.66px bold)
//       'nontext'    → AA 3:1  (SC 1.4.11 — form outlines, focus rings, meaningful
//                               component boundaries, graphics needed to understand content)
//       'decorative' → no target. SC 1.4.11 explicitly exempts purely decorative
//                      elements. Measured and printed so the choice is evidenced,
//                      but it cannot fail the gate. Anything a user must PERCEIVE
//                      to operate the interface must be 'nontext', not 'decorative'.
const PAIRS = [
  // Light surfaces
  ["--color-text", "--color-bg", "text", "Body copy on white"],
  ["--color-heading", "--color-bg", "text", "Headings on white"],
  ["--color-text-muted", "--color-bg", "text", "Muted copy on white"],
  ["--color-text", "--color-bg-subtle", "text", "Body copy on sand"],
  ["--color-heading", "--color-bg-subtle", "text", "Headings on sand"],
  ["--color-border", "--color-bg", "decorative", "Hairline divider on white (decorative only)"],
  ["--color-border-strong", "--color-bg", "nontext", "Input outline / meaningful boundary on white"],
  ["--color-focus", "--color-bg", "nontext", "Focus ring on white"],
  // Action colour
  ["--color-action-text", "--color-action", "text", "Button label on orange"],
  ["--color-action-text", "--color-action-hover", "text", "Button label on orange (hover)"],
  ["--color-action", "--color-bg", "nontext", "Orange as border / UI boundary on white"],
  ["--color-action", "--color-bg", "large", "Orange as LARGE display text on white"],
  // Dark surfaces
  ["--color-text-inverse", "--color-bg-inverse", "text", "White on navy"],
  ["--color-text-inverse", "--color-bg-inverse-deep", "text", "White on deep navy"],
  ["--color-text-inverse-muted", "--color-bg-inverse", "text", "Muted on navy"],
  ["--color-text-inverse-muted", "--color-bg-inverse-deep", "text", "Muted on deep navy"],
  ["--color-action", "--color-bg-inverse-deep", "text", "Orange eyebrow on deep navy"],
  ["--color-action", "--color-bg-inverse-deep", "nontext", "Orange strap device on deep navy"],
  ["--color-focus-inverse", "--color-bg-inverse-deep", "nontext", "Focus ring on deep navy"],
  ["--color-border-inverse", "--color-bg-inverse", "decorative", "Divider on navy (decorative only)"],
  ["--color-border-inverse-strong", "--color-bg-inverse", "nontext", "Input outline / meaningful boundary on navy"],
  // Status
  ["--color-error", "--color-bg", "text", "Error text on white"],
  ["--color-success", "--color-bg", "text", "Success text on white"],
  ["--color-pending", "--color-bg-subtle", "text", "Pending-verification text on sand"],
  // Known-restricted: measured so the restriction is evidenced, not asserted
  ["--feytom-steel", "--color-bg", "nontext", "Steel — borders/icons ONLY (fails as body text)"],
  ["--feytom-white", "--color-action", "large", "White on orange — LARGE text only"],
];

const TARGET = { text: 4.5, large: 3, nontext: 3, decorative: 0 };

let failed = 0;
const rows = PAIRS.map(([fgTok, bgTok, role, label]) => {
  const fg = resolveToken(fgTok);
  const bg = resolveToken(bgTok);
  const r = ratio(fg, bg);
  const pass = r >= TARGET[role];
  if (!pass) failed++;
  return {
    label,
    fg,
    bg,
    role,
    r: Math.round(r * 100) / 100,
    pass,
    verdict: role === "decorative" ? "n/a" : pass ? "PASS" : "FAIL",
  };
});

const pad = (s, n) => String(s).padEnd(n);
console.log(
  `\n${pad("PAIRING", 50)}${pad("FG", 10)}${pad("BG", 10)}${pad("ROLE", 12)}${pad("RATIO", 9)}RESULT`
);
console.log("-".repeat(97));
for (const r of rows) {
  console.log(
    `${pad(r.label, 50)}${pad(r.fg, 10)}${pad(r.bg, 10)}${pad(r.role, 12)}${pad(
      r.r.toFixed(2) + ":1",
      9
    )}${r.verdict}`
  );
}
console.log("-".repeat(93));
console.log(
  `${rows.length} pairings checked · ${rows.length - failed} pass · ${failed} fail\n`
);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(rows, null, 2));
}
if (failed > 0) {
  console.error(`Contrast gate FAILED: ${failed} pairing(s) below WCAG 2.2 AA.`);
  process.exit(1);
}
