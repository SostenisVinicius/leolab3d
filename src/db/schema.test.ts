import { describe, expect, it } from "vitest";
import { getTableConfig } from "drizzle-orm/pg-core";
import { db } from "./index";
import {
  productImages,
  products,
  productsToCollections,
  quoteRequestItems,
  quoteRequests,
} from "./schema";

/** Ação declarada para a chave estrangeira que aponta para `column` da tabela `table`. */
function onDeleteFor(table: Parameters<typeof getTableConfig>[0], columnName: string) {
  const foreignKey = getTableConfig(table).foreignKeys.find((fk) =>
    fk.reference().columns.some((column) => column.name === columnName),
  );
  return foreignKey?.onDelete;
}

describe("exclusão de produto", () => {
  it("preserva o histórico dos pedidos anulando apenas o vínculo", () => {
    expect(onDeleteFor(quoteRequestItems, "product_id")).toBe("set null");
  });

  it("mantém nome e quantidade do item obrigatórios, independentes do produto", () => {
    const columns = getTableConfig(quoteRequestItems).columns;
    const productId = columns.find((column) => column.name === "product_id");
    const productName = columns.find((column) => column.name === "product_name");
    const quantity = columns.find((column) => column.name === "quantity");
    expect(productId?.notNull).toBe(false);
    expect(productName?.notNull).toBe(true);
    expect(quantity?.notNull).toBe(true);
  });

  it("remove os vínculos com coleções", () => {
    expect(onDeleteFor(productsToCollections, "product_id")).toBe("cascade");
  });

  it("remove as imagens auxiliares vinculadas", () => {
    expect(onDeleteFor(productImages, "product_id")).toBe("cascade");
  });
});

describe("exclusão de coleção", () => {
  it("remove apenas os vínculos, nunca os produtos", () => {
    expect(onDeleteFor(productsToCollections, "collection_id")).toBe("cascade");
    const productForeignKeys = getTableConfig(products).foreignKeys;
    expect(productForeignKeys).toHaveLength(0);
  });
});

describe("configuração de relations", () => {
  it("resolve relações com muitos anexos sem ambiguidade", () => {
    expect(() =>
      db.query.quoteRequests
        .findFirst({ with: { items: true, attachments: true, history: true } })
        .toSQL(),
    ).not.toThrow();
  });

  it("resolve a galeria de imagens do produto", () => {
    expect(() => db.query.products.findFirst({ with: { images: true } }).toSQL()).not.toThrow();
  });

  it("resolve as coleções de um produto", () => {
    expect(() =>
      db.query.collections.findFirst({ with: { products: true } }).toSQL(),
    ).not.toThrow();
  });
});

describe("consistência do modelo", () => {
  it("mantém quote_requests como raiz dos itens", () => {
    expect(onDeleteFor(quoteRequestItems, "quote_request_id")).toBe("cascade");
    expect(getTableConfig(quoteRequests).name).toBe("quote_requests");
  });
});
