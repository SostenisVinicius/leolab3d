import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { getPublishedCollections, getPublishedProducts } from "@/lib/public-data";

export const metadata = { title: "Catálogo | LeoLab3D" };
export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; colecao?: string }>;
}) {
  const query = await searchParams;
  const [filtered, collectionOptions] = await Promise.all([
    getPublishedProducts({ search: query.busca, collectionSlug: query.colecao }),
    getPublishedCollections(),
  ]);
  const catalogHref = (colecao?: string) => {
    const params = new URLSearchParams();
    if (query.busca) params.set("busca", query.busca);
    if (colecao) params.set("colecao", colecao);
    const search = params.toString();
    return search ? `/catalogo?${search}` : "/catalogo";
  };
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="kicker">Catálogo LeoLab3D</span>
          <h1>
            Peças que inspiram
            <br />
            <em>novas ideias.</em>
          </h1>
          <p>
            Encontre seu próximo item ou use uma criação como ponto de partida para algo
            exclusivamente seu.
          </p>
        </div>
      </section>
      <section className="section catalog-section">
        <div className="container">
          <form className="catalog-tools">
            {query.colecao && <input type="hidden" name="colecao" value={query.colecao} />}
            <label>
              <Search />
              <input name="busca" defaultValue={query.busca} placeholder="Buscar uma peça..." />
            </label>
            <div className="filter-pills">
              <a href={catalogHref()} className={!query.colecao ? "active" : ""}>
                Todas
              </a>
              {collectionOptions.map((c) => (
                <a
                  key={c.id}
                  className={query.colecao === c.slug ? "active" : ""}
                  href={catalogHref(c.slug)}
                >
                  {c.name}
                </a>
              ))}
            </div>
          </form>
          <div className="result-count">
            <strong>{filtered.length}</strong> peças encontradas
          </div>
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {!filtered.length && (
            <div className="empty-state">
              <h2>Nenhuma peça encontrada</h2>
              <p>Tente outro termo ou solicite uma criação personalizada.</p>
              <a className="button" href="/orcamento">
                Criar uma peça
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
