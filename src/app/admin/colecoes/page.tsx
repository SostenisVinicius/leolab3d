import Link from "next/link";
import { ArrowRight, FolderKanban, ImageIcon, Plus } from "lucide-react";
import { getAdminCollections } from "@/lib/admin-data";

export default async function AdminCollections() {
  const rows = await getAdminCollections();
  return (
    <>
      <header className="admin-header">
        <div>
          <span>Organização do catálogo</span>
          <h1>Coleções</h1>
          <p>Agrupe produtos por universo, estilo ou campanha.</p>
        </div>
        <Link className="button" href="/admin/colecoes/nova">
          <Plus /> Nova coleção
        </Link>
      </header>
      <section className="admin-content">
        {rows.length ? (
          <div className="collection-admin-grid">
            {rows.map((c, i) => (
              <Link
                href={`/admin/colecoes/${c.slug}`}
                className="data-card admin-collection"
                key={c.id}
              >
                <div
                  className={!c.coverUrl ? "no-image" : ""}
                  style={{ backgroundImage: c.coverUrl ? `url(${c.coverUrl})` : undefined }}
                >
                  {!c.coverUrl && <ImageIcon />}
                  <span className={`publication ${c.status}`}>
                    {c.status === "published"
                      ? "Publicada"
                      : c.status === "draft"
                        ? "Rascunho"
                        : "Arquivada"}
                  </span>
                </div>
                <section>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h2>{c.name}</h2>
                  <p>{c.description}</p>
                  <small>
                    {c.productCount} {c.productCount === 1 ? "produto" : "produtos"}
                  </small>
                  <ArrowRight />
                </section>
              </Link>
            ))}
          </div>
        ) : (
          <div className="data-card admin-empty">
            <FolderKanban />
            <h3>Nenhuma coleção</h3>
            <p>Crie coleções para organizar os produtos da vitrine.</p>
            <Link href="/admin/colecoes/nova" className="button">
              <Plus /> Nova coleção
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
