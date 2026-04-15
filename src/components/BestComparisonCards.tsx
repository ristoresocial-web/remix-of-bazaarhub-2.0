import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/cityUtils";

interface ComparisonProduct {
  name: string;
  slug: string;
  image: string;
  cityPartnerPrice: number;
  onlinePrice: number;
}

const mockComparisons: ComparisonProduct[] = [
  {
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    image: "/placeholder.svg",
    cityPartnerPrice: 124999,
    onlinePrice: 131999,
  },
  {
    name: "LG 1.5 Ton 5 Star AC",
    slug: "lg-1-5-ton-5-star-ac",
    image: "/placeholder.svg",
    cityPartnerPrice: 38990,
    onlinePrice: 42499,
  },
  {
    name: "HP Pavilion 15 Laptop",
    slug: "hp-pavilion-15-laptop",
    image: "/placeholder.svg",
    cityPartnerPrice: 62999,
    onlinePrice: 59999,
  },
];

interface BestComparisonCardsProps {
  city: string;
}

const BestComparisonCards: React.FC<BestComparisonCardsProps> = ({ city }) => {
  return (
    <section className="bg-muted/30 py-14">
      <div className="container">
        <h2 className="mb-1 text-center text-2xl font-bold text-foreground">
          Today's Best Price Differences in {city}
        </h2>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Updated 15 mins ago
        </p>

        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {mockComparisons.map((product) => {
            const diff = Math.abs(product.cityPartnerPrice - product.onlinePrice);
            const cheaperVia = product.cityPartnerPrice < product.onlinePrice ? "city partner" : "online";

            return (
              <div
                key={product.slug}
                className="min-w-[280px] flex-shrink-0 rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover md:min-w-0"
              >
                <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-background">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-24 w-24 object-contain"
                    loading="lazy"
                  />
                </div>

                <h3 className="notranslate mb-3 text-sm font-semibold text-foreground line-clamp-2">
                  {product.name}
                </h3>

                <div className="mb-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">{city} City Partner</p>
                    <p className="notranslate font-bold text-foreground">{formatPrice(product.cityPartnerPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Online Best</p>
                    <p className="notranslate font-bold text-foreground">{formatPrice(product.onlinePrice)}</p>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-primary w-fit">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span className="notranslate">{formatPrice(diff)} cheaper via {cheaperVia}</span>
                </div>

                <Link to={`/search?q=${encodeURIComponent(product.name)}`}>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    Compare Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BestComparisonCards;
