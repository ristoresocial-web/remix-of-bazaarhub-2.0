import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { mockProducts } from "@/data/mockData";

const ROTATING_PLACEHOLDERS = [
  "Search Samsung Galaxy A55 in Madurai...",
  "Compare AC prices near you...",
  "Find best laptop deals in Chennai...",
  "iPhone 15 local vs online price...",
];

const ONLINE_PLATFORMS = [
  { name: "Amazon", url: "https://www.amazon.in/s?k=", color: "#FF9900" },
  { name: "Flipkart", url: "https://www.flipkart.com/search?q=", color: "#2874F0" },
  { name: "Meesho", url: "https://www.meesho.com/search?q=", color: "#F43397" },
];

interface AISuggestion {
  name: string;
  category: string;
  emoji: string;
  why_popular: string;
}

interface AISmartSearchBarProps {
  city: string;
  className?: string;
}

const AISmartSearchBar: React.FC<AISmartSearchBarProps> = ({ city, className = "" }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [localResults, setLocalResults] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Rotate placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch suggestions when query changes (debounced)
  useEffect(() => {
    if (query.length < 2) {
      setOpen(false);
      setAiSuggestions([]);
      setLocalResults([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchSuggestions(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, city]);

  const fetchSuggestions = async (q: string) => {
    // Cancel previous request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setOpen(true);

    // Local mock results
    const localMatches = mockProducts
      .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 4)
      .map((p) => ({ name: p.name, count: Math.floor(Math.random() * 8) + 2 }));
    setLocalResults(localMatches);

    // AI suggestions
    try {
      const { data, error } = await supabase.functions.invoke("ai-search-suggestions", {
        body: { query: q, city },
      });
      if (!error && data?.suggestions) {
        setAiSuggestions(data.suggestions.slice(0, 5));
      }
    } catch {
      // Fallback: show local results only
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = useCallback(
    (productName: string) => {
      setOpen(false);
      setQuery("");
      // Log search
      supabase.from("search_logs").insert({ search_query: productName, city }).then(() => {});
      navigate(`/search?q=${encodeURIComponent(productName)}&city=${encodeURIComponent(city)}`);
    },
    [navigate, city]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      supabase.from("search_logs").insert({ search_query: query.trim(), city }).then(() => {});
      setOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}&city=${encodeURIComponent(city)}`);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = aiSuggestions.length + localResults.length;
    if (!open || totalItems === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i < totalItems - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i > 0 ? i - 1 : totalItems - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      if (activeIdx < aiSuggestions.length) {
        handleSelect(aiSuggestions[activeIdx].name);
      } else {
        handleSelect(localResults[activeIdx - aiSuggestions.length].name);
      }
    }
  };

  const showDropdown = open && (loading || aiSuggestions.length > 0 || localResults.length > 0);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center overflow-hidden rounded-2xl bg-white shadow-2xl border-l-4 border-primary">
        {/* City button */}
        <button
          type="button"
          className="hidden md:flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-primary whitespace-nowrap border-r border-border"
          onClick={() => window.dispatchEvent(new CustomEvent("open-city-selector"))}
        >
          <MapPin className="h-4 w-4" />
          <span>{city}</span>
        </button>

        {/* Input with rotating placeholder */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query.length >= 2) setOpen(true); }}
            onKeyDown={handleKeyDown}
            className="w-full border-none bg-transparent px-5 py-4 md:py-5 text-sm md:text-base text-foreground outline-none"
            autoComplete="off"
            role="combobox"
            aria-expanded={showDropdown}
          />
          {!query && (
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholderIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm md:text-base text-muted-foreground"
              >
                {ROTATING_PLACEHOLDERS[placeholderIdx]}
              </motion.span>
            </AnimatePresence>
          )}
        </div>

        {query && (
          <button type="button" onClick={() => { setQuery(""); setOpen(false); }} className="mr-1 p-2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          className="m-2 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl"
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Search</span>
        </motion.button>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          {/* AI Suggestions */}
          {(loading || aiSuggestions.length > 0) && (
            <div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/5">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">🤖 AI Suggestions</span>
              </div>
              {loading && aiSuggestions.length === 0 ? (
                <div className="space-y-1 p-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : (
                aiSuggestions.map((s, i) => (
                  <motion.button
                    key={s.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleSelect(s.name)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      activeIdx === i ? "bg-accent" : "hover:bg-accent/50"
                    }`}
                  >
                    <span className="text-lg">{s.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-foreground">{s.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">— {s.why_popular}</span>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          )}

          {/* Local Results */}
          {localResults.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--success))]/5">
                <span className="text-xs font-bold text-[hsl(var(--success))] uppercase tracking-wide">📍 From Local Shops</span>
              </div>
              {localResults.map((r, i) => {
                const idx = aiSuggestions.length + i;
                return (
                  <button
                    key={r.name}
                    onClick={() => handleSelect(r.name)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      activeIdx === idx ? "bg-accent" : "hover:bg-accent/50"
                    }`}
                  >
                    <MapPin className="h-4 w-4 text-[hsl(var(--success))]" />
                    <span className="font-medium text-foreground">{r.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{r.count} shops in {city}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Online Platforms */}
          {query.length >= 2 && (
            <div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">🌐 Online Platforms</span>
              </div>
              {ONLINE_PLATFORMS.map((p) => (
                <a
                  key={p.name}
                  href={`${p.url}${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-accent/50 transition-colors"
                >
                  <span className="font-bold text-xs" style={{ color: p.color }}>{p.name}</span>
                  <span className="text-muted-foreground">Search "{query}" on {p.name}</span>
                  <ExternalLink className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AISmartSearchBar;
