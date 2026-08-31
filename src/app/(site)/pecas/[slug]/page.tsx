import Link from "next/link";
import { ArrowRight, Box, Clock3, Paintbrush, Ruler } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { getPublishedProduct } from "@/lib/public-data";
import { formatCurrency } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getPublishedProduct(slug);
  if (!p) notFound();
  const tag = p.material ?? "Peça 3D";
  const photos = [
    ...(p.image ? [{ url: p.image, alt: p.name }] : []),
    ...p.gallery.filter((photo) => photo.url !== p.image),
  ];
  return (
    <section className="section product-page">
      <div className="container product-detail">
        <ProductGallery photos={photos} tag={tag} />
        <div className="detail-copy">
          <div className="breadcrumbs">
            <Link href="/catalogo">Catálogo</Link> / {p.name}
          </div>
          <span className="kicker">Peça LeoLab3D</span>
          <h1>{p.name}</h1>
          <p className="lead">{p.description}</p>
          <div className="spec-grid">
            <div>
              <Box />
              <span>
                Material<strong>{p.material ?? "Sob consulta"}</strong>
              </span>
            </div>
            <div>
              <Ruler />
              <span>
                Dimensões<strong>{p.dimensions ?? "Personalizáveis"}</strong>
              </span>
            </div>
            <div>
              <Paintbrush />
              <span>
                Acabamento<strong>{p.finish ?? "Sob consulta"}</strong>
              </span>
            </div>
            <div>
              <Clock3 />
              <span>
                Prazo estimado
                <strong>
                  {p.estimatedDays ? `${p.estimatedDays} dias úteis` : "Sob consulta"}
                </strong>
              </span>
            </div>
          </div>
          <div className="detail-price">
            <span>Valores a partir de</span>
            <strong>{formatCurrency(p.startingPriceCents)}</strong>
            <small>O valor final depende da escala, acabamento e personalizações.</small>
          </div>
          <Link href={`/orcamento?peca=${p.slug}`} className="button">
            Solicitar orçamento desta peça <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
