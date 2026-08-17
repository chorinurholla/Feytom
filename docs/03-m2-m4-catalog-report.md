# Feytom — M2–M4 + Pages: Content Layer, Catalog and Site

**Milestones:** M2 (content layer) · M3 (global shell) · M4 (catalog) · plus Home, Industries, About, Product Safety, Contact and the RFQ page
**Status:** complete and verified. M5 (server endpoint) is the only remaining build milestone, blocked on the RFQ destination.
**Trigger:** `FEYTOM_Product_List 2.pdf`, received 17 August 2026
**Date:** 17 August 2026

---

## 1. Does the PDF carry the content? Yes — and it created two conflicts

The PDF is text-only: no photography, no SKUs, no MOQ, no load ratings. Against Appendix A it **confirms** far more than it adds. What it genuinely contributed:

| New | Where it is now used |
|---|---|
| Combined size line per product — `2 in x 328 ft (100 m)` | New `sizeSummary` field. Drives the catalog card "Size" row, the placeholder plate, and the product selector in the quote form. It is the single most scannable fact on a card. |
| Category intro — "Dependable chains, lashing belts, and industrial rope for transportation, warehouse, and material-handling operations." | `/products` category introduction |
| Appendix B safety note, **verbatim identical** | Confirms the note we had already implemented — a useful independent check |
| Company descriptor "Warehouse and Industrial Supplies" | Footer description, Organization schema |

### The two conflicts, and how §20 resolved them

§20 ranks **the taxonomy (3) above the initial product-list PDF (5)**, so the taxonomy wins both. Each is recorded in the product record's `safety.withheldClaims` — an audit field that never renders to a page, so the decision is traceable a year from now.

**1. "High-strength Grade 70 transport chain…"** The PDF opens the Grade 70 description with *High-strength*; the taxonomy does not. §3.6 bans strength language until documented. Dropped. I also **added `high-strength` to the content guard's banned patterns**, so it cannot re-enter from a future copy edit.

**2. "…trucking, towing, and heavy-duty industrial applications."** The PDF lists **towing** as an application. §4 permits towing "where the product is appropriate and manufacturer documentation supports the application" — we hold no such documentation. Held back. Published applications for that product are now exactly: Cargo securement · Trucking · Heavy-duty industrial applications.

> **One consequence worth flagging.** I did **not** publish the PDF as a downloadable product list, even though it is client-authored and would be a useful download. It contains the "High-strength" claim we just removed from the site, so offering it would reintroduce through a download exactly what the page copy excludes. Supply a revised PDF without that phrase and I'll wire it onto `/products` in one step.

---

## 2. What was built

**16 pages, all generated from data.** No product fact is written into any template.

```
/                          Home — all 8 required modules (§8.1)
/products/                 Catalog index + progressive family filter
/products/?family=…        Crawlable filtered states (lashing | chains | rope)
/products/cargo-securement/lashing/cargo-lashing-belt-2in-328ft/
/products/cargo-securement/chains/grade-70-truckers-chain-5-16in-20ft/
/products/cargo-securement/chains/grade-43-high-test-chain-5-16in-551ft/
/products/cargo-securement/rope/heavy-duty-pe-rope-3-8in-502ft/
/industries/               One page, three deep-linked sections (D6)
/about/                    Legal identity, pronunciation, what we don't claim
/product-safety/           What we publish, what we withhold, and why
/contact/                  Honest: no verified channels yet
/request-a-quote/          Full form, sending disabled, reason stated
/privacy/  /terms/  /shipping-returns/     noindex scaffolds, absent from nav
/404
```

Plus `public/_redirects` covering D5 (`/products/cargo-securement` → `/products/`), D7b (family paths → filtered states) and D7 (`/resources/product-safety` → `/product-safety/`), so no previously-published URL shape can 404.

**Payload:** 14 KB CSS (3.5 KB gzipped) shared across all 16 pages · 8.2 KB gzipped for the home page · **zero JavaScript bundle files** — the nav toggle, catalog filter and product preselect are all inlined, together under 2 KB.

---

## 3. The schema locks, proven rather than asserted

I tried to break the content layer five ways. Each attempt fails the build:

| Attempt | Result |
|---|---|
| `price: 129.00` on a product | `commerce.price: Expected type "null", received "number"` |
| `workingLoadLimit: 3000 lb` | `safety.workingLoadLimit: Expected type "null", received "string"` |
| `certifications: [EN 12195-2]` | `safety.certifications.0: Expected type "never"` · `Too big: expected array to have <=0 items` |
| `heroImage` with no `altText` | `media.altText: altText is required whenever heroImage is set` |
| `productFamily: webbing` | `Invalid content reference … references "webbing" … but that entry does not exist` |

Publishing a price or an unverified load rating is now a **type error**, not a policy breach someone has to remember. Unlocking any of them is a deliberate, reviewable code change gated on manufacturer documentation.

---

## 4. Verification

