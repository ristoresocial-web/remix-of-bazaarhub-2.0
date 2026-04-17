import React, { useEffect, useState } from "react";
import { Sparkles, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface TrustData {
  seller_score: number;
  breakdown: { completeness: number; doc_score: number; listing_score: number };
  review_prompt_en: string;
  review_prompt_ta: string;
}

const TrustScoreCard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<TrustData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchScore = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("ai-trust-score", {
        body: { seller_id: user.id },
      });
      if (error) throw error;
      if ((res as any)?.error) {
        toast.error((res as any).error);
        return;
      }
      setData(res as TrustData);
    } catch (e: any) {
      toast.error(e?.message || "Couldn't load trust score");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const tier =
    !data ? "" : data.seller_score >= 80 ? "Trusted" : data.seller_score >= 60 ? "Established" : "Building";
  const tierColor =
    data && data.seller_score >= 80
      ? "text-success"
      : data && data.seller_score >= 60
      ? "text-primary"
      : "text-warning";

  return (
    <div className="rounded-card border border-border bg-card p-5 shadow-card border-t-4 border-t-primary">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> AI Trust Score
        </h3>
        <Button size="sm" variant="ghost" onClick={fetchScore} disabled={loading} className="h-7 px-2 gap-1">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "" : "Refresh"}
        </Button>
      </div>

      {data ? (
        <>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-foreground">{data.seller_score}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
            <span className={`ml-auto text-xs font-bold ${tierColor}`}>{tier}</span>
          </div>
          <Progress value={data.seller_score} className="h-2 mb-4" />

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profile completeness</span>
              <span className="font-semibold text-foreground">{data.breakdown.completeness}/40</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document verification</span>
              <span className="font-semibold text-foreground">{data.breakdown.doc_score}/30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Listing quality</span>
              <span className="font-semibold text-foreground">{data.breakdown.listing_score}/30</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border space-y-1.5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
              <Star className="h-3 w-3" /> AI Review Request
            </p>
            <p className="text-xs text-foreground">{data.review_prompt_en}</p>
            <p className="text-xs text-foreground">{data.review_prompt_ta}</p>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center">{loading ? "Calculating..." : "Tap Refresh to load"}</p>
      )}
    </div>
  );
};

export default TrustScoreCard;
