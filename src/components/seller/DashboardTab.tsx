import React from "react";
import { Package, Eye, MessageCircle, Bell, MessageSquare, TrendingUp, Award, CheckCircle, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import TrustScoreCard from "@/components/seller/TrustScoreCard";

interface Props {
  whatsappSetup: boolean;
  setWhatsappSetup: (v: boolean) => void;
}

const stats = [
  { icon: Package, label: "Products", value: "47", trend: "+3", trendUp: true },
  { icon: Eye, label: "Views", value: "1,243", trend: "+12%", trendUp: true },
  { icon: MessageCircle, label: "Enquiries", value: "18", trend: "+5", trendUp: true },
  { icon: Bell, label: "Price Alerts", value: "3", trend: "−1", trendUp: false },
];

const activities = [
  {
    icon: TrendingUp,
    text: "Adjust Samsung TV by ₹500 to become #1!",
    action: "View Opportunity",
    accent: "text-bh-orange",
  },
  {
    icon: MessageSquare,
    text: "New buyer WhatsApp inquiry for LG Fridge!",
    action: "View",
    accent: "text-bh-green",
  },
  {
    icon: Award,
    text: "Voltas AC is the best price in Madurai today!",
    action: "Share",
    accent: "text-bh-orange",
  },
];

const DashboardTab: React.FC<Props> = ({ whatsappSetup, setWhatsappSetup }) => (
  <div className="space-y-6">
    {/* Stat Cards — DM Mono numbers, uppercase labels */}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map(({ icon: Icon, label, value, trend, trendUp }) => (
        <div
          key={label}
          className="bg-white rounded-2xl border border-bh-border p-5 shadow-bh-sm hover:shadow-bh transition-all duration-200 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-bh-orange-light text-bh-orange flex items-center justify-center">
              <Icon className="h-5 w-5" />
            </div>
            <span
              className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                trendUp ? "text-bh-green" : "text-red-500"
              }`}
            >
              <ArrowUp className={`h-3 w-3 ${trendUp ? "" : "rotate-180"}`} />
              {trend}
            </span>
          </div>
          <p className="font-mono text-3xl font-medium text-bh-text notranslate price-animate">{value}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-bh-text-muted">{label}</p>
        </div>
      ))}
    </div>

    {/* AI Trust Score */}
    <TrustScoreCard />

    {/* WhatsApp Setup */}
    {!whatsappSetup && (
      <div className="rounded-2xl border border-bh-green/30 bg-bh-green-light/50 p-5">
        <h3 className="mb-3 text-base font-display font-bold text-bh-text flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-bh-green" />
          FREE Daily Price Reports on WhatsApp!
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bh-green text-xs font-bold text-white">1</span>
            <span className="text-sm text-bh-text">
              Save Bazaar Hub Number: <strong className="font-mono notranslate">+91 9943440384</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bh-green text-xs font-bold text-white">2</span>
            <a
              href="https://wa.me/919943440384?text=Hi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-[#25D366] hover:bg-[#1DA851] px-4 py-1.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(37,211,102,0.25)] transition-all duration-200 hover:scale-[1.02]"
            >
              Send Hi on WhatsApp
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bh-green text-xs font-bold text-white">3</span>
            <Button size="sm" variant="outline" onClick={() => setWhatsappSetup(true)}>
              Mark as Done
            </Button>
          </div>
        </div>
      </div>
    )}
    {whatsappSetup && (
      <div className="flex items-center gap-2 rounded-2xl bg-bh-green-light p-3 text-sm font-medium text-bh-green-dark border border-bh-green/20">
        <CheckCircle className="h-5 w-5" /> WhatsApp reports enabled!
      </div>
    )}

    {/* Recent Activity */}
    <div className="rounded-2xl border border-bh-border bg-white shadow-bh-sm overflow-hidden">
      <div className="border-b border-bh-border px-5 py-3 flex items-baseline justify-between">
        <h3 className="text-sm font-display font-bold text-bh-text">Recent Activity</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-bh-text-muted">Last 24h</span>
      </div>
      <div className="divide-y divide-bh-border">
        {activities.map((a, i) => (
          <div key={i} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-bh-surface-2 transition-colors duration-150">
            <div className="flex items-center gap-3">
              <a.icon className={`h-5 w-5 ${a.accent}`} />
              <span className="text-sm text-bh-text">{a.text}</span>
            </div>
            <button className="text-xs font-semibold text-bh-orange hover:underline">
              {a.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardTab;
