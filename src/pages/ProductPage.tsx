import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, MapPin, Phone, Flag, Star, RefreshCw, Bell, ChevronRight,
  MessageCircle, ExternalLink, Truck, Wrench, ShieldCheck, RotateCcw,
  Clock, Calendar, Heart,
} from "lucide-react";
import { mockProducts } from "@/data/mockData";
import { formatPrice, getDistance, getPlatformsForCity } from "@/lib/cityUtils";
import SellerPriceTable from "@/components/SellerPriceTable";
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer";
import ProductVariants from "@/components/ProductVariants";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import AIPricePrediction from "@/components/AIPricePrediction";
import ReviewSection from "@/components/ReviewSection";
import ReportModal from "@/components/ReportModal";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { toggleWishlist, isInWishlist, addToRecentlyViewed } from "@/lib/wishlist";

/* ── Scroll reveal ── */
const useReveal = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible: v };
};
const Reveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const { ref, visible } = useReveal();
  return <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>{children}</div>;
};

/* ── Mock TV product data ── */
const tvProduct = {
  id: 200,
  slug: "samsung-43-crystal-4k-tv",
  name: 'Samsung 43" Crystal 4K UHD Smart TV (2024)',
  category: "TVs",
  brand: "Samsung",
  images: [
    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&h=600&fit=crop",
  ],
  description: "Samsung 43-inch Crystal 4K UHD Smart TV with Dynamic Crystal Color, Crystal Processor 4K, HDR, Smart Hub, and built-in Alexa.",
  variants: { sizes: ["43 inch", "50 inch", "55 inch"], colors: [{ name: "Glossy Black", hex: "#1C1C1E" }, { name: "Matte Black", hex: "#3A3A3C" }] },
  specs: [
    ["Display", '43" Crystal 4K UHD (3840x2160)'],
    ["Processor", "Crystal Processor 4K"],
    ["HDR", "HDR10+ / HLG"],
    ["Smart TV", "Tizen OS with Smart Hub"],
    ["Sound", "20W, Dolby Digital Plus"],
    ["Connectivity", "3x HDMI, 1x USB, Wi-Fi, Bluetooth 5.2"],
    ["Voice Assistant", "Alexa Built-in, Google Assistant"],
    ["Weight", "8.2 kg (without stand)"],
  ] as [string, string][],
  cityPartners: [
    { name: "Sri Murugan Electronics", price: 28500, km: 2.3, address: "45 Main Bazaar, Madurai", phone: "9876543210", rating: 4.3, photo: "🏪", holiday: false, holidayUntil: "" },
    { name: "Poorvika Electronics", price: 29800, km: 3.8, address: "KK Nagar, Madurai", phone: "9876512345", rating: 4.5, photo: "🏬", holiday: false, holidayUntil: "" },
    { name: "Sangeetha Mobiles", price: 29500, km: 5.1, address: "Anna Nagar, Madurai", phone: "9876567890", rating: 4.1, photo: "🏪", holiday: true, holidayUntil: "Jan 20" },
  ],
  reviews: [
    { user: "Ramesh K.", rating: 5, text: "Crystal clear picture quality! Best TV under 30k. Delivery from Sri Murugan was same day.", date: "Dec 2024" },
    { user: "Priya S.", rating: 4, text: "Good smart TV. Tizen OS is smooth. Remote could be better.", date: "Nov 2024" },
    { user: "Arun M.", rating: 5, text: "Compared prices on BazaarHub, saved ₹1,500 vs Amazon. Local delivery and free installation!", date: "Oct 2024" },
  ],
};

const allPrices = {
  local: { platform: "Sri Murugan (Local)", price: 28500, url: "#", isAffiliate: false, inStock: true },
  amazon: { platform: "Amazon", price: 29999, url: "#", isAffiliate: true, inStock: true },
  flipkart: { platform: "Flipkart", price: 30500, url: "#", isAffiliate: true, inStock: true },
  meesho: { platform: "Meesho", price: 31200, url: "#", isAffiliate: true, inStock: true },
  croma: { platform: "Croma", price: 31500, url: "#", isAffiliate: true, inStock: true },
  relianceDigital: { platform: "Reliance Digital", price: 30800, url: "#", isAffiliate: true, inStock: true },
  poorvika: { platform: "Poorvika", price: 29800, url: "#", isAffiliate: false, inStock: true },
  vijaySales: { platform: "Vijay Sales", price: 30200, url: "#", isAffiliate: true, inStock: true },
};

