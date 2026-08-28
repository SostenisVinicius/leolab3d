import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { collections, products, productsToCollections } from "@/db/schema";

export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string | null;
  material: string | null;
  dimensions: string | null;
  finish: string | null;
  estimatedDays: number | null;
  startingPriceCents: number | null;
  featured: boolean;
};

export type PublicCollection = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string | null;
  productCount: number;
};

const productSelection = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  shortDescription: products.shortDescription,
  description: products.description,
  image: products.coverUrl,
  material: products.material,
  dimensions: products.dimensions,
  finish: products.finish,
  estimatedDays: products.estimatedDays,
  startingPriceCents: products.startingPriceCents,
  featured: products.featured,
};

export type PublicProductQuery = {
  slug?: string;
  search?: string;
  collectionSlug?: string;
  limit?: number;
  featured?: boolean;
};

/**
 * Condições de visibilidade pública. Rascunhos e arquivados nunca são incluídos,
 * nem os produtos publicados que pertençam a uma coleção não publicada.
 */
export function publishedProductFilters(options?: PublicProductQuery) {
  const filters = [eq(products.status, "published")];
  if (options?.slug) filters.push(eq(products.slug, options.slug));
  if (options?.search) {
    filters.push(
      or(
        ilike(products.name, `%${options.search}%`),
        ilike(products.shortDescription, `%${options.search}%`),
      )!,
    );
  }
  if (options?.featured) filters.push(eq(products.featured, true));
  if (options?.collectionSlug) {
    filters.push(eq(collections.slug, options.collectionSlug), eq(collections.status, "published"));
  }
  return and(...filters)!;
}

export function publishedCollectionFilters(slug?: string) {
  const filters = [eq(collections.status, "published")];
  if (slug) filters.push(eq(collections.slug, slug));
  return and(...filters)!;
}

export async function getPublishedProducts(options?: PublicProductQuery) {
  let query = db.select(productSelection).from(products).$dynamic();
  if (options?.collectionSlug) {
    query = query
      .innerJoin(productsToCollections, eq(productsToCollections.productId, products.id))
      .innerJoin(collections, eq(collections.id, productsToCollections.collectionId));
  }
  const ordered = query
    .where(publishedProductFilters(options))
    .orderBy(asc(products.displayOrder), desc(products.createdAt));
  return options?.limit ? ordered.limit(options.limit) : ordered;
}

export async function getPublishedProduct(slug: string) {
  const [product] = await db
    .select(productSelection)
    .from(products)
    .where(publishedProductFilters({ slug }))
    .limit(1);
  return product ?? null;
}

export async function getPublishedCollections(limit?: number) {
  const rows = await db
    .select({
      id: collections.id,
      slug: collections.slug,
      name: collections.name,
      description: collections.description,
      image: collections.coverUrl,
    })
    .from(collections)
    .where(publishedCollectionFilters())
    .orderBy(asc(collections.displayOrder), desc(collections.createdAt));
  const links = rows.length
    ? await db
        .select({ collectionId: productsToCollections.collectionId })
        .from(productsToCollections)
        .innerJoin(
          products,
          and(eq(products.id, productsToCollections.productId), eq(products.status, "published")),
        )
    : [];
  const mapped = rows.map((row) => ({
    ...row,
    productCount: links.filter((link) => link.collectionId === row.id).length,
  }));
  return limit ? mapped.slice(0, limit) : mapped;
}

export async function getPublishedCollection(slug: string) {
  const [collection] = await db
    .select({
      id: collections.id,
      slug: collections.slug,
      name: collections.name,
      description: collections.description,
      image: collections.coverUrl,
    })
    .from(collections)
    .where(publishedCollectionFilters(slug))
    .limit(1);
  if (!collection) return null;
  const items = await getPublishedProducts({ collectionSlug: slug });
  return { ...collection, productCount: items.length, products: items };
}
