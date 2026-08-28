import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedCollections } from "@/lib/public-data";

export default async function CollectionsPage() {
  const collections = await getPublishedCollections();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="kicker">Coleções</span>
          <h1>
            Universos reunidos
            <br />
            <em>por uma ideia.</em>
          </h1>
          <p>
            Navegue por temas, estilos e histórias. Cada coleção pode crescer com a sua próxima
            peça.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container collection-list">
          {collections.map((c, i) => (
            <Link key={c.slug} href={`/colecoes/${c.slug}`} className="collection-row">
              <div className="collection-number">0{i + 1}</div>
              <div
                className="collection-row-image"
                style={{ backgroundImage: c.image ? `url(${c.image})` : undefined }}
              />
              <div>
                <span className="kicker">Coleção LeoLab3D</span>
                <h2>{c.name}</h2>
                <p>{c.description}</p>
                <b>
                  {c.productCount} {c.productCount === 1 ? "peça" : "peças"} <ArrowRight />
                </b>
              </div>
            </Link>
          ))}
          {!collections.length && (
            <div className="empty-state">
              <h2>Novas coleções em breve</h2>
              <p>Enquanto isso, explore nossas peças individuais.</p>
              <Link className="button" href="/catalogo">
                Ver catálogo
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
