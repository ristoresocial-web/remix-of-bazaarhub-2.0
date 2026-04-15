import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { formatPrice } from "@/lib/cityUtils";

interface PriceHistoryChartProps {
  amazonPrices: number[];
  flipkartPrices: number[];
  localPrice: number;
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ amazonPrices, flipkartPrices, localPrice }) => {
  const data = amazonPrices.map((_, i) => ({
    day: `Day ${i + 1}`,
    Amazon: Math.round(amazonPrices[i]),
    Flipkart: Math.round(flipkartPrices[i]),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: number) => formatPrice(value)}
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <ReferenceLine
            y={localPrice}
            stroke="hsl(var(--success))"
            strokeDasharray="6 4"
            strokeWidth={2}
            label={{ value: `City Partner ₹${(localPrice / 1000).toFixed(1)}k`, position: "right", fontSize: 10, fill: "hsl(var(--success))" }}
          />
          <Line type="monotone" dataKey="Amazon" stroke="#3B82F6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Flipkart" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceHistoryChart;
