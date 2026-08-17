# Feytom Website — working folder

**Client:** Feytom LLC (customer-facing: Feytom) · **Project:** US B2B cargo-securement catalog + request-a-quote
**Stage:** M0–M5 complete of M0–M8. The quote form is wired to Netlify Forms; turning it on needs
the approved privacy notice, not more code. M7 (live metadata) and M8 (final QA) follow the domain.
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
│   │   ├── layouts/ pages/   17 routes
│   │   ├── styles/          tokens.css · typography.css · global.css
│   │   └── lib/             catalog.ts · seo.ts · safety.ts · config.ts
│   ├── scripts/
│   │   ├── launch-guard.mjs  refuses an unapproved launch config (fails the build)
│   │   ├── contrast.mjs      WCAG contrast gate (fails the build)
│   │   ├── content-guard.mjs restricted-claim linter (fails the build)
│   │   └── build-logo.py     regenerates the provisional logo suite
│   ├── content-guard.allow.json  every guard exception, with a written reason
│   ├── public/              fonts, favicon, _redirects (robots.txt is generated)
│   ├── .env.example         every configuration flag, documented
│   └── netlify.toml         build, security headers, per-context indexing
├── build/               ← last built static site. Open build/index.html to browse it offline.
├── docs/
│   ├── 01-pre-build-brief.md       assumptions, stack, routes, schema, phased plan
│   ├── 02-m1-foundations-report.md tokens, contrast table, logo, verification
│   ├── 03-m2-m4-catalog-report.md  content layer, catalog, PDF reconciliation
│   ├── WORKING-LOCALLY.md          install Node, run the dev server, edit content
│   ├── DEPLOY.md                   GitHub + Netlify, review URL then public
│   ├── SELLING-ONLINE.md           the staged commerce plan + client checklist
│   └── source/                     the client's own documents (source of truth)
├── previews/            ← single-file page previews. Open in any browser, no build needed.
├── tools/
│   └── inline-previews.mjs  regenerates previews/ from the built output
└── sync-to-device.sh    used by Claude to push its working mirror back into this folder
```

## Start here

- **Working on this yourself?** → `docs/WORKING-LOCALLY.md`
- **Getting it online?** → `docs/DEPLOY.md`
- **Selling and taking payment?** → `docs/SELLING-ONLINE.md`

## Running it

```bash
cd site
npm install          # node_modules is not synced — install once
npm run dev          # local dev server
npm run build        # launch + contrast + content gates → static build into site/dist/
npm run preview      # serve the built output
```

`npm run build` runs three gates before Astro. Any one failing stops the build:

- **`npm run check:launch`** — refuses a configuration that would publish something
  unapproved: a live build with no domain, or a live quote form with no privacy notice.
- **`npm run check:tokens`** — measures 26 colour pairings against WCAG 2.2 AA.
- **`npm run check:content`** — fails on prices, cart UI, inventory, delivery promises,
  working-load limits, certifications, strength claims and banned marketing filler.

Configuration lives in environment variables — see `site/.env.example`. Everything
defaults to "not approved", so an unset value can never accidentally publish something.

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
| `commerce.price` | structured, or null | needs amount, currency, the unit it buys, exclusions, source and date (D26) |
| `commerce.fulfilment` | required | `parcel` or `freight`; a freight item can never be sold online |
| `safety.workingLoadLimit` | must be null | manufacturer documentation supplied |
| `safety.breakingStrength` | must be null | manufacturer documentation supplied |
| `safety.certifications` | must be empty | certificates supplied |
| `media.altText` | required if `heroImage` set | — always required |

## Blocked on the client

1. **Prices, terms of sale and a returns policy** — blocks publishing prices (D26).
   See `docs/SELLING-ONLINE.md` for the full checklist.
2. **Approved privacy notice** — blocks turning the quote form on. Delivery itself is
   solved: the form is wired to Netlify Forms and `PUBLIC_QUOTE_DESTINATION=netlify`
   switches it on.
3. **A vector logo** — the real mark is installed as a PNG; a vector would fix the
   favicon, header crispness and allow a proper horizontal lockup.
4. **Confirmed shipping weights** — now blocking, not cosmetic: checkout cannot
   price delivery without them.
5. **Manufacturer technical documentation** — breaking strengths remain withheld.
6. **Domain + DNS access** — set `PUBLIC_SITE_URL` and flip `PUBLIC_SITE_STAGE=live`.
7. **Photography for the Grade 43 chain** — the other three now have real photos.
8. Verified contact details · SKUs and MOQ · social URLs.

## Deploying

Netlify, from a GitHub repo, building automatically on push. `netlify.toml` is already
configured — full walkthrough in `docs/DEPLOY.md`. The site ships in **review** stage:
every page carries `noindex` and `robots.txt` disallows all, so the review URL cannot be
found by search engines. One environment variable flips it live.

`public/_redirects` carries the 301s for the collapsed category path, the family paths and
the old `/resources/product-safety` URL, so no previously published URL shape can 404.

---

**Note on the folder name:** this folder is `FEYTOL`; the client is **Feytom**. If that's a typo,
rename it — nothing in the project references the folder name, so a rename breaks nothing.
