# Feytom — M1 Foundations + Home Hero Style Check

**Milestone:** M1 of M0–M8 · **Status:** complete, awaiting visual approval
**Date:** 16 August 2026
**Deliverables:** `feytom-m1-style-check.html` (self-contained preview) · `feytom-m1-source.zip` (full source)

---

## 1. What was built

| | |
|---|---|
| Stack | Astro 7.2.2, TypeScript strict, static output, plain CSS with custom-property tokens |
| Fonts | Barlow Condensed 700 + Inter 400/600, **self-hosted** woff2, latin subset, 70 KB total, preloaded, `font-display: swap` with metric overrides to prevent layout shift |
| Tokens | `src/styles/tokens.css` — §10.2 palette transcribed, plus spacing (8px base), layout, radii (2–6px), motion, focus |
| Logo | Provisional Open Loadlock suite — 5 SVGs, wordmark outlined from Barlow Condensed so it renders without a webfont |
| Components | `Logo`, `UtilityBar`, `Header` (responsive nav), `StrapDevice`, `Hero`, `BaseLayout`, button/link/plate/rule primitives |
| Build gates | `npm run build` = contrast gate → content guard → Astro build. Either gate failing stops the build. |

**Page weight (the whole hero page):** 9.2 KB HTML (3.1 KB gzipped) · 13.5 KB CSS (3.5 KB gzipped) · 70 KB fonts · **zero JavaScript files** — the 12-line nav toggle is inlined. No third-party origins, no network requests beyond the page itself.

## 2. The two build gates

**Contrast gate** (`scripts/contrast.mjs`) parses the token file, resolves `var()` aliases, and measures 26 real pairings against WCAG 2.x. It exits non-zero on failure, so an inaccessible colour cannot ship. Decorative pairings are measured and printed but exempt per SC 1.4.11 — the exemption is explicit in the code, not implied by omission.

| Pairing | Ratio | Role |
|---|---|---|
| Body copy Iron on white | 15.11:1 | AA |
| Headings Navy on white | 14.64:1 | AA |
| Muted `#52616D` on white | 6.38:1 | AA |
| White on deep navy (hero) | 17.22:1 | AA |
| Muted `#A9B8C6` on deep navy | 8.49:1 | AA |
| **Iron label on Signal Orange** | **5.02:1** | AA |
| **Iron label on hover orange** | **5.82:1** | AA |
| Orange eyebrow on deep navy | 5.72:1 | AA |
| Orange as border / large text on white | 3.01:1 | AA non-text + large only |
| Input outline Steel on white | 3.67:1 | AA non-text |
| Focus ring `#0067B1` on white | 5.87:1 | AA non-text |
| Focus ring `#7FC4FF` on deep navy | 9.22:1 | AA non-text |

26 pairings · 26 pass · 0 fail.

**Content guard** (`scripts/content-guard.mjs`) fails the build on restricted claims — WLL, breaking strength, certification, OSHA/DOT, superlatives, prices, cart UI, inventory, delivery promises, and the banned marketing filler from §3.6. Comments are stripped before scanning, so the team can discuss a restricted term in the source without tripping it. Exceptions live in `content-guard.allow.json` with a written reason — currently **zero**.

Verified with a planted violation file containing 10 breaches: all 10 caught with file, line, column, rule and reason; the same terms inside code comments correctly ignored.

## 3. Three things the gates caught that a review would have missed

**The conventional hover state was inaccessible.** Darkening Signal Orange on hover — the obvious industrial move — measured **3.95:1** against the Iron label and failed AA. The gate rejected it. Hover now *brightens* to `#FF7A33` (5.82:1). This is why the label colour override (D7c) had to come with a matching hover decision rather than being a one-line token swap.

**"Border" was doing two different jobs.** Galvanized `#DCE2E7` measures 1.31:1 on white — fine for a decorative hairline, and *not* fine as the perceivable outline of a form input, which SC 1.4.11 requires at 3:1. Splitting into `--color-border` (decorative) and `--color-border-strong` (Steel, 3.67:1) fixes this before M5 builds a form on top of the wrong token.

