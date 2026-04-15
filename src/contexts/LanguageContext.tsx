import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

export interface LanguageOption {
  code: string;
  label: string;       // Native script name
  labelEn: string;     // English name
  gtCode: string;      // Google Translate language code
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", labelEn: "English", gtCode: "en" },
  { code: "as", label: "অসমীয়া", labelEn: "Assamese", gtCode: "as" },
  { code: "bn", label: "বাংলা", labelEn: "Bengali", gtCode: "bn" },
  { code: "brx", label: "बड़ो", labelEn: "Bodo", gtCode: "brx" },
  { code: "doi", label: "डोगरी", labelEn: "Dogri", gtCode: "doi" },
  { code: "gu", label: "ગુજરાતી", labelEn: "Gujarati", gtCode: "gu" },
  { code: "hi", label: "हिन्दी", labelEn: "Hindi", gtCode: "hi" },
  { code: "kn", label: "ಕನ್ನಡ", labelEn: "Kannada", gtCode: "kn" },
  { code: "ks", label: "कॉशुर", labelEn: "Kashmiri", gtCode: "ks" },
  { code: "gom", label: "कोंकणी", labelEn: "Konkani", gtCode: "gom" },
  { code: "mai", label: "मैथिली", labelEn: "Maithili", gtCode: "mai" },
  { code: "ml", label: "മലയാളം", labelEn: "Malayalam", gtCode: "ml" },
  { code: "mni", label: "ꯃꯤꯇꯩꯂꯣꯟ", labelEn: "Manipuri", gtCode: "mni-Mtei" },
  { code: "mr", label: "मराठी", labelEn: "Marathi", gtCode: "mr" },
  { code: "ne", label: "नेपाली", labelEn: "Nepali", gtCode: "ne" },
  { code: "or", label: "ଓଡ଼ିଆ", labelEn: "Odia", gtCode: "or" },
  { code: "pa", label: "ਪੰਜਾਬੀ", labelEn: "Punjabi", gtCode: "pa" },
  { code: "sa", label: "संस्कृतम्", labelEn: "Sanskrit", gtCode: "sa" },
  { code: "sat", label: "ᱥᱟᱱᱛᱟᱲᱤ", labelEn: "Santali", gtCode: "sat" },
  { code: "sd", label: "سنڌي", labelEn: "Sindhi", gtCode: "sd" },
  { code: "ta", label: "தமிழ்", labelEn: "Tamil", gtCode: "ta" },
  { code: "te", label: "తెలుగు", labelEn: "Telugu", gtCode: "te" },
  { code: "ur", label: "اردو", labelEn: "Urdu", gtCode: "ur" },
];

// Static translations for key UI strings (English base)
const translations: Record<string, string> = {
  tagline: "Your Market. Your Choice.",
  heroTitle: "Shop Local, Save Big",
  heroSubtitle: "Compare prices from city partners and online platforms across India",
  explore: "Explore Deals",
  home: "Home",
  categories: "Categories",
  deals: "Deals",
  account: "Account",
  selectCity: "Select City",
  search: "Search products...",
  comparePrices: "Compare Prices",
  sellerLogin: "Seller Login",
  about: "About",
  help: "Help",
  alertMe: "Alert Me",
  availableLocally: "Available Locally",
  cheapest: "Cheapest",
  viewAll: "View All",
  trendingDeals: "Trending Deals",
  topCategories: "Top Categories",
  registerShop: "Register Your Shop",
  notInCity: "Not available in",
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  currentLangOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): string {
  // Priority: URL param > localStorage > default
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get("lang");
  if (urlLang && LANGUAGES.some(l => l.code === urlLang)) return urlLang;

  const stored = localStorage.getItem("bazaarhub_lang");
  if (stored && LANGUAGES.some(l => l.code === stored)) return stored;

  return "en";
}

function triggerGoogleTranslate(langCode: string) {
  // Find the Google Translate select element and change its value
  const gtCombo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (gtCombo) {
    gtCombo.value = LANGUAGES.find(l => l.code === langCode)?.gtCode || "en";
    gtCombo.dispatchEvent(new Event("change"));
  }
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(getInitialLanguage);

  const currentLangOption = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("bazaarhub_lang", lang);

    // Update URL param without full reload
    const url = new URL(window.location.href);
    if (lang === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", lang);
    }
    window.history.replaceState({}, "", url.toString());

    // Trigger Google Translate
    if (lang === "en") {
      // Reset to original
      const gtCombo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (gtCombo) {
        gtCombo.value = "en";
        gtCombo.dispatchEvent(new Event("change"));
      }
      // Also try the reset cookie approach
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname;
    } else {
      triggerGoogleTranslate(lang);
    }
  }, []);

  // On mount, apply saved language to Google Translate after it loads
  useEffect(() => {
    if (language === "en") return;

    const interval = setInterval(() => {
      const gtCombo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (gtCombo) {
        triggerGoogleTranslate(language);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [language]);

  const t = useCallback((key: string): string => {
    return translations[key] || key;
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLangOption }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

// Legacy exports for backward compat
export type Language = string;
export const languageLabels: Record<string, string> = Object.fromEntries(
  LANGUAGES.map(l => [l.code, l.label])
);
