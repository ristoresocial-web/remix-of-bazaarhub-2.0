import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MODEL_DATABASE, ModelSpec, CompareCategory } from "@/data/compareModels";

interface Props {
  category: CompareCategory;
  selectedIds: string[];
  onSelect: (model: ModelSpec) => void;
  placeholder?: string;
  label?: string;
}

const ModelSearchBox: React.FC<Props> = ({ category, selectedIds, onSelect, placeholder, label }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];
    return MODEL_DATABASE
      .filter((m) => m.category === category)
      .filter((m) => m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, category]);

  const handleSelect = useCallback((m: ModelSpec) => {
    onSelect(m);
    setQuery("");
    setOpen(false);
  }, [onSelect]);

  const highlight = (text: string) => {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-primary/20 text-foreground rounded-sm">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div ref={ref} className="relative">
      {label && <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{label}</p>}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder || `Search ${category}…`}
          className="pl-9"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {open && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
          {suggestions.length > 0 ? (
            suggestions.map((m) => {
              const alreadySelected = selectedIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => !alreadySelected && handleSelect(m)}
                  disabled={alreadySelected}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent ${alreadySelected ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <img src={m.image} alt={m.name} className="h-10 w-10 rounded-lg object-contain bg-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{highlight(m.name)}</p>
                    <p className="text-xs text-muted-foreground">{highlight(m.brand)} · ₹{m.lowestPrice.toLocaleString("en-IN")}</p>
                  </div>
                  {!alreadySelected && <Plus className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm font-medium text-foreground">No models found</p>
              <p className="mt-1 text-xs text-muted-foreground">Try a different brand or model name</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSearchBox;
