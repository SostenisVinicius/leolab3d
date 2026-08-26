import { UploadCloud } from "lucide-react";
import { products, type Collection } from "@/lib/demo-data";
export function CollectionAdminForm({ collection }: { collection?: Collection }) {
  return (
    <form className="admin-form-layout">
      <div className="data-card form-card">
        <h2>Dados da coleção</h2>
        <label>
          Nome
          <input defaultValue={collection?.name} />
        </label>
        <label>
          Slug
          <input defaultValue={collection?.slug} />
        </label>
        <label>
          Descrição
          <textarea rows={5} defaultValue={collection?.description} />
        </label>
        <h2>Produtos da coleção</h2>
        {products.map((p) => (
          <label className="product-check" key={p.id}>
            <input type="checkbox" defaultChecked={collection?.productSlugs.includes(p.slug)} />
            <span style={{ backgroundImage: `url(${p.image})` }} />
            <b>{p.name}</b>
          </label>
        ))}
      </div>
      <aside>
        <div className="data-card form-card">
          <h2>Capa</h2>
          <div className="upload-box">
            {collection ? (
              <div style={{ backgroundImage: `url(${collection.image})` }} />
            ) : (
              <>
                <UploadCloud />
                <strong>Enviar imagem</strong>
              </>
            )}
          </div>
          <label>
            Status
            <select>
              <option>Publicada</option>
              <option>Rascunho</option>
            </select>
          </label>
          <button className="button">Salvar coleção</button>
        </div>
      </aside>
    </form>
  );
}
