import { describe, expect, it } from "vitest";
import { IMAGE_UPLOAD_MAX_SIZE, isManagedBlobUrl, validateImageFile } from "./image-upload";

describe("isManagedBlobUrl", () => {
  it("reconhece uma URL do Vercel Blob", () => {
    expect(
      isManagedBlobUrl("https://abc123.public.blob.vercel-storage.com/products/peca.png"),
    ).toBe(true);
  });

  it("ignora imagens externas", () => {
    expect(isManagedBlobUrl("https://images.unsplash.com/foto.jpg")).toBe(false);
  });

  it("ignora um domínio que apenas imita o sufixo", () => {
    expect(isManagedBlobUrl("https://blob.vercel-storage.com.attacker.test/x.png")).toBe(false);
  });

  it("ignora URLs inválidas e ausentes", () => {
    expect(isManagedBlobUrl("nao-e-url")).toBe(false);
    expect(isManagedBlobUrl(null)).toBe(false);
    expect(isManagedBlobUrl(undefined)).toBe(false);
  });
});

describe("validateImageFile", () => {
  it("aceita imagens suportadas dentro do limite", () => {
    expect(validateImageFile({ type: "image/webp", size: 1024 })).toBeNull();
  });

  it("rejeita formatos não suportados", () => {
    expect(validateImageFile({ type: "application/pdf", size: 1024 })).toContain("JPG");
  });

  it("rejeita imagens maiores que 8 MB", () => {
    expect(validateImageFile({ type: "image/png", size: IMAGE_UPLOAD_MAX_SIZE + 1 })).toContain(
      "8 MB",
    );
  });
});
