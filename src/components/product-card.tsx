import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PublicProduct } from "@/lib/public-data";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: PublicProduct }) {
  return (
    <article className="product-card">
      <Link
        href={`/pecas/${product.slug}`}
        className="product-image"
        style={{ backgroundImage: product.image ? `url(${product.image})` : undefined }}
      >
        <span className="product-tag">{product.material ?? "Peça 3D"}</span>
        <span className="round-arrow">
          <ArrowUpRight />
        </span>
      </Link>
      <div className="product-content">
        <Link href={`/pecas/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.shortDescription}</p>
        <div className="product-meta">
          <span>A partir de</span>
          <strong>{formatCurrency(product.startingPriceCents)}</strong>
        </div>
      </div>
    </article>
  );
}
