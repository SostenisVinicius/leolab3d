"use client";

import { saveProduct, type AdminFormState } from "@/app/actions/admin";
import { AdminSubmitButton } from "@/components/admin-submit-button";
import { ImageUpload } from "@/components/image-upload";
import { ProductGalleryUpload } from "@/components/product-gallery-upload";
import { CurrencyInput } from "@/components/currency-input";
import { useActionState } from "react";
type ProductForm = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverUrl: string | null;
  material: string | null;
  dimensions: string | null;
  finish: string | null;
  estimatedDays: number | null;
  startingPriceCents: number | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
  collectionIds: string[];
  images: Array<{ url: string; alt: string }>;
};
type CollectionOption = { id: string; name: string };
export function ProductAdminForm({
  product,
  collections,
}: {
  product?: ProductForm | null;
  collections: CollectionOption[];
}) {
  const initialState: AdminFormState = { success: false, message: "" };
  const [state, action] = useActionState(saveProduct, initialState);
  return (
    <form action={action} className="admin-form-layout">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div>
        <div className="data-card form-card">
          <h2>Informações básicas</h2>
          <label>
            Nome do produto
            <input name="name" defaultValue={product?.name} />
          </label>
          <label>
            Slug
            <input name="slug" defaultValue={product?.slug} />
          </label>
          <label>
            Resumo
            <input name="shortDescription" defaultValue={product?.shortDescription} />
          </label>
          <label>
            Descrição
            <textarea name="description" rows={6} defaultValue={product?.description} />
          </label>
        </div>
        <div className="data-card form-card">
          <h2>Especificações</h2>
          <div className="form-grid">
            <label>
              Material
              <input name="material" defaultValue={product?.material ?? ""} />
            </label>
            <label>
              Dimensões
              <input name="dimensions" defaultValue={product?.dimensions ?? ""} />
            </label>
            <label>
              Acabamento
              <input name="finish" defaultValue={product?.finish ?? ""} />
            </label>
            <label>
              Prazo estimado
              <input
                name="estimatedDays"
                type="number"
                defaultValue={product?.estimatedDays ?? ""}
              />
            </label>
            <label>
              Valor inicial (R$)
              <CurrencyInput name="startingPriceCents" initialCents={product?.startingPriceCents} />
            </label>
          </div>
        </div>
      </div>
      <aside>
        <div className="data-card form-card">
          <ImageUpload name="coverUrl" folder="products" initialUrl={product?.coverUrl} />
          <ProductGalleryUpload initialImages={product?.images} />
        </div>
        <div className="data-card form-card">
          <h2>Publicação</h2>
          <label>
            Status
            <select name="status" defaultValue={product?.status ?? "draft"}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </label>
          <label className="checkbox">
            <input name="featured" type="checkbox" defaultChecked={product?.featured} /> Destacar na
            home
          </label>
          <h3>Coleções</h3>
          {collections.map((c) => (
            <label className="checkbox" key={c.id}>
              <input
                name="collectionIds"
                value={c.id}
                type="checkbox"
                defaultChecked={product?.collectionIds.includes(c.id)}
              />{" "}
              {c.name}
            </label>
          ))}
          {state.message && <p className="admin-form-message">{state.message}</p>}
          <AdminSubmitButton>Salvar produto</AdminSubmitButton>
        </div>
      </aside>
    </form>
  );
}
