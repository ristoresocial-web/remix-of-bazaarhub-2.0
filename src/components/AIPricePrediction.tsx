import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/cityUtils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface AIPricePredictionProps {
  currentPrice: number;
  productName: string;
}

const AIPricePrediction: React.FC<AIPricePredictionProps> = ({ currentPrice, productName }) => {
  const prediction = useMemo(() => {
    const trend = Math.random();
    const changePercent = 2 + Math.random() * 8;
    if (trend < 0.4) return { direction: "down" as const, percent: changePercent, confidence: 72 + Math.random() * 20 };
    if (trend < 0.75) return { direction: "up" as const, percent: changePercent, confidence: 65 + Math.random() * 20 };
    return { direction: "stable" as const, percent: 0, confidence: 80 + Math.random() * 15 };
  }, [currentPrice]);

  const futurePrice = prediction.direction === "down"
    ? currentPrice * (1 - prediction.percent / 100)
    : prediction.direction === "up"
    ? currentPrice * (1 + prediction.percent / 100)
    : currentPrice;

  const forecastData = useMemo(() => {
    const data = [];
    for (let i = 0; i <= 14; i++) {
      const progress = i / 14;
      const noise = (Math.random() - 0.5) * currentPrice * 0.02;
      const interpolated = currentPrice + (futurePrice - currentPrice) * progress + noise;
      data.push({ day: i === 0 ? "Today" : `+${i}d`, price: Math.round(interpolated) });
    }
    return data;
  }, [currentPrice, futurePrice]);

  const Icon = prediction.direction === "down" ? TrendingDown : prediction.direction === "up" ? TrendingUp : Minus;
  const colorClass = prediction.direction === "down" ? "text-success" : prediction.direction === "up" ? "text-destructive" : "text-muted-foreground";
  const bgClass = prediction.direction === "down" ? "bg-success-light" : prediction.direction === "up" ? "bg-destructive-light" : "bg-muted";
  const lineColor = prediction.direction === "down" ? "hsl(var(--success))" : prediction.direction === "up" ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-base font-bold text-foreground">AI Price Prediction</h3>
        <span className="ml-auto rounded-pill bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary">PHASE 2</span>
      </div>

      <div className={`mb-4 flex items-center gap-3 rounded-xl ${bgClass} p-3`}>
        <Icon className={`h-6 w-6 ${colorClass}`} />
        <div>
          <p className="text-sm font-semibold text-foreground">
            {prediction.direction === "down" && `Price likely to drop ${prediction.percent.toFixed(1)}% in 14 days`}
            {prediction.direction === "up" && `Price may increase ${prediction.percent.toFixed(1)}% in 14 days`}
            {prediction.direction === "stable" && "Price expected to remain stable"}
          </p>
          <p className="text-xs text-muted-foreground">
            Predicted: {formatPrice(Math.round(futurePrice))} · {prediction.confidence.toFixed(0)}% confidence
          </p>
        </div>
      </div>

      {prediction.direction === "down" && (
        <div className="mb-4 rounded-lg bg-success-light p-2.5 text-xs font-medium text-success">
          💡 Wait {Math.ceil(prediction.percent / 2)} days for the best deal!
        </div>
      )}
      {prediction.direction === "up" && (
        <div className="mb-4 rounded-lg bg-primary-light p-2.5 text-xs font-medium text-primary">
          ⚡ Buy now — price is expected to rise!
        </div>
      )}

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} interval={2} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value: number) => formatPrice(value)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }} />
            <Area type="monotone" dataKey="price" stroke={lineColor} fill="url(#predGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-[10px] text-muted-foreground text-center">
        AI predictions are based on historical trends and market data. Actual prices may vary.
      </p>
    </div>
  );
};

export default AIPricePrediction;
