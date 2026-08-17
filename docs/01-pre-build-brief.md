# Feytom — Pre-Build Brief

**Project:** Feytom LLC website (customer-facing: Feytom)
**Stage:** 1–2 of 13 (Discovery → Strategy), pre-implementation gate
**Date:** 16 August 2026
**Source of truth:** *Feytom Website Taxonomy & Claude Build Brief*, v1.0 (uploaded)
**Status:** AWAITING APPROVAL — no code will be written until this is signed off

This document is the six-part response the source brief requires before coding (§17), extended with the challenges, decision log and risk register your project workflow requires.

---

## 0. What I understand this project to be

A **nationwide US B2B catalog with request-a-quote conversion** — not an ecommerce store. Feytom LLC supplies cargo-securement products (lashing belt, two chain grades, PE rope) to fleet/trucking, warehouse/distribution, industrial procurement and material-handling buyers. The website's job is to turn a qualified business visitor into a **product-specific quote or availability inquiry**, while establishing enough credibility that a procurement team is willing to send an RFQ to a supplier they have not bought from before.

Primary tagline: **Built for the Work.** Legal entity in footer, policies and formal contexts: **Feytom LLC**. Pronunciation *Fei-tom*, used on About and in brand metadata only. Supporting lines held in reserve per §3.5: *Secure the Load. Keep Work Moving.* (campaign), *Work-Ready Supply.* (capability), *Dependable by Specification.* (technical trust).

The dominant constraint is not design. It is **evidentiary discipline**: almost every fact a competitor site would lead with — working load limits, certifications, prices, stock, delivery times, address, phone — is either unverified or unapproved. The site must feel confident and specific while publishing only what is confirmed. That constraint shapes the architecture, not just the copy.

**Approved this session (Tolu, 16 Aug 2026):** stage-gated delivery · Astro + TypeScript static build · provisional in-house logo mark (real SVG suite not supplied) · RFQ destination undecided, build honest.

---

## 1. Assumptions

Stated explicitly so you can reject any of them before they cost anything.

| # | Assumption | If wrong |
|---|---|---|
| A1 | Feytom is a **distributor/supplier**, not a manufacturer. No owned factory, warehouse network or fabrication is claimed anywhere. | Changes About page and positioning materially. |
| A2 | No public street address, phone number or email is confirmed. Contact page launches with a **form-only** contact route plus service-area statement. | Contact page gains a details block; Organization schema gains `telephone`/`address`. |
| A3 | **No prices, no cart, no stock levels, no delivery estimates** anywhere in the MVP — including "from $X" or "usually ships in". | A pricing tier or commerce layer becomes a separate project phase. |
| A4 | The four products are **seed content**, and the catalog will grow. Everything is data-driven so adding product #5 is one file, zero template edits. | No impact — this is safe either way. |
| A5 | Legal pages (privacy, terms, shipping & returns) launch as **`noindex` scaffolds, absent from navigation**, until you supply approved text. | If you have approved legal copy already, send it and they go live in nav. |
| A6 | **No analytics and no cookie banner at launch** (source brief: "use no analytics by default"). Event names are implemented as a no-op adapter so a tool can be dropped in later without touching components. | Adding GA4/Plausible later needs a consent review, not a rebuild. |
| A7 | Product photography does not yet exist. Product cards and detail pages ship with a **branded geometric placeholder** that is obviously not a photograph — never a stock image of a different product. | Real photos slot into the same aspect-ratio containers. |
| A8 | English only, US market only. No i18n layer, no currency switching. | i18n would change the routing model — flag early if ever needed. |
| A9 | "3T" on the lashing belt is a **product marking**, rendered as such, never as a load rating. Enforced in code, not just in copy review. | None — this is a safety floor. |
| A10 | Hosting is undecided; the build stays platform-agnostic and deploys to Cloudflare Pages, Netlify or Vercel with a one-file adapter change. | Existing host (cPanel/WordPress) would change the stack decision — tell me now if so. |

---

## 2. Proposed stack, and why

**Astro 5 + TypeScript, static output, plain CSS with custom-property design tokens.**

