import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { allProducts } from "@/data/mockData";
import { findSameBrandSameSpec, findDifferentBrandSameSpec, type FallbackMatch } from "@/lib/smartFallback";
import type { Product } from "@/data/mockData";

interface SmartFallbackPanelProps {
  target: Product;
}

const SmartFallbackPanel: React.FC<SmartFallbackPanelProps> = ({ target }) => {
  const sameBrand = useMemo(() => findSameBrandSameSpec(target, allProducts).slice(0, 4), [target]);
  const diffBrand = useMemo(
    () => (sameBrand.length === 0 ? findDifferentBrandSameSpec(target, allProducts).slice(0, 4) : []),
    [target, sameBrand.length],
  );

  if (sameBrand.length === 0 && diffBrand.length === 0) return null;

  return (
    <div className="space-y-4">
      {sameBrand.length > 0 && (
        <FallbackSection
          title="Similar product with same brand & specs found. Compare now?"
          icon={<Sparkles className="h-4 w-4 text-bh-orange" />}
          matches={sameBrand}
          showMatchPill={false}
          accent="orange"
        />
      )}
      {diffBrand.length > 0 && (
        <FallbackSection
          title="Alternative brands with similar specifications"
          icon={<RefreshCw className="h-4 w-4 text-bh-green-dark" />}
          matches={diffBrand}
          showMatchPill
          accent="green"
        />
      )}
    </div>
  );
};

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  matches: FallbackMatch[];
  showMatchPill: boolean;
  accent: "orange" | "green";
}

const FallbackSection: React.FC<SectionProps> = ({ title, icon, matches, showMatchPill, accent }) => {
  const accentBorder = accent === "orange" ? "border-bh-orange/30 bg-bh-orange-light/30" : "border-bh-green/30 bg-bh-green-light/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 ${accentBorder}`}
    >
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <p className="font-display text-sm font-bold text-bh-text">{title}</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
        {matches.map(({ product, matchPercent, lowestPrice }) => (
          <Link
            key={product.id}
            to={`/product/${product.id}/${product.slug}`}
            className="group shrink-0 w-[180px] snap-start rounded-xl border border-bh-border bg-white p-3 transition-all hover:shadow-bh-sm hover:border-bh-orange"
          >
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-bh-surface-2 mb-2">
              <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain p-2" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-bh-text-muted notranslate">{product.brand}</p>
            <p className="line-clamp-2 text-xs font-semibold text-bh-text notranslate min-h-[2rem]">{product.name}</p>
            <p className="mt-1 font-mono text-sm font-bold text-bh-orange-dark notranslate">
              ₹{lowestPrice.toLocaleString("en-IN")}
            </p>
            <div className="mt-2 flex items-center justify-between gap-1">
              {showMatchPill && (
                <Badge className="bg-bh-green-light text-bh-green-dark border border-bh-green/30 text-[9px] notranslate">
                  {matchPercent}% match
                </Badge>
              )}
              <Button size="sm" variant="outline" className="h-6 ml-auto px-2 text-[10px] gap-1">
                Compare <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default SmartFallbackPanel;
