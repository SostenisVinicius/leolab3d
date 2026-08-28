import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductAdminForm } from "@/components/product-admin-form";
import { db } from "@/db";
import { collections } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getProductWithCollections } from "@/lib/admin-data";
import { DeleteEntityButton } from "@/components/delete-entity-button";
import { AdminToast } from "@/components/admin-toast";
export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ salvo?: string; status?: string }>;
}) {
  const { id } = await params;
  const notice = await searchParams;
  const [p, options] = await Promise.all([
    getProductWithCollections(id),
    db
      .select({ id: collections.id, name: collections.name })
      .from(collections)
      .orderBy(asc(collections.name)),
  ]);
  if (!p) notFound();
  return (
    <>
      <header className="admin-header">
        <div>
          <Link className="back-link" href="/admin/produtos">
            <ArrowLeft /> Produtos
          </Link>
          <h1>Editar produto</h1>
          <p>{p.name}</p>
        </div>
      </header>
      <section className="admin-content">
        <ProductAdminForm product={p} collections={options} />
        <div className="danger-zone">
          <div>
            <strong>Excluir produto</strong>
            <p>Pedidos antigos preservarão o nome e a quantidade da peça.</p>
          </div>
          <DeleteEntityButton id={p.id} entity="produto" />
        </div>
      </section>
      {notice.salvo && (
        <AdminToast entity="produto" status={notice.status} publicHref={`/pecas/${p.slug}`} />
      )}
    </>
  );
}
