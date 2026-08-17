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

const pad = (s) => `  ${s}`;
console.log(`Launch guard: stage=${stage} · url=${url || "(unset)"} · quote=${dest || "(unset)"} · privacy=${privacy} · testSubs=${testSubs}`);
for (const w of warn) console.log(pad(`note: ${w}`));
if (fail.length) {
  console.error(`\nLaunch guard FAILED — ${fail.length} configuration problem(s):\n`);
  for (const f of fail) console.error(pad(`- ${f}`));
  console.error("");
  process.exit(1);
}
