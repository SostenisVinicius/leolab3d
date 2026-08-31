import { describe, expect, it } from "vitest";
import {
  isPublicQuoteUploadPath,
  isValidQuotePhone,
  MAX_QUOTE_ATTACHMENTS,
  normalizePhone,
  normalizeQuoteAttachments,
  quoteUploadFolder,
} from "./quote-attachments";

describe("vínculo do upload com o WhatsApp", () => {
  it("reduz o número ao que interessa", () => {
    expect(normalizePhone("(11) 99999-9999")).toBe("11999999999");
  });

  it("aceita números com DDD", () => {
    expect(isValidQuotePhone("(11) 99999-9999")).toBe(true);
    expect(isValidQuotePhone("+55 11 99999-9999")).toBe(true);
  });

  it("recusa número incompleto ou vazio", () => {
    expect(isValidQuotePhone("99999")).toBe(false);
    expect(isValidQuotePhone("")).toBe(false);
    expect(isValidQuotePhone(null)).toBe(false);
  });

  it("monta a pasta do solicitante", () => {
    expect(quoteUploadFolder("(11) 99999-9999")).toBe("quotes/11999999999");
  });
});

describe("caminhos liberados sem sessão administrativa", () => {
  it("aceita uma referência dentro da pasta de um WhatsApp", () => {
    expect(isPublicQuoteUploadPath("quotes/11999999999/1700000000-foto.png")).toBe(true);
  });

  it("recusa a pasta de produtos", () => {
    expect(isPublicQuoteUploadPath("products/1700000000-capa.png")).toBe(false);
    expect(isPublicQuoteUploadPath("collections/1700000000-capa.png")).toBe(false);
  });

  it("recusa referência sem número válido", () => {
    expect(isPublicQuoteUploadPath("quotes/abc/foto.png")).toBe(false);
    expect(isPublicQuoteUploadPath("quotes/123/foto.png")).toBe(false);
  });

  it("recusa tentativa de escapar da pasta", () => {
    expect(isPublicQuoteUploadPath("quotes/11999999999/../products/capa.png")).toBe(false);
    expect(isPublicQuoteUploadPath("quotes/11999999999/sub/foto.png")).toBe(false);
  });
});

describe("normalizeQuoteAttachments", () => {
  const base = (n: number) => ({
    url: `https://abc.public.blob.vercel-storage.com/quotes/11999999999/${n}.png`,
    fileName: `ref-${n}.png`,
    contentType: "image/png",
    size: 1024,
  });

  it("monta os anexos preservando a ordem", () => {
    const [first, second] = [base(1), base(2)];
    expect(
      normalizeQuoteAttachments({
        urls: [first.url, second.url],
        names: [first.fileName, second.fileName],
        types: ["image/png", "image/png"],
        sizes: ["1024", "1024"],
      }),
    ).toEqual([first, second]);
  });

  it("respeita o limite de seis imagens", () => {
    const count = MAX_QUOTE_ATTACHMENTS + 4;
    const result = normalizeQuoteAttachments({
      urls: Array.from({ length: count }, (_, index) => base(index).url),
      names: Array.from({ length: count }, (_, index) => base(index).fileName),
      types: Array.from({ length: count }, () => "image/png"),
      sizes: Array.from({ length: count }, () => "1024"),
    });
    expect(result).toHaveLength(MAX_QUOTE_ATTACHMENTS);
  });

  it("ignora repetidos e vazios", () => {
    const first = base(1);
    const result = normalizeQuoteAttachments({
      urls: ["", first.url, first.url],
      names: ["", first.fileName, first.fileName],
      types: ["", "image/png", "image/png"],
      sizes: ["", "1024", "1024"],
    });
    expect(result).toHaveLength(1);
  });

  it("preenche metadados ausentes sem quebrar as colunas obrigatórias", () => {
    const [file] = normalizeQuoteAttachments({
      urls: [base(1).url],
      names: [""],
      types: [""],
      sizes: ["não é número"],
    });
    expect(file.fileName).toBe("referencia");
    expect(file.contentType).toBe("application/octet-stream");
    expect(file.size).toBe(0);
  });

  it("aceita solicitação sem nenhuma referência", () => {
    expect(normalizeQuoteAttachments({ urls: [], names: [], types: [], sizes: [] })).toEqual([]);
  });
});
