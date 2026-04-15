import React, { useState } from "react";
import { Star, ThumbsUp, User, Camera } from "lucide-react";

interface Review {
  user: string;
  rating: number;
  text: string;
  date: string;
  helpful?: number;
  type?: "product" | "seller";
}

interface ReviewSectionProps {
  productReviews: Review[];
  sellerReviews: Review[];
  productRating: number;
  sellerRating: number;
}

const StarInput: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(s => (
      <button key={s} onClick={() => onChange(s)} className="transition-all duration-200 hover:scale-110">
        <Star className={`h-6 w-6 ${s <= value ? "fill-warning text-warning" : "text-muted-foreground"}`} />
      </button>
    ))}
  </div>
);

const ReviewSection: React.FC<ReviewSectionProps> = ({ productReviews, sellerReviews, productRating, sellerRating }) => {
  const [tab, setTab] = useState<"product" | "seller">("product");
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const reviews = tab === "product" ? productReviews : sellerReviews;
  const avgRating = tab === "product" ? productRating : sellerRating;

  const handleSubmit = () => {
    if (newRating === 0) return;
    setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); setNewRating(0); setNewText(""); }, 2000);
  };

  const ratingDist = [5, 4, 3, 2, 1].map(s => ({
    star: s,
    count: reviews.filter(r => r.rating === s).length,
    pct: reviews.length ? (reviews.filter(r => r.rating === s).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">⭐ Reviews</h3>
        <span className="rounded-pill bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary">PHASE 2</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["product", "seller"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-pill px-4 py-2 text-xs font-semibold transition-all duration-200 ${tab === t ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-accent"}`}>
            {t === "product" ? "Product" : "Seller"} ({t === "product" ? productReviews.length : sellerReviews.length})
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-start gap-6 rounded-xl border border-border bg-card p-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
          <div className="flex gap-0.5 text-warning">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-current" : ""}`} />)}</div>
          <p className="mt-1 text-xs text-muted-foreground">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1">
          {ratingDist.map(d => (
            <div key={d.star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-muted-foreground">{d.star}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-warning transition-all duration-500" style={{ width: `${d.pct}%` }} />
              </div>
              <span className="w-4 text-right text-muted-foreground">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="w-full rounded-pill border-2 border-primary py-3 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground">
          Write a Review
        </button>
      ) : (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          {submitted ? (
            <div className="py-6 text-center">
              <p className="text-lg font-bold text-success">🎉 Thank you for your review!</p>
              <p className="text-sm text-muted-foreground">Your review helps the community.</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-foreground">Rate this {tab}</p>
              <StarInput value={newRating} onChange={setNewRating} />
              <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Share your experience..." rows={3} className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <div className="flex gap-2">
                <button onClick={handleSubmit} disabled={newRating === 0} className="rounded-pill bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">Submit</button>
                <button onClick={() => { setShowForm(false); setNewRating(0); setNewText(""); }} className="rounded-pill border border-border px-4 py-2 text-sm text-muted-foreground">Cancel</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Review Cards */}
      <div className="space-y-3">
        {reviews.map((review, idx) => (
          <div key={idx} className="rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-card">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">{review.user[0]}</div>
                <p className="text-sm font-semibold text-foreground">{review.user}</p>
              </div>
              <span className="text-[11px] text-muted-foreground">{review.date}</span>
            </div>
            <div className="mb-2 flex gap-0.5 text-warning">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}</div>
            <p className="text-sm text-muted-foreground">{review.text}</p>
            <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground transition-all duration-200 hover:text-primary">
              <ThumbsUp className="h-3 w-3" /> Helpful ({review.helpful || 0})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
