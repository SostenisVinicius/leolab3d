import { notFound } from "next/navigation";
import { CollectionAdminForm } from "@/components/collection-admin-form";
import { db } from "@/db";
import { products } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getCollectionWithProducts } from "@/lib/admin-data";
export default async function EditCollection({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
      </section>
    </>
  );
}
