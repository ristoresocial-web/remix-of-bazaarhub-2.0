import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Scale, Handshake, Bell } from "lucide-react";
import { motion } from "framer-motion";
import AISmartSearchBar from "@/components/AISmartSearchBar";
import StatsBar from "@/components/StatsBar";
import CategoryGrid from "@/components/CategoryGrid";
import BestComparisonCards from "@/components/BestComparisonCards";
import FeaturedSellers from "@/components/FeaturedSellers";
import BecomeSeller from "@/components/BecomeSeller";
import CityOffersFloatingButton from "@/components/CityOffersFloatingButton";

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
  const navigate = useNavigate();
  const [selectedCity] = useState(() => localStorage.getItem("bazaarhub_city") || "Madurai");

  const popularSearches = ["Samsung Galaxy S24", "LG AC", "HP Laptop", "iPhone 15", "Sony TV"];

  return (
    <div>
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-accent/30 px-4 py-20">
        <div className="container relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-3 text-4xl font-bold text-foreground md:text-5xl"
          >
            Find the Best Price in Your City
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mx-auto mb-8 max-w-xl text-base text-muted-foreground"
          >
            Compare city partners vs Amazon, Flipkart — in real time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
          >
            <AISmartSearchBar city={selectedCity} className="mx-auto max-w-2xl" />
          </motion.div>

          {/* Popular searches */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-5 flex flex-wrap justify-center gap-2"
          >
            <span className="text-sm text-muted-foreground">Popular:</span>
            {popularSearches.map((term) => (
              <Link
                key={term}
                to={`/search?q=${encodeURIComponent(term)}`}
                className="notranslate rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground transition-all duration-200 hover:border-primary hover:text-primary"
              >
                {term}
              </Link>
            ))}
          </motion.div>

          {/* City context line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            Showing prices in <span className="font-semibold text-foreground">{selectedCity}</span> ·{" "}
            <button
              onClick={() => document.querySelector<HTMLButtonElement>('[data-city-selector]')?.click()}
              className="text-primary underline-offset-2 hover:underline"
            >
              Change city
            </button>
          </motion.p>
        </div>
      </section>

      {/* ── 2. STATS BAR ── */}
      <StatsBar />

      {/* ── 3. CATEGORY GRID ── */}
      <RevealSection>
        <CategoryGrid />
      </RevealSection>

      {/* ── 4. BEST COMPARISON CARDS ── */}
      <RevealSection>
        <BestComparisonCards city={selectedCity} />
      </RevealSection>

      {/* ── 5. HOW IT WORKS ── */}
      <RevealSection>
        <section className="bg-muted/20 py-14">
          <div className="container">
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { num: 1, icon: Search, title: "Search Product", sub: "Type any product name or model" },
                { num: 2, icon: Scale, title: "Compare Prices", sub: "See online vs city partner prices" },
                { num: 3, icon: Handshake, title: "Choose Best Deal", sub: "Buy from city partner or order online" },
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
          </div>
        </section>
      </RevealSection>

      {/* ── 6. FEATURED SELLERS ── */}
      <RevealSection>
        <FeaturedSellers city={selectedCity} />
      </RevealSection>

      {/* ── 7. PRICE ALERT BANNER ── */}
      <RevealSection>
        <section className="container py-8">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-orange-dark p-8 text-center text-white">
            <Bell className="mx-auto mb-3 h-10 w-10" />
            <h2 className="mb-2 text-xl font-bold">
              Never miss a price drop!
            </h2>
            <p className="mb-6 text-sm text-white/80">Set alerts and get notified on WhatsApp when prices fall.</p>
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

      {/* ── 8. BECOME A SELLER ── */}
      <RevealSection>
        <BecomeSeller />
      </RevealSection>

      <CityOffersFloatingButton />
    </div>
  );
};

export default Index;
