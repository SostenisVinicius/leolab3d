import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/demo-data";

export const metadata = { title: "Catálogo | LeoLab3D" };
export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; categoria?: string }>;
}) {
  const query = await searchParams;
  const term = query.busca?.toLowerCase() ?? "";
  const filtered = products.filter(
    (p) =>
      (!term || `${p.name} ${p.shortDescription}`.toLowerCase().includes(term)) &&
      (!query.categoria || p.category === query.categoria),
  );
  const categories = [...new Set(products.map((p) => p.category))];
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
            <label>
              <Search />
              <input name="busca" defaultValue={query.busca} placeholder="Buscar uma peça..." />
            </label>
            <div className="filter-pills">
              <a href="/catalogo" className={!query.categoria ? "active" : ""}>
                Todas
              </a>
              {categories.map((c) => (
                <a
                  key={c}
                  className={query.categoria === c ? "active" : ""}
                  href={`/catalogo?categoria=${encodeURIComponent(c)}`}
                >
                  {c}
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