| Layer | Choice | Why this, not the alternative |
|---|---|---|
| Framework | **Astro 5** (static, islands where needed) | The site is 15-ish content pages with one interactive filter and one form. Astro ships **zero JavaScript by default**, which directly serves the Core Web Vitals requirement (§14) without effort. Next.js would ship a React runtime to render a spec table — cost with no return at this scale. |
| Content | **Astro Content Collections + Zod** | This is the load-bearing decision. Your `product` schema (§5.4) becomes a Zod schema, so an incomplete or non-compliant product record **fails the build** rather than shipping a half-empty page. It also satisfies "all four products generated from one data source" structurally, not by discipline. |
| Styling | **Plain CSS, `@layer`, custom properties** | Your tokens (§10.2) are already CSS custom properties. A utility framework would add a build dependency and push styling into markup, working against "avoid inline styles" and "centralized design tokens". Trade-off: slightly slower to scaffold, meaningfully easier to hand to another developer. |
| Type | **Self-hosted Barlow Condensed + Inter**, woff2, subset to latin, `font-display: swap`, preloaded | Google Fonts CDN adds a third-party origin and a privacy/consent question you don't need. Self-hosting removes both and is faster. |
| Interactivity | Two small islands: mobile nav, catalog filter. Filter is **progressive** — links with query params that work with JS disabled. | Satisfies "works without hover, keyboard-only" as a property of the implementation rather than a QA finding. |
| RFQ form | Native HTML form → **platform serverless function** at `/api/quote`, behind a swappable `QuoteDestination` adapter (`email` \| `formservice` \| `crm` \| `unconfigured`) | Keeps the site static and cheap. The adapter is why "destination undecided" costs nothing: choosing later is one env var, not a refactor. |
| Form integrity | Server-side Zod validation, honeypot field, submission-timing check, per-IP rate limit, no PII to analytics | §15 requirements, implemented server-side where they can't be bypassed. |
| Content guard | **Custom build-time linter** (see below) | New. Non-negotiable check "no unsupported safety claims" becomes automated instead of aspirational. |
| Testing | Playwright (keyboard journeys, form states), axe-core (WCAG 2.2 AA), Lighthouse CI, link checker | Each maps to a §18 acceptance criterion. |

### The content guard — the one addition I'm recommending beyond the brief

A script in the build pipeline that **fails the build** if any content file, component or page contains a restricted term outside an approved context: *certified, guaranteed, safest, strongest, best-in-class, OSHA-approved, DOT-approved, rated capacity, working load limit, WLL, breaking strength, unbreakable, same-day, next-day, in stock, free shipping,* plus any `$` amount.

Rationale: §16 says "no invented business facts or safety claims" is non-negotiable, but as written it depends on whoever edits content last remembering the rule. This makes the rule mechanical. It also means a future copywriter or CMS editor cannot publish a compliance claim by accident. Trade-off: occasional false positives on legitimate uses (e.g. quoting the safety note itself), handled with an explicit allowlist annotation.

---

## 3. Route map

Confirmed routes, with three deviations from the source sitemap flagged as **CHALLENGE** below.

```
/                                    Home
/products                            Catalog index — all products, family filter chips
/products/?family=lashing|chains|rope    Filtered states (crawlable links, canonical → /products)
                                     ↑ replaces the three family routes — see CHALLENGE 5
/products/cargo-securement/lashing/cargo-lashing-belt-2in-328ft
/products/cargo-securement/chains/grade-70-truckers-chain-5-16in-20ft
/products/cargo-securement/chains/grade-43-high-test-chain-5-16in-551ft
/products/cargo-securement/rope/heavy-duty-pe-rope-3-8in-502ft
/industries                          Three anchored sections (see CHALLENGE 2)
/about
/product-safety                      (see CHALLENGE 3)
/request-a-quote                     ?product=<slug> preselects
/contact
/privacy        noindex, not in nav   ─┐
/terms          noindex, not in nav    ├ scaffolds until approved
/shipping-returns  noindex, not in nav ─┘
/404
/sitemap.xml  /robots.txt
```

### CHALLENGE 1 — Collapse `/products/cargo-securement` into `/products` at launch

