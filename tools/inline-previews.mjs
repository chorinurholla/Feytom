#!/usr/bin/env node
/**
 * Build single-file, self-contained previews of key pages.
 * CSS and woff2 fonts are inlined so each file opens in any browser with no
 * server and no build. Internal links are inert by nature (no server), which
 * the footer banner states rather than leaving the reader to discover.
 *
 * Usage: node tools/inline-previews.mjs <outDir>   (run from site/)
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";

const outDir = process.argv[2] ?? "../previews";
mkdirSync(outDir, { recursive: true });

const fonts = readdirSync("public/fonts").map((f) => [
  f,
  readFileSync(`public/fonts/${f}`).toString("base64"),
]);
const cssFiles = readdirSync("dist/_astro").filter((f) => f.endsWith(".css"));
const fav = readFileSync("public/favicon-32.png").toString("base64");

const PAGES = [
  ["dist/index.html", "home.html", "Home — all eight modules"],
  ["dist/products/index.html", "catalog.html", "Catalog index — /products"],
  [
    "dist/products/cargo-securement/chains/grade-70-truckers-chain-5-16in-20ft/index.html",
    "product.html",
    "Product detail — Grade 70 Trucker's Chain",
  ],
  ["dist/request-a-quote/index.html", "quote.html", "Request a Quote — honest unconfigured state"],
];

for (const [src, name, banner] of PAGES) {
  let html = readFileSync(src, "utf8");
  for (const c of cssFiles) {
    const css = readFileSync(`dist/_astro/${c}`, "utf8");
    html = html.replace(
      new RegExp(`<link rel="stylesheet" href="/_astro/${c}"\\s*/?>`),
      `<style>${css}</style>`
    );
  }
  for (const [f, b64] of fonts) {
    html = html.split(`/fonts/${f}`).join(`data:font/woff2;base64,${b64}`);
  }
  html = html.replace(/<link rel="preload"[^>]*>/g, "");

  /* A standalone preview does not need a responsive image set. Collapse each
     <picture> to one mid-size AVIF first, or inlining every avif + webp + jpeg
     variant turns a 140KB file into 5MB. */
  html = html.replace(/<source[^>]*>/g, "");
  html = html.replace(/<img([^>]*)>/g, (tag, attrs) => {
    const set = attrs.match(/srcset="([^"]*)"/);
    let out = attrs;
    if (set) {
      const cands = set[1].split(",").map((s) => s.trim().split(/\s+/));
      const pick = cands.find((c) => c[1] === "600w") ?? cands[Math.floor(cands.length / 2)];
      if (pick) out = out.replace(/src="[^"]*"/, `src="${pick[0]}"`);
    }
    out = out.replace(/\ssrcset="[^"]*"/, "").replace(/\ssizes="[^"]*"/, "");
    return `<img${out}>`;
  });

  /* Inline the images too. Without this a standalone preview shows broken
     images, because /_astro/... does not resolve from a bare file. Only the
     variants the page actually references are inlined, so the file stays
     sendable. */
  const MIME = { avif: "image/avif", webp: "image/webp", jpeg: "image/jpeg",
                 jpg: "image/jpeg", png: "image/png", svg: "image/svg+xml" };
  const refs = [...new Set(html.match(/\/_astro\/[A-Za-z0-9._-]+\.(?:avif|webp|jpeg|jpg|png|svg)/g) ?? [])];
  for (const ref of refs) {
    const ext = ref.split(".").pop();
    const file = `dist${ref}`;
    if (!existsSync(file)) continue;
    const b64 = readFileSync(file).toString("base64");
    html = html.split(ref).join(`data:${MIME[ext]};base64,${b64}`);
  }
  html = html.split("/favicon-32.png").join(`data:image/png;base64,${fav}`);
  html = html.replace(
    /<\/body>/,
    `<div style="background:#F4F1EA;border-top:3px solid #F36C21;padding:1.25rem 1.5rem;font:14px/1.6 system-ui,sans-serif;color:#52616D">
<strong style="color:#102A43">${banner}</strong> Standalone preview — internal links are inert here. Open <code>build/index.html</code> for the full navigable site. Logo artwork is provisional.
</div></body>`
  );
  writeFileSync(`${outDir}/${name}`, html);
  console.log(`   ${name}  ${(html.length / 1024) | 0}KB`);
}
