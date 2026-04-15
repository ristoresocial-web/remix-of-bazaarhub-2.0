import React, { useState } from "react";
import { Heart, Phone, MessageCircle, ArrowDownUp } from "lucide-react";

const products = [
  { id: 1, name: "Samsung Galaxy S24 FE", localPrice: 29999, onlinePrice: 32999, platform: "Flipkart", shop: "Mobile Planet", rating: 4.5 },
  { id: 2, name: "Sony WH-1000XM5", localPrice: 22990, onlinePrice: 26990, platform: "Amazon", shop: "Audio House", rating: 4.7 },
  { id: 3, name: "LG 43\" Smart TV", localPrice: 26490, onlinePrice: 29990, platform: "Croma", shop: "TV Bazaar", rating: 4.3 },
  { id: 4, name: "Apple iPad 10th Gen", localPrice: 30900, onlinePrice: 33900, platform: "Amazon", shop: "iStore", rating: 4.8 },
  { id: 5, name: "Whirlpool 7kg Washer", localPrice: 18500, onlinePrice: 21000, platform: "Flipkart", shop: "Home Needs", rating: 4.2 },
  { id: 6, name: "Canon EOS R50", localPrice: 55990, onlinePrice: 59990, platform: "Amazon", shop: "CamZone", rating: 4.6 },
];

type SortKey = "price" | "rating" | "savings";

const PopularProductsGrid: React.FC<{ city: string }> = ({ city }) => {
  const [sort, setSort] = useState<SortKey>("savings");
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  const sorted = [...products].sort((a, b) => {
    if (sort === "price") return a.localPrice - b.localPrice;
    if (sort === "rating") return b.rating - a.rating;
    return (b.onlinePrice - b.localPrice) - (a.onlinePrice - a.localPrice);
  });

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="container py-14">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-foreground">Popular in {city}</h2>
        <div className="flex items-center gap-2">
          <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
          {(["savings", "price", "rating"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all duration-200 ${
                sort === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {key === "savings" ? "Best Savings" : key}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((p) => {
          const saving = p.onlinePrice - p.localPrice;
          return (
            <div key={p.id} className="relative rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:shadow-card-hover">
              <button
                onClick={() => toggleWishlist(p.id)}
                className="absolute right-3 top-3 rounded-full p-1.5 transition-colors hover:bg-muted"
              >
                <Heart className={`h-5 w-5 ${wishlist.has(p.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
              </button>
              <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-muted">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="notranslate mb-2 text-sm font-semibold text-foreground">{p.name}</h3>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="notranslate text-lg font-bold text-foreground">₹{p.localPrice.toLocaleString("en-IN")}</span>
                <span className="notranslate text-sm text-muted-foreground line-through">₹{p.onlinePrice.toLocaleString("en-IN")}</span>
              </div>
              {saving > 0 && (
                <span className="mb-2 inline-block rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                  Save ₹{saving.toLocaleString("en-IN")} vs {p.platform}
                </span>
              )}
              <p className="mb-3 text-xs text-muted-foreground">{p.shop} · ⭐ {p.rating}</p>
              <div className="flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border py-2 text-xs font-medium text-foreground transition-all duration-200 hover:bg-accent">
                  <Phone className="h-3.5 w-3.5" /> Call
                </button>
                <button className="flex flex-1 items-center justify-center gap-1 rounded-full py-2 text-xs font-medium text-white transition-all duration-200 hover:opacity-90" style={{ backgroundColor: "#25D366" }}>
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PopularProductsGrid;
