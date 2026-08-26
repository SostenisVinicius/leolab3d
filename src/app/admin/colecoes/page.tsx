import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { collections } from "@/lib/demo-data";
export default function AdminCollections() {
  return (
    <>
      <header className="admin-header">
        <div>
          <span>Organização</span>
          <h1>Coleções</h1>
          <p>Agrupe produtos por universo, estilo ou campanha.</p>
        </div>
        <Link className="button" href="/admin/colecoes/nova">
          <Plus /> Nova coleção
        </Link>
      </header>
      <section className="admin-content collection-admin-grid">
        {collections.map((c, i) => (
          <Link
            href={`/admin/colecoes/${c.slug}`}
            className="data-card admin-collection"
            key={c.slug}
          >
            <div style={{ backgroundImage: `url(${c.image})` }} />
            <section>
              <span>0{i + 1}</span>
              <h2>{c.name}</h2>
              <p>{c.description}</p>
              <small>{c.productSlugs.length} produtos</small>
              <ArrowRight />
            </section>
          </Link>
        ))}
      </section>
    </>
  );
}
