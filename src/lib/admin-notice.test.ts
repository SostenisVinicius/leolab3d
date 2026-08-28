import { describe, expect, it } from "vitest";
import { adminNotice } from "./admin-notice";

describe("aviso administrativo", () => {
  it("confirma a publicação de um produto", () => {
    const notice = adminNotice({ entity: "produto", status: "published" });
    expect(notice.title).toBe("Produto publicado com sucesso");
    expect(notice.tone).toBe("success");
    expect(notice.showPublicLink).toBe(true);
  });

  it("confirma a publicação de uma coleção com concordância feminina", () => {
    const notice = adminNotice({ entity: "coleção", status: "published" });
    expect(notice.title).toBe("Coleção publicada com sucesso");
    expect(notice.showPublicLink).toBe(true);
  });

  it("avisa que o rascunho não está visível", () => {
    const notice = adminNotice({ entity: "produto", status: "draft" });
    expect(notice.title).toBe("Rascunho salvo com sucesso");
    expect(notice.message).toContain("ainda não está visível");
    expect(notice.showPublicLink).toBe(false);
  });

  it("trata status ausente como rascunho", () => {
    expect(adminNotice({ entity: "produto" }).title).toBe("Rascunho salvo com sucesso");
  });

  it("avisa que o item arquivado saiu do catálogo", () => {
    const notice = adminNotice({ entity: "produto", status: "archived" });
    expect(notice.title).toBe("Produto arquivado");
    expect(notice.showPublicLink).toBe(false);
  });

  it("confirma exclusões com a concordância de cada entidade", () => {
    expect(adminNotice({ entity: "produto", deleted: true }).title).toBe(
      "Produto excluído com sucesso",
    );
    expect(adminNotice({ entity: "coleção", deleted: true }).title).toBe(
      "Coleção excluída com sucesso",
    );
  });

  it("nunca oferece link público para item excluído", () => {
    const notice = adminNotice({ entity: "produto", status: "published", deleted: true });
    expect(notice.showPublicLink).toBe(false);
  });
});
