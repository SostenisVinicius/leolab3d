import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductAdminForm } from "@/components/product-admin-form";
import { products } from "@/lib/demo-data";
export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = products.find((x) => x.id === id);
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
        <ProductAdminForm product={p} />
      </section>
    </>
  );
}
