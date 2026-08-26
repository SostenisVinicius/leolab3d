import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link
        href={`/pecas/${product.slug}`}
        className="product-image"
        style={{ backgroundImage: `url(${product.image})` }}
      >
        <span className="product-tag">{product.category}</span>
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
