import { CollectionAdminForm } from "@/components/collection-admin-form";
export default function NewCollection() {
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
        <CollectionAdminForm />
      </section>
    </>
  );
}
