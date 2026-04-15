import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { mockProducts } from "@/data/mockData";

interface Suggestion {
  type: "product" | "brand" | "category";
  label: string;
  subLabel?: string;
  query: string;
  productId?: number;
  slug?: string;
}

function buildSuggestions(query: string): Suggestion[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const results: Suggestion[] = [];
  const seen = new Set<string>();

  // Product name matches
  for (const p of mockProducts) {
    if (p.name.toLowerCase().includes(q)) {
      const key = `product-${p.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          type: "product",
          label: p.name,
          subLabel: p.brand,
          query: p.name,
          productId: p.id,
          slug: p.slug,
        });
      }
    }
  }

  // Brand matches
  const brands = [...new Set(mockProducts.map(p => p.brand))];
  for (const brand of brands) {
    if (brand.toLowerCase().includes(q)) {
      const key = `brand-${brand}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ type: "brand", label: brand, subLabel: "Brand", query: brand });
      }
    }
  }

  // Category matches
  const categories = [...new Set(mockProducts.map(p => p.category))];
  for (const cat of categories) {
    if (cat.toLowerCase().includes(q)) {
      const key = `cat-${cat}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ type: "category", label: cat, subLabel: "Category", query: cat });
      }
    }
  }

  return results.slice(0, 8);
}

function highlightMatch(text: string, query: string) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-foreground rounded-sm px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

interface SearchAutoSuggestProps {
  city: string;
  className?: string;
  placeholder?: string;
}

const SearchAutoSuggest: React.FC<SearchAutoSuggestProps> = ({ city, className = "", placeholder }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Build suggestions on debounced query change
  useEffect(() => {
    const results = buildSuggestions(debouncedQuery);
    setSuggestions(results);
    setOpen(results.length > 0 && debouncedQuery.length >= 2);
    setActiveIdx(-1);
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goTo = useCallback((suggestion: Suggestion) => {
    setOpen(false);
    setQuery("");
    if (suggestion.type === "product" && suggestion.productId && suggestion.slug) {
      navigate(`/product/${suggestion.productId}/${suggestion.slug}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion.query)}&city=${encodeURIComponent(city)}`);
    }
  }, [navigate, city]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIdx >= 0 && suggestions[activeIdx]) {
      goTo(suggestions[activeIdx]);
    } else if (query.trim()) {
      setOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}&city=${encodeURIComponent(city)}`);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      goTo(suggestions[activeIdx]);
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "product": return "🔗";
      case "brand": return "🏷️";
      case "category": return "📁";
      default: return "🔍";
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center overflow-hidden rounded-full bg-white shadow-lg">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { if (suggestions.length > 0 && query.length >= 2) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || `Search any product in ${city}...`}
          className="flex-1 border-none bg-transparent px-5 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(""); setOpen(false); }} className="mr-1 p-1.5 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className="m-1.5 flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark"
        >
          <Search className="h-4 w-4" /> Search
        </button>
      </form>

      {open && (
        <ul
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-border bg-card shadow-lg"
          role="listbox"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.type}-${s.label}`}
              role="option"
              aria-selected={i === activeIdx}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => goTo(s)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                i === activeIdx ? "bg-accent" : "hover:bg-accent/50"
              }`}
            >
              <span className="notranslate text-base">{typeIcon(s.type)}</span>
              <div className="min-w-0 flex-1">
                <p className="notranslate truncate font-medium text-foreground">
                  {highlightMatch(s.label, debouncedQuery)}
                </p>
                {s.subLabel && (
                  <p className="notranslate truncate text-xs text-muted-foreground">{s.subLabel}</p>
                )}
              </div>
              <span className="shrink-0 rounded-pill bg-muted px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
                {s.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchAutoSuggest;
