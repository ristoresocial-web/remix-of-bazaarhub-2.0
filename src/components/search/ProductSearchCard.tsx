import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist";
import { formatPrice } from "@/lib/cityUtils";
import type { Product } from "@/data/mockData";

interface ProductSearchCardProps {
  product: Product;
  isCompare: boolean;
  onToggleCompare: () => void;
  viewMode: "grid" | "list";
  isBestDeal?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const ProductSearchCard: React.FC<ProductSearchCardProps> = ({
  product, isCompare, onToggleCompare, viewMode, isBestDeal, expanded, onToggleExpand,
}) => {
  const [wishlisted, setWishlisted] = React.useState(() => isInWishlist(String(product.id)));

  const inStockPrices = product.prices.filter(p => p.inStock);
  const localPrices = inStockPrices.filter(p => !p.isAffiliate);
  const onlinePrices = inStockPrices.filter(p => p.isAffiliate);

  const localBest = localPrices.length > 0 ? Math.min(...localPrices.map(p => p.price)) : null;
  const onlineBest = onlinePrices.length > 0 ? Math.min(...onlinePrices.map(p => p.price)) : null;
  const overallBest = Math.min(...inStockPrices.map(p => p.price));

  const diff = localBest !== null && onlineBest !== null ? Math.abs(localBest - onlineBest) : 0;
  const cheaperSource = localBest !== null && onlineBest !== null
    ? (localBest < onlineBest ? "locally" : "online")
    : null;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleWishlist(String(product.id));
    setWishlisted(result);
  };

  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 rounded-card border border-border bg-card p-3 shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary">
        <Link to={`/product/${product.id}/${product.slug}`} className="shrink-0">
          <div className="h-24 w-24 rounded-lg bg-background p-2">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain" loading="lazy" />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/product/${product.id}/${product.slug}`}>
            <p className="text-xs text-muted-foreground notranslate">{product.brand}</p>
            <h3 className="text-sm font-semibold text-foreground line-clamp-1 notranslate">{product.name}</h3>
          </Link>
          <div className="mt-1 flex items-center gap-3 text-xs">
            {localBest !== null && (
              <span className="text-muted-foreground">LOCAL: <strong className="text-foreground notranslate">{formatPrice(localBest)}</strong></span>
            )}
            {onlineBest !== null && (
              <span className="text-muted-foreground">ONLINE: <strong className="text-foreground notranslate">{formatPrice(onlineBest)}</strong></span>
            )}
          </div>
          {diff > 100 && cheaperSource && (
            <span className="mt-1 inline-block rounded-pill bg-success-light px-2 py-0.5 text-[10px] font-bold text-success notranslate">
              💰 {formatPrice(diff)} cheaper {cheaperSource}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <button onClick={handleWishlist} className="text-muted-foreground hover:text-destructive transition-colors">
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-destructive text-destructive" : ""}`} />
          </button>
          <label className="flex items-center gap-1 cursor-pointer">
            <Checkbox checked={isCompare} onCheckedChange={onToggleCompare} className="h-3.5 w-3.5" />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-card border border-border bg-card shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary hover:scale-[1.02]">
      <Link to={`/product/${product.id}/${product.slug}`} className="block">
        <div className="relative h-48 overflow-hidden rounded-t-card bg-background p-4">
          <img src={product.image} alt={product.name} className="h-full w-full object-contain" loading="lazy" />
          {isBestDeal && (
            <span className="absolute right-2 top-2 rounded-pill bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-md">
              🏆 Best Deal
            </span>
          )}
          {product.localAvailable && (
            <span className="absolute left-2 top-2 rounded-pill bg-success px-2 py-0.5 text-[10px] font-semibold text-success-foreground">
              City Partner
            </span>
          )}
        </div>
        <div className="p-3 space-y-1">
          <p className="text-xs text-muted-foreground notranslate">{product.brand}</p>
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight notranslate">{product.name}</h3>
          <div className="flex items-center gap-1 text-xs text-warning">
            <Star className="h-3 w-3 fill-warning" />
            <span className="notranslate">4.{Math.floor(Math.random() * 5) + 1}</span>
          </div>
          <div className="space-y-0.5 pt-1">
            {localBest !== null && (
              <p className="text-xs text-muted-foreground">LOCAL: <strong className="text-foreground notranslate">{formatPrice(localBest)}</strong></p>
            )}
            {onlineBest !== null && (
              <p className="text-xs text-muted-foreground">ONLINE: <strong className="text-foreground notranslate">{formatPrice(onlineBest)}</strong></p>
            )}
          </div>
          {diff > 100 && cheaperSource && (
            <span className="inline-block rounded-pill bg-success-light px-2 py-0.5 text-[10px] font-bold text-success notranslate">
              💰 {formatPrice(diff)} cheaper {cheaperSource}
            </span>
          )}
        </div>
      </Link>
      <div className="flex items-center justify-between border-t border-border px-3 py-2">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <Checkbox checked={isCompare} onCheckedChange={onToggleCompare} className="h-3.5 w-3.5" />
          <span className="text-[10px] text-muted-foreground">Compare</span>
        </label>
        <button onClick={handleWishlist} className="text-muted-foreground hover:text-destructive transition-colors">
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-destructive text-destructive" : ""}`} />
        </button>
      </div>
      {onToggleExpand && (
        <div className="px-3 pb-2">
          <Button
            type="button"
            size="sm"
            variant={expanded ? "secondary" : "default"}
            onClick={onToggleExpand}
            className="w-full h-8 gap-1 text-xs"
          >
            {expanded ? (
              <>Hide comparison <ChevronUp className="h-3 w-3" /></>
            ) : (
              <>Compare prices <ChevronDown className="h-3 w-3" /></>
            )}
          </Button>
        </div>
      )}
      <div className="px-3 pb-2">
        <p className="text-[9px] text-muted-foreground">
          Prices via affiliate APIs — may vary.
        </p>
      </div>
    </div>
  );
};

export default ProductSearchCard;