**Issue:** With exactly one primary category, `/products` and `/products/cargo-securement` would carry near-identical content. The source brief itself warns against low-value duplicated pages (§7.2).
**Recommendation:** `/products` is the real catalog index; `/products/cargo-securement` **301s to it**. Product detail URLs keep their full nested path exactly as specified, so nothing changes later.
**Trade-off:** when a second category launches, the redirect is removed and `/products` becomes a category hub. **No product URL ever changes**, which is the URL that matters for SEO.

### CHALLENGE 2 — One `/industries` page, not four

**Issue:** We have no evidence base for assigning any of the four products to one industry over another — the source descriptions name transportation, warehouse, industrial and material-handling uses for nearly all of them. Three separate pages would therefore differ only in heading and a paragraph — thin, near-duplicate, exactly what §7.2 and §12 tell us to avoid — while implying an industry-specific suitability judgement we cannot support. §8.5 requires industry pages to link *only* to appropriate products; today we cannot evidence that filter.
**Recommendation:** a single `/industries` page with three deep-linkable sections (`#transportation-trucking`, etc.). Split into standalone pages when each has **distinct proof** — an industry-specific product subset, an application note, or a case study.
**Trade-off:** loses three potential keyword landing pages. Given zero unique content per page today, they'd be unlikely to rank anyway and would dilute the strong page.

### CHALLENGE 3 — Simplify the primary navigation

**Issue:** The proposed nav has six items, and "Resources" would be a section containing exactly one page. Nav labels should be organised around visitor understanding, and "Resources" tells a fleet buyer nothing.
**Recommendation:** **Products · Industries · About · Contact**, plus an emphasised **Request a Quote** button. Product safety lives at `/product-safety`, linked from every product page (where the question actually arises) and the footer. Restore a Resources hub when there are ≥3 downloadable documents.
**Trade-off:** one fewer top-level entry point for spec sheets. Mitigated by linking the safety/documentation page at the point of need rather than in a nav item people don't click. Note this also moves the URL `/resources/product-safety` → `/product-safety`; restoring a Resources hub later means a 301, not a rewrite.

### CHALLENGE 5 — Family pages as filtered states on `/products`, not standalone routes

**Issue:** The three family routes would hold 1, 2 and 1 products respectively. §7.2 already permits family pages to be "implemented as filtered states rather than separate indexable pages if content is too thin" — with 1–2 products each, they are.
**Recommendation:** `/products?family=chains` etc., rendered as crawlable links, canonical to `/products`. Note this differs from §7.2 in one respect: the source anticipates filtering on `/products/cargo-securement`, but D5 collapses that route, so filtering lives on `/products`.
**Promotion rule:** a family graduates to its own indexable route at **≥3 products with distinct family-level copy**. Chains is closest.
**Trade-off:** three fewer potential landing pages now, in exchange for one page that can actually rank.

### CHALLENGE 4 — Hero CTA hierarchy (accepted, with a caveat)

The brief's dual hero CTAs (*Explore Products* primary, *Request a Quote* secondary) are correct — a cold visitor cannot write a meaningful RFQ before seeing the range. But with an emphasised **Request a Quote** already in the header, three quote-adjacent actions compete above the fold. **Implementation rule: exactly one filled-orange button per viewport.** The hero's *Explore Products* is filled; *Request a Quote* in the hero is a text/outline link; the header button uses a distinct, smaller treatment.

---

## 4. Content and data schema

Direct Zod translation of §5.4. Abbreviated here; full file lands in `src/content/config.ts` at M1.

