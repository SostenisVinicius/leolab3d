import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { collections } from "@/lib/demo-data";

export default function CollectionsPage() {
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
                style={{ backgroundImage: `url(${c.image})` }}
              />
              <div>
                <span className="kicker">{c.eyebrow}</span>
                <h2>{c.name}</h2>
                <p>{c.description}</p>
                <b>
                  {c.productSlugs.length} peças <ArrowRight />
                </b>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
