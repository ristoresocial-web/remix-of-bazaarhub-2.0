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
      className="group block rounded-card border border-border bg-card shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary hover:scale-[1.03]"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-card bg-background p-4">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain"
          loading="lazy"
        />
        {product.localAvailable && (
          <span className="absolute left-2 top-2 rounded-pill bg-success px-2 py-0.5 text-[10px] font-semibold text-success-foreground">
            Available Locally
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="notranslate text-xs font-medium text-muted-foreground">{product.brand}</p>
        <h3 className="notranslate mb-1 text-sm font-semibold text-foreground line-clamp-2">{product.name}</h3>
        <p className="notranslate text-lg font-bold text-success">{formatPrice(cheapest)}</p>
        <p className="text-[10px] text-muted-foreground">{product.prices.length} prices compared</p>
        <PriceTeaser productSlug={product.slug} />
      </div>
    </Link>
  );
};

export default ProductCard;
