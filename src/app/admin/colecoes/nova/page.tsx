import { CollectionAdminForm } from "@/components/collection-admin-form";
import { db } from "@/db";
import { products } from "@/db/schema";
import { asc } from "drizzle-orm";
export default async function NewCollection() {
  const options = await db
    .select({ id: products.id, name: products.name, coverUrl: products.coverUrl })
    .from(products)
    .orderBy(asc(products.name));
  return (
    <>
      <header className="admin-header">
        <div>
          <span>Organização</span>
          <h1>Nova coleção</h1>
          <p>Crie um novo agrupamento para a vitrine.</p>
        </div>
      </header>
      <section className="admin-content">
        <CollectionAdminForm products={options} />
      </section>
    </>
  );
}
