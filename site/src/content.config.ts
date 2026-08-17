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
  /* The schema is a function so it can use Astro's image() helper. image()
     validates that the file exists at build time and hands the component real
     width/height metadata, which is what lets us reserve space and avoid layout
     shift (§14) rather than hard-coding dimensions per product. */
  schema: ({ image }) => z.object({
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
        heroImage: image().optional(),
        /* Each gallery entry carries its own alt text. An image without a
           description is not a gallery item, it is an accessibility defect. */
        gallery: z
          .array(
            z.object({
              src: image(),
              /* What is in the frame — for someone who cannot see it. */
              altText: z.string().min(10),
              /* Why the photo is worth showing — for everyone. Must NOT repeat
                 altText, or assistive tech announces the same sentence twice. */
              caption: z.string().min(10).optional(),
            })
          )
          .default([]),
        specSheet: z.string().nullable().default(null),
        altText: z.string().nullable().default(null),
        /* Where the photograph came from, so provenance is auditable. §10.4
           forbids imagery that misleads; recording the source is how we can
           show that a photo is of the actual product and not a competitor's. */
        credit: z.enum(["client_supplied", "manufacturer_supplied", "studio"]).optional(),
        /* CSS object-position for the card crop. Cards share one ratio so a row
           lines up; this decides WHICH part of a photo survives that crop, per
           image, without a code change. The file itself is never cropped. */
        focal: z.string().default("center 40%"),
      })
      .refine((m) => !m.heroImage || !!m.altText, {
        message: "altText is required whenever heroImage is set",
        path: ["altText"],
      })
      .refine((m) => !m.heroImage || !!m.credit, {
        message: "credit is required whenever heroImage is set — record where the photo came from",
        path: ["credit"],
      })
      /* .default() must come AFTER the refinements. Applied before them the
         refinements wrap the default and a product with no media block parses
         to undefined, which then explodes on media.gallery.length. */
      .default({ gallery: [], specSheet: null, altText: null }),

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
