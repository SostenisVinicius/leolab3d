import { describe, expect, it } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";
import { publishedCollectionFilters, publishedProductFilters } from "./public-data";

const dialect = new PgDialect();
const compile = (condition: Parameters<PgDialect["sqlToQuery"]>[0]) =>
  dialect.sqlToQuery(condition);

describe("visibilidade pública de produtos", () => {
  it("só retorna produtos publicados", () => {
    const { sql, params } = compile(publishedProductFilters());
    expect(sql).toContain('"status" = $1');
    expect(params).toEqual(["published"]);
  });

  it("não abre exceção para rascunho nem arquivado", () => {
    const { params } = compile(publishedProductFilters());
    expect(params).not.toContain("draft");
    expect(params).not.toContain("archived");
  });

  it("mantém o filtro de publicação ao buscar por slug", () => {
    const { params } = compile(publishedProductFilters({ slug: "produto-em-rascunho" }));
    expect(params).toEqual(["published", "produto-em-rascunho"]);
  });

  it("exige coleção publicada ao filtrar por coleção", () => {
    const { params } = compile(publishedProductFilters({ collectionSlug: "futuro-sintetico" }));
    expect(params).toEqual(["published", "futuro-sintetico", "published"]);
  });

  it("busca por nome e resumo sem perder o filtro de publicação", () => {
    const { sql, params } = compile(publishedProductFilters({ search: "totem" }));
    expect(sql).toContain("ilike");
    expect(params).toEqual(["published", "%totem%", "%totem%"]);
  });

  it("restringe destaques a produtos publicados", () => {
    const { params } = compile(publishedProductFilters({ featured: true }));
    expect(params).toEqual(["published", true]);
  });
});

describe("visibilidade pública de coleções", () => {
  it("só retorna coleções publicadas", () => {
    const { params } = compile(publishedCollectionFilters());
    expect(params).toEqual(["published"]);
  });

  it("mantém o filtro de publicação ao buscar por slug", () => {
    const { params } = compile(publishedCollectionFilters("colecao-em-rascunho"));
    expect(params).toEqual(["published", "colecao-em-rascunho"]);
  });
});
