"use server";

import { count, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  collections,
  products,
  productsToCollections,
  quoteRequests,
  quoteStatusHistory,
  userRoleHistory,
  users,
} from "@/db/schema";
import { requireAdmin } from "@/lib/session";

export async function changeUserRole(formData: FormData) {
  const session = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!userId || (role !== "admin" && role !== "customer")) throw new Error("Alteração inválida.");
  if (session.user.id === userId && role !== "admin")
    throw new Error("Você não pode remover o próprio acesso.");

  const [target] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target) throw new Error("Usuário não encontrado.");
  if (target.role === role) return;
  if (target.role === "admin" && role === "customer") {
    const [{ total }] = await db
      .select({ total: count() })
      .from(users)
      .where(eq(users.role, "admin"));
    if (Number(total) <= 1) throw new Error("O último administrador não pode ser removido.");
  }
  await db.batch([
    db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId)),
    db.insert(userRoleHistory).values({
      userId,
      previousRole: target.role,
      newRole: role,
      changedBy: session.user.id,
    }),
  ]);
  revalidatePath("/admin/equipe");
  revalidatePath("/admin");
}

export async function updateQuote(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  const valid = [
    "pending",
    "reviewing",
    "waiting_customer",
    "approved",
    "rejected",
    "in_production",
    "completed",
    "cancelled",
  ] as const;
  const requestedStatus = String(formData.get("status"));
  if (!valid.includes(requestedStatus as (typeof valid)[number]))
    throw new Error("Status inválido.");
  const status = requestedStatus as (typeof valid)[number];
  const [current] = await db.select().from(quoteRequests).where(eq(quoteRequests.id, id)).limit(1);
  if (!current) throw new Error("Pedido não encontrado.");
  const price = String(formData.get("price") ?? "");
  const days = String(formData.get("estimatedDays") ?? "");
  const note = String(formData.get("adminNotes") ?? "").trim();
  const update = db
    .update(quoteRequests)
    .set({
      status,
      proposedPriceCents: price ? Math.round(Number(price.replace(",", ".")) * 100) : null,
      estimatedDays: days ? Number(days) : null,
      adminNotes: note || null,
      updatedAt: new Date(),
    })
    .where(eq(quoteRequests.id, id));
  if (current.status !== status) {
    await db.batch([
      update,
      db.insert(quoteStatusHistory).values({
        quoteRequestId: id,
        fromStatus: current.status,
        toStatus: status,
        note: note || null,
        changedBy: session.user.id,
      }),
    ]);
  } else {
    await update;
  }
  revalidatePath(`/admin/pedidos/${id}`);
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
}

function optionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

export type AdminFormState = { success: boolean; message: string };

function databaseErrorMessage(error: unknown, entity: "produto" | "coleção") {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("unique") || message.includes("duplicate")) {
    return `Já existe ${entity === "produto" ? "um produto" : "uma coleção"} com esse slug.`;
  }
  console.error(`Falha ao salvar ${entity}:`, error);
  return `Não foi possível salvar ${entity === "produto" ? "o produto" : "a coleção"}. Tente novamente.`;
}

export async function saveProduct(
  _state: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();
  const id = optionalText(formData, "id");
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name || !slug || !shortDescription || !description) {
    return { success: false, message: "Preencha nome, slug, resumo e descrição." };
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return {
      success: false,
      message: "O slug deve conter apenas letras minúsculas, números e hífens.",
    };
  }
  const price = optionalText(formData, "startingPrice");
  const days = optionalText(formData, "estimatedDays");
  const values = {
    name,
    slug,
    shortDescription,
    description,
    coverUrl: optionalText(formData, "coverUrl"),
    material: optionalText(formData, "material"),
    dimensions: optionalText(formData, "dimensions"),
    finish: optionalText(formData, "finish"),
    estimatedDays: days ? Number(days) : null,
    startingPriceCents: price ? Math.round(Number(price.replace(",", ".")) * 100) : null,
    status: String(formData.get("status") ?? "draft") as "draft" | "published" | "archived",
    featured: formData.get("featured") === "on",
    updatedAt: new Date(),
  };
  const collectionIds = formData.getAll("collectionIds").map(String);
  const productId = id ?? randomUUID();
  const save = id
    ? db.update(products).set(values).where(eq(products.id, productId))
    : db.insert(products).values({ id: productId, ...values });
  const clearLinks = db
    .delete(productsToCollections)
    .where(eq(productsToCollections.productId, productId));
  try {
    if (collectionIds.length) {
      await db.batch([
        save,
        clearLinks,
        db
          .insert(productsToCollections)
          .values(collectionIds.map((collectionId) => ({ productId, collectionId }))),
      ]);
    } else {
      await db.batch([save, clearLinks]);
    }
  } catch (error) {
    return { success: false, message: databaseErrorMessage(error, "produto") };
  }
  revalidatePath("/admin/produtos");
  revalidatePath("/catalogo");
  revalidatePath("/");
  redirect(`/admin/produtos/${productId}`);
}

export async function saveCollection(
  _state: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();
  const id = optionalText(formData, "id");
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name || !slug || !description) {
    return { success: false, message: "Preencha nome, slug e descrição." };
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return {
      success: false,
      message: "O slug deve conter apenas letras minúsculas, números e hífens.",
    };
  }
  const values = {
    name,
    slug,
    description,
    coverUrl: optionalText(formData, "coverUrl"),
    status: String(formData.get("status") ?? "draft") as "draft" | "published" | "archived",
    updatedAt: new Date(),
  };
  const productIds = formData.getAll("productIds").map(String);
  const collectionId = id ?? randomUUID();
  const save = id
    ? db.update(collections).set(values).where(eq(collections.id, collectionId))
    : db.insert(collections).values({ id: collectionId, ...values });
  const clearLinks = db
    .delete(productsToCollections)
    .where(eq(productsToCollections.collectionId, collectionId));
  try {
    if (productIds.length) {
      await db.batch([
        save,
        clearLinks,
        db
          .insert(productsToCollections)
          .values(productIds.map((productId) => ({ productId, collectionId }))),
      ]);
    } else {
      await db.batch([save, clearLinks]);
    }
  } catch (error) {
    return { success: false, message: databaseErrorMessage(error, "coleção") };
  }
  revalidatePath("/admin/colecoes");
  revalidatePath("/colecoes");
  revalidatePath("/");
  redirect(`/admin/colecoes/${slug}`);
}
