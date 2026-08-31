import { describe, expect, it } from "vitest";
import { quoteSchema } from "./validators";

/** Os ramos da união expõem campos diferentes; nos testes basta olhar por nome. */
function fieldErrorsOf(input: unknown): Record<string, string[] | undefined> {
  const parsed = quoteSchema.safeParse(input);
  if (parsed.success) return {};
  return parsed.error.flatten().fieldErrors;
}

const contact = {
  name: "Maria Souza",
  email: "maria@exemplo.com",
  phone: "(11) 99999-9999",
  quantity: "2",
};

describe("orçamento de peça cadastrada", () => {
  const catalog = { kind: "catalog", ...contact, productId: "uuid-1", productName: "Totem" };

  it("aceita apenas contato e detalhes do pedido", () => {
    const parsed = quoteSchema.safeParse(catalog);
    expect(parsed.success).toBe(true);
  });

  it("não exige descrição da peça", () => {
    const parsed = quoteSchema.safeParse(catalog);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data).not.toHaveProperty("description");
  });

  it("aceita observações opcionais", () => {
    const parsed = quoteSchema.safeParse({ ...catalog, notes: "Prefiro em azul." });
    expect(parsed.success && parsed.data.kind === "catalog" && parsed.data.notes).toBe(
      "Prefiro em azul.",
    );
  });

  it("exige a identificação da peça", () => {
    const parsed = quoteSchema.safeParse({ ...catalog, productId: "" });
    expect(parsed.success).toBe(false);
  });

  it("cobra os dados de contato", () => {
    const errors = fieldErrorsOf({ ...catalog, email: "não-é-email", phone: "123" });
    expect(errors.email).toBeDefined();
    expect(errors.phone).toBeDefined();
  });
});

describe("orçamento de projeto personalizado", () => {
  const custom = {
    kind: "custom",
    ...contact,
    title: "Miniatura do meu cachorro",
    description: "Quero uma miniatura de 15 cm, colorida, com base personalizada.",
  };

  it("aceita o formulário completo", () => {
    expect(quoteSchema.safeParse(custom).success).toBe(true);
  });

  it("exige nome do projeto", () => {
    expect(fieldErrorsOf({ ...custom, title: "" }).title).toBeDefined();
  });

  it("exige uma descrição com o mínimo de detalhe", () => {
    expect(fieldErrorsOf({ ...custom, description: "curta" }).description).toBeDefined();
  });

  it("não exige peça do catálogo", () => {
    const parsed = quoteSchema.safeParse(custom);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data).not.toHaveProperty("productId");
  });
});
