import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getPublishedCollection } from "@/lib/public-data";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getPublishedCollection(slug);
  if (!collection) notFound();
  const items = collection.products;
  return (
    <>
      <section
        className="collection-hero"
        style={{
          backgroundImage: collection.image
            ? `linear-gradient(90deg, rgba(2,16,27,.98), rgba(2,16,27,.36)), url(${collection.image})`
            : "linear-gradient(120deg, #03121d, #07516b)",
        }}
      >
        <div className="container">
          <span className="kicker">Coleção LeoLab3D</span>
          <h1>{collection.name}</h1>
          <p>{collection.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="kicker">Nesta coleção</span>
              <h2>{items.length} criações para explorar</h2>
            </div>
          </div>
          <div className="product-grid">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
