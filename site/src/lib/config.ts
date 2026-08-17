/**
 * Launch configuration — one place where every "is this approved yet?" answer lives.
 *
 * Nothing here has a permissive default. An unset variable always means "not
 * approved", so a missing value can never accidentally publish something.
 */

const env = import.meta.env;

/** "review" = private URL, noindex everywhere. "live" = public. */
export const SITE_STAGE: "review" | "live" =
  env.PUBLIC_SITE_STAGE === "live" ? "live" : "review";

/** Absolute production URL. Unset means no canonical links and no sitemap (§19). */
export const SITE_URL: string | undefined = env.PUBLIC_SITE_URL || undefined;

/** Where quote requests go. Empty means the form cannot submit (D4). */
export const QUOTE_DESTINATION: string = env.PUBLIC_QUOTE_DESTINATION ?? "";

/** Set only once owner/legal-approved privacy text is published (§19). */
export const PRIVACY_APPROVED: boolean = env.PUBLIC_PRIVACY_APPROVED === "true";

/**
 * Staging escape hatch: lets the form be submitted for end-to-end testing before
 * the privacy notice exists. It forces a visible test banner and is refused by
 * the launch guard on a live build, so it cannot leak into production.
 */
export const ALLOW_TEST_SUBMISSIONS: boolean =
  env.PUBLIC_ALLOW_TEST_SUBMISSIONS === "true";

/** Publish prices. Off until real figures AND terms of sale exist (D26). */
export const SHOW_PRICES: boolean = env.PUBLIC_SHOW_PRICES === "true";

/** Approved terms of sale + returns policy are published at /terms/ etc. */
export const SALE_TERMS_APPROVED: boolean =
  env.PUBLIC_SALE_TERMS_APPROVED === "true";

/** Prices may only be shown once there are terms to sell under. */
export const PRICES_VISIBLE = SHOW_PRICES && SALE_TERMS_APPROVED;

export const IS_INDEXABLE = SITE_STAGE === "live";

/** The form may accept input at all. */
export const FORM_ENABLED =
  QUOTE_DESTINATION.length > 0 && (PRIVACY_APPROVED || ALLOW_TEST_SUBMISSIONS);

/** Submissions are test-only — shown to the visitor, not just logged. */
export const FORM_IS_TEST_ONLY = FORM_ENABLED && !PRIVACY_APPROVED;
