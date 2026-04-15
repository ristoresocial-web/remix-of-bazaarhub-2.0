import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Scale, Handshake, Bell, MessageCircle, MapPin, ShieldCheck, Globe, Phone, Heart } from "lucide-react";
import { motion } from "framer-motion";
import AISmartSearchBar from "@/components/AISmartSearchBar";
import TrendingSection from "@/components/TrendingSection";
import PriceComparisonTable from "@/components/PriceComparisonTable";
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer";
import { mockSamsungTV } from "@/data/mockData";
import { formatPrice } from "@/lib/cityUtils";
import CityOffersBanner from "@/components/CityOffersBanner";
import FeaturedSellers from "@/components/FeaturedSellers";
import CityOffersFloatingButton from "@/components/CityOffersFloatingButton";
import CityHeroBanner from "@/components/CityHeroBanner";
import StatsBar from "@/components/StatsBar";
import TodaysBestDeals from "@/components/TodaysBestDeals";
import PopularProductsGrid from "@/components/PopularProductsGrid";
import MapBanner from "@/components/MapBanner";

// Category images
import imgMobiles from "@/assets/categories/mobiles.jpg";
import imgTVs from "@/assets/categories/tvs.jpg";
import imgRefrigerators from "@/assets/categories/refrigerators.jpg";
import imgWashingMachines from "@/assets/categories/washing-machines.jpg";
import imgLaptops from "@/assets/categories/laptops.jpg";
import imgACs from "@/assets/categories/acs.jpg";
import imgElectronics from "@/assets/categories/electronics.jpg";
import imgClothing from "@/assets/categories/clothing.jpg";
import imgBooks from "@/assets/categories/books.jpg";
import imgHomeKitchen from "@/assets/categories/home-kitchen.jpg";
import imgSports from "@/assets/categories/sports.jpg";
import imgAutomotive from "@/assets/categories/automotive.jpg";
import imgHealthBeauty from "@/assets/categories/health-beauty.jpg";
import imgToysBaby from "@/assets/categories/toys-baby.jpg";
import imgGrocery from "@/assets/categories/grocery.jpg";
import imgJewellery from "@/assets/categories/jewellery.jpg";
import imgIndustrialTools from "@/assets/categories/industrial-tools.jpg";
import imgPetSupplies from "@/assets/categories/pet-supplies.jpg";
import imgMusicalInstruments from "@/assets/categories/musical-instruments.jpg";
import imgStationery from "@/assets/categories/stationery.jpg";

/* ── Scroll reveal hook ── */
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

const RevealSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const Index = () => {
  const { t } = useLanguage();
  const [selectedCity] = useState(() => localStorage.getItem("bazaarhub_city") || "Madurai");

  const trustBadges = ["Local", "Amazon", "Flipkart", "Meesho", "Croma", "Reliance Digital", "Poorvika", "Sangeetha", "JioMart", "Myntra"];

  const categories = [
    { name: "Mobiles", img: imgMobiles },
    { name: "TVs", img: imgTVs },
    { name: "Refrigerators", img: imgRefrigerators },
    { name: "Washing Machines", img: imgWashingMachines },
    { name: "Laptops", img: imgLaptops },
    { name: "ACs", img: imgACs },
    { name: "Electronics", img: imgElectronics },
    { name: "TV & Appliances", img: imgTVs },
    { name: "Clothing & Fashion", img: imgClothing },
    { name: "Books & Education", img: imgBooks },
    { name: "Home & Kitchen", img: imgHomeKitchen },
    { name: "Sports & Fitness", img: imgSports },
    { name: "Automotive", img: imgAutomotive },
    { name: "Health & Beauty", img: imgHealthBeauty },
    { name: "Toys & Baby", img: imgToysBaby },
    { name: "Grocery & Food", img: imgGrocery },
    { name: "Jewellery & Watches", img: imgJewellery },
    { name: "Industrial & Tools", img: imgIndustrialTools },
    { name: "Pet Supplies", img: imgPetSupplies },
    { name: "Musical Instruments", img: imgMusicalInstruments },
    { name: "Stationery & Office", img: imgStationery },
  ];

  const cityCoverage = ["Madurai", "Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Kolkata", "Pune", "Coimbatore", "Kochi", "Jaipur", "Ahmedabad"];

  const whyBazaarHub = [
    { icon: MapPin, title: "Best Price", desc: "Always show best price (your city seller & online seller)" },
    { icon: Globe, title: "500+ Cities", desc: "Pan-India coverage" },
    { icon: Phone, title: "WhatsApp Direct", desc: "Chat with sellers instantly" },
    { icon: Heart, title: "Free for Buyers", desc: "No charges, ever" },
  ];

  return (
    <div>
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-deep to-navy px-4 py-20">
        <div className="container relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-3 text-4xl font-bold text-white md:text-5xl"
          >
            Your Market. Your Choice.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mx-auto mb-8 max-w-xl text-base text-white/70"
          >
            Compare local shop prices in {selectedCity} vs Amazon &amp; 10+ platforms
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
          >
            <AISmartSearchBar city={selectedCity} className="mx-auto max-w-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 flex flex-wrap justify-center gap-2 overflow-x-auto"
          >
            {trustBadges.map((badge, i) => (
              <motion.span
                key={badge}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.65 + i * 0.04 }}
                className="whitespace-nowrap rounded-full px-3 py-1 text-sm text-white"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                {badge}
              </motion.span>
            ))}
          </motion.div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/10" />
      </section>

      {/* ── STATS BAR ── */}
      <StatsBar />

      {/* ── TODAY'S BEST DEALS ── */}
      <TodaysBestDeals city={selectedCity} />

      {/* ── TRENDING SECTION ── */}
      <TrendingSection city={selectedCity} />

      {/* ── CITY HERO BANNER ── */}
      <CityHeroBanner city={selectedCity} />

      {/* ── CITY OFFERS BANNER ── */}
      <CityOffersBanner city={selectedCity} />

      {/* ── FEATURED SELLERS ── */}
      <FeaturedSellers city={selectedCity} />

      {/* ── POPULAR PRODUCTS ── */}
      <PopularProductsGrid city={selectedCity} />

      {/* ── 2. HOW IT WORKS ── */}
      <RevealSection>
        <section className="container py-14">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { num: 1, icon: Search, title: "Search any product", sub: "Find what you're looking for" },
              { num: 2, icon: Scale, title: "Compare across platforms", sub: "Local + 10+ online platforms" },
              { num: 3, icon: Handshake, title: "Your choice — local or online", sub: "Buy from whoever offers the best deal" },
            ].map((step) => (
              <div key={step.num} className="relative rounded-2xl bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover">
                <span className="absolute -top-3 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step.num}
                </span>
                <div className="mb-4 mt-2 flex justify-center">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-1 text-center text-base font-semibold text-foreground">{step.title}</h3>
                <p className="text-center text-sm text-muted-foreground">{step.sub}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ── 3. PRICE COMPARISON SAMPLE ── */}
      <RevealSection>
        <section className="bg-background py-14">
          <div className="container max-w-3xl">
            <h2 className="mb-1 text-center text-2xl font-bold text-foreground">
              Live Price Comparison
            </h2>
            <p className="mb-8 text-center text-muted-foreground">See real-time prices from all platforms</p>
            <div className="mb-2 rounded-card bg-card p-4 shadow-card">
              <h3 className="mb-4 text-lg font-semibold text-foreground">{mockSamsungTV.name}</h3>
              <PriceComparisonTable
                prices={mockSamsungTV.prices}
                localAvailable={mockSamsungTV.localAvailable}
                city="Madurai"
              />
            </div>
            <div className="mb-6">
              <AffiliateDisclaimer />
            </div>
            <div className="text-center">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark hover:shadow-lg"
              >
                <Search className="h-4 w-4" /> Search Your Product
              </Link>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── MAP BANNER ── */}
      <MapBanner />

      {/* ── 4. CITY COVERAGE STRIP ── */}
      <section className="bg-navy py-8">
        <div className="container text-center">
          <h2 className="mb-4 text-xl font-bold text-white">
            Available in 500+ cities across India
          </h2>
          <div className="flex flex-wrap justify-center gap-2 overflow-x-auto">
            {cityCoverage.map((city) => (
              <span key={city} className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white">
                {city}
              </span>
            ))}
            <span className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white">+ more</span>
          </div>
        </div>
      </section>

      {/* ── 5. CATEGORIES GRID ── */}
      <RevealSection>
        <section className="container py-14">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Categories</h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/search?category=${encodeURIComponent(cat.name)}`}
                className="notranslate group flex flex-col items-center gap-2 rounded-xl border-2 border-border bg-card p-3 shadow-card transition-all duration-200 hover:border-primary hover:shadow-card-hover hover:scale-105"
              >
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-background">
                  <img src={cat.img} alt={cat.name} width={120} height={120} loading="lazy" className="h-full w-full object-contain" />
                </div>
                <span className="text-center text-xs font-semibold text-foreground leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ── 6. PRICE ALERT BANNER ── */}
      <RevealSection>
        <section className="container py-8">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-orange-dark p-8 text-center text-white">
            <Bell className="mx-auto mb-3 h-10 w-10" />
            <h2 className="mb-2 text-xl font-bold">
              We'll notify you when prices drop!
            </h2>
            <p className="mb-6 text-sm text-white/80">Get notified when prices drop in your city</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto flex max-w-md items-center overflow-hidden rounded-full bg-white shadow-lg"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 border-none bg-transparent px-5 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="m-1.5 rounded-full bg-card px-5 py-2 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted"
              >
                Set Alert
              </button>
            </form>
          </div>
        </section>
      </RevealSection>

      {/* ── 7. WHATSAPP BANNER ── */}
      <RevealSection>
        <section className="container py-8">
          <div className="rounded-2xl p-8 text-center text-white" style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}>
            <MessageCircle className="mx-auto mb-3 h-10 w-10" />
            <h2 className="mb-2 text-xl font-bold">
              Chat directly with sellers on WhatsApp!
            </h2>
            <p className="mb-6 text-sm text-white/80">Connect with local sellers via WhatsApp</p>
            <button className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted hover:shadow-lg">
              Try WhatsApp Connect
            </button>
          </div>
        </section>
      </RevealSection>

      {/* ── 8. WHY BAZAAR HUB ── */}
      <RevealSection>
        <section className="container py-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center text-2xl font-bold text-foreground"
          >
            Why Bazaar Hub?
          </motion.h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {whyBazaarHub.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
                whileHover={{ y: -6, scale: 1.04 }}
                className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 shadow-card text-center transition-shadow duration-200 hover:shadow-card-hover"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.1, type: "spring", stiffness: 200 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary"
                >
                  <Icon className="h-6 w-6" />
                </motion.div>
                <h3 className="text-sm font-bold text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </RevealSection>

      <CityOffersFloatingButton />
    </div>
  );
};

export default Index;
