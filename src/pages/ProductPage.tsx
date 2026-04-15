import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, MapPin, Phone, Flag, Star, RefreshCw, Bell, ChevronRight,
  MessageCircle, ExternalLink, Truck, Wrench, ShieldCheck, RotateCcw,
  Clock, Calendar,
} from "lucide-react";
import { mockProducts } from "@/data/mockData";
import { formatPrice, getDistance, getPlatformsForCity } from "@/lib/cityUtils";
import PriceComparisonTable from "@/components/PriceComparisonTable";
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer";
import ProductVariants from "@/components/ProductVariants";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import AIPricePrediction from "@/components/AIPricePrediction";
import ReviewSection from "@/components/ReviewSection";
import ReportModal from "@/components/ReportModal";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

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
  ],
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
  const [lastRefreshed, setLastRefreshed] = useState(() =>
    new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
  );
  const [showCompareBtn, setShowCompareBtn] = useState(false);

  // Use mock TV product for id=200 or fallback to mockProducts
  const existingProduct = mockProducts.find(p => p.id === Number(id));
  const isTVProduct = Number(id) === 200 || !existingProduct;
  const product = existingProduct;

  const amazonHistory = useMemo(() => generatePriceHistory(), []);
  const flipkartHistory = useMemo(() => generatePriceHistory(), []);

  // Build city-aware price list
  const cityPrices = useMemo(() => {
    const prices = [allPrices.local, allPrices.amazon, allPrices.flipkart, allPrices.meesho, allPrices.croma, allPrices.relianceDigital];
    if (tamilNaduCities.includes(selectedCity)) prices.push(allPrices.poorvika);
    if (metroCities.includes(selectedCity)) prices.push(allPrices.vijaySales);
    return prices;
  }, [selectedCity]);

  // Scroll listener for compare button
  useEffect(() => {
    const onScroll = () => setShowCompareBtn(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Refresh cooldown timer
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
      setRefreshCooldown(300); // 5 min
    }, 1500);
  };

  // For existing products, render the enhanced version
  const productName = isTVProduct ? tvProduct.name : product!.name;
  const productBrand = isTVProduct ? tvProduct.brand : product!.brand;
  const productDesc = isTVProduct ? tvProduct.description : product!.description;
  const productImages = isTVProduct ? tvProduct.images : [product!.image];
  const variants = isTVProduct ? tvProduct.variants : product!.variants;
  const cityPartner = isTVProduct ? tvProduct.cityPartners[0] : (product?.localShop ? { ...product.localShop, price: Math.min(...product.prices.filter(p => !p.isAffiliate && p.inStock).map(p => p.price)), rating: 4.3, photo: "🏪", holiday: false, holidayUntil: "" } : null);
  const priceList = isTVProduct ? cityPrices : product!.prices;
  const isLocalAvailable = isTVProduct ? true : product!.localAvailable;
  const cheapest = Math.min(...priceList.filter(p => p.inStock).map(p => p.price));

  if (!isTVProduct && !product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-lg font-semibold text-foreground">Almost there!</p>
        <p className="text-sm text-muted-foreground">We couldn't find this product. It may have been moved.</p>
        <Link to="/" className="mt-4 inline-block rounded-pill bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground">{t("home")}</Link>
      </div>
    );
  }

  const waMessage = encodeURIComponent(`Vanakkam! Bazaar Hub-il ungal ${productName} patthi parthen`);
  const similarProducts = mockProducts.filter(p => p.id !== Number(id)).slice(0, 6);

  return (
    <>
      <Helmet>
        <title>Buy {productName} in {selectedCity} — Cheapest Price | Bazaar Hub</title>
        <meta name="description" content={`Compare ${productName} in ${selectedCity} — Local vs Amazon vs Flipkart`} />
      </Helmet>

      <div className="pb-20 md:pb-0">
        <div className="container py-4">

          {/* ── A. BREADCRUMB + H1 + REPORT ── */}
          <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/" className="transition-all duration-200 hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/search" className="transition-all duration-200 hover:text-primary">Search</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{productName}</span>
          </nav>

          <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{productName}</h1>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-warning">
                  {[1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                  <Star className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">4.2 (1,240 ratings)</span>
              </div>
            </div>
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-all duration-200 hover:text-primary"
            >
              <Flag className="h-3 w-3" /> Report wrong info
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              {/* ── B. IMAGE GALLERY ── */}
              <div>
                <div className="mb-3 overflow-hidden rounded-2xl bg-background">
                  <img
                    src={productImages[mainImage]}
                    alt={productName}
                    className="mx-auto h-72 w-full object-contain"
                    loading="eager"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
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
              </div>

              {/* ── C. PRODUCT VARIANTS ── */}
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

              {/* ── E. LOCAL ADVANTAGE BOX ── */}
              {isLocalAvailable && (
                <Reveal>
                  <div className="rounded-xl border border-primary/20 bg-primary-light p-4">
                    <h3 className="mb-3 text-sm font-bold text-foreground">🏪 Why buy local?</h3>
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

              {/* ── G. PRICE HISTORY CHART ── */}
              <Reveal>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <h3 className="mb-4 text-base font-bold text-foreground">📈 30-Day Price History</h3>
                  <PriceHistoryChart
                    amazonPrices={amazonHistory}
                    flipkartPrices={flipkartHistory}
                    localPrice={cityPartner?.price || cheapest}
                  />
                </div>
              </Reveal>

              {/* ── G2. AI PRICE PREDICTION (Phase 2) ── */}
              <Reveal>
                <AIPricePrediction currentPrice={cheapest} productName={productName} />
              </Reveal>

              {/* ── H. SPECS TABLE ── */}
              {isTVProduct && (
                <Reveal>
                  <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
                    <h3 className="p-4 text-base font-bold text-foreground">📋 Specifications</h3>
                    <table className="w-full text-sm">
                      <tbody>
                        {tvProduct.specs.map(([key, val], idx) => (
                          <tr key={key} className={idx % 2 === 0 ? "bg-muted/40" : ""}>
                            <td className="px-4 py-2.5 font-medium text-muted-foreground w-40">{key}</td>
                            <td className="px-4 py-2.5 text-foreground">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Reveal>
              )}

              {/* ── I. OTHER CITY PARTNERS ── */}
              {isTVProduct && (
                <Reveal>
                  <h3 className="mb-4 text-base font-bold text-foreground">🏪 Other {selectedCity} City Partners</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {tvProduct.cityPartners.map((seller) => (
                      <div key={seller.name} className="min-w-[260px] flex-shrink-0 rounded-xl border border-border bg-card p-4 shadow-card">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-2xl">{seller.photo}</span>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{seller.name}</p>
                            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Star className="h-3 w-3 fill-warning text-warning" /> {seller.rating}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-primary">{formatPrice(seller.price)}</p>
                        <p className="mb-3 text-xs text-muted-foreground">
                          <MapPin className="mr-1 inline h-3 w-3" />{seller.address} · {getDistance(seller.km)}
                        </p>
                        {seller.holiday && (
                          <div className="mb-3 flex items-center gap-1 rounded-pill bg-primary-light px-3 py-1 text-xs font-medium text-primary">
                            <Calendar className="h-3 w-3" /> Shop on holiday until {seller.holidayUntil}
                          </div>
                        )}
                        <a
                          href={seller.holiday ? undefined : `https://wa.me/91${seller.phone}?text=${waMessage}`}
                          target="_blank"
                          rel="nofollow sponsored noopener"
                          className={`flex w-full items-center justify-center gap-1 rounded-pill py-2 text-xs font-semibold transition-all duration-200 ${
                            seller.holiday
                              ? "bg-muted text-muted-foreground cursor-not-allowed"
                              : "bg-[#25D366] text-white hover:opacity-90"
                          }`}
                          onClick={seller.holiday ? (e) => e.preventDefault() : undefined}
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                        </a>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {/* ── J. REVIEWS (Phase 2 Enhanced) ── */}
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
                  productRating={4.2}
                  sellerRating={4.5}
                />
              </Reveal>

              {/* ── K. SIMILAR PRODUCTS ── */}
              <Reveal>
                <h3 className="mb-4 text-base font-bold text-foreground">Similar Products</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {similarProducts.map(p => (
                    <div key={p.id} className="min-w-[180px] flex-shrink-0">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* RIGHT COLUMN (STICKY) */}
            <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">

              {/* ── D. PRICE BLOCK ── */}
              <div className="rounded-2xl border-2 border-primary p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">
                    Prices in {selectedCity}
                  </h3>
                  <Link to="/" className="text-xs font-medium text-primary transition-all duration-200 hover:underline">
                    Change City
                  </Link>
                </div>

                {/* Best price */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground">Best price</p>
                  <p className="text-3xl font-bold text-primary">{formatPrice(cheapest)}</p>
                </div>

                {/* Price list */}
                <PriceComparisonTable
                  prices={priceList}
                  localAvailable={isLocalAvailable}
                  city={selectedCity}
                />

                {/* Refresh */}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">
                    Last updated: {lastRefreshed}
                  </p>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshCooldown > 0}
                    className={`flex items-center gap-1 rounded-pill px-3 py-1 text-[11px] font-medium transition-all duration-200 ${
                      refreshCooldown > 0
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-primary hover:bg-accent"
                    }`}
                  >
                    <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
                    {refreshCooldown > 0 ? `${Math.floor(refreshCooldown / 60)}:${String(refreshCooldown % 60).padStart(2, "0")}` : "Refresh"}
                  </button>
                </div>

                {/* Price Disclaimer (mandatory) */}
                <div className="mt-2">
                  <AffiliateDisclaimer />
                </div>

                {/* Price Alert button */}
                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-pill border-2 border-primary py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground">
                  <Bell className="h-4 w-4" /> Set Price Alert
                </button>
              </div>

              {/* ── F. SELLER CARD ── */}
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
                  <p className="mb-1 text-lg font-bold text-primary">{formatPrice(cityPartner.price)}</p>
                  <p className="mb-3 text-xs text-muted-foreground">{cityPartner.address}</p>

                  {cityPartner.holiday && (
                    <div className="mb-3 flex items-center gap-1 rounded-pill bg-[hsl(var(--primary-light))] px-3 py-1.5 text-xs font-medium text-primary">
                      <Calendar className="h-3.5 w-3.5" /> Shop on holiday until {cityPartner.holidayUntil}
                    </div>
                  )}

                  {isLoggedIn ? (
                    <div className="grid grid-cols-3 gap-2">
                      <a
                        href={cityPartner.holiday ? undefined : `tel:+91${cityPartner.phone}`}
                        className={`flex items-center justify-center gap-1 rounded-pill py-2 text-xs font-semibold transition-all duration-200 ${
                          cityPartner.holiday ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-secondary text-secondary-foreground hover:opacity-90"
                        }`}
                        onClick={cityPartner.holiday ? (e: React.MouseEvent) => e.preventDefault() : undefined}
                      >
                        <Phone className="h-3.5 w-3.5" /> Call
                      </a>
                      <a
                        href={cityPartner.holiday ? undefined : `https://wa.me/91${cityPartner.phone}?text=${waMessage}`}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        className={`flex items-center justify-center gap-1 rounded-pill py-2 text-xs font-semibold transition-all duration-200 ${
                          cityPartner.holiday ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-[#25D366] text-white hover:opacity-90"
                        }`}
                        onClick={cityPartner.holiday ? (e: React.MouseEvent) => e.preventDefault() : undefined}
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(cityPartner.address)}`}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center justify-center gap-1 rounded-pill border border-border py-2 text-xs font-semibold text-foreground transition-all duration-200 hover:bg-accent"
                      >
                        <MapPin className="h-3.5 w-3.5" /> Map
                      </a>
                    </div>
                  ) : (
                    <Link to="/buyer/login" className="flex w-full items-center justify-center gap-2 rounded-pill bg-primary py-2.5 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))]">
                      <Phone className="h-3.5 w-3.5" /> Login to see contact details
                    </Link>
                  )}
                </div>
              )}

              {/* Product description */}
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">{productBrand}</p>
                <p className="text-sm text-muted-foreground">{productDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── L. ADD TO COMPARE BUTTON ── */}
      {showCompareBtn && (
        <Link
          to="/product/compare"
          className="fixed right-4 top-1/2 z-30 -translate-y-1/2 rounded-pill bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground shadow-lg transition-all duration-200 hover:bg-secondary/90 [writing-mode:vertical-lr]"
        >
          + Compare
        </Link>
      )}

      {/* ── M. REPORT MODAL ── */}
      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} productName={productName} />
    </>
  );
};

export default ProductPage;
