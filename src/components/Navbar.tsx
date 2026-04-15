import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem("bazaarhub_city") || "Madurai";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      className={`sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur transition-shadow duration-200 supports-[backdrop-filter]:bg-card/80 ${
        scrolled ? "shadow-card" : ""
      }`}
    >
      {/* Desktop Navbar */}
      <div className="container hidden h-16 items-center justify-between gap-4 md:flex">
        {/* Left: Logo + Home + Tagline */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <Link to="/">
              <BazaarLogo />
            </Link>
          </div>
          <Link to="/" className="rounded-pill border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-all duration-200 hover:bg-accent">
            {t("home")}
          </Link>
        </div>

        {/* Center: City Selector */}
        <div className="flex items-center">
          <CitySelector selectedCity={selectedCity} onCityChange={handleCityChange} />
        </div>

        {/* Right: Language + Seller Login */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <Link to="/buyer/dashboard" className="flex items-center gap-2 rounded-pill border border-primary px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground">
              <User className="h-4 w-4" /> {profile?.name || "My Account"}
            </Link>
          ) : (
            <Link
              to="/buyer/login"
              className="rounded-pill border border-primary px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
            >
              Login
            </Link>
          )}
          <Link
            to="/seller/dashboard"
            className="rounded-pill bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))] hover:shadow-lg"
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
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-all duration-200 hover:bg-accent"
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
            /* CitySelector will open via its own state, so we use a workaround */
            const event = new CustomEvent("open-city-selector");
            window.dispatchEvent(event);
          }}
          className="flex items-center gap-1 rounded-pill border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-all duration-200"
        >
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="max-w-[60px] truncate">{selectedCity}</span>
        </button>
      </div>

      {/* Mobile Slide Menu */}
      {mobileMenuOpen && (
        <div className="animate-fade-in border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="mb-4">
            <CitySelector selectedCity={selectedCity} onCityChange={handleCityChange} />
          </div>
          <div className="mb-4">
            <LanguageSwitcher />
          </div>
          <Link
            to="/seller/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-pill bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark"
          >
            {t("sellerLogin")}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
