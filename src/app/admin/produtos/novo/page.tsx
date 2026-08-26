import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductAdminForm } from "@/components/product-admin-form";
import { db } from "@/db";
import { collections } from "@/db/schema";
import { asc } from "drizzle-orm";
export default async function NewProduct() {
  const options = await db
    .select({ id: collections.id, name: collections.name })
    .from(collections)
    .orderBy(asc(collections.name));
  return (
    <>
      <header className="admin-header">
        <div>
          <Link className="back-link" href="/admin/produtos">
            <ArrowLeft /> Produtos
          </Link>
          <h1>Novo produto</h1>
          <p>Cadastre uma nova peça no catálogo.</p>
        </div>
      </header>
      <section className="admin-content">
        <ProductAdminForm collections={options} />
      </section>
    </>
  );
}
