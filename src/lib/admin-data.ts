import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  collections,
  productImages,
  products,
  productsToCollections,
  quoteRequests,
  users,
} from "@/db/schema";

export async function getAdminDashboard() {
  const [quoteCounts, catalogCounts, userCounts, recentQuotes] = await Promise.all([
    db
      .select({
        status: quoteRequests.status,
        total: count(),
        value: sql<number>`coalesce(sum(${quoteRequests.proposedPriceCents}), 0)`,
      })
      .from(quoteRequests)
      .groupBy(quoteRequests.status),
    db.select({ status: products.status, total: count() }).from(products).groupBy(products.status),
    db.select({ role: users.role, total: count() }).from(users).groupBy(users.role),
    db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt)).limit(6),
  ]);

  const quotes = Object.fromEntries(quoteCounts.map((row) => [row.status, Number(row.total)]));
  const catalog = Object.fromEntries(catalogCounts.map((row) => [row.status, Number(row.total)]));
  const people = Object.fromEntries(userCounts.map((row) => [row.role, Number(row.total)]));
  const approvedValue = quoteCounts
    .filter((row) => ["approved", "in_production", "completed"].includes(row.status))
    .reduce((sum, row) => sum + Number(row.value), 0);

  return { quotes, catalog, people, approvedValue, recentQuotes };
}

export async function getAdminUsers(query = "", role = "all") {
  const filters = [];
  if (query) filters.push(or(ilike(users.name, `%${query}%`), ilike(users.email, `%${query}%`))!);
  if (role === "admin" || role === "customer") filters.push(eq(users.role, role));
  return db
    .select()
    .from(users)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(users.createdAt));
}

export async function getAdminQuotes(status?: string, query?: string) {
  const filters = [];
  const validStatuses = [
    "pending",
    "reviewing",
    "waiting_customer",
    "approved",
    "rejected",
    "in_production",
    "completed",
    "cancelled",
  ] as const;
  if (status && validStatuses.includes(status as (typeof validStatuses)[number])) {
    filters.push(eq(quoteRequests.status, status as (typeof validStatuses)[number]));
  }
  if (query) {
    filters.push(
      or(
        ilike(quoteRequests.protocol, `%${query}%`),
        ilike(quoteRequests.customerName, `%${query}%`),
        ilike(quoteRequests.title, `%${query}%`),
      )!,
    );
  }
  return db
    .select()
    .from(quoteRequests)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(
      sql`case ${quoteRequests.status} when 'pending' then 0 when 'reviewing' then 1 else 2 end`,
      desc(quoteRequests.createdAt),
    );
}

export async function getAdminQuote(id: string) {
  return db.query.quoteRequests.findFirst({
    where: eq(quoteRequests.id, id),
    with: {
      items: true,
      attachments: true,
      history: { with: { author: true }, orderBy: (h, { desc }) => [desc(h.createdAt)] },
    },
  });
}

export async function getAdminProducts() {
  return db.select().from(products).orderBy(asc(products.displayOrder), desc(products.createdAt));
}

export async function getAdminCollections() {
  const rows = await db.select().from(collections).orderBy(asc(collections.displayOrder));
  const links = await db.select().from(productsToCollections);
  return rows.map((collection) => ({
    ...collection,
    productCount: links.filter((link) => link.collectionId === collection.id).length,
  }));
}

export async function getProductWithCollections(id: string) {
  const product = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!product) return null;
  const [links, images] = await Promise.all([
    db
      .select({ collectionId: productsToCollections.collectionId })
      .from(productsToCollections)
      .where(eq(productsToCollections.productId, id)),
    db
      .select({ url: productImages.url, alt: productImages.alt })
      .from(productImages)
      .where(eq(productImages.productId, id))
      .orderBy(asc(productImages.displayOrder)),
  ]);
  return { ...product, collectionIds: links.map((link) => link.collectionId), images };
}

export async function getCollectionWithProducts(slug: string) {
  const collection = await db.query.collections.findFirst({ where: eq(collections.slug, slug) });
  if (!collection) return null;
  const links = await db
    .select({ productId: productsToCollections.productId })
    .from(productsToCollections)
    .where(eq(productsToCollections.collectionId, collection.id));
  return { ...collection, productIds: links.map((link) => link.productId) };
}