const tamilNaduCities = ["Madurai", "Chennai", "Coimbatore", "Trichy", "Salem", "Erode", "Tirunelveli", "Thanjavur", "Vellore"];
const metroCities = ["Mumbai", "Delhi", "Pune", "Bangalore"];

const generatePriceHistory = () =>
  Array(30).fill(0).map(() => 28000 + Math.random() * 3000);

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string; slug: string }>();
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();

  const [selectedCity] = useState(() => localStorage.getItem("bazaarhub_city") || "Madurai");
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCooldown, setRefreshCooldown] = useState(0);
  const [mainImage, setMainImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(() =>
    new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
  );
  const [showCompareBtn, setShowCompareBtn] = useState(false);

  const existingProduct = mockProducts.find(p => p.id === Number(id));
  const isTVProduct = Number(id) === 200 || !existingProduct;
  const product = existingProduct;

  const amazonHistory = useMemo(() => generatePriceHistory(), []);
  const flipkartHistory = useMemo(() => generatePriceHistory(), []);

  const cityPrices = useMemo(() => {
    const prices = [allPrices.local, allPrices.amazon, allPrices.flipkart, allPrices.meesho, allPrices.croma, allPrices.relianceDigital];
    if (tamilNaduCities.includes(selectedCity)) prices.push(allPrices.poorvika);
    if (metroCities.includes(selectedCity)) prices.push(allPrices.vijaySales);
    return prices;
  }, [selectedCity]);

  // Track recently viewed + wishlist state
  useEffect(() => {
    const pid = String(id || "");
    if (pid) {
      addToRecentlyViewed(pid);
      setWishlisted(isInWishlist(pid));
    }
  }, [id]);

  useEffect(() => {
    const onScroll = () => setShowCompareBtn(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (refreshCooldown <= 0) return;
    const timer = setInterval(() => setRefreshCooldown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [refreshCooldown]);

  const handleRefresh = () => {
    if (refreshCooldown > 0) return;
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed("just now");
      setRefreshCooldown(300);
    }, 1500);
  };

  const handleWishlistToggle = () => {
    const result = toggleWishlist(String(id || ""));
    setWishlisted(result);
  };

  const productName = isTVProduct ? tvProduct.name : product!.name;
  const productBrand = isTVProduct ? tvProduct.brand : product!.brand;
  const productDesc = isTVProduct ? tvProduct.description : product!.description;
  const productImages = isTVProduct ? tvProduct.images : (product!.galleryImages?.length ? product!.galleryImages : [product!.image]);
  const variants = isTVProduct ? tvProduct.variants : product!.variants;
  const specs = isTVProduct ? tvProduct.specs : product!.specs;
  const cityPartner = isTVProduct ? tvProduct.cityPartners[0] : (product?.localShop ? { ...product.localShop, price: Math.min(...product.prices.filter(p => !p.isAffiliate && p.inStock).map(p => p.price)), rating: 4.3, photo: "🏪", holiday: false, holidayUntil: "" } : null);
  const cityPartnersList = isTVProduct
    ? tvProduct.cityPartners
    : (product?.localShop
      ? [{ ...product.localShop, price: Math.min(...product.prices.filter(p => !p.isAffiliate && p.inStock).map(p => p.price)), rating: 4.3, photo: "🏪", holiday: false, holidayUntil: "", inStock: true }]
      : []);
  const onlinePrices = isTVProduct
    ? Object.values(allPrices).filter(p => p.isAffiliate)
    : product!.prices.filter(p => p.isAffiliate);
  const allPriceValues = [
    ...onlinePrices.filter(p => p.inStock).map(p => p.price),
    ...cityPartnersList.map(p => p.price),
  ];
  const cheapest = Math.min(...allPriceValues);
  const onlineBest = Math.min(...onlinePrices.filter(p => p.inStock).map(p => p.price));
  const localBest = cityPartnersList.length > 0 ? Math.min(...cityPartnersList.map(p => p.price)) : null;
  const priceDiff = localBest !== null ? Math.abs(onlineBest - localBest) : 0;
  const cheaperSource = localBest !== null && localBest < onlineBest ? "city partner" : "online";
  const cheapestSeller = isTVProduct
    ? (cheaperSource === "city partner" ? tvProduct.cityPartners[0].name : "Amazon")
    : (cheaperSource === "city partner" ? product?.localShop?.name : onlinePrices.filter(p => p.inStock).sort((a, b) => a.price - b.price)[0]?.platform) || "Online";

  if (!isTVProduct && !product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-lg font-semibold text-foreground">Almost there!</p>
        <p className="text-sm text-muted-foreground">We couldn't find this product. It may have been moved.</p>
        <Link to="/" className="mt-4 inline-block rounded-pill bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground">{t("home")}</Link>
      </div>
    );
  }

  const similarProducts = mockProducts.filter(p => p.id !== Number(id)).slice(0, 6);

  return (
    <>
      <Helmet>
        <title>Buy {productName} in {selectedCity} — Cheapest Price | Bazaar Hub</title>
        <meta name="description" content={`Compare ${productName} in ${selectedCity} — City Partners vs Amazon vs Flipkart`} />
      </Helmet>

      <div className="pb-20 md:pb-0">
        <div className="container py-4">

          {/* ── BREADCRUMB ── */}
          <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/" className="transition-all duration-200 hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/search?q=${encodeURIComponent(isTVProduct ? tvProduct.category : product!.category)}`} className="transition-all duration-200 hover:text-primary">
              {isTVProduct ? tvProduct.category : product!.category}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="notranslate text-foreground font-medium truncate max-w-[200px]">{productBrand}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="notranslate text-foreground font-medium truncate max-w-[200px]">{productName}</span>
          </nav>

          {/* ── H1 + REPORT ── */}
          <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h1 className="notranslate text-2xl font-bold text-foreground md:text-3xl">{productName}</h1>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-warning">
                  {[1, 2, 3, 4].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                  <Star className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">4.5 (2,340 reviews)</span>
              </div>
            </div>
            <button onClick={() => setReportOpen(true)} className="flex items-center gap-1 text-xs text-muted-foreground transition-all duration-200 hover:text-primary">
              <Flag className="h-3 w-3" /> Report wrong info
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            {/* ════════════ LEFT COLUMN ════════════ */}
            <div className="space-y-8">
              {/* ── IMAGE GALLERY ── */}
              <div>
                <div className="mb-3 overflow-hidden rounded-2xl bg-background">
                  <img src={productImages[mainImage]} alt={productName} className="mx-auto h-72 w-full object-contain" loading="eager" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
                    {productImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMainImage(idx)}
                        className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-background transition-all duration-200 ${
                          mainImage === idx ? "ring-2 ring-primary" : "border border-border hover:border-primary"
                        }`}
                      >
                        <img src={img} alt="" className="h-full w-full object-contain" loading="lazy" />
                      </button>
                    ))}
                  </div>
                  {/* Wishlist button */}
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex items-center gap-1.5 rounded-pill border-2 px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      wishlisted
                        ? "border-red-400 bg-red-50 text-red-500"
                        : "border-border text-muted-foreground hover:border-red-300 hover:text-red-400"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
                    {wishlisted ? "Saved" : "Save"}
                  </button>
                </div>
              </div>

              {/* ── VARIANTS ── */}
              {variants && (
                <ProductVariants
                  sizes={variants.sizes}
                  colors={variants.colors}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  onSizeChange={setSelectedSize}
                  onColorChange={setSelectedColor}
                />
              )}

              {/* ── SPECS TABLE ── */}
              {specs && specs.length > 0 && (
                <Reveal>
                  <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
                    <h3 className="p-4 text-base font-bold text-foreground">📋 Product Specifications</h3>
                    <table className="w-full text-sm">
                      <tbody>
                        {specs.map(([key, val], idx) => (
                          <tr key={key} className={idx % 2 === 0 ? "bg-muted/40" : ""}>
                            <td className="px-4 py-2.5 font-medium text-muted-foreground w-40">{key}</td>
                            <td className="notranslate px-4 py-2.5 text-foreground">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Reveal>
              )}

              {/* ── ALL SELLERS TABLE ── */}
              <Reveal>
                <h3 className="mb-4 text-lg font-bold text-foreground">
                  All Sellers for <span className="notranslate">{productName}</span> in {selectedCity}
                </h3>
                <SellerPriceTable
                  onlinePrices={onlinePrices}
                  cityPartners={cityPartnersList}
                  city={selectedCity}
                  productName={productName}
                  lastRefreshed={lastRefreshed}
                  onReport={() => setReportOpen(true)}
                />
              </Reveal>

              {/* ── LOCAL ADVANTAGE BOX ── */}
              {cityPartnersList.length > 0 && (
                <Reveal>
                  <div className="rounded-xl border border-primary/20 bg-primary-light p-4">
                    <h3 className="mb-3 text-sm font-bold text-foreground">🏪 Why buy from a city partner?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Truck, text: "Same day delivery" },
                        { icon: Wrench, text: "Free installation" },
                        { icon: ShieldCheck, text: "Direct warranty" },
                        { icon: RotateCcw, text: "Easy returns" },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium text-foreground">{text}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] text-muted-foreground">
                      vs Amazon: 2-3 days delivery + ₹500 installation charges
                    </p>
                  </div>
                </Reveal>
              )}

              {/* ── PRICE HISTORY CHART ── */}
              <Reveal>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <h3 className="mb-4 text-base font-bold text-foreground">📈 Price History — Last 30 Days</h3>
                  <PriceHistoryChart
                    amazonPrices={amazonHistory}
                    flipkartPrices={flipkartHistory}
                    localPrice={localBest || cheapest}
                  />
                </div>
              </Reveal>

              {/* ── AI PRICE PREDICTION ── */}
              <Reveal>
                <AIPricePrediction currentPrice={cheapest} productName={productName} />
              </Reveal>

              {/* ── REVIEWS ── */}
              <Reveal>
                <ReviewSection
                  productReviews={[
                    ...(isTVProduct ? tvProduct.reviews : [{ user: "User", rating: 5, text: "Great product!", date: "Dec 2024" }]),
                    { user: "Lakshmi R.", rating: 4, text: "Very good value for money. Picture quality is excellent for the price.", date: "Jan 2025", helpful: 5 },
                    { user: "Karthik V.", rating: 5, text: "Bought from city partner via BazaarHub. Saved ₹2,000 and got same-day delivery!", date: "Jan 2025", helpful: 12 },
                  ]}
                  sellerReviews={[
                    { user: "Ramesh K.", rating: 5, text: "Sri Murugan Electronics provides excellent service. Free installation!", date: "Dec 2024", helpful: 8 },
                    { user: "Priya S.", rating: 4, text: "Quick response on WhatsApp. Good after-sales support.", date: "Nov 2024", helpful: 3 },
                    { user: "Arun M.", rating: 5, text: "Best electronics shop in Madurai. Fair prices always.", date: "Oct 2024", helpful: 15 },
                  ]}
                  productRating={4.5}
                  sellerRating={4.5}
                />
              </Reveal>

              {/* ── SIMILAR PRODUCTS ── */}
              <Reveal>
                <h3 className="mb-4 text-base font-bold text-foreground">You may also compare:</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {similarProducts.map(p => (
                    <div key={p.id} className="min-w-[180px] flex-shrink-0">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* ════════════ RIGHT COLUMN (STICKY) ════════════ */}
            <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">

              {/* ── BEST PRICE SUMMARY ── */}
              <div className="rounded-3xl border border-bh-border bg-gradient-to-br from-bh-surface-2 to-white p-5 shadow-bh">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-bh-orange">
                    🏆 Best Price in {selectedCity}
                  </p>
                  <Link to="/" className="text-xs font-medium text-bh-orange transition-all duration-200 hover:underline">
                    Change City
                  </Link>
                </div>

                <p className="notranslate font-mono text-4xl font-medium text-bh-text price-animate tracking-tight">
                  {formatPrice(cheapest)}
                </p>
                <p className="text-sm text-bh-text-secondary mb-4">
                  at <span className="font-display font-bold text-bh-text">{cheapestSeller}</span>
                </p>

                {/* Online vs City Partner comparison */}
                <div className="rounded-2xl bg-white border border-bh-border p-3 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-bh-text-secondary flex items-center gap-1">🌐 Online Best</span>
                    <span className="notranslate font-mono font-medium text-bh-blue">{formatPrice(onlineBest)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-bh-border" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-bh-text-muted">vs</span>
                    <div className="h-px flex-1 bg-bh-border" />
                  </div>
                  {localBest !== null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-bh-text-secondary flex items-center gap-1">🏪 City Partner Best</span>
                      <span className="notranslate font-mono font-medium text-bh-green-dark">{formatPrice(localBest)}</span>
                    </div>
                  )}
                  {priceDiff > 0 && (
                    <div className="mt-2 flex items-center justify-between rounded-xl border border-bh-orange/20 bg-bh-orange-light p-2.5 animate-savings-pop">
                      <span className="text-xs font-bold text-bh-orange-dark flex items-center gap-1">
                        💰 You save
                      </span>
                      <span className="font-mono notranslate text-lg font-medium text-bh-orange-dark">
                        {formatPrice(priceDiff)}
                      </span>
                    </div>
                  )}
                  {priceDiff > 0 && (
                    <p className="text-[10px] text-bh-text-muted text-center">
                      cheaper via <span className="font-bold text-bh-orange-dark">{cheaperSource}</span>
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <a href="#sellers" className="flex items-center justify-center gap-1 rounded-full bg-bh-orange py-2.5 text-sm font-bold text-white shadow-price transition-all duration-200 hover:bg-bh-orange-dark hover:scale-[1.02] active:scale-[0.98]">
                    Compare All Prices
                  </a>
                  <button className="flex items-center justify-center gap-1 rounded-full border-2 border-bh-orange py-2.5 text-sm font-bold text-bh-orange transition-all duration-200 hover:bg-bh-orange-light">
                    <Bell className="h-4 w-4" /> Price Alert
                  </button>
                </div>

                {/* Refresh */}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">Last updated: {lastRefreshed}</p>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshCooldown > 0}
                    className={`flex items-center gap-1 rounded-pill px-3 py-1 text-[11px] font-medium transition-all duration-200 ${
                      refreshCooldown > 0 ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:bg-accent"
                    }`}
                  >
                    <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
                    {refreshCooldown > 0 ? `${Math.floor(refreshCooldown / 60)}:${String(refreshCooldown % 60).padStart(2, "0")}` : "Refresh"}
                  </button>
                </div>
              </div>

              {/* ── TOP CITY PARTNER CARD ── */}
              {cityPartner && (
                <div className="rounded-xl bg-card p-4 shadow-card">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-3xl">{cityPartner.photo}</span>
                    <div>
                      <p className="text-sm font-bold text-foreground">{cityPartner.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span>{cityPartner.rating}</span>
                        <span>·</span>
                        <MapPin className="h-3 w-3" />
                        <span>{getDistance(cityPartner.km)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="notranslate mb-1 text-lg font-bold text-primary">{formatPrice(cityPartner.price)}</p>
                  <p className="mb-3 text-xs text-muted-foreground">{cityPartner.address}</p>

                  {cityPartner.holiday ? (
                    <div className="flex items-center gap-1 rounded-pill bg-primary-light px-3 py-1.5 text-xs font-medium text-primary">
                      <Calendar className="h-3.5 w-3.5" /> Shop on holiday until {cityPartner.holidayUntil}
                    </div>
                  ) : isLoggedIn ? (
                    <div className="grid grid-cols-3 gap-2">
                      <a href={`tel:+91${cityPartner.phone}`} className="flex items-center justify-center gap-1 rounded-pill bg-secondary py-2 text-xs font-semibold text-secondary-foreground transition-all duration-200 hover:opacity-90">
                        <Phone className="h-3.5 w-3.5" /> Call
                      </a>
                      <a href={`https://wa.me/91${cityPartner.phone}`} target="_blank" rel="nofollow sponsored noopener" className="flex items-center justify-center gap-1 rounded-pill bg-[#25D366] py-2 text-xs font-semibold text-white transition-all duration-200 hover:opacity-90">
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(cityPartner.address)}`} target="_blank" rel="noopener" className="flex items-center justify-center gap-1 rounded-pill border border-border py-2 text-xs font-semibold text-foreground transition-all duration-200 hover:bg-accent">
                        <MapPin className="h-3.5 w-3.5" /> Map
                      </a>
                    </div>
                  ) : (
                    <Link to="/buyer/login" className="flex w-full items-center justify-center gap-2 rounded-pill bg-primary py-2.5 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90">
                      <Phone className="h-3.5 w-3.5" /> Login to see contact details
                    </Link>
                  )}
                </div>
              )}

              {/* ── DESCRIPTION ── */}
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">{productBrand}</p>
                <p className="text-sm text-muted-foreground">{productDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMPARE BUTTON ── */}
      {showCompareBtn && (
        <Link
          to="/product/compare"
          className="fixed right-4 top-1/2 z-30 -translate-y-1/2 rounded-pill bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground shadow-lg transition-all duration-200 hover:bg-secondary/90 [writing-mode:vertical-lr]"
        >
          + Compare
        </Link>
      )}

      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} productName={productName} />
    </>
  );
};

export default ProductPage;
