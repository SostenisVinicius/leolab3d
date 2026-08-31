import { describe, expect, it } from "vitest";
import { cn, formatCurrency, formatCurrencyInput, parseCurrencyInput, statusLabels } from "./utils";
describe("formatCurrency", () => {
  it("formata centavos", () => expect(formatCurrency(129900)).toContain("1.299,00"));
  it("trata ausência", () => expect(formatCurrency(null)).toBe("Sob consulta"));
});

describe("campos monetários BRL", () => {
  it("formata centavos para entrada brasileira", () =>
    expect(formatCurrencyInput(125000)).toContain("1.250,00"));
  it("formata zero", () => expect(formatCurrencyInput(0)).toContain("0,00"));
  it("formata ausência como zero", () => expect(formatCurrencyInput(null)).toContain("0,00"));
  it("formata centavos quebrados", () =>
    expect(formatCurrencyInput(1250090)).toContain("12.500,90"));
  it("converte valor brasileiro em centavos", () =>
    expect(parseCurrencyInput("R$ 1.250,00")).toBe(125000));
  it("converte valor com centavos quebrados", () =>
    expect(parseCurrencyInput("R$ 12.500,90")).toBe(1250090));
  it("não confunde separador de milhar com decimal", () =>
    expect(parseCurrencyInput("1.250,00")).not.toBe(125));
  it("trata valor vazio", () => expect(parseCurrencyInput("")).toBeNull());
  it("trata valor só com espaços", () => expect(parseCurrencyInput("   ")).toBeNull());
  it("trata ausência", () => expect(parseCurrencyInput(null)).toBeNull());
  it("trata texto sem dígitos como zero", () => expect(parseCurrencyInput("R$")).toBe(0));
  it("faz a volta completa do valor", () =>
    expect(parseCurrencyInput(formatCurrencyInput(125000))).toBe(125000));
});
describe("interface", () => {
  it("combina classes", () => expect(cn("a", false, undefined, "b")).toBe("a b"));
  it("traduz estado", () => expect(statusLabels.pending).toBe("Pendente"));
});