```ts
const sourceStatus = z.enum(['confirmed', 'manufacturer_verified', 'pending']);

const product = z.object({
  id: z.string(),                          // stable, never reused
  status: z.enum(['draft','active','temporarily_unavailable','archived']),
  name: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  eyebrow: z.string().optional(),
  primaryCategory: z.literal('Cargo Securement'),   // controlled vocabulary, §5.2
  productFamily: z.enum(['Lashing','Chains','Rope']),
  shortDescription: z.string().min(40).max(220),
  longDescription: z.string().optional(),
  applications: z.array(z.string()).default([]),    // possible uses, never approvals
  specifications: z.array(z.object({
    label: z.string(), value: z.string(), sourceStatus,
  })).min(1),
  packaging: z.object({
    type: z.enum(['Roll','Bag','Drum']),
    unitsPerCase: z.string().nullable().default(null),
    caseDimensions: z.string().nullable().default(null),
    shippingWeight: z.string().nullable().default(null),
  }),
  commerce: z.object({
    mode: z.literal('request_quote'),               // locked for MVP
    sku: z.string().nullable().default(null),
    price: z.null(),                                // structurally impossible to set
    minimumOrderQuantity: z.string().nullable().default(null),
    inventoryStatus: z.literal('contact_for_availability'),
  }),
  safety: z.object({
    generalNote: z.string(),                        // required
    workingLoadLimit: z.null(),                     // locked null until verified
    breakingStrength: z.null(),
    certifications: z.array(z.never()).default([]), // locked empty
    manufacturerDocumentUrl: z.string().url().nullable().default(null),
  }),
  media: z.object({
    heroImage: z.string().nullable().default(null),
    gallery: z.array(z.string()).default([]),
    specSheet: z.string().nullable().default(null),
    altText: z.string().nullable().default(null),
  }).refine(m => !m.heroImage || !!m.altText, 'altText required when heroImage is set'),
  seo: z.object({ title: z.string().max(60), description: z.string().max(158) }),
  // Note: this 158-char cap applies to PRODUCT metadata only. Page-level metadata uses a
  // separate schema — the source's approved home description (§12) is 175 chars and must not
  // be truncated to fit a product rule.
  relatedProducts: z.array(z.string()).default([]),
});
```

**Three schema-level safety locks worth noting.** `price`, `workingLoadLimit`, `breakingStrength` are typed `z.null()` and `certifications` as an empty array — publishing one is a **type error**, not a policy breach. Unlocking them is a deliberate, reviewable code change gated on you supplying manufacturer documentation. Second, specs with `sourceStatus: 'pending'` render in a visually distinct "pending verification" state or not at all — never as plain fact. Third, `altText` is conditionally required, so an image cannot ship without it.

All four seed records transcribe **exactly** the values in Appendix A. Nothing added.

---

## 5. Asset mapping

The paths in §11 (`output/feytom-brand-identity/...`) refer to a workspace this session does not have — no Feytom asset files were uploaded, and no folder is connected from your Mac. Per your instruction I will **draft an interpretation of the Open Loadlock mark**.

> **⚠ Risk flagged (R1, high).** A drafted mark will not match the approved artwork in your brand guidelines PDF. It is a **development stand-in**: acceptable for reviewing layout, spacing and colour, not for print, packaging, vehicle livery or launch. Recommendation: send the `Feytom_Loadlock_Primary_*.svg` files (or connect the folder containing them) before production deploy. Swapping is a one-directory replacement because every logo reference resolves through a single module.

| Asset | Launch state | Replacement path |
|---|---|---|
| Primary lockup (full colour, reversed, one-colour dark) | Drafted SVG — F-form with an open loadlock counter, paired orange diagonals | `src/assets/logos/` — drop-in replace, no component edits |
| Icon / favicon / social avatar | Derived from the drafted mark; SVG + PNG at 32/180/512/1024 | same |
| Product imagery | Branded geometric placeholder, per-family tint, labelled `[Product photography pending]` in dev only — production shows the neutral placeholder with correct alt text | `src/assets/products/<slug>/` |
| Strap graphic device | Inline SVG component, `aria-hidden`, empty alt, respects `prefers-reduced-motion` | n/a |
| Spec sheets | No download UI rendered until an approved PDF exists (§8.4.9) | `public/docs/` + `media.specSheet` |
| Brand guidelines PDF | Not available — colour, type and shape rules taken from §10 of the taxonomy | Per §20 the **taxonomy outranks the guidelines PDF**; if the PDF later conflicts, §10 wins unless you approve an override in writing |

Design tokens are transcribed from §10.2 with **one sanctioned override**, recorded here rather than applied silently: §10.2 sets `--color-action-text: #FFFFFF`, but §10.2 also instructs "use dark text on orange when white text fails at a given size". White on Signal Orange measures **3.01:1** — below the 4.5:1 needed for normal text — so button labels on orange will be Iron `#20272D` (**5.02:1**, passes AA).

