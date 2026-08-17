import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export type Product = CollectionEntry<"products">;
export type Family = CollectionEntry<"families">;

export const CATEGORY = "Cargo Securement" as const;
export const CATEGORY_SLUG = "cargo-securement" as const;

/** Owner-supplied catalog line, confirmed by the FEYTOM LLC Product List PDF. */
export const CATEGORY_INTRO =
  "Dependable chains, lashing belts and industrial rope for transportation, " +
  "warehouse and material-handling operations.";

/** Only active records reach the site. Draft and archived stay unpublished. */
export async function getActiveProducts(): Promise<Product[]> {
  const all = await getCollection("products", (p) => p.data.status === "active");
  return all.sort((a, b) => a.data.name.localeCompare(b.data.name));
}

export async function getFamilies(): Promise<Family[]> {
  const all = await getCollection("families");
  return all.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Families that actually contain published products. Empty families are never
 * rendered as filters or cards — §5.1 forbids publishing empty categories and
 * §8.2 forbids empty filters.
 */
export async function getPopulatedFamilies() {
  const [families, products] = await Promise.all([
    getFamilies(),
    getActiveProducts(),
  ]);
  return families
    .map((family) => ({
      family,
      products: products.filter((p) => p.data.productFamily.id === family.id),
    }))
    .filter((group) => group.products.length > 0);
}

/** Canonical product URL. The only place this shape is constructed. */
export function productUrl(product: Product): string {
  return `/products/${CATEGORY_SLUG}/${product.data.productFamily.id}/${product.data.slug}/`;
}

/** Filtered catalog state. Crawlable, canonical to /products/ (D5, D7b). */
export function familyFilterUrl(familySlug?: string): string {
  return familySlug ? `/products/?family=${familySlug}` : "/products/";
}

/**
 * Quote URL that carries product context. §16 non-negotiable: every quote CTA
 * passes the product into the form.
 */
export function quoteUrl(product?: Product): string {
  return product
    ? `/request-a-quote/?product=${encodeURIComponent(product.data.slug)}`
    : "/request-a-quote/";
}

export async function resolveRelated(product: Product): Promise<Product[]> {
  const resolved = await Promise.all(
    product.data.relatedProducts.map((ref) => getEntry(ref))
  );
  return resolved.filter(
    (p): p is Product => !!p && p.data.status === "active" && p.id !== product.id
  );
}

export async function familyOf(product: Product): Promise<Family> {
  const family = await getEntry(product.data.productFamily);
  if (!family) throw new Error(`Unknown family on product ${product.id}`);
  return family;
}
