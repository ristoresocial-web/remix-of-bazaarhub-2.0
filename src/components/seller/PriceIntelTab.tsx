import React from "react";
import { Award, TrendingDown, Lightbulb } from "lucide-react";
import { formatPrice } from "@/lib/cityUtils";
import { Button } from "@/components/ui/button";

const products = [
  { name: "Samsung Galaxy S24 Ultra", yourPrice: 129990, amazonPrice: 131999, isBest: true },
  { name: "iPhone 15 Pro Max", yourPrice: 159900, amazonPrice: 156900, isBest: false, diff: 3000 },
  { name: "Samsung 43\" Crystal 4K TV", yourPrice: 29990, amazonPrice: 29999, isBest: true },
  { name: "HP Pavilion Laptop 15", yourPrice: 65990, amazonPrice: 67999, isBest: true },
  { name: "LG OLED C3 55\" TV", yourPrice: 119990, amazonPrice: 116990, isBest: false, diff: 3000 },
];

const PriceIntelTab: React.FC<{ city: string }> = ({ city }) => (
  <div className="space-y-4">
    <div className="flex items-baseline justify-between mb-2">
      <h2 className="text-xl font-display font-bold text-bh-text">Price Intelligence</h2>
      <span className="text-sm text-bh-text-secondary notranslate">{city}</span>
    </div>

    {products.map((p) => (
      <div
        key={p.name}
        className={`rounded-2xl border-l-4 p-5 flex items-start justify-between gap-4 transition-all duration-200 hover:shadow-bh ${
          p.isBest
            ? "border-l-bh-green bg-bh-green-light/40 border-y border-r border-bh-green/10"
            : "border-l-bh-orange bg-bh-orange-light/40 border-y border-r border-bh-orange/10"
        }`}
      >
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-base text-bh-text">{p.name}</p>
          <p className="text-sm text-bh-text-secondary mt-1">
            Your price: <strong className="font-mono text-bh-text notranslate">{formatPrice(p.yourPrice)}</strong>
            <span className="mx-1.5 text-bh-text-muted">·</span>
            Amazon: <span className="font-mono notranslate">{formatPrice(p.amazonPrice)}</span>
          </p>

          {!p.isBest && p.diff && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold text-bh-orange-dark">
                Reduce by <span className="font-mono notranslate">{formatPrice(p.diff)}</span> to become #1 — quick win!
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-full bg-bh-orange hover:bg-bh-orange-dark text-white text-xs font-semibold px-4 py-1.5 shadow-price transition-all duration-200 hover:scale-[1.02]">
                  Adjust Price
                </button>
                <button className="rounded-full border-2 border-bh-orange text-bh-orange hover:bg-bh-orange-light text-xs font-semibold px-4 py-1.5 transition-all duration-200">
                  Bundle Offer
                </button>
                <button className="rounded-full text-bh-text-secondary hover:text-bh-orange text-xs font-medium px-3 py-1.5 transition-colors duration-200">
                  Keep Same — Service Advantage →
                </button>
              </div>
            </div>
          )}

          {p.isBest && (
            <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-bh-green-dark">
              <Award className="h-4 w-4" /> You are the best price in {city} today!
            </div>
          )}
        </div>

        {p.isBest ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-bh-green-light text-bh-green-dark text-xs font-bold rounded-full border border-bh-green/20 shrink-0">
            <Award className="h-3 w-3" /> Best in City
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-bh-orange-light text-bh-orange-dark text-xs font-bold rounded-full border border-bh-orange/20 shrink-0">
            <TrendingDown className="h-3 w-3" /> Quick Win
          </div>
        )}
      </div>
    ))}

    <div className="rounded-2xl bg-bh-orange-light/60 border border-bh-orange/15 p-4 flex items-start gap-3">
      <Lightbulb className="h-5 w-5 text-bh-orange mt-0.5 shrink-0" />
      <p className="text-sm text-bh-text">
        <strong className="font-semibold">Tip:</strong> Your delivery + installation = <span className="font-mono notranslate">₹1,200</span> advantage over Amazon. Highlight this to buyers!
      </p>
    </div>
  </div>
);

export default PriceIntelTab;
