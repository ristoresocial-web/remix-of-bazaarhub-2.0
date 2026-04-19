import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TrendingItem {
  query: string;
  count: number;
}

interface TrendingSectionProps {
  city: string;
}

const MOCK_TRENDING: TrendingItem[] = [
  { query: "Samsung Galaxy S24 Ultra", count: 342 },
  { query: "iPhone 15 Pro Max", count: 289 },
  { query: "Sony WH-1000XM5", count: 234 },
  { query: "MacBook Air M3", count: 198 },
  { query: "LG OLED C3 TV", count: 176 },
  { query: "Samsung Galaxy Buds2 Pro", count: 156 },
  { query: "OnePlus 12", count: 143 },
  { query: "Redmi Note 13 Pro", count: 128 },
];

const MOCK_COMPARED: { pair: string; count: number }[] = [
  { pair: "Samsung S24 Ultra vs iPhone 15 Pro Max", count: 89 },
  { pair: "MacBook Air M3 vs Dell XPS 15", count: 67 },
  { pair: "Sony WH-1000XM5 vs AirPods Max", count: 54 },
];

const TrendingSection: React.FC<TrendingSectionProps> = ({ city }) => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState<TrendingItem[]>(MOCK_TRENDING);
  const [compared] = useState(MOCK_COMPARED);

  useEffect(() => {
    // Fetch aggregated trending searches via secure RPC (no user_id leak)
    const fetchTrending = async () => {
      try {
        const { data } = await supabase.rpc("get_trending_searches", {
          p_city: city,
          p_days: 7,
        });

        if (data && data.length > 5) {
          setTrending(
            data.map((row: { query: string; count: number }) => ({
              query: row.query,
              count: Number(row.count),
            }))
          );
        }
      } catch {
        // Use mock data fallback
      }
    };
    fetchTrending();
  }, [city]);

  const handleClick = async (query: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    supabase.from("search_logs").insert({
      search_query: query,
      city,
      user_id: user?.id ?? null,
    }).then(() => {});
    navigate(`/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`);
  };

  return (
    <section className="container py-10 space-y-8">
      {/* Trending */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
          <Flame className="h-5 w-5 text-destructive" />
          Trending in {city} Today
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {trending.map((item, i) => (
            <motion.button
              key={item.query}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleClick(item.query)}
              className="snap-start shrink-0 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-foreground hover:bg-primary/10 hover:border-primary/40 transition-all"
            >
              <Flame className="h-3.5 w-3.5 text-destructive" />
              <span className="text-xs font-bold text-primary">{item.count}</span>
              <span className="whitespace-nowrap">·</span>
              <span className="whitespace-nowrap">{item.query}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Most Compared */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
          <TrendingUp className="h-5 w-5 text-primary" />
          Most Compared Today
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {compared.map((item, i) => (
            <motion.button
              key={item.pair}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/product/compare`)}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 text-left shadow-sm hover:shadow-card transition-all"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{item.pair}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  🔥 {item.count} comparisons today
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
