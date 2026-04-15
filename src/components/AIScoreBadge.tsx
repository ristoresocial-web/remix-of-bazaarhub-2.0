import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";

interface AIScoreBadgeProps {
  productName: string;
  category?: string;
  price?: number;
  city: string;
  specs?: string;
  localSellersCount?: number;
  lowestLocalPrice?: number;
  onlineLowestPrice?: number;
  compact?: boolean;
}

interface ScoreData {
  score: number;
  reasons: string[];
  verdict: string;
}

const AIScoreBadge: React.FC<AIScoreBadgeProps> = ({
  productName,
  category,
  price,
  city,
  specs,
  localSellersCount,
  lowestLocalPrice,
  onlineLowestPrice,
  compact = false,
}) => {
  const [data, setData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(!compact);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const { data: result, error } = await supabase.functions.invoke("ai-product-score", {
          body: {
            product_name: productName,
            category,
            price,
            specs,
            city,
            local_sellers_count: localSellersCount,
            lowest_local_price: lowestLocalPrice,
            online_lowest_price: onlineLowestPrice,
          },
        });
        if (!error && result && !result.error) {
          setData({ score: result.score, reasons: result.reasons, verdict: result.verdict });
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, [productName, city]);

  // Count-up animation
  useEffect(() => {
    if (!data || !isInView) return;
    const target = data.score;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayScore(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [data, isInView]);

  const scoreColor = (score: number) => {
    if (score >= 80) return "from-[hsl(var(--success))] to-primary";
    if (score >= 60) return "from-primary to-[hsl(var(--warning))]";
    return "from-[hsl(var(--warning))] to-destructive";
  };

  if (loading) {
    return (
      <div ref={ref} className="flex flex-col items-center gap-1">
        <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
        <span className="text-xs italic text-primary">Analyzing...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      {/* Score Circle */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.05 }}
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${scoreColor(data.score)} shadow-lg ring-[3px] ring-white ${
          compact ? "h-12 w-12" : "h-16 w-16"
        }`}
        style={{ boxShadow: "0 0 20px rgba(142, 36, 170, 0.3)" }}
      >
        <div className="text-center">
          <span className={`font-bold text-white ${compact ? "text-lg" : "text-2xl"}`}>
            {isInView ? displayScore : 0}
          </span>
          {!compact && (
            <p className="text-[8px] text-white/80 leading-tight">BazaarHub<br />Score</p>
          )}
        </div>
      </motion.button>

      {/* Expandable Reasons */}
      {expanded && data.reasons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="w-full space-y-1"
        >
          {data.reasons.slice(0, 3).map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-1.5 text-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--success))] mt-0.5" />
              <span className="text-foreground">{reason}</span>
            </motion.div>
          ))}
          {data.verdict && (
            <p className="text-[10px] italic text-muted-foreground mt-1">
              "{data.verdict}"
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AIScoreBadge;
