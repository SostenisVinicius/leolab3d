"use client";

import { saveCollection, type AdminFormState } from "@/app/actions/admin";
import { AdminSubmitButton } from "@/components/admin-submit-button";
import { ImageUpload } from "@/components/image-upload";
import { useActionState } from "react";
type CollectionForm = {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverUrl: string | null;
  status: "draft" | "published" | "archived";
  productIds: string[];
};
type ProductOption = { id: string; name: string; coverUrl: string | null };
export function CollectionAdminForm({
  collection,
  products,
}: {
  collection?: CollectionForm | null;
  products: ProductOption[];
}) {
  const initialState: AdminFormState = { success: false, message: "" };
  const [state, action] = useActionState(saveCollection, initialState);
  return (
    <form action={action} className="admin-form-layout">
      {collection && <input type="hidden" name="id" value={collection.id} />}
      <div className="data-card form-card">
        <h2>Dados da coleção</h2>
        <label>
          Nome
          <input name="name" defaultValue={collection?.name} />
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={collection?.slug} />
        </label>
        <label>
          Descrição
          <textarea name="description" rows={5} defaultValue={collection?.description} />
        </label>
        <h2>Produtos da coleção</h2>
        {products.map((p) => (
          <label className="product-check" key={p.id}>
            <input
              name="productIds"
              value={p.id}
              type="checkbox"
              defaultChecked={collection?.productIds.includes(p.id)}
            />
            <span style={{ backgroundImage: p.coverUrl ? `url(${p.coverUrl})` : undefined }} />
            <b>{p.name}</b>
          </label>
        ))}
      </div>
      <aside>
        <div className="data-card form-card">
          <ImageUpload
            name="coverUrl"
            folder="collections"
            initialUrl={collection?.coverUrl}
            label="Capa da coleção"
          />
          <label>
            Status
            <select name="status" defaultValue={collection?.status ?? "draft"}>
              <option value="published">Publicada</option>
              <option value="draft">Rascunho</option>
              <option value="archived">Arquivada</option>
            </select>
          </label>
          {state.message && <p className="admin-form-message">{state.message}</p>}
          <AdminSubmitButton>Salvar coleção</AdminSubmitButton>
        </div>
      </aside>
    </form>
  );
}
