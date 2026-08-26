import Link from "next/link";
import { Edit3, Plus, Search } from "lucide-react";
import { products } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";
export default function AdminProducts() {
  return (
    <>
      <header className="admin-header">
        <div>
          <span>Catálogo</span>
          <h1>Produtos</h1>
          <p>Cadastre peças e organize a vitrine pública.</p>
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
        </div>
        <div className="admin-product-grid">
          {products.map((p) => (
            <article className="admin-product" key={p.id}>
              <div style={{ backgroundImage: `url(${p.image})` }}>
                <span>Publicado</span>
              </div>
              <section>
                <small>{p.category}</small>
                <h2>{p.name}</h2>
                <p>{formatCurrency(p.startingPriceCents)}</p>
                <Link href={`/admin/produtos/${p.id}`}>
                  <Edit3 /> Editar
                </Link>
              </section>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
