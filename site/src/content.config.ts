import { defineCollection, reference, z } from "astro:content";
import { SAFETY_NOTE } from "./lib/safety";
import { glob } from "astro/loaders";

/* =============================================================
   Feytom — content schemas
   Direct translation of the product content model (§5.4).

   Three deliberate SAFETY LOCKS. price, workingLoadLimit and
   breakingStrength are typed z.null() and certifications as an empty
   tuple, so publishing one is a TYPE ERROR, not a policy breach.
   Unlocking any of them is a reviewable code change, gated on the
   client supplying manufacturer documentation (§19).
   ============================================================= */

const sourceStatus = z.enum(["confirmed", "manufacturer_verified", "pending"]);

const specification = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  sourceStatus,
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/products" }),
  schema: z.object({
    id: z.string().min(1),
    status: z.enum(["draft", "active", "temporarily_unavailable", "archived"]),
    name: z.string().min(1),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case"),
    eyebrow: z.string().optional(),
    primaryCategory: z.literal("Cargo Securement"),
    productFamily: reference("families"),
    shortDescription: z.string().min(40).max(240),
    longDescription: z.string().optional(),

    /** Scannable size line, e.g. "2 in x 328 ft (100 m)".
        Confirmed by the client's own product list PDF (16 Aug 2026). */
    sizeSummary: z.string().min(3),

    /** Possible uses, never approvals (§8.4.6). Every entry must be
        traceable to a confirmed product description. */
    applications: z.array(z.string()).default([]),

    specifications: z.array(specification).min(1),

    packaging: z.object({
      type: z.enum(["Roll", "Bag", "Drum"]),
      unitsPerCase: z.string().nullable().default(null),
      caseDimensions: z.string().nullable().default(null),
      shippingWeight: z.string().nullable().default(null),
    }),

    commerce: z.object({
      mode: z.literal("request_quote"),
      sku: z.string().nullable().default(null),
      price: z.null().default(null), // LOCK — no approved pricing (§6)
      minimumOrderQuantity: z.string().nullable().default(null),
      inventoryStatus: z.literal("contact_for_availability"),
    }),

    safety: z.object({
      generalNote: z.string().min(20).default(SAFETY_NOTE),
      workingLoadLimit: z.null().default(null), // LOCK — §19
      breakingStrength: z.null().default(null), // LOCK — §19
      certifications: z.array(z.never()).max(0).default([]), // LOCK — §19
      manufacturerDocumentUrl: z.string().url().nullable().default(null),
      /** Claims a source document asserts but which we will NOT publish
          until documented. Recorded so the decision is auditable. */
      withheldClaims: z.array(z.string()).default([]),
    }),

    media: z
      .object({
        heroImage: z.string().nullable().default(null),
        gallery: z.array(z.string()).default([]),
        specSheet: z.string().nullable().default(null),
        altText: z.string().nullable().default(null),
      })
      .default({})
      .refine((m) => !m.heroImage || !!m.altText, {
        message: "altText is required whenever heroImage is set",
        path: ["altText"],
      }),

    seo: z.object({
      title: z.string().min(10).max(62),
      description: z.string().min(50).max(158),
    }),

    relatedProducts: z.array(reference("products")).default([]),
  }),
});

const families = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/families" }),
  schema: z.object({
    name: z.enum(["Lashing", "Chains", "Rope"]),
    slug: z.enum(["lashing", "chains", "rope"]),
    order: z.number().int(),
    /** One practical sentence. No superlatives, no capacity language. */
    intro: z.string().min(40).max(300),
    /** What a buyer is deciding when they look at this family. */
    decisionHelp: z.string().min(30).max(300),
  }),
});

const industries = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/industries" }),
  schema: z.object({
    name: z.string().min(3),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    order: z.number().int(),
    visitorQuestion: z.string().min(10),
    intro: z.string().min(40).max(400),
    needs: z.array(z.string()).min(2),
  }),
});

export const collections = { products, families, industries };
