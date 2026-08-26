import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductAdminForm } from "@/components/product-admin-form";
export default function NewProduct() {
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
        <ProductAdminForm />
      </section>
    </>
  );
}
