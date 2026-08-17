# Going live — GitHub + Netlify

**Chosen route:** Netlify hosting, GitHub repo with automatic deploys, review URL
first. Everything on Netlify's side is already configured in `netlify.toml`; what
follows is the account setup, which only you can do.

Two facts worth having up front:

- The site is **static**. There is no server to maintain, no database, no runtime
  to patch. Deploys are instant and rolling back is one click.
- The build refuses to publish an unapproved configuration. `scripts/launch-guard.mjs`
  fails the build rather than letting a live site go out without its domain, or a
  live quote form go out without a privacy notice.

---

## Stage 1 — Get it onto a private review URL

Nothing here needs the client. No domain, no logo decision, no legal text.

### 1a. Put the folder in git

Already initialised — `git init` has been run and everything is committed. Check:

```bash
cd ~/Documents/FEYTOL
git log --oneline
```

### 1b. Create the GitHub repo

1. Sign in at **https://github.com** (free account is fine).
2. Click **+ → New repository**. Name it `feytom-website`. Set it to **Private**.
   Do **not** add a README, .gitignore or licence — this folder has them.
3. GitHub shows you a "push an existing repository" snippet. Run it here:

```bash
cd ~/Documents/FEYTOL
git remote add origin https://github.com/YOUR-USERNAME/feytom-website.git
git branch -M main
git push -u origin main
```

It will ask for credentials. GitHub no longer accepts passwords — use a Personal
Access Token (**Settings → Developer settings → Personal access tokens → Tokens
(classic) → Generate new token**, tick `repo`) and paste the token when prompted
for the password. Or install GitHub Desktop and skip the terminal entirely.

### 1c. Connect Netlify

1. Sign in at **https://app.netlify.com** — choose "Sign up with GitHub" so the
   two are linked from the start.
2. **Add new site → Import an existing project → GitHub**, authorise, pick
   `feytom-website`.
3. Netlify reads `netlify.toml`, so the build settings fill themselves in:
   base `site`, command `npm run build`, publish `site/dist`. **Don't change them.**
4. **Deploy site.**

Roughly a minute later you have a URL like `https://random-name-123.netlify.app`.
Rename it under **Site configuration → Site details → Change site name** to
something you can share, e.g. `feytom-review`.

### 1d. Confirm it is genuinely private

The review stage is the default, so this should already be true. Verify:

- Visit `https://your-site.netlify.app/robots.txt` — it must say `Disallow: /`.
- View source on any page — you must see
  `<meta name="robots" content="noindex, nofollow">`.

Both are set independently, deliberately: one of them will eventually be
forgotten and the other still holds.

### 1e. Optional — test the quote form end to end

The form is switched off by default because the privacy notice isn't approved.
To test that delivery actually works before launch, add these under
**Site configuration → Environment variables**:

```
PUBLIC_QUOTE_DESTINATION      = netlify
PUBLIC_ALLOW_TEST_SUBMISSIONS = true
```

Redeploy. The form becomes submittable and carries a red **"Test environment —
do not send real enquiries"** banner. Submissions land in **Forms** in the
Netlify sidebar. The launch guard refuses this combination on a live build, so it
cannot follow you into production by accident.

Remove `PUBLIC_ALLOW_TEST_SUBMISSIONS` when you're done testing.

---

## Stage 2 — Go public

### 2a. Attach the domain

**Domain management → Add a domain.** Netlify then tells you which DNS records
to create at your registrar. Two options:

- **Netlify DNS** (simpler): change the nameservers at your registrar to the four
  Netlify gives you. Netlify handles everything after that.
- **Keep your existing DNS**: add a `CNAME` for `www` pointing at your Netlify
  subdomain, plus an `ALIAS`/`ANAME` or Netlify's load-balancer IP for the apex.
  Netlify shows the exact values.

HTTPS is automatic (Let's Encrypt) once DNS resolves — usually minutes, up to a
day if the registrar is slow.

### 2b. Flip to live

Under **Environment variables**, set:

```
PUBLIC_SITE_STAGE = live
PUBLIC_SITE_URL   = https://www.yourdomain.com     ← no trailing slash, https
```

Redeploy. That single change:

- removes `noindex` from every page
- rewrites `robots.txt` to `Allow: /` and adds the sitemap line
- generates `sitemap-index.xml`, excluding the unapproved legal scaffolds
- adds canonical `<link>` tags on every page

If `PUBLIC_SITE_URL` is missing or isn't `https://`, the build fails with the
reason. That's intentional.

### 2c. Turn the quote form on properly

Requires the privacy notice first. Write the approved text into
`site/src/pages/privacy.astro` (replacing the scaffold and removing its
`noindex`), then set:

```
PUBLIC_QUOTE_DESTINATION = netlify
PUBLIC_PRIVACY_APPROVED  = true
```

The consent checkbox appears, linked to `/privacy/`, and the form goes live.
Set the destination without the privacy flag and the build refuses.

**Where submissions go:** Netlify **Forms** in the sidebar, plus email
notification if you add one under **Forms → Settings and usage → Form
notifications**. Spam is filtered by Akismet, and the honeypot field already in
the form means bot submissions are rejected before they're even stored.

**The one limit to watch:** Netlify's free plan includes **100 form submissions
per month, pooled across your whole account**. Fine for a new B2B supplier;
if enquiries outgrow it, the swap is a Netlify Function or a Cloudflare Worker
posting to an email API — one component and one env var, because the form's
delivery is already behind an adapter.

---

## Day-to-day after launch

```bash
# make your change, then:
cd ~/Documents/FEYTOL
git add -A
git commit -m "Describe what changed"
git push
```

Netlify builds and publishes automatically, and runs all three gates on the way.
A failing gate means nothing is published — the previous version stays up.

**Preview before publishing:** work on a branch (`git checkout -b my-change`,
then push it). Netlify builds it at its own URL, always noindexed, so you can
review it without touching the live site. Merge to `main` to publish.

**Rolling back:** **Deploys** in the Netlify sidebar → pick any previous
successful deploy → **Publish deploy**. Instant.

---

## What still has to happen before a public launch

Not blockers for the review URL. Real blockers for going public:

| | Needed for | Who |
|---|---|---|
| Domain + DNS access | Stage 2a | You / client |
| **Real logo SVGs** | Stage 2b — the current mark is provisional and is the first thing a visitor sees | Client |
| Approved privacy notice | Stage 2c — required before collecting any enquiry | Client / legal |
| Verified phone and email | Removes the "not published yet" panel on Contact | Client |
| Manufacturer documentation | Removes the largest credibility gap: four products with no published ratings | Client |
| Product photography | Replaces the placeholder plates | Client |
| Shipping and returns policy | Fills that scaffold and allows any coverage statement | Client |

A **catalog-only public launch** is legitimate before the last four: with the
form off and no analytics, the site collects no data, so no privacy notice is
needed yet. The one I would not launch without is the real logo.
