import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRole = pgEnum("user_role", ["customer", "admin"]);
export const publicationStatus = pgEnum("publication_status", ["draft", "published", "archived"]);
export const quoteStatus = pgEnum("quote_status", [
  "pending",
  "reviewing",
  "waiting_customer",
  "approved",
  "rejected",
  "in_production",
  "completed",
  "cancelled",
]);
export const quoteKind = pgEnum("quote_kind", ["catalog", "custom"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: userRole("role").notNull().default("customer"),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    issuer: text("issuer"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("accounts_user_id_idx").on(table.userId)],
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

export const collections = pgTable(
  "collections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    coverUrl: text("cover_url"),
    status: publicationStatus("status").notNull().default("draft"),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("collections_slug_idx").on(table.slug)],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    shortDescription: text("short_description").notNull(),
    description: text("description").notNull(),
    coverUrl: text("cover_url"),
    material: text("material"),
    dimensions: text("dimensions"),
    finish: text("finish"),
    estimatedDays: integer("estimated_days"),
    startingPriceCents: integer("starting_price_cents"),
    status: publicationStatus("status").notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("products_slug_idx").on(table.slug),
    index("products_status_idx").on(table.status),
  ],
);

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
});

export const productsToCollections = pgTable(
  "products_to_collections",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    displayOrder: integer("display_order").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.productId, table.collectionId] })],
);

export const quoteRequests = pgTable(
  "quote_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    protocol: text("protocol").notNull().unique(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    kind: quoteKind("kind").notNull(),
    status: quoteStatus("status").notNull().default("pending"),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    quantity: integer("quantity").notNull().default(1),
    desiredDate: timestamp("desired_date", { withTimezone: true }),
    proposedPriceCents: integer("proposed_price_cents"),
    estimatedDays: integer("estimated_days"),
    adminNotes: text("admin_notes"),
    metadata: jsonb("metadata").$type<Record<string, string>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("quotes_status_idx").on(table.status),
    index("quotes_user_idx").on(table.userId),
  ],
);

export const quoteRequestItems = pgTable("quote_request_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  quoteRequestId: uuid("quote_request_id")
    .notNull()
    .references(() => quoteRequests.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const quoteAttachments = pgTable("quote_attachments", {
  id: uuid("id").defaultRandom().primaryKey(),
  quoteRequestId: uuid("quote_request_id")
    .notNull()
    .references(() => quoteRequests.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  fileName: text("file_name").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quoteStatusHistory = pgTable("quote_status_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  quoteRequestId: uuid("quote_request_id")
    .notNull()
    .references(() => quoteRequests.id, { onDelete: "cascade" }),
  fromStatus: quoteStatus("from_status"),
  toStatus: quoteStatus("to_status").notNull(),
  note: text("note"),
  changedBy: text("changed_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ many }) => ({
  images: many(productImages),
  collections: many(productsToCollections),
}));
export const collectionsRelations = relations(collections, ({ many }) => ({
  products: many(productsToCollections),
}));
export const productsToCollectionsRelations = relations(productsToCollections, ({ one }) => ({
  product: one(products, { fields: [productsToCollections.productId], references: [products.id] }),
  collection: one(collections, {
    fields: [productsToCollections.collectionId],
    references: [collections.id],
  }),
}));
export const quoteRelations = relations(quoteRequests, ({ many, one }) => ({
  user: one(users, { fields: [quoteRequests.userId], references: [users.id] }),
  items: many(quoteRequestItems),
  attachments: many(quoteAttachments),
  history: many(quoteStatusHistory),
}));
