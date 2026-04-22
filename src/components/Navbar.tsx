import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin, ChevronDown, Globe } from "lucide-react";
import CitySelector from "./CitySelector";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";

const HEADER_LANGS = LANGUAGES.filter((l) => ["en", "ta", "hi"].includes(l.code));

const Navbar: React.FC = () => {
  const location = useLocation();
  const { language, setLanguage, currentLangOption } = useLanguage();

  const [selectedCity, setSelectedCity] = useState(
    () => localStorage.getItem("bazaarhub_city") || "Madurai"
  );
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem("bazaarhub_city", city);
  };

  // Close language dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    if (langOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [langOpen]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const linkCls = (path: string) =>
    `relative whitespace-nowrap px-3 py-2 text-sm transition-colors duration-200 ${
      isActive(path)
        ? "font-bold text-primary after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-primary"
        : "font-medium text-foreground hover:text-primary"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-2 overflow-x-auto px-3 sm:gap-4 sm:px-4">
        {/* 1. Home */}
        <Link to="/" className={linkCls("/")}>
          Home
        </Link>

        {/* 2. City Expo */}
        <Link to="/city-offers" className={linkCls("/city-offers")}>
          City Expo
        </Link>

        {/* 3. Log In */}
        <Link to="/buyer/login" className={linkCls("/buyer/login")}>
          Log In
        </Link>

        {/* spacer */}
        <div className="flex-1" />

        {/* 4. Location */}
        <div className="shrink-0">
          <CitySelector selectedCity={selectedCity} onCityChange={handleCityChange} />
        </div>

        {/* 5. Languages */}
        <div ref={langRef} className="relative shrink-0">
          <button
            onClick={() => setLangOpen((s) => !s)}
            className="flex items-center gap-1.5 rounded-pill border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent"
            aria-label="Select language"
            aria-expanded={langOpen}
          >
            <Globe className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">{currentLangOption.labelEn}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-card border border-border bg-card shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
              {HEADER_LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setLangOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors duration-150 ${
                    language === l.code
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <span>{l.labelEn}</span>
                  <span className="text-xs text-muted-foreground">{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
