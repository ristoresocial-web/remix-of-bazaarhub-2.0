import React from "react";
import { Package, Eye, MessageCircle, Bell, MessageSquare, TrendingUp, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TrustScoreCard from "@/components/seller/TrustScoreCard";

interface Props {
  whatsappSetup: boolean;
  setWhatsappSetup: (v: boolean) => void;
}

const stats = [
  { icon: Package, label: "Products", value: "47", color: "border-t-primary" },
  { icon: Eye, label: "Views", value: "1,243", color: "border-t-primary" },
  { icon: MessageCircle, label: "Enquiries", value: "18", color: "border-t-primary" },
  { icon: Bell, label: "Price Alerts", value: "3", color: "border-t-primary" },
];

const activities = [
  {
    icon: TrendingUp,
    text: "Adjust Samsung TV by ₹500 to become #1!",
    action: "View Opportunity",
    color: "text-primary",
  },
  {
    icon: MessageSquare,
    text: "New buyer WhatsApp inquiry for LG Fridge!",
    action: "View",
    color: "text-success",
  },
  {
    icon: Award,
    text: "Voltas AC is the best price in Madurai today!",
    action: "Share",
    color: "text-primary",
  },
];

const DashboardTab: React.FC<Props> = ({ whatsappSetup, setWhatsappSetup }) => (
  <div className="space-y-6">
    {/* Stat Cards */}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className={`rounded-card border border-border bg-card p-4 shadow-card border-t-4 ${color}`}>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
        </div>
      ))}
    </div>

    {/* AI Trust Score */}
    <TrustScoreCard />

    {/* WhatsApp Setup */}
    {!whatsappSetup && (
      <div className="rounded-card border border-success/30 bg-success-light p-5">
        <h3 className="mb-3 text-base font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-success" />
          FREE Daily Price Reports on WhatsApp!
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success text-xs font-bold text-success-foreground">1</span>
            <span className="text-sm text-foreground">Save Bazaar Hub Number: <strong>+91 9943440384</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success text-xs font-bold text-success-foreground">2</span>
            <a
              href="https://wa.me/919943440384?text=Hi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-pill bg-success px-4 py-1.5 text-sm font-semibold text-success-foreground transition-all duration-200 hover:bg-success/90"
            >
              Send Hi on WhatsApp
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success text-xs font-bold text-success-foreground">3</span>
            <Button size="sm" variant="outline" onClick={() => setWhatsappSetup(true)}>
              Mark as Done
            </Button>
          </div>
        </div>
      </div>
    )}
    {whatsappSetup && (
      <div className="flex items-center gap-2 rounded-card bg-success-light p-3 text-sm font-medium text-success">
        <CheckCircle className="h-5 w-5" /> WhatsApp reports enabled!
      </div>
    )}

    {/* Recent Activity */}
    <div className="rounded-card border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-bold text-foreground">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {activities.map((a, i) => (
          <div key={i} className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="flex items-center gap-3">
              <a.icon className={`h-5 w-5 ${a.color}`} />
              <span className="text-sm text-foreground">{a.text}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              {a.action}
            </Button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardTab;
