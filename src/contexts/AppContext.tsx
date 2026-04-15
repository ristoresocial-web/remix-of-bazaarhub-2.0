import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  whatsapp?: string;
  createdAt: string;
}

interface AppState {
  selectedCity: string;
  wishlist: string[];
  recentlyViewed: string[];
  priceAlerts: PriceAlert[];
}

interface AppActions {
  setCity: (city: string) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => boolean;
  addRecentlyViewed: (productId: string) => void;
  addPriceAlert: (alert: Omit<PriceAlert, "id" | "createdAt">) => void;
  removePriceAlert: (alertId: string) => void;
}

type AppContextType = AppState & AppActions;

const AppContext = createContext<AppContextType | null>(null);

const WISHLIST_KEY = "bh_wishlist";
const RECENT_KEY = "bh_recent";
const ALERTS_KEY = "bh_alerts";
const CITY_KEY = "bh_city";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => loadJSON<string>(CITY_KEY, "Madurai"));
  const [wishlist, setWishlist] = useState<string[]>(() => loadJSON(WISHLIST_KEY, []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => loadJSON(RECENT_KEY, []));
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => loadJSON(ALERTS_KEY, []));

  useEffect(() => { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem(ALERTS_KEY, JSON.stringify(priceAlerts)); }, [priceAlerts]);
  useEffect(() => { localStorage.setItem(CITY_KEY, JSON.stringify(selectedCity)); }, [selectedCity]);

  const setCity = useCallback((city: string) => setSelectedCity(city), []);

  const addToWishlist = useCallback((id: string) => {
    setWishlist(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist(prev => prev.filter(x => x !== id));
  }, []);

  const isInWishlist = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const toggleWishlist = useCallback((id: string) => {
    const exists = wishlist.includes(id);
    if (exists) setWishlist(prev => prev.filter(x => x !== id));
    else setWishlist(prev => [...prev, id]);
    return !exists;
  }, [wishlist]);

  const addRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed(prev => [id, ...prev.filter(x => x !== id)].slice(0, 10));
  }, []);

  const addPriceAlert = useCallback((alert: Omit<PriceAlert, "id" | "createdAt">) => {
    setPriceAlerts(prev => [...prev, { ...alert, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
  }, []);

  const removePriceAlert = useCallback((alertId: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  return (
    <AppContext.Provider value={{
      selectedCity, wishlist, recentlyViewed, priceAlerts,
      setCity, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist,
      addRecentlyViewed, addPriceAlert, removePriceAlert,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export type { PriceAlert };
