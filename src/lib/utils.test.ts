import { describe, expect, it } from "vitest";
import { cn, formatCurrency, statusLabels } from "./utils";
describe("formatCurrency", () => {
  it("formata centavos", () => expect(formatCurrency(129900)).toContain("1.299,00"));
  it("trata ausência", () => expect(formatCurrency(null)).toBe("Sob consulta"));
});
describe("interface", () => {
  it("combina classes", () => expect(cn("a", false, undefined, "b")).toBe("a b"));
  it("traduz estado", () => expect(statusLabels.pending).toBe("Pendente"));
});
