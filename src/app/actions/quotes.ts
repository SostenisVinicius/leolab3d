"use server";

import {
  quoteAttachments,
  quoteRequests,
  quoteRequestItems,
  quoteStatusHistory,
} from "@/db/schema";
import { databaseConfigured, db } from "@/db";
import { normalizeQuoteAttachments } from "@/lib/quote-attachments";
import { quoteSchema, type QuoteState } from "@/lib/validators";

export async function createQuote(_: QuoteState, formData: FormData): Promise<QuoteState> {
  const parsed = quoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      success: false,
      message: "Revise os campos destacados.",
      errors: parsed.error.flatten().fieldErrors,
    };
  const data = parsed.data;

  // Referências visuais existem apenas no projeto personalizado.
  const attachments =
    data.kind === "custom"
      ? normalizeQuoteAttachments({
          urls: formData.getAll("attachmentUrl").map(String),
          names: formData.getAll("attachmentName").map(String),
          types: formData.getAll("attachmentType").map(String),
          sizes: formData.getAll("attachmentSize").map(String),
        })
      : [];

  const protocol = `LL3D-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  if (!databaseConfigured)
    return { success: true, protocol, message: "Solicitação registrada no modo de demonstração." };

  const title = data.kind === "catalog" ? data.productName : data.title;
  const description =
    data.kind === "catalog"
      ? data.notes?.trim() || "Pedido da peça do catálogo, sem observações adicionais."
      : data.description;

  try {
    const [quote] = await db
      .insert(quoteRequests)
      .values({
        protocol,
        kind: data.kind,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        title,
        description,
        quantity: data.quantity,
        desiredDate: data.desiredDate ? new Date(`${data.desiredDate}T12:00:00`) : null,
      })
      .returning({ id: quoteRequests.id });

    if (data.kind === "catalog") {
      await db.insert(quoteRequestItems).values({
        quoteRequestId: quote.id,
        productId: data.productId,
        productName: data.productName,
        quantity: data.quantity,
      });
    }
    if (attachments.length) {
      await db
        .insert(quoteAttachments)
        .values(attachments.map((file) => ({ ...file, quoteRequestId: quote.id })));
    }
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
