import React from "react";
import { getComparisonBySlug, COMPARISON_DATA } from "@/data/comparisonMockData";

interface PriceTeaserProps {
  productSlug?: string;
  localPrice?: number;
  onlinePrice?: number;
}

const PriceTeaser: React.FC<PriceTeaserProps> = ({ productSlug, localPrice, onlinePrice }) => {
  let local = localPrice;
  let online = onlinePrice;

  if (!local || !online) {
    if (productSlug) {
      const data = getComparisonBySlug(productSlug);
      if (data) {
        local = data.lowestLocalPrice;
        online = data.lowestOnlinePrice;
      }
    }
  }

  if (!local || !online || !isFinite(local) || !isFinite(online)) return null;

  const diff = Math.abs(online - local);
  const cheaper = local < online ? "locally" : "online";

  if (diff < 100) return null;

  return (
    <p className="mt-1 text-[10px] leading-tight">
      <span className="text-muted-foreground">
        ₹{local.toLocaleString("en-IN")} local
      </span>
      <span className="mx-1 text-muted-foreground/50">|</span>
      <span className="text-muted-foreground">
        ₹{online.toLocaleString("en-IN")} online
      </span>
      <span className="mx-1">→</span>
      <span className="font-semibold text-success">
        ₹{diff.toLocaleString("en-IN")} cheaper {cheaper}
      </span>
    </p>
  );
};

export default PriceTeaser;
