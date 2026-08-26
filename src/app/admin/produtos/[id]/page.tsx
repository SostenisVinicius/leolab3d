import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductAdminForm } from "@/components/product-admin-form";
import { db } from "@/db";
import { collections } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getProductWithCollections } from "@/lib/admin-data";
export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
      </section>
    </>
  );
}
