import type { Product } from "./catalog";

/**
 * Structured data (§12).
 *
 * Hard rule: no Offer, price, priceCurrency, availability, aggregateRating,
 * review or shippingDetails — none is supported by real data. Organization
 * carries no address, telephone or sameAs until those are verified (§19).
 */

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": "#organization",
  name: "Feytom LLC",
  alternateName: "Feytom",
  description:
    "Feytom supplies chains, lashing belts, ropes and industrial essentials for " +
    "transportation, warehouse and material-handling operations across the United States.",
  areaServed: { "@type": "Country", name: "United States" },
  // url / telephone / address / sameAs: intentionally absent — unverified (§19).
} as const;

export const WEBSITE = {
  "@type": "WebSite",
  "@id": "#website",
  name: "Feytom",
  publisher: { "@id": "#organization" },
  inLanguage: "en-US",
} as const;

export function breadcrumbList(
  crumbs: { label: string; href?: string }[]
): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: c.href } : {}),
    })),
  };
}

export function productSchema(product: Product): Record<string, unknown> {
  const d = product.data;
  return {
    "@type": "Product",
    name: d.name,
    description: d.shortDescription,
    category: d.primaryCategory,
    brand: { "@id": "#organization" },
    // Only confirmed specs become additionalProperty. Pending values never do.
    additionalProperty: d.specifications
      .filter((s) => s.sourceStatus === "confirmed")
      .map((s) => ({
        "@type": "PropertyValue",
        name: s.label,
        value: s.value,
      })),
    // NO offers block. Adding one would require a price and an availability
    // value, neither of which is approved (§12).
  };
}
