import { UploadCloud } from "lucide-react";
import { collections, type Product } from "@/lib/demo-data";
export function ProductAdminForm({ product }: { product?: Product }) {
  return (
    <form className="admin-form-layout">
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
              <input defaultValue={product?.material} />
            </label>
            <label>
              Dimensões
              <input defaultValue={product?.dimensions} />
            </label>
            <label>
              Acabamento
              <input defaultValue={product?.finish} />
            </label>
            <label>
              Prazo estimado
              <input type="number" defaultValue={product?.estimatedDays} />
            </label>
            <label>
              Valor inicial (R$)
              <input
                type="number"
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
            {product ? (
              <div style={{ backgroundImage: `url(${product.image})` }} />
            ) : (
              <>
                <UploadCloud />
                <strong>Enviar imagem</strong>
                <span>PNG, JPG ou WEBP · até 8 MB</span>
              </>
            )}
          </div>
        </div>
        <div className="data-card form-card">
          <h2>Publicação</h2>
          <label>
            Status
            <select defaultValue="published">
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </label>
          <label className="checkbox">
            <input type="checkbox" defaultChecked={product?.featured} /> Destacar na home
          </label>
          <h3>Coleções</h3>
          {collections.map((c) => (
            <label className="checkbox" key={c.slug}>
              <input type="checkbox" /> {c.name}
            </label>
          ))}
          <button className="button">Salvar produto</button>
        </div>
      </aside>
    </form>
  );
}
