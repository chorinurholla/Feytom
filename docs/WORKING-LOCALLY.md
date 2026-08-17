# Working directly in this folder

Everything below happens on your Mac, in Terminal, inside `~/Documents/FEYTOL`.
You need to do steps 1 and 2 once. After that it's two commands.

---

## 1. Install Node (once)

The project needs Node 20 or newer. Check what you have:

```bash
node --version
```

If that says "command not found" or a number below 20, install it. Easiest route
is the macOS installer from **https://nodejs.org** — take the LTS version, run
the `.pkg`, click through. Then quit and reopen Terminal and check again.

If you use Homebrew instead: `brew install node`.

## 2. Install the project's dependencies (once)

```bash
cd ~/Documents/FEYTOL/site
npm install
```

That creates `node_modules/` — a few hundred MB of libraries. It's deliberately
not synced between your Mac and Claude's container, and it should never be
committed to git (`.gitignore` already covers it).

## 3. Run it

```bash
cd ~/Documents/FEYTOL/site
npm run dev
```

Open **http://localhost:4321**. Leave that command running while you work — save
a file and the browser updates itself within about a second. Stop it with
`Ctrl+C`.

## 4. Check your work before you call it done

```bash
npm run build
```

This runs three gates before it builds anything. Any one of them failing stops
the build, which is the point:

| Command | What it refuses to let through |
|---|---|
| `npm run check:launch` | A configuration that would publish something unapproved — a live build with no domain, or a live quote form with no privacy notice |
| `npm run check:tokens` | A colour pairing that fails WCAG 2.2 AA. 26 pairings measured |
| `npm run check:content` | Prices, cart wording, stock claims, delivery promises, working-load limits, certifications, strength claims, and generic marketing filler |

You can run any of them on their own. `npm run preview` serves the built result
so you can check the real thing rather than the dev server.

---

## An editor

Any text editor works, but **VS Code** (free, code.visualstudio.com) plus the
official **Astro** extension gives you syntax highlighting, error underlines and
autocomplete for this project. Install the extension from the Extensions panel —
search "Astro", publisher "astro-build".

Open the whole folder, not individual files: `File → Open Folder → FEYTOL`.

---

## What you can safely change without touching code

**Product facts** live in `site/src/content/products/` — one `.yaml` file per
product. Plain text, indentation-sensitive, no code. Change a length, fix a
description, add a fifth product by copying an existing file.

The schema checks every record when you save. If you get something wrong the dev
server shows a specific message — `seo.description: Too big: expected string to
have <=158 characters` — rather than failing silently.

**Five fields will refuse to accept a value.** This is deliberate, not a bug:

| Field | Why it's locked |
|---|---|
| `commerce.price` | No pricing is approved for publication |
| `safety.workingLoadLimit` | Needs manufacturer documentation |
| `safety.breakingStrength` | Needs manufacturer documentation |
| `safety.certifications` | No certifications are verified |
| `media.altText` | Always required once `media.heroImage` is set |

Setting one gives you a type error and the build stops. Unlocking any of them is
a deliberate change to `site/src/content.config.ts`, which should only happen
once the client supplies the documentation.

**Also editable as plain text:** `site/src/content/families/` (the three product
families) and `site/src/content/industries/` (the three industry sections).

**Adding product photography:** drop the image in `site/src/assets/products/`,
then in the product's YAML add:

```yaml
media:
  heroImage: /products/your-file.jpg
  altText: A specific description of what the photo shows
```

The placeholder plate disappears automatically. Leave `altText` out and the
build fails — that's the lock doing its job.

---

## Working alongside Claude

Claude's session runs in a cloud container, which is a separate filesystem from
your Mac. The rule that keeps this from going wrong:

**This folder is canonical. Tell Claude when you have edited it.**

Claude then pulls your version in before doing anything, so your changes are
never overwritten. When Claude finishes a change set it syncs back here, and
anything it can't delete is parked in `_to_delete/` for you to remove.

If you're using git (see `DEPLOY.md`), commit before telling Claude — then
nothing can be lost, because you can always get the previous version back.
