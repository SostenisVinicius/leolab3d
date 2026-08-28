import { notFound } from "next/navigation";
import { CollectionAdminForm } from "@/components/collection-admin-form";
import { db } from "@/db";
import { products } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getCollectionWithProducts } from "@/lib/admin-data";
import { DeleteEntityButton } from "@/components/delete-entity-button";
import { AdminToast } from "@/components/admin-toast";
export default async function EditCollection({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ salvo?: string; status?: string }>;
}) {
  const { slug } = await params;
  const notice = await searchParams;
  const [c, options] = await Promise.all([
    getCollectionWithProducts(slug),
    db
      .select({ id: products.id, name: products.name, coverUrl: products.coverUrl })
      .from(products)
      .orderBy(asc(products.name)),
  ]);
  if (!c) notFound();
  return (
    <>
      <header className="admin-header">
        <div>
          <span>Organização</span>
          <h1>Editar coleção</h1>
          <p>{c.name}</p>
        </div>
      </header>
      <section className="admin-content">
        <CollectionAdminForm collection={c} products={options} />
        <div className="danger-zone">
          <div>
            <strong>Excluir coleção</strong>
            <p>Os produtos continuarão disponíveis individualmente.</p>
          </div>
          <DeleteEntityButton id={c.id} entity="coleção" />
        </div>
      </section>
      {notice.salvo && (
        <AdminToast entity="coleção" status={notice.status} publicHref={`/colecoes/${c.slug}`} />
      )}
    </>
  );
}
