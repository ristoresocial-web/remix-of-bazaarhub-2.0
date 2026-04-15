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
      <div className="divide-y divide-border rounded-card border border-border bg-card">
        {sortedPrices.map((entry) => {
          const isAmazon = entry.platform.toLowerCase().includes("amazon");
          const isFlipkart = entry.platform.toLowerCase().includes("flipkart");

          return (
            <div
              key={entry.platform}
              className={`flex items-center justify-between gap-3 p-3 transition-all duration-200 ${
                entry.price === cheapestPrice ? "bg-success-light" : ""
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="notranslate text-sm font-semibold text-foreground">{entry.platform}</span>
                  {entry.price === cheapestPrice && (
                    <span className="rounded-pill bg-success px-2 py-0.5 text-[10px] font-bold text-success-foreground">
                      {t("cheapest")}
                    </span>
                  )}
                  {entry.price === cheapestPrice && localAvailable && !entry.isAffiliate && (
                    <span className="rounded-pill bg-success px-2 py-0.5 text-[10px] font-bold text-success-foreground">
                      {t("availableLocally")}
                    </span>
                  )}
                </div>
                {isAmazon && (
                  <p className="text-[10px] text-muted-foreground">
                    as of {timestamp} · Amazon Associate link. We earn from qualifying purchases.
                  </p>
                )}
                {isFlipkart && entry.isAffiliate && (
                  <p className="text-[10px] text-muted-foreground">
                    Flipkart affiliate link. Commission earned.
                  </p>
                )}
                {entry.isAffiliate && !isAmazon && !isFlipkart && (
                  <p className="text-[10px] text-muted-foreground">Affiliate link</p>
                )}
              </div>
              <div className="text-right">
                <p className={`notranslate text-base font-bold ${entry.price === cheapestPrice ? "text-success" : "text-foreground"}`}>
                  {formatPrice(entry.price)}
                </p>
              </div>
              <a
                href={entry.url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="flex items-center gap-1 rounded-pill bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark"
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
