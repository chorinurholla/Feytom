# Feytom Website — working folder

**Client:** Feytom LLC (customer-facing: Feytom) · **Project:** US B2B cargo-securement catalog + request-a-quote
**Stage:** M4 complete of M0–M8. M5 (quote-form server endpoint) is the only remaining build milestone.
**Last synced:** 17 August 2026

This folder is the canonical home for the project. Everything below was produced against the client's
*Feytom Website Taxonomy & Build Brief* v1.0, which is the source of truth and is kept in `docs/source/`.

---

## What's here

```
FEYTOL/
├── README.md            ← you are here
├── site/                ← THE PROJECT. Astro + TypeScript source. Edit here.
│   ├── src/
│   │   ├── content/         product, family and industry records (YAML — client-editable)
│   │   ├── content.config.ts Zod schemas, including the safety locks
│   │   ├── components/       global / product / content / forms
│   │   ├── layouts/ pages/   16 routes
│   │   ├── styles/          tokens.css · typography.css · global.css
│   │   └── lib/             catalog.ts · seo.ts · safety.ts
│   ├── scripts/
│   │   ├── contrast.mjs      WCAG contrast gate (fails the build)
│   │   ├── content-guard.mjs restricted-claim linter (fails the build)
│   │   └── build-logo.py     regenerates the provisional logo suite
│   ├── content-guard.allow.json  every guard exception, with a written reason
│   └── public/              fonts, favicon, _redirects, robots.txt
├── build/               ← last built static site. Open build/index.html to browse it offline.
├── docs/
│   ├── 01-pre-build-brief.md       assumptions, stack, routes, schema, phased plan
│   ├── 02-m1-foundations-report.md tokens, contrast table, logo, verification
│   ├── 03-m2-m4-catalog-report.md  content layer, catalog, PDF reconciliation
│   └── source/                     the client's own documents (source of truth)
├── previews/            ← single-file page previews. Open in any browser, no build needed.
├── tools/
│   └── inline-previews.mjs  regenerates previews/ from the built output
└── sync-to-device.sh    used by Claude to push its working mirror back into this folder
```

## Running it

```bash
cd site
npm install          # node_modules is not synced — install once
npm run dev          # local dev server
npm run build        # contrast gate → content guard → static build into site/dist/
npm run preview      # serve the built output
```

`npm run build` runs two gates before Astro. Either one failing stops the build:

- **`npm run check:tokens`** — measures 26 colour pairings against WCAG 2.2 AA.
- **`npm run check:content`** — fails on prices, cart UI, inventory, delivery promises,
  working-load limits, certifications, strength claims and banned marketing filler.

To browse without building anything, open `build/index.html` or any file in `previews/`.

## How editing works while Claude is involved

The Claude session runs in a cloud container, which is a separate filesystem from this Mac.
The arrangement is:

1. **This folder is canonical.** It holds the version of record.
2. Claude keeps a working mirror in its container, where it builds, runs the gates and tests.
3. After each change set, Claude syncs the result back here.

So: edit here freely. Tell Claude when you have, and it will pull this folder in before working,
so your edits are never overwritten.

## Editing content without touching code

Product facts live in `site/src/content/products/*.yaml` — one file per product. Adding a
fifth product means adding one YAML file; no template changes. The schema will reject the
record if anything required is missing or if a locked field is set.

**The locks.** These fail the build by design, and unlocking one is a deliberate code change
gated on the client supplying manufacturer documentation:

| Field | State | Unlocks when |
|---|---|---|
| `commerce.price` | must be null | pricing is approved for publication |
| `safety.workingLoadLimit` | must be null | manufacturer documentation supplied |
| `safety.breakingStrength` | must be null | manufacturer documentation supplied |
| `safety.certifications` | must be empty | certificates supplied |
| `media.altText` | required if `heroImage` set | — always required |

## Blocked on the client

1. **RFQ delivery destination** — the only blocker on M5. Set `PUBLIC_QUOTE_DESTINATION`.
2. **Approved privacy notice** — blocks accepting any real submission.
3. **Manufacturer technical documentation** — the largest commercial gap.
4. **Real logo SVGs** — the mark in `site/src/assets/logos/` is provisional, not for print.
5. **Domain + hosting** — blocks canonical URLs, sitemap and deployment.
6. **Product photography** — placeholders are deliberate, but photos would lift the catalog most.
7. Verified contact details · SKUs and MOQ · shipping and returns policy · social URLs.

## Deploying

`build/` is a plain static site and deploys as-is to Cloudflare Pages, Netlify or any static host.
`public/_redirects` (copied into the build) already carries the 301s for the collapsed category
path, the family paths and the old `/resources/product-safety` URL. Add the domain to
`site/astro.config.mjs` (`site:`) to switch on canonical URLs and the sitemap.

---

**Note on the folder name:** this folder is `FEYTOL`; the client is **Feytom**. If that's a typo,
rename it — nothing in the project references the folder name, so a rename breaks nothing.
