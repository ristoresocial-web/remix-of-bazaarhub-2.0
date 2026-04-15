import React, { useMemo, useState } from "react";
import { Star, Phone, MessageCircle, ExternalLink, MapPin, ArrowUpDown, X, Calculator, Zap, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModelSpec, getSpecSections, getCellHighlight, HIGHLIGHT_CLASSES, getSellersForModel, ModelSeller, calculateEMI, calculateValueScore } from "@/data/compareModels";
import { formatPrice } from "@/lib/cityUtils";

interface Props {
  models: ModelSpec[];
  onRemove: (id: string) => void;
}

/* ── Seller Profile Modal ── */
const SellerModal: React.FC<{ seller: ModelSeller; onClose: () => void }> = ({ seller, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
    <div className="mx-4 w-full max-w-md rounded-card border border-border bg-card p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">{seller.name}</h3>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-muted"><X className="h-5 w-5 text-muted-foreground" /></button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge className={seller.type === "local" ? "bg-success/10 text-success border-success/20" : "bg-accent text-accent-foreground"}>
            {seller.type === "local" ? "Local Store" : "Online"}
          </Badge>
          <span className="flex items-center gap-1 text-sm text-warning-foreground">
            <Star className="h-4 w-4 fill-current" /> {seller.rating} ({seller.reviews})
          </span>
        </div>
        {seller.distance && <p className="text-sm text-muted-foreground">📍 {seller.distance} km away</p>}
        <p className="text-2xl font-bold text-success">{formatPrice(seller.price)}</p>
        <div className="grid grid-cols-3 gap-3 rounded-card bg-muted/30 p-3 text-center text-xs">
          <div><p className="text-muted-foreground">Response</p><p className="font-semibold text-foreground">~2 hrs</p></div>
          <div><p className="text-muted-foreground">Delivery</p><p className="font-semibold text-foreground">{seller.type === "local" ? "Same day" : "2-5 days"}</p></div>
          <div><p className="text-muted-foreground">Returns</p><p className="font-semibold text-foreground">{seller.type === "local" ? "7 days" : "10 days"}</p></div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Recent Reviews</p>
          {[{ user: "Arun K.", text: "Great service, quick delivery!", stars: 5 }, { user: "Priya M.", text: "Good price but packaging was average.", stars: 4 }].map((r, i) => (
            <div key={i} className="rounded-lg border border-border bg-background p-2">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: r.stars }).map((_, j) => <Star key={j} className="h-3 w-3 fill-warning text-warning" />)}
                <span className="ml-1 text-xs font-medium text-foreground">{r.user}</span>
              </div>
              <p className="text-xs text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {seller.phone && (
            <a href={`https://wa.me/91${seller.phone.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-pill bg-success py-2 text-center text-sm font-semibold text-success-foreground">
              <MessageCircle className="inline h-4 w-4 mr-1" />WhatsApp
            </a>
          )}
          <a href={seller.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="flex-1 rounded-pill bg-primary py-2 text-center text-sm font-semibold text-primary-foreground">
            <ExternalLink className="inline h-4 w-4 mr-1" />Visit Store
          </a>
        </div>
      </div>
    </div>
  </div>
);

/* ── EMI Calculator Component ── */
const EMICalculator: React.FC<{ price: number }> = ({ price }) => {
  const [months, setMonths] = useState(12);
  const emi = calculateEMI(price, months);
  const total = emi * months;
  const interest = total - price;

  return (
    <div className="rounded-card border border-border bg-muted/20 p-3 space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <Calculator className="h-3.5 w-3.5 text-primary" /> EMI Calculator (12% p.a.)
      </div>
      <div className="flex gap-1">
        {[6, 12, 24].map((m) => (
          <button
            key={m}
            onClick={() => setMonths(m)}
            className={`flex-1 rounded-pill py-1 text-[10px] font-semibold transition-colors ${
              months === m ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {m} mo
          </button>
        ))}
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-bold text-foreground notranslate">{formatPrice(emi)}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
        <span className="text-[10px] text-muted-foreground notranslate">Interest: {formatPrice(interest)}</span>
      </div>
    </div>
  );
};

