/**
 * The single canonical safety note (Appendix B), verbatim.
 *
 * It exists once so that it cannot drift between product pages, and so the
 * content guard needs exactly one documented exception rather than one per
 * product record.
 */
export const SAFETY_NOTE =
  "Load limits, working-load limits and safety certifications must be confirmed " +
  "against the manufacturer's technical documentation before use. A product " +
  "marking alone may not establish a certified working-load limit.";

/** Appendix B's framing — used on the Product Safety page, not on cards. */
export const SAFETY_NOTE_CONTEXT =
  "This note is a publication safeguard, not a substitute for manufacturer " +
  "instructions, applicable regulations, inspection procedures or qualified " +
  "operational judgement.";
