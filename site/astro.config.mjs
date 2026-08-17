// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

/**
 * `site` comes from the environment, never a guess (§19: "Do not guess a public
 * URL"). With it unset there are no canonical links and no sitemap; with it set
 * both switch on. The launch guard refuses a live build without it.
 */
const site = process.env.PUBLIC_SITE_URL || undefined;
const isLive = process.env.PUBLIC_SITE_STAGE === "live";

// Routes that must never enter the sitemap: unapproved legal scaffolds (§8.10).
const EXCLUDED = ["/privacy", "/terms", "/shipping-returns", "/404"];

export default defineConfig({
  site,
  output: "static",
  build: { format: "directory" },
  compressHTML: true,
  integrations:
    site && isLive
      ? [
          sitemap({
            filter: (page) =>
              !EXCLUDED.some((p) => new URL(page).pathname.replace(/\/$/, "") === p),
          }),
        ]
      : [],
});
