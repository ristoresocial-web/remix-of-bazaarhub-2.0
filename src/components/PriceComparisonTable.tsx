import React from "react";
import { formatPrice } from "@/lib/cityUtils";
import type { PriceEntry } from "@/data/mockData";
import AffiliateDisclaimer from "./AffiliateDisclaimer";
import { getTimestamp } from "@/lib/cityUtils";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PriceComparisonTableProps {
  prices: PriceEntry[];
  localAvailable: boolean;
  city: string;
}

const PriceComparisonTable: React.FC<PriceComparisonTableProps> = ({ prices, localAvailable, city }) => {
  const { t } = useLanguage();
  const sortedPrices = [...prices].filter(p => p.inStock).sort((a, b) => a.price - b.price);
  const cheapestPrice = sortedPrices[0]?.price;
  const timestamp = getTimestamp();

  return (
    <div>
      {!localAvailable && (
        <div className="mb-3 rounded-card bg-muted p-3 text-center text-sm text-muted-foreground">
          {t("notInCity")} {city}
          <button className="ml-2 rounded-pill bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark">
            {t("alertMe")}
          </button>
        </div>
      )}
      <div className="divide-y divide-bh-border rounded-2xl border border-bh-border bg-bh-surface shadow-bh-sm overflow-hidden">
        {sortedPrices.map((entry) => {
          const isAmazon = entry.platform.toLowerCase().includes("amazon");
          const isFlipkart = entry.platform.toLowerCase().includes("flipkart");
          const isCheapest = entry.price === cheapestPrice;

          return (
            <div
              key={entry.platform}
              className={`flex items-center justify-between gap-3 p-3 transition-all duration-200 ${
                isCheapest ? "bg-bh-orange-light/40 ring-2 ring-bh-orange ring-inset" : "hover:bg-bh-surface-2"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="notranslate text-sm font-display font-bold text-bh-text">{entry.platform}</span>
                  {isCheapest && (
                    <span className="rounded-full bg-bh-orange px-2 py-0.5 text-[10px] font-bold text-white shadow-price">
                      🏆 {t("cheapest")}
                    </span>
                  )}
                  {isCheapest && localAvailable && !entry.isAffiliate && (
                    <span className="rounded-full bg-bh-green-light text-bh-green-dark border border-bh-green/20 px-2 py-0.5 text-[10px] font-bold">
                      {t("availableLocally")}
                    </span>
                  )}
                </div>
                {isAmazon && (
                  <p className="text-[10px] text-bh-text-muted mt-0.5">
                    as of {timestamp} · Amazon Associate link. We earn from qualifying purchases.
                  </p>
                )}
                {isFlipkart && entry.isAffiliate && (
                  <p className="text-[10px] text-bh-text-muted mt-0.5">
                    Flipkart affiliate link. Commission earned.
                  </p>
                )}
                {entry.isAffiliate && !isAmazon && !isFlipkart && (
                  <p className="text-[10px] text-bh-text-muted mt-0.5">Affiliate link</p>
                )}
              </div>
              <div className="text-right">
                <p
                  className={`notranslate font-mono text-lg font-medium price-animate ${
                    isCheapest ? "text-bh-orange-dark" : entry.isAffiliate ? "text-bh-blue" : "text-bh-green-dark"
                  }`}
                >
                  {formatPrice(entry.price)}
                </p>
              </div>
              <a
                href={entry.url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="flex items-center gap-1 rounded-full bg-bh-orange px-3 py-1.5 text-xs font-bold text-white shadow-price transition-all duration-200 hover:bg-bh-orange-dark hover:scale-[1.03] active:scale-[0.97]"
              >
                Buy <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          );
        })}
      </div>
      <div className="mt-2">
        <AffiliateDisclaimer />
      </div>
    </div>
  );
};

export default PriceComparisonTable;