**Contrast is a build gate, not a review step.** Measured, WCAG 2.x:

| Pairing | Ratio | Verdict |
|---|---|---|
| `#FFFFFF` on Navy `#102A43` | 14.64:1 | AAA |
| Iron `#20272D` on Orange `#F36C21` | 5.02:1 | AA normal text |
| Muted `#52616D` on white | 6.38:1 | AA normal text |
| Orange `#F36C21` on white | **3.01:1** | Fails AA normal text · passes AA **large** text (≥24px / 18.66px bold) and SC 1.4.11 for borders, focus rings and UI boundaries |
| Steel `#7A8793` on white | **3.68:1** | **Fails AA normal text** — Steel is for borders, dividers and icons only, never body copy |

Full pairing table published at M1.

---

## 6. Phased implementation plan

Each milestone ends with a verification report and a list of what remains pending. Nothing is described as production-ready until it is.

| M | Milestone | Output | Verification |
|---|---|---|---|
| **M0** | *This document* | Pre-build brief, logs | Your approval |
| **M1** | Foundations | Astro scaffold, tokens, typography, self-hosted fonts, provisional logo suite, contrast table, content-guard linter | Contrast pairings all ≥AA; linter fails on a deliberately planted claim |
| **M2** | Content layer | Zod schemas, 4 seed products, category/family/industry data, page content files | Build fails on a deliberately malformed record; zero product data in templates |
| **M3** | Global shell | Utility bar, header + responsive nav, footer (**Feytom LLC**), breadcrumbs, buttons, skip-link, 404 | Keyboard-only traversal; focus visible on every surface; 320px viewport |
| **M4** | Catalog | `/products` index, progressive family filter, product cards, product detail template, spec block, safety note, related products | All 4 pages render from data alone; filter works with JS disabled |
| **M5** | RFQ | `/request-a-quote` with product preselect, server validation, honeypot + rate limit, destination adapter, **honest unconfigured state** | Form never reports success without server confirmation; every error names its field and its fix |
| **M6** | Remaining pages | Home, Industries, About, Product Safety, Contact, legal scaffolds (`noindex`, out of nav) | Content-guard clean; heading order strict; no empty sections |
| **M7** | SEO & metadata | Titles/descriptions per §12, Organization + WebSite + BreadcrumbList + Product schema (**no Offer, price, availability, rating**), canonicals, sitemap, robots | Schema validates; no restricted properties emitted |
| **M8** | QA & handover | axe-core, Playwright keyboard journeys, Lighthouse, link check, 320/375/768/1024/1440 pass, prioritised issue list (Critical/High/Medium/Low), deploy + content-editing guide | Every §18 acceptance criterion checked off or explicitly listed as blocked |

**Realistic sequencing note:** M5 cannot be declared complete while the RFQ destination is undecided — it will ship fully built and fully validated, in a state that honestly refuses submissions, and closes when you supply a destination. I'd rather leave one milestone visibly open than mark it done with a form that silently discards inquiries.

---

## 7. Decision log

