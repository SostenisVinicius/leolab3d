import { UploadCloud } from "lucide-react";
import { saveCollection } from "@/app/actions/admin";
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
  return (
    <form action={saveCollection} className="admin-form-layout">
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
          <h2>Capa</h2>
          <div className="upload-box">
            {collection?.coverUrl ? (
              <div style={{ backgroundImage: `url(${collection.coverUrl})` }} />
            ) : (
              <>
                <UploadCloud />
                <strong>Enviar imagem</strong>
              </>
            )}
          </div>
          <label>
            URL da imagem
            <input
              name="coverUrl"
              type="url"
              defaultValue={collection?.coverUrl ?? ""}
              placeholder="https://..."
            />
          </label>
          <label>
            Status
            <select name="status" defaultValue={collection?.status ?? "draft"}>
              <option value="published">Publicada</option>
              <option value="draft">Rascunho</option>
              <option value="archived">Arquivada</option>
            </select>
          </label>
          <button className="button">Salvar coleção</button>
        </div>
      </aside>
    </form>
  );
}