| Check | Result |
|---|---|
| **axe-core** — WCAG 2.0/2.1/2.2 A + AA + best-practice, 11 pages × 3 widths (1440 / 768 / 320) = **33 runs** | **0 violations** |
| Horizontal overflow, 9 pages × 5 widths (320 / 375 / 768 / 1024 / 1440) | **0 px everywhere** |
| Heading order | 11/11 pages: exactly one `h1`, no skipped levels |
| Internal links | 27 targets, **0 broken** |
| Structured data | No `offers`, `price`, `priceCurrency`, `availability`, `aggregateRating`, `review`, `telephone` or `address` on any page |
| **Catalog with JavaScript disabled** | All 4 cards render; 4 filter links present, each a real crawlable URL (`/products/?family=lashing`) |
| Catalog filter with JavaScript | URL updates to `?family=chains`, 2 of 4 cards shown, `aria-current="true"` on the active chip, live region announces "Showing 2 of 4 products." |
| **Product context into the quote form** | Product CTA → `/request-a-quote/?product=grade-70-truckers-chain-5-16in-20ft` → selector pre-set to that product. §16 non-negotiable satisfied. |
| RFQ honest state | Submit disabled, notice visible and explains why. No success state exists to be faked. |
| Contrast gate / content guard | 26/26 pass · 43 files scanned, 0 violations |

### Two defects the sweep caught and I fixed

**`definition-list` (serious), on every product page.** My spec-block caption was a `<p>` inside the `<dl>`. Only `dt`, `dd`, `div`, `script` and `template` are permitted children of a definition list, so screen readers could mis-parse the whole specification table. The caption now sits outside the list.

**137 px horizontal overflow on the quote page at 320 px.** A `<select>` is intrinsically as wide as its longest option, and "Grade 43 High-Test Chain — 5/16 in x 551 ft (168 m)" was dragging the entire grid column past the viewport. Fixed with `minmax(0, 1fr)` tracks and `min-width: 0` on the control — and I added the same floor to the shared `.grid` primitive so no future component can repeat it.

---

## 5. Decisions honoured where it would have been easier not to

- **Contact page has no phone or email**, because none is verified. It says so, explains why, and routes to the form. §8.9 allows only verified channels.
- **No response-time claim** anywhere. §8.9 permits one only if approved.
- **No download button on product pages.** `media.specSheet` is null for all four, so the download block renders nothing — no empty "Downloads" heading, no dead button.
- **Packaging unknowns are stated, not hidden.** Units per case, case dimensions and shipping weight each show "Not yet confirmed" in the pending style. A procurement buyer needs to know it's a question to ask.
- **Industry pages list no products.** All four products are described for all three industries; §8.5 requires linking "only to appropriate products", and we cannot evidence that split. Implying one would be a suitability claim.
- **Legal pages contain no placeholder legal text** — they say plainly that no approved content exists.

## 6. Content guard — 18 documented exceptions, all negative uses

The guard now scans 43 files. It correctly flagged the Product Safety page, the About page's "what we do not claim" list, the Appendix B note and the `withheldClaims` audit records — because those sentences contain the restricted terms while *denying* the claim.

Every exception is in `content-guard.allow.json` with a written reason, reviewed as a set. The pattern is uniform: **the site saying it will not publish a claim, or warning the reader to verify.** A positive claim would not qualify, and the guard would still stop it.

## 7. Decision log — added this pass

| # | Decision | Reason | Status |
|---|---|---|---|
| D17 | Taxonomy wording wins over the PDF; "High-strength" and "towing" withheld | §20 source hierarchy; §3.6 and §4 | Applied |
| D18 | `high-strength` added to the content guard | Prevent re-entry via future copy edits | Applied |
| D19 | New `sizeSummary` field from the PDF's size column | The most scannable fact on a card | Applied |
| D20 | Client PDF **not** published as a download | It contains the claim we removed | **Needs your call** |
| D21 | Canonical links and sitemap deliberately not emitted | §19 forbids guessing a public URL; `site` is unset | Applied |
| D22 | Safety note centralised in `src/lib/safety.ts`, defaulted into every record | One canonical string, one guard exception instead of four | Applied |
| D23 | Packaging unknowns displayed as "Not yet confirmed" | Better for procurement than silent omission | Applied |

## 8. What is still blocked

Unchanged and now the only thing between this and a launchable site:

1. **RFQ delivery destination** — the one blocker on M5. One env var plus credentials.
2. **Approved privacy notice** — blocks accepting any real submission.
3. **Manufacturer technical documentation** — still the largest commercial gap. Four products with no published ratings.
4. **Real logo SVGs** — the mark is provisional.
5. **Domain and hosting** — blocks canonical URLs, the sitemap and deployment.
6. **Product photography** — the placeholders are deliberate, but photographs would lift the catalog most.
7. Verified contact details · SKUs and MOQ · shipping and returns policy · social URLs.

## 9. Next

**M5** the moment you supply an RFQ destination: server endpoint, server-side validation, honeypot and timing checks, rate limiting, real success and error states. Then **M7** metadata and sitemap once the domain is confirmed, and **M8** the final prioritised QA pass.

If you'd rather see the site running on a URL before that, the built output deploys to Cloudflare Pages or Netlify as-is — the redirects file is already in place.
