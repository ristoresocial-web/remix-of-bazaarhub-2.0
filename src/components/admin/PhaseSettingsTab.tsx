import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, CheckCircle, ArrowRight } from "lucide-react";

const phases = [
  {
    num: 1, label: "Phase 1 — Launch",
    features: ["Manual seller approval", "Basic price comparison", "WhatsApp integration", "City-aware platforms", "Affiliate links"],
  },
  {
    num: 2, label: "Phase 2 — Growth",
    features: ["Auto-approval for established sellers", "AI price predictions", "Buyer accounts", "Review system", "Push notifications"],
  },
  {
    num: 3, label: "Phase 3 — Scale",
    features: ["Full automation", "Multi-language AI chatbot", "Logistics integration", "Seller analytics API", "Premium subscriptions"],
  },
];

const PhaseSettingsTab: React.FC = () => {
  const [current, setCurrent] = useState(2);
  const [confirming, setConfirming] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Phase Settings</h2>
      </div>

      <div className="space-y-4">
        {phases.map((p) => {
          const isCurrent = p.num === current;
          const isDone = p.num < current;
          const isNext = p.num === current + 1;
          return (
            <div key={p.num} className={`rounded-card border-2 p-5 shadow-card transition-all duration-200 ${
              isCurrent ? "border-primary bg-primary-light" : isDone ? "border-success bg-success-light" : "border-border bg-card"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isDone && <CheckCircle className="h-5 w-5 text-success" />}
                  <h3 className={`font-bold ${isCurrent ? "text-primary" : isDone ? "text-success" : "text-foreground"}`}>
                    {p.label}
                  </h3>
                  {isCurrent && <span className="rounded-pill bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">CURRENT</span>}
                </div>
                {isNext && confirming !== p.num && (
                  <Button size="sm" onClick={() => setConfirming(p.num)}>
                    Upgrade <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                )}
                {confirming === p.num && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground font-medium">Confirm upgrade?</span>
                    <Button size="sm" onClick={() => { setCurrent(p.num); setConfirming(null); }}>Yes</Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirming(null)}>Cancel</Button>
                  </div>
                )}
              </div>
              <ul className="space-y-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <span className={`h-1.5 w-1.5 rounded-full ${isCurrent ? "bg-primary" : isDone ? "bg-success" : "bg-muted-foreground"}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseSettingsTab;
