import type { APIRoute } from "astro";
import { IS_INDEXABLE, SITE_URL } from "../lib/config";

/**
 * Generated, not static — the review URL must disallow everything (§12:
 * "Noindex incomplete legal pages, internal search states and staging
 * environments"), and a static file could not tell the difference.
 */
export const GET: APIRoute = () => {
  const body = IS_INDEXABLE
    ? [
        "User-agent: *",
        "Allow: /",
        "",
        "# Legal scaffolds carry noindex in their own markup until approved (§8.10).",
        SITE_URL ? `Sitemap: ${SITE_URL.replace(/\/$/, "")}/sitemap-index.xml` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : [
        "# Review environment — not for indexing.",
        "User-agent: *",
        "Disallow: /",
      ].join("\n");

  return new Response(body + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
