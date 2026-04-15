import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, Bell, Star, MapPin, Settings, LogOut, User, Search, ShoppingBag,
  Clock, MessageCircle, Shield, ChevronRight,
} from "lucide-react";
import { mockProducts } from "@/data/mockData";
import { formatPrice } from "@/lib/cityUtils";
import { useAuth } from "@/contexts/AuthContext";
import { getBuyer, logoutBuyer } from "@/lib/buyerAuth";

type Tab = "wishlist" | "reviews" | "alerts" | "searches" | "interests" | "settings";

const mockWishlist = mockProducts.slice(0, 3);
const mockAlerts = [
  { id: 1, product: "Samsung 43\" Crystal 4K TV", target: 27000, current: 28500, triggered: false },
  { id: 2, product: "LG 32\" Smart TV", target: 15000, current: 14800, triggered: true },
];
const mockBuyerReviews = [
  { id: 1, product: "Samsung 43\" Crystal 4K TV", seller: "Sri Murugan Electronics", rating: 5, text: "Amazing picture quality!", date: "Jan 2025" },
  { id: 2, product: "LG Refrigerator 260L", seller: "Poorvika Electronics", rating: 4, text: "Good product, fast delivery.", date: "Dec 2024" },
];
const mockSearches = [
  { id: 1, query: "Samsung 4K TV under 30000", date: "Mar 2025", results: 12 },
  { id: 2, query: "iPhone 15 Pro Max Madurai", date: "Feb 2025", results: 8 },
  { id: 3, query: "Washing machine front load", date: "Feb 2025", results: 15 },
];
const mockInterests = [
  { id: 1, product: "Samsung 43\" Crystal 4K TV", seller: "Sri Murugan Electronics", date: "Mar 2025", status: "Contacted" },
  { id: 2, product: "LG Refrigerator 260L", seller: "Poorvika Electronics", date: "Feb 2025", status: "Visited Store" },
];

const BuyerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isLoggedIn, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("wishlist");

  // Also check legacy localStorage buyer for WhatsApp mock login
  const legacyBuyer = getBuyer();

  if (!isLoggedIn && !legacyBuyer) {
    navigate("/buyer/login");
    return null;
  }

  const displayName = profile?.name || legacyBuyer?.name || "Buyer";
  const displayUsername = profile?.username || legacyBuyer?.username || "user";
  const displayCity = profile?.city || legacyBuyer?.city || "Madurai";
  const displayEmail = profile?.email || user?.email || legacyBuyer?.email || "";
  const displayMobile = profile?.mobile || legacyBuyer?.mobile || "";
  const displayIsAdmin = profile?.is_admin || legacyBuyer?.isAdmin || false;

  const handleLogout = async () => {
    await signOut();
    logoutBuyer();
    navigate("/");
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "wishlist", label: "Wishlist", icon: Heart, count: mockWishlist.length },
    { id: "searches", label: "Saved Searches", icon: Search, count: mockSearches.length },
    { id: "alerts", label: "Price Alerts", icon: Bell, count: mockAlerts.length },
    { id: "reviews", label: "My Reviews", icon: Star, count: mockBuyerReviews.length },
    { id: "interests", label: "Purchase Interest", icon: ShoppingBag, count: mockInterests.length },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <Helmet>
        <title>My Account — Bazaar Hub</title>
        <meta name="description" content="Manage your wishlist, reviews, and price alerts on Bazaar Hub." />
      </Helmet>

      <div className="container pb-20 pt-6 md:pb-8">
        {/* Profile Header */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                {(displayName || "B")[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">{displayName}</h1>
                <p className="text-xs text-muted-foreground">@{displayUsername}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {displayCity}</span>
                  {displayEmail && <span className="notranslate">{displayEmail}</span>}
                  {displayMobile && <span className="notranslate">{displayMobile}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {displayIsAdmin && <span className="flex items-center gap-1 rounded-pill bg-warning/20 px-3 py-1 text-[10px] font-bold text-warning-foreground"><Shield className="h-3 w-3" /> ADMIN</span>}
              <button onClick={handleLogout} className="flex items-center gap-1 rounded-pill border border-border px-3 py-1.5 text-xs text-destructive transition-all duration-200 hover:bg-destructive/10">
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 whitespace-nowrap rounded-pill px-4 py-2 text-xs font-semibold transition-all duration-200 ${tab === t.id ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground hover:bg-accent"}`}>
              <t.icon className="h-3.5 w-3.5" /> {t.label}
              {t.count !== undefined && <span className={`rounded-full px-1.5 text-[10px] ${tab === t.id ? "bg-white/20" : "bg-muted"}`}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* Wishlist */}
        {tab === "wishlist" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockWishlist.map(p => (
              <div key={p.id} className="rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:border-primary hover:shadow-hover">
                <div className="relative mb-3">
                  <img src={p.image} alt={p.name} className="h-40 w-full rounded-xl bg-background object-contain" loading="lazy" />
                  <button className="absolute right-2 top-2 rounded-full bg-card p-1.5 shadow-md"><Heart className="h-4 w-4 fill-destructive text-destructive" /></button>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-foreground line-clamp-2">{p.name}</h3>
                <p className="mb-2 text-lg font-bold text-primary">{formatPrice(Math.min(...p.prices.map(pr => pr.price)))}</p>
                <Link to={`/product/${p.id}/${p.slug}`} className="block rounded-pill bg-primary py-2 text-center text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))]">View Product</Link>
              </div>
            ))}
          </div>
        )}

        {/* Saved Searches */}
        {tab === "searches" && (
          <div className="space-y-3">
            {mockSearches.map(s => (
              <Link key={s.id} to={`/search?q=${encodeURIComponent(s.query)}`} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:border-primary">
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.query}</p>
                    <p className="text-xs text-muted-foreground">{s.results} results · {s.date}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}

        {/* Price Alerts */}
        {tab === "alerts" && (
          <div className="space-y-4">
            {mockAlerts.map(a => (
              <div key={a.id} className={`rounded-2xl border p-4 shadow-card ${a.triggered ? "border-[hsl(var(--success))] bg-[hsl(var(--success-light))]" : "border-border bg-card"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{a.product}</p>
                    <p className="text-xs text-muted-foreground">Target: {formatPrice(a.target)} · Current: {formatPrice(a.current)}</p>
                  </div>
                  {a.triggered && <span className="rounded-pill bg-[hsl(var(--success))] px-3 py-1 text-xs font-bold text-[hsl(var(--success-foreground))]">🎉 Price dropped!</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        {tab === "reviews" && (
          <div className="space-y-4">
            {mockBuyerReviews.map(r => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.product}</p>
                    <p className="text-xs text-muted-foreground">Seller: {r.seller}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <div className="mb-2 flex gap-0.5 text-warning">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
            <button className="w-full rounded-pill border-2 border-primary py-3 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground">Write a Review</button>
          </div>
        )}

        {/* Purchase Interest */}
        {tab === "interests" && (
          <div className="space-y-3">
            {mockInterests.map(i => (
              <div key={i.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{i.product}</p>
                    <p className="text-xs text-muted-foreground">{i.seller} · {i.date}</p>
                  </div>
                  <span className="rounded-pill bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{i.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div className="max-w-lg space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-foreground">Profile</h3>
              <div className="space-y-2">
                <input type="text" defaultValue={displayName} placeholder="Name" className="w-full rounded-[var(--radius-input)] border border-input bg-background px-3 py-2 text-sm" />
                <input type="text" defaultValue={displayUsername} placeholder="Username" className="w-full rounded-[var(--radius-input)] border border-input bg-background px-3 py-2 text-sm" />
                <input type="email" defaultValue={displayEmail} placeholder="Email" className="notranslate w-full rounded-[var(--radius-input)] border border-input bg-background px-3 py-2 text-sm" />
                <input type="tel" defaultValue={displayMobile} placeholder="Mobile" className="notranslate w-full rounded-[var(--radius-input)] border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <button className="rounded-pill bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground">Save</button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <h3 className="mb-2 text-sm font-bold text-foreground">Notification Preferences</h3>
              <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" defaultChecked className="accent-[hsl(var(--primary))]" /> Price drop alerts</label>
              <label className="mt-2 flex items-center gap-2 text-sm text-foreground"><input type="checkbox" defaultChecked className="accent-[hsl(var(--primary))]" /> New seller in your city</label>
              <label className="mt-2 flex items-center gap-2 text-sm text-foreground"><input type="checkbox" className="accent-[hsl(var(--primary))]" /> Weekly deals digest</label>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BuyerDashboardPage;
