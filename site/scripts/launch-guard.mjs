#!/usr/bin/env node
/**
 * Feytom — launch guard.
 *
 * Refuses to produce a build whose configuration would publish something the
 * client has not approved. Runs before Astro, alongside the contrast gate and
 * the content guard.
 */
const e = process.env;
const stage = e.PUBLIC_SITE_STAGE === "live" ? "live" : "review";
const dest = e.PUBLIC_QUOTE_DESTINATION ?? "";
const privacy = e.PUBLIC_PRIVACY_APPROVED === "true";
const testSubs = e.PUBLIC_ALLOW_TEST_SUBMISSIONS === "true";
const url = e.PUBLIC_SITE_URL ?? "";
const showPrices = e.PUBLIC_SHOW_PRICES === "true";
const saleTerms = e.PUBLIC_SALE_TERMS_APPROVED === "true";

const fail = [];
const warn = [];

if (stage === "live") {
  if (!url) fail.push("PUBLIC_SITE_STAGE=live but PUBLIC_SITE_URL is unset — a live build needs its canonical domain (§12, §19).");
  if (url && !/^https:\/\//.test(url)) fail.push(`PUBLIC_SITE_URL must be https — got "${url}".`);
  if (testSubs) fail.push("PUBLIC_ALLOW_TEST_SUBMISSIONS=true on a live build. Test submissions are for the review URL only.");
  if (dest && !privacy) fail.push("The quote form has a destination but PUBLIC_PRIVACY_APPROVED is not true. §19: do not collect production inquiries before the required notices exist.");
  if (!dest) warn.push("Live build with no quote destination — the form will render disabled with its explanation. Intentional for a catalog-only launch.");
} else {
  if (testSubs && !dest) fail.push("PUBLIC_ALLOW_TEST_SUBMISSIONS=true but no PUBLIC_QUOTE_DESTINATION — there is nothing to test against.");
  warn.push('Stage is "review": every page emits noindex and robots.txt disallows all. Set PUBLIC_SITE_STAGE=live to publish.');
  if (testSubs) warn.push("Test submissions are ENABLED. The form will carry a visible test-only banner.");
}

/* D26 — selling, not just quoting, brings its own preconditions. */
if (showPrices && !saleTerms) {
  fail.push(
    "PUBLIC_SHOW_PRICES=true but PUBLIC_SALE_TERMS_APPROVED is not. Publishing a price is an invitation to buy; there must be approved terms of sale and a returns policy behind it."
  );
}
if (showPrices && !privacy && stage === "live") {
  fail.push(
    "Prices are published on a live build without an approved privacy notice. Taking an order means taking personal data."
  );
}
if (showPrices) {
  warn.push("Prices are VISIBLE. Every published price excludes delivery and tax, and each product page says so.");
}

const pad = (s) => `  ${s}`;
console.log(
  `Launch guard: stage=${stage} · url=${url || "(unset)"} · quote=${dest || "(unset)"} · privacy=${privacy} · testSubs=${testSubs} · prices=${showPrices} · saleTerms=${saleTerms}`
);
for (const w of warn) console.log(pad(`note: ${w}`));
if (fail.length) {
  console.error(`\nLaunch guard FAILED — ${fail.length} configuration problem(s):\n`);
  for (const f of fail) console.error(pad(`- ${f}`));
  console.error("");
  process.exit(1);
}
