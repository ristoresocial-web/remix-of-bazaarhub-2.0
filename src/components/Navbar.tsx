import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Menu, X, Search, User } from "lucide-react";
import BazaarLogo from "./BazaarLogo";
import AnnouncementTicker from "./AnnouncementTicker";
import CitySelector from "./CitySelector";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const { t, language } = useLanguage();
  const { isLoggedIn, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem("bazaarhub_city") || "Madurai";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem("bazaarhub_city", city);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-bh-border bg-white/90 backdrop-blur-xl transition-shadow duration-200 supports-[backdrop-filter]:bg-white/80 ${
        scrolled ? "shadow-bh-sm" : ""
      }`}
    >
      {/* Desktop Navbar */}
      <div className="container hidden h-16 items-center justify-between gap-4 md:flex">
        {/* Left: Logo + Home + Tagline */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <BazaarLogo />
          </Link>
          <Link
            to="/"
            className="rounded-full border border-bh-border px-3 py-1.5 text-xs font-semibold text-bh-text transition-all duration-200 hover:bg-bh-orange-light hover:border-bh-orange hover:text-bh-orange-dark"
          >
            {t("home")}
          </Link>
        </div>

        {/* Center: City Selector + Search */}
        <div className="flex flex-1 items-center gap-3 px-4">
          <CitySelector selectedCity={selectedCity} onCityChange={handleCityChange} />
          <form
            onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); }}
            className="relative flex flex-1 max-w-md"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands..."
              className="h-10 w-full rounded-full border border-bh-border bg-bh-surface-2 pl-10 pr-4 text-sm text-bh-text placeholder:text-bh-text-muted outline-none transition-all duration-200 focus:border-bh-orange focus:bg-white focus:ring-4 focus:ring-bh-orange/12"
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-bh-text-muted" />
          </form>
        </div>

        {/* Right: Language + Login + Seller */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <Link
              to="/buyer/dashboard"
              className="inline-flex items-center gap-2 rounded-full border-2 border-bh-orange px-4 py-2 text-sm font-semibold text-bh-orange transition-all duration-200 hover:bg-bh-orange hover:text-white"
            >
              <User className="h-4 w-4" /> {profile?.name || "My Account"}
            </Link>
          ) : (
            <Link
              to="/buyer/login"
              className="inline-flex items-center rounded-full border-2 border-bh-orange px-4 py-2 text-sm font-semibold text-bh-orange transition-all duration-200 hover:bg-bh-orange hover:text-white"
            >
              Login
            </Link>
          )}
          <Link
            to="/seller/dashboard"
            className="inline-flex items-center rounded-full bg-bh-orange px-5 py-2 text-sm font-semibold text-white shadow-price transition-all duration-200 hover:bg-bh-orange-dark hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("sellerLogin")}
          </Link>
        </div>
      </div>

      {/* Announcement Ticker */}
      <AnnouncementTicker />

      <div className="flex h-14 items-center justify-between gap-2 px-4 md:hidden">
        {/* Left: Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-bh-text transition-all duration-200 hover:bg-bh-surface-2"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Center: Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <BazaarLogo />
        </Link>

        {/* Right: Compact City Selector */}
        <button
          onClick={() => {
            const event = new CustomEvent("open-city-selector");
            window.dispatchEvent(event);
          }}
          className="flex items-center gap-1 rounded-full border border-bh-border bg-bh-surface-2 px-2.5 py-1.5 text-xs font-semibold text-bh-text transition-all duration-200 hover:bg-bh-orange-light hover:border-bh-orange"
        >
          <MapPin className="h-3.5 w-3.5 text-bh-orange" />
          <span className="max-w-[60px] truncate">{selectedCity}</span>
        </button>
      </div>

      {/* Mobile Slide Menu */}
      {mobileMenuOpen && (
        <div className="animate-fade-in border-t border-bh-border bg-white px-4 py-4 md:hidden">
          <div className="mb-4">
            <CitySelector selectedCity={selectedCity} onCityChange={handleCityChange} />
          </div>
          <div className="mb-4">
            <LanguageSwitcher />
          </div>
          {!isLoggedIn && (
            <Link
              to="/buyer/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block mb-3 rounded-full border-2 border-bh-orange py-2.5 text-center text-sm font-semibold text-bh-orange"
            >
              Login
            </Link>
          )}
          <Link
            to="/seller/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-full bg-bh-orange py-2.5 text-center text-sm font-semibold text-white shadow-price transition-all duration-200 hover:bg-bh-orange-dark"
          >
            {t("sellerLogin")}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
