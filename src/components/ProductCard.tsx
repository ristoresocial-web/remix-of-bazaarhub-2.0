import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/cityUtils";
import type { Product } from "@/data/mockData";
import PriceTeaser from "@/components/PriceTeaser";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const cheapest = Math.min(...product.prices.filter(p => p.inStock).map(p => p.price));

  return (
    <Link
      to={`/product/${product.id}/${product.slug}`}
      className="group block rounded-2xl border border-bh-border bg-bh-surface shadow-bh-sm transition-all duration-200 hover:shadow-price hover:border-bh-orange/40 hover:-translate-y-1 overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-bh-surface-2 p-4">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {product.localAvailable && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-bh-green-light px-2.5 py-1 text-[10px] font-bold text-bh-green-dark border border-bh-green/20">
            🏪 Available Locally
          </span>
        )}
      </div>
      <div className="p-3.5">
        <p className="notranslate text-xs font-semibold text-bh-text-muted uppercase tracking-wide">{product.brand}</p>
        <h3 className="notranslate mt-0.5 mb-1.5 text-sm font-semibold text-bh-text line-clamp-2 leading-snug">{product.name}</h3>
        <p className="notranslate font-mono text-xl font-medium text-bh-price-local tracking-tight">{formatPrice(cheapest)}</p>
        <p className="text-[11px] text-bh-text-muted mt-0.5">{product.prices.length} prices compared</p>
        <PriceTeaser productSlug={product.slug} />
      </div>
    </Link>
  );
};

export default React.memo(ProductCard);