/* ── Best Value Badge ── */
const ValueBadge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 7 ? "bg-success/10 text-success border-success/20" :
                score >= 5 ? "bg-warning/10 text-warning-foreground border-warning/20" :
                "bg-muted text-muted-foreground border-border";
  return (
    <div className={`inline-flex items-center gap-1 rounded-pill border px-2 py-0.5 text-xs font-bold ${color}`}>
      <Zap className="h-3 w-3" /> Value: {score}/10
    </div>
  );
};

const ComparisonTable: React.FC<Props> = ({ models, onRemove }) => {
  const [sellerModal, setSellerModal] = useState<ModelSeller | null>(null);
  const [sellerFilter, setSellerFilter] = useState<"all" | "local" | "online">("all");
  const [sellerSort, setSellerSort] = useState<"price" | "distance" | "rating">("price");
  const [showEMI, setShowEMI] = useState(false);

  // Determine category from first model
  const category = models[0]?.category || "Mobiles";
  const specSections = useMemo(() => getSpecSections(category), [category]);

  const valueScores = useMemo(() => {
    const scores: Record<string, number> = {};
    models.forEach((m) => { scores[m.id] = calculateValueScore(m); });
    return scores;
  }, [models]);

  const getFilteredSellers = useMemo(() => {
    const cache: Record<string, ModelSeller[]> = {};
    models.forEach((m) => {
      let sellers = getSellersForModel(m);
      if (sellerFilter === "local") sellers = sellers.filter((s) => s.type === "local");
      if (sellerFilter === "online") sellers = sellers.filter((s) => s.type === "online");
      sellers.sort((a, b) => {
        if (sellerSort === "price") return a.price - b.price;
        if (sellerSort === "rating") return b.rating - a.rating;
        return (a.distance ?? 999) - (b.distance ?? 999);
      });
      cache[m.id] = sellers;
    });
    return cache;
  }, [models, sellerFilter, sellerSort]);

  const handleWhatsAppShare = () => {
    const ids = models.map((m) => m.id).join(",");
    const url = `${window.location.origin}/product/compare?cat=${category}&models=${ids}`;
    const text = `Compare ${models.map((m) => m.name).join(" vs ")} on BazaarHub: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Sticky header with model names + value scores */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-border bg-card/95 px-4 py-3 shadow-sm backdrop-blur-sm md:-mx-0 md:rounded-card md:border">
        <div className="flex gap-3">
          <div className="hidden w-32 shrink-0 items-center md:flex">
            <span className="text-xs font-semibold uppercase text-muted-foreground">vs</span>
          </div>
          {models.map((m) => (
            <div key={m.id} className="flex flex-1 items-center gap-2 min-w-0">
              <img src={m.image} alt={m.name} className="h-8 w-8 rounded-lg object-contain bg-muted shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground notranslate">{m.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-success font-semibold notranslate">{formatPrice(m.lowestPrice)}</p>
                  <ValueBadge score={valueScores[m.id] || 0} />
                </div>
              </div>
              <button onClick={() => onRemove(m.id)} className="ml-auto shrink-0 rounded-full p-1 hover:bg-destructive/10">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-2 flex items-center gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => setShowEMI(!showEMI)} className="gap-1 text-xs h-7">
            <Calculator className="h-3 w-3" /> {showEMI ? "Hide EMI" : "EMI Calculator"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleWhatsAppShare} className="gap-1 text-xs h-7">
            <Share2 className="h-3 w-3" /> Share via WhatsApp
          </Button>
        </div>
      </div>

      {/* EMI Calculator Row */}
      {showEMI && (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${models.length}, 1fr)` }}>
          {models.map((m) => (
            <EMICalculator key={m.id} price={m.lowestPrice} />
          ))}
        </div>
      )}

      {/* MOBILE: Stacked card view */}
      <div className="space-y-4 md:hidden">
        {specSections.map((section) => (
          <div key={section.title} className="rounded-card border border-border bg-card overflow-hidden">
            <div className="border-b border-border bg-muted/30 px-4 py-2">
              <h3 className="text-sm font-bold text-foreground">{section.icon} {section.title}</h3>
            </div>
            {section.rows.map((row) => {
              const values = models.map((m) => row.getValue(m));
              return (
                <div key={row.label} className="border-b border-border last:border-0 px-4 py-2.5">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">{row.label}</p>
                  <div className="flex gap-2">
                    {models.map((m, i) => {
                      const val = values[i];
                      const hl = getCellHighlight(values, i, row.higherIsBetter);
                      return (
                        <div key={m.id} className="flex-1">
                          <span className={`inline-block rounded-pill px-2 py-0.5 text-xs font-semibold notranslate ${HIGHLIGHT_CLASSES[hl]}`}>
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* DESKTOP: Side-by-side table */}
      <div className="hidden md:block overflow-x-auto rounded-card border border-border bg-card shadow-card">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 w-40 border-b-2 border-border bg-card p-4 text-left text-xs font-semibold uppercase text-muted-foreground">Spec</th>
              {models.map((m) => (
                <th key={m.id} className="border-b-2 border-border p-4 text-center min-w-[200px]">
                  <img src={m.image} alt={m.name} className="mx-auto mb-2 h-24 w-24 object-contain" loading="lazy" />
                  <p className="text-sm font-bold text-foreground notranslate">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.brand}</p>
                  <p className="mt-1 text-base font-bold text-success notranslate">{formatPrice(m.lowestPrice)}</p>
                  <div className="mt-1 flex items-center justify-center gap-1 text-xs text-warning-foreground">
                    <Star className="h-3 w-3 fill-current" /> {m.avgRating} ({m.ratingCount})
                  </div>
                  <div className="mt-1.5">
                    <ValueBadge score={valueScores[m.id] || 0} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specSections.map((section) => (
              <React.Fragment key={section.title}>
                <tr>
                  <td colSpan={models.length + 1} className="border-b border-border bg-muted/30 px-4 py-2 text-sm font-bold text-foreground">
                    {section.icon} {section.title}
                  </td>
                </tr>
                {section.rows.map((row, rIdx) => {
                  const values = models.map((m) => row.getValue(m));
                  return (
                    <tr key={row.label} className={rIdx % 2 === 0 ? "bg-muted/10" : ""}>
                      <td className="sticky left-0 z-10 border-b border-border bg-card p-3 text-sm font-medium text-foreground">{row.label}</td>
                      {models.map((m, i) => {
                        const val = values[i];
                        const hl = getCellHighlight(values, i, row.higherIsBetter);
                        return (
                          <td key={m.id} className="border-b border-border p-3 text-center">
                            <span className={`inline-block rounded-pill px-3 py-1 text-xs font-semibold notranslate ${HIGHLIGHT_CLASSES[hl]}`}>
                              {val}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-success/20 border border-success/30" /> Same</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-warning/20 border border-warning/30" /> Different</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-destructive/20 border border-destructive/30" /> Inferior</span>
      </div>

      {/* See All Sellers per model */}
      <div>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-foreground">All Sellers</h2>
          <div className="flex items-center gap-2">
            <div className="flex rounded-pill border border-border bg-background p-0.5">
              {(["all", "local", "online"] as const).map((f) => (
                <button key={f} onClick={() => setSellerFilter(f)} className={`rounded-pill px-3 py-1 text-xs font-semibold capitalize transition-colors ${sellerFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 rounded-pill border border-border bg-background px-2 py-1">
              <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
              <select value={sellerSort} onChange={(e) => setSellerSort(e.target.value as "price" | "distance" | "rating")} className="bg-transparent text-xs font-semibold text-foreground outline-none">
                <option value="price">Price</option>
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <div key={m.id} className="rounded-card border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
                <img src={m.image} alt={m.name} className="h-8 w-8 rounded-lg object-contain bg-muted" />
                <p className="text-sm font-bold text-foreground truncate notranslate">{m.name}</p>
              </div>
              <div className="space-y-2">
                {(getFilteredSellers[m.id] || []).map((seller, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5 transition-colors hover:bg-accent/50">
                    <div className="min-w-0 flex-1">
                      <button onClick={() => setSellerModal(seller)} className="text-sm font-semibold text-primary hover:underline truncate block">{seller.name}</button>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {seller.type === "local" ? "Local" : "Online"}
                        </Badge>
                        <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-warning text-warning" /> {seller.rating}</span>
                        {seller.distance && <span><MapPin className="inline h-3 w-3" /> {seller.distance} km</span>}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-success whitespace-nowrap notranslate">{formatPrice(seller.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {sellerModal && <SellerModal seller={sellerModal} onClose={() => setSellerModal(null)} />}
    </div>
  );
};

export default ComparisonTable;