| # | Decision | Reason | Alternatives | Status |
|---|---|---|---|---|
| D1 | Stage-gated delivery, approval before code | Source brief §17; project workflow | Straight to MVP | Approved (Tolu, 16 Aug) |
| D2 | Astro 5 + TS, static, plain CSS tokens | Zero-JS baseline, Zod-validated content, cheap hosting | Next.js; hand-written HTML | Approved (Tolu, 16 Aug) |
| D3 | Provisional in-house logo mark | Real SVG suite not supplied | Wait for assets; placeholder wordmark | Approved (Tolu, 16 Aug) — **flagged R1** |
| D4 | RFQ destination adapter, unconfigured = honest refusal | No production form without confirmed delivery (§19) | Email now; form service | Approved (Tolu, 16 Aug) |
| D5 | `/products/cargo-securement` → 301 `/products` | Avoid duplicate near-identical index pages | Keep both | **Proposed** |
| D6 | Single `/industries` page with anchored sections | Three pages would be thin duplicates implying unevidenced suitability | Three pages as per sitemap | **Proposed** |
| D7 | Nav = Products/Industries/About/Contact + RFQ button; `/resources/product-safety` → `/product-safety` | "Resources" would hold one page; label is internal language | Six-item nav as per §7.1 | **Proposed** |
| D7b | Family pages as filtered states on `/products`, promoted at ≥3 products | §7.2 permits it when content is thin; families hold 1–2 products | Three standalone family routes | **Proposed** |
| D7c | Token override: `--color-action-text` → Iron `#20272D` on orange fills | White on orange = 3.01:1, fails AA; §10.2 sanctions dark text where white fails | Keep `#FFFFFF`, restrict orange buttons to large text only | **Proposed** |
| D8 | Build-time content guard for restricted terms | Makes the non-negotiable safety rule mechanical | Manual copy review | **Proposed** |
| D9 | Price/WLL/breaking-strength/certifications typed as null | Makes unsupported claims a type error | String fields + review | **Proposed** |
| D10 | No analytics, no cookie banner at launch | §19: "use no analytics by default" | Plausible from day one | **Proposed** |

## 8. Content gaps — needed from the client

Ordered by what blocks launch soonest.

1. **RFQ delivery destination** — blocks a live form.
2. **Verified contact details** (email, phone, any public address) — blocks Contact page and Organization schema.
3. **Approved privacy & terms text** — blocks collecting any production inquiry.
4. **Manufacturer technical documentation** for all four products — blocks WLL, capacity, finish, construction, certification claims. Currently the largest credibility gap: procurement buyers evaluating a chain expect a rating.
5. **Final logo route selection + the real SVG files** — blocks production deploy.
6. **Domain + hosting/DNS access** — blocks deploy.
7. **Product photography** — blocks the strongest version of the catalog; ships with placeholders.
8. **SKUs, MOQ, case quantities** — improves RFQ quality; may stay absent at launch.
9. **Shipping/returns/service policy** — blocks that page and any coverage statement.
10. **Verified social profile URLs** — footer icons omitted until supplied.

## 9. Risk register

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| R1 | Drafted logo diverges from approved artwork | High | Single-module logo resolution; labelled provisional; replace before production |
| R2 | No published load ratings on a securement catalog reduces buyer confidence vs. competitors who publish them | High | Lead with what *is* confirmed (grade, diameter, length, packaging); frame documentation-on-request as diligence, and make the RFQ the route to specs — turns the gap into a conversion step |
| R3 | RFQ destination unresolved at launch | High | Honest refusal state; one env var to activate |
| R4 | Thin content across 15 pages with 4 products | Medium | D5–D7 consolidation; grow pages as the catalog grows |
| R5 | Legal pages unapproved while form collects data | High | Form disabled until D4 + privacy text both resolved |
| R6 | Placeholder imagery reads as unfinished to a procurement buyer | Medium | Branded, deliberate, consistent placeholders — never stock photos of other companies' products |

## 10. Do-not-use list (live)

Inherited from §10.4 and §14 of the source brief, plus this project's additions: no invented prices, WLLs, certifications, delivery promises, addresses, testimonials, customer logos or founding stories · no Add to Cart or price UI in the MVP · no stock photography of construction workers, sparks, or unsafe loads · no imagery implying Feytom manufactures · **Signal Orange is never used as a large background, and never as text below 24px / 18.66px bold on white** · Steel `#7A8793` never used for body copy · no soft/bubbly radii (2–6px only) · no carousels for essential information · no hover-only information · no autoplay video · no generic AI illustration · no "Resources" or other internal-language nav labels · no `Offer`/`price`/`availability`/`aggregateRating` structured data · no analytics before consent review · **no form that reports success without server confirmation**.

---

## 11. Recommended next action

Approve or amend **D5–D10 (including D7b and D7c)** and confirm A1–A10. On approval I proceed to **M1 (foundations)** and report back with the token implementation, the measured contrast table and the provisional logo for your review before any page templates are built.

If you'd rather see something visual before committing to the consolidation decisions, I can produce M1 plus a single rendered home-page hero as a style check first — that's roughly one extra step and de-risks the visual direction early.
