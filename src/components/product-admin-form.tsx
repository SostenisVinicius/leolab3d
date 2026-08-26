import { UploadCloud } from "lucide-react";
import { saveProduct } from "@/app/actions/admin";
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
};
type CollectionOption = { id: string; name: string };
export function ProductAdminForm({
  product,
  collections,
}: {
  product?: ProductForm | null;
  collections: CollectionOption[];
}) {
  return (
    <form action={saveProduct} className="admin-form-layout">
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
              <input
                name="startingPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  product?.startingPriceCents ? product.startingPriceCents / 100 : undefined
                }
              />
            </label>
          </div>
        </div>
      </div>
      <aside>
        <div className="data-card form-card">
          <h2>Imagem de capa</h2>
          <div className="upload-box">
            {product?.coverUrl ? (
              <div style={{ backgroundImage: `url(${product.coverUrl})` }} />
            ) : (
              <>
                <UploadCloud />
                <strong>Enviar imagem</strong>
                <span>PNG, JPG ou WEBP · até 8 MB</span>
              </>
            )}
          </div>
          <label>
            URL da imagem
            <input
              name="coverUrl"
              type="url"
              defaultValue={product?.coverUrl ?? ""}
              placeholder="https://..."
            />
          </label>
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
          <button className="button">Salvar produto</button>
        </div>
      </aside>
    </form>
  );
}
