import Link from "next/link";
import { Edit3, ImageIcon, Plus, Search } from "lucide-react";
import { getAdminProducts } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

const publication = { draft: "Rascunho", published: "Publicado", archived: "Arquivado" };
export default async function AdminProducts() {
  const rows = await getAdminProducts();
  return (
    <>
      <header className="admin-header">
        <div>
          <span>Catálogo</span>
          <h1>Produtos</h1>
          <p>Gerencie as peças que aparecem na vitrine.</p>
        </div>
        <Link className="button" href="/admin/produtos/novo">
          <Plus /> Novo produto
        </Link>
      </header>
      <section className="admin-content">
        <div className="admin-toolbar">
          <label>
            <Search />
            <input placeholder="Buscar produto..." />
          </label>
          <span className="toolbar-count">{rows.length} produtos</span>
        </div>
        {rows.length ? (
          <div className="admin-product-grid">
            {rows.map((p) => (
              <article className="admin-product" key={p.id}>
                <div
                  className={!p.coverUrl ? "no-image" : ""}
                  style={{ backgroundImage: p.coverUrl ? `url(${p.coverUrl})` : undefined }}
                >
                  {!p.coverUrl && <ImageIcon />}
                  <span className={`publication ${p.status}`}>{publication[p.status]}</span>
                </div>
                <section>
                  <small>{p.material ?? "Peça 3D"}</small>
                  <h2>{p.name}</h2>
                  <p>{formatCurrency(p.startingPriceCents)}</p>
                  <Link href={`/admin/produtos/${p.id}`}>
                    <Edit3 /> Editar produto
                  </Link>
                </section>
              </article>
            ))}
          </div>
        ) : (
          <div className="data-card admin-empty">
            <BoxesFallback />
            <h3>Catálogo vazio</h3>
            <p>Cadastre o primeiro produto para começar sua vitrine.</p>
            <Link href="/admin/produtos/novo" className="button">
              <Plus /> Novo produto
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
function BoxesFallback() {
  return <span className="empty-symbol">3D</span>;
}
