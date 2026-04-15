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
    <h2 className="text-lg font-bold text-foreground">Price Intelligence — {city}</h2>
    {products.map((p) => (
      <div
        key={p.name}
        className={`rounded-card border p-4 ${
          p.isBest
            ? "border-success/30 bg-success-light"
            : "border-primary/30 bg-primary-light"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-semibold text-foreground">{p.name}</p>
            <p className="text-sm text-muted-foreground">
              Your price: <strong className="text-foreground">{formatPrice(p.yourPrice)}</strong> · Amazon: {formatPrice(p.amazonPrice)}
            </p>
          </div>
          {p.isBest ? (
            <div className="flex items-center gap-1.5 rounded-pill bg-success px-3 py-1 text-xs font-semibold text-success-foreground">
              <Award className="h-3.5 w-3.5" /> Best in {city}!
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-pill bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              <TrendingDown className="h-3.5 w-3.5" /> Quick Win!
            </div>
          )}
        </div>
        {!p.isBest && p.diff && (
          <div className="mt-3 space-y-2">
            <p className="text-sm font-medium text-primary">
              Reduce by {formatPrice(p.diff)} to become #1 — quick win!
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Adjust Price</Button>
              <Button size="sm" variant="outline">Bundle Offer</Button>
              <Button size="sm" variant="ghost">Keep Same — Service Advantage</Button>
            </div>
          </div>
        )}
        {p.isBest && (
          <div className="mt-2 flex items-center gap-1.5 text-sm text-success">
            <Award className="h-4 w-4" /> You are the best price in {city} today!
          </div>
        )}
      </div>
    ))}
    <div className="rounded-card bg-primary-light p-4 flex items-start gap-3">
      <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
      <p className="text-sm text-foreground">
        <strong>Tip:</strong> Your delivery + installation = ₹1,200 advantage over Amazon. Highlight this to buyers!
      </p>
    </div>
  </div>
);

export default PriceIntelTab;
