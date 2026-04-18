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
  const cheaper = local < online ? "via city partner" : "online";

  if (diff < 100) return null;

  const cheaperColor = local < online ? "text-bh-green-dark" : "text-bh-blue";

  return (
    <p className="mt-1 text-[10px] leading-tight">
      <span className="font-mono notranslate text-bh-green-dark">
        ₹{local.toLocaleString("en-IN")}
      </span>
      <span className="ml-0.5 text-bh-text-muted">local</span>
      <span className="mx-1 text-bh-border">|</span>
      <span className="font-mono notranslate text-bh-blue">
        ₹{online.toLocaleString("en-IN")}
      </span>
      <span className="ml-0.5 text-bh-text-muted">online</span>
      <span className="mx-1 text-bh-text-muted">→</span>
      <span className={`font-display font-bold ${cheaperColor}`}>
        <span className="font-mono notranslate">₹{diff.toLocaleString("en-IN")}</span> cheaper {cheaper}
      </span>
    </p>
  );
};

export default PriceTeaser;
