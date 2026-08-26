import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo."),
  email: z.email("Informe um e-mail válido."),
  phone: z.string().trim().min(10, "Informe um telefone com DDD."),
  title: z.string().trim().min(3, "Dê um nome ao projeto."),
  description: z
    .string()
    .trim()
    .min(20, "Conte um pouco mais sobre a peça (mínimo de 20 caracteres)."),
  quantity: z.coerce.number().int().min(1).max(100),
  productId: z.string().optional(),
  productName: z.string().optional(),
  desiredDate: z.string().optional(),
});

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
