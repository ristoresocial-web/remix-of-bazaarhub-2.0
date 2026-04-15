import React from "react";
import { Link } from "react-router-dom";
import { Tag, ArrowRight } from "lucide-react";

const deals = [
  { id: 1, name: "Samsung Galaxy M15", price: 10499, savings: 2500, shop: "Ravi Mobiles", platform: "Flipkart" },
  { id: 2, name: "boAt Rockerz 450", price: 999, savings: 600, shop: "Sound Zone", platform: "Amazon" },
  { id: 3, name: "Prestige Induction Cooktop", price: 1899, savings: 800, shop: "Kitchen World", platform: "Amazon" },
  { id: 4, name: "HP 15s Laptop", price: 34990, savings: 5000, shop: "Laptop Hub", platform: "Flipkart" },
  { id: 5, name: "LG 260L Refrigerator", price: 22490, savings: 3500, shop: "Cool Appliances", platform: "Croma" },
  { id: 6, name: "Noise ColorFit Pro 5", price: 2999, savings: 1200, shop: "Gadget Point", platform: "Amazon" },
];

interface Props {
  city: string;
}

const TodaysBestDeals: React.FC<Props> = ({ city }) => (
  <section className="py-10" style={{ background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(270 50% 30%))" }}>
    <div className="container">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white md:text-2xl">
          🔥 Today's Best Deals in {city}
        </h2>
        <Link to="/search" className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {deals.map((deal) => (
          <Link
            key={deal.id}
            to={`/product/${deal.id}`}
            className="min-w-[220px] flex-shrink-0 rounded-2xl bg-card p-4 shadow-card transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02]"
          >
            <div className="mb-2 flex h-28 items-center justify-center rounded-lg bg-muted">
              <Tag className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="notranslate mb-1 truncate text-sm font-semibold text-foreground">{deal.name}</h3>
            <p className="notranslate text-lg font-bold text-foreground">₹{deal.price.toLocaleString("en-IN")}</p>
            <span className="inline-block rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
              Save ₹{deal.savings.toLocaleString("en-IN")} vs {deal.platform}
            </span>
            <p className="mt-1 text-xs text-muted-foreground">{deal.shop}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default TodaysBestDeals;
