import { z } from "zod";

const contactFields = {
  name: z.string().trim().min(3, "Informe seu nome completo."),
  email: z.email("Informe um e-mail válido."),
  phone: z.string().trim().min(10, "Informe um WhatsApp com DDD."),
  quantity: z.coerce.number().int().min(1).max(100),
  desiredDate: z.string().optional(),
};

/** Peça já cadastrada: a descrição vem do produto, então só pedimos contato e observações. */
export const catalogQuoteSchema = z.object({
  kind: z.literal("catalog"),
  ...contactFields,
  productId: z.string().trim().min(1, "Peça não identificada."),
  productName: z.string().trim().min(1, "Peça não identificada."),
  notes: z.string().trim().max(2000, "Use no máximo 2000 caracteres.").optional(),
});

/** Projeto personalizado: precisamos que a pessoa descreva a peça. */
export const customQuoteSchema = z.object({
  kind: z.literal("custom"),
  ...contactFields,
  title: z.string().trim().min(3, "Dê um nome ao projeto."),
  description: z
    .string()
    .trim()
    .min(20, "Conte um pouco mais sobre a peça (mínimo de 20 caracteres)."),
});

export const quoteSchema = z.discriminatedUnion("kind", [catalogQuoteSchema, customQuoteSchema]);

export const productSchema = z.object({
  name: z.string().trim().min(3),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().trim().min(10),
  description: z.string().trim().min(20),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  finish: z.string().optional(),
  startingPrice: z.coerce.number().min(0).optional(),
  estimatedDays: z.coerce.number().int().min(1).optional(),
});

export type QuoteState = {
  success: boolean;
  message: string;
  protocol?: string;
  errors?: Record<string, string[]>;
};