**The strap device was failing text contrast at every width.** The first pass put the diagonals behind the hero copy. White on orange is 3.01:1 — a hard AA failure on the lead paragraph at mobile. Fixed structurally: the straps live in a reserved grid column that contains no text, and below 60em they are **removed rather than shrunk**. Layout guarantees the rule instead of vigilance.

## 4. Verification results

| Check | Result |
|---|---|
| axe-core, WCAG 2.0/2.1/2.2 A+AA + best-practice, at 1440 / 768 / 320 | **0 violations** at all three |
| Horizontal overflow at 1440 / 1024 / 768 / 375 / 320 | **0 px** at all five |
| Keyboard traversal | 12 stops, all with a visible 3px focus ring; order is skip-link → brand → nav → quote → hero actions → catalog rail |
| Mobile menu | Opens on Enter, `aria-expanded` toggles, Escape closes and returns focus, accessible name "Menu" present even when the label is visually hidden |
| **JavaScript disabled** | Nav renders as a plain 4-link list, toggle hidden, quote action visible. Nothing is lost. |
| `prefers-reduced-motion` | All transitions and smooth scroll disabled |
| Contrast gate / content guard | Pass / pass, wired into `npm run build` |

## 5. Provisional logo

Drafted from the §10.1 description: an industrial plate with a clipped corner, an F whose top arm turns down into a hook, and a deliberate gap between that hook and the mid-arm — the "open loadlock". The clipped corner is filled Signal Orange, echoing the strap device. Legible at 16 px (favicon) through to large format.

The wordmark is outlined from Barlow Condensed Bold, so the SVGs are self-contained.

> **This is not the client's approved artwork.** It is a development stand-in so layout, spacing and colour can be judged. Every reference resolves through `src/components/global/Logo.astro`, so replacing the five files in `src/assets/logos/` with the supplied `Feytom_Loadlock_Primary_*.svg` swaps the mark everywhere with no other change. Do not use this mark for print, packaging or vehicle livery.

## 6. What this page is *not*

Modules 3–8 of §8.1 — product-family cards, featured products, value-pillar strip, industries section, safety/documentation callout and the closing RFQ panel — are deliberately absent. They depend on the M2 content layer and are built in M4–M6. **This is a style check, not a draft home page.** Judge the type, colour, spacing, logo and CTA hierarchy; the page is expected to be short.

The hero's right-hand column is the reserved slot for the hero photograph once approved imagery exists. The straps are the honest placeholder — not a stand-in pretending to be a photo.

## 7. Decision log — added at M1

| # | Decision | Reason | Status |
|---|---|---|---|
| D11 | Action hover **brightens** to `#FF7A33` rather than darkening | Darkening fails AA against the Iron label (3.95:1); brightening measures 5.82:1 | Applied |
| D12 | Split `--color-border` (decorative) from `--color-border-strong` (meaningful, ≥3:1) | Galvanized is 1.31:1 and cannot be a form-control outline | Applied |
| D13 | Nav is progressively enhanced: visible without JS, collapsed by JS below 60em | Guarantees the nav works with no JS; quote action sits outside the collapse (§14) | Applied |
| D14 | Hero straps confined to a reserved text-free column; removed below 60em | Structural guarantee that no text sits on orange | Applied |
| D15 | Utility bar nested inside the `<header>` banner landmark | Otherwise page content sits outside any landmark (axe "region") | Applied |
| D16 | Product metadata capped at 158 chars; page metadata uses a separate schema | The source's own approved home description is 175 chars | Noted for M7 |

## 8. Still pending — unchanged from the pre-build brief

RFQ delivery destination · verified contact details · approved privacy & terms · manufacturer technical documentation · **final logo route + real SVG files** · domain and hosting · product photography · SKUs/MOQ · shipping & returns policy · social profile URLs.

New: `FEYTOM_Product_List.pdf` arrived as a 0-byte upload — worth re-sending, as it sits at rank 5 in the source hierarchy.

## 9. Next action

Approve the visual direction (or tell me what to change), and confirm **D5–D10** from the pre-build brief. On approval I proceed to **M2 — content layer**: Zod schemas with the price/WLL/certification locks, the four seed product records transcribed from Appendix A, and a deliberately malformed record to prove the build fails on it.
