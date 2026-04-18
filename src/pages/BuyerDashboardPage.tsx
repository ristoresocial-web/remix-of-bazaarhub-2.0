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
        <div className="relative mb-6 overflow-hidden rounded-3xl border border-bh-border bg-gradient-to-br from-bh-orange-light/40 via-bh-surface-2 to-white p-5 shadow-bh">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-bh-orange/10 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bh-orange text-2xl font-bold text-white shadow-price font-display">
                {(displayName || "B")[0].toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-bh-text">{displayName}</h1>
                <p className="text-xs text-bh-text-muted font-mono">@{displayUsername}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-bh-text-secondary">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-bh-orange" /> {displayCity}</span>
                  {displayEmail && <span className="notranslate font-mono">{displayEmail}</span>}
                  {displayMobile && <span className="notranslate font-mono">{displayMobile}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {displayIsAdmin && <span className="flex items-center gap-1 rounded-pill bg-bh-orange px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-price"><Shield className="h-3 w-3" /> Admin</span>}
              <button onClick={handleLogout} className="flex items-center gap-1 rounded-pill border border-bh-border bg-white px-3 py-1.5 text-xs font-semibold text-destructive transition-all duration-200 hover:bg-destructive/10">
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 whitespace-nowrap rounded-pill px-4 py-2 text-xs font-semibold transition-all duration-200 ${tab === t.id ? "bg-bh-orange text-white shadow-price" : "border border-bh-border bg-bh-surface text-bh-text hover:border-bh-orange/30 hover:bg-bh-orange-light/30"}`}>
              <t.icon className="h-3.5 w-3.5" /> {t.label}
              {t.count !== undefined && <span className={`rounded-full px-1.5 text-[10px] font-mono ${tab === t.id ? "bg-white/25" : "bg-bh-surface-2 text-bh-text-secondary"}`}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* Wishlist */}
        {tab === "wishlist" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockWishlist.map(p => (
              <div key={p.id} className="rounded-2xl border border-bh-border bg-bh-surface p-4 shadow-bh-sm transition-all duration-200 hover:-translate-y-1 hover:border-bh-orange/30 hover:shadow-price">
                <div className="relative mb-3">
                  <img src={p.image} alt={p.name} className="h-40 w-full rounded-xl bg-bh-surface-2 object-contain" loading="lazy" />
                  <button className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-md"><Heart className="h-4 w-4 fill-destructive text-destructive" /></button>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-bh-text line-clamp-2">{p.name}</h3>
                <p className="mb-2 font-mono text-xl font-bold text-bh-green-dark">{formatPrice(Math.min(...p.prices.map(pr => pr.price)))}</p>
                <Link to={`/product/${p.id}/${p.slug}`} className="block rounded-pill bg-bh-orange py-2 text-center text-xs font-semibold text-white shadow-price transition-all duration-200 hover:bg-bh-orange-dark">View Product</Link>
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
              <div key={a.id} className={`rounded-2xl border p-4 shadow-bh-sm ${a.triggered ? "border-bh-green bg-bh-green-light/40" : "border-bh-border bg-bh-surface"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-bh-text">{a.product}</p>
                    <p className="text-xs text-bh-text-secondary font-mono">Target: {formatPrice(a.target)} · Current: {formatPrice(a.current)}</p>
                  </div>
                  {a.triggered && <span className="rounded-pill bg-bh-green px-3 py-1 text-xs font-bold text-white animate-savings-pop">🎉 Price dropped!</span>}
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
            <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <h3 className="mb-1 text-sm font-bold text-foreground">Security</h3>
              <p className="mb-3 text-xs text-muted-foreground">Update your password — verified by mobile OTP.</p>
              <Link
                to="/account/change-password"
                className="inline-flex items-center gap-1 rounded-pill border border-primary px-4 py-2 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
              >
                Change Password <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BuyerDashboardPage;
