import { notFound } from "next/navigation";
import { CollectionAdminForm } from "@/components/collection-admin-form";
import { collections } from "@/lib/demo-data";
export default async function EditCollection({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
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
        <CollectionAdminForm collection={c} />
      </section>
    </>
  );
}
