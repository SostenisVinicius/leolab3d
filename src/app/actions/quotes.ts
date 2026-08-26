"use server";

import { quoteRequests, quoteRequestItems, quoteStatusHistory } from "@/db/schema";
import { databaseConfigured, db } from "@/db";
import { quoteSchema, type QuoteState } from "@/lib/validators";

export async function createQuote(_: QuoteState, formData: FormData): Promise<QuoteState> {
  const parsed = quoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      success: false,
      message: "Revise os campos destacados.",
      errors: parsed.error.flatten().fieldErrors,
    };
  const protocol = `LL3D-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  if (!databaseConfigured)
    return { success: true, protocol, message: "Solicitação registrada no modo de demonstração." };
  try {
    const [quote] = await db
      .insert(quoteRequests)
      .values({
        protocol,
        kind: parsed.data.productId ? "catalog" : "custom",
        customerName: parsed.data.name,
        customerEmail: parsed.data.email,
        customerPhone: parsed.data.phone,
        title: parsed.data.title,
        description: parsed.data.description,
        quantity: parsed.data.quantity,
        desiredDate: parsed.data.desiredDate
          ? new Date(`${parsed.data.desiredDate}T12:00:00`)
          : null,
      })
      .returning({ id: quoteRequests.id });
    if (parsed.data.productId && parsed.data.productName)
      await db.insert(quoteRequestItems).values({
        quoteRequestId: quote.id,
        productId: parsed.data.productId,
        productName: parsed.data.productName,
        quantity: parsed.data.quantity,
      });
    await db
      .insert(quoteStatusHistory)
      .values({ quoteRequestId: quote.id, toStatus: "pending", note: "Solicitação recebida." });
    return { success: true, protocol, message: "Recebemos sua solicitação." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Não foi possível registrar agora. Tente novamente em instantes.",
    };
  }
}
