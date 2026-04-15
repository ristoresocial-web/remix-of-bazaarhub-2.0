import React, { useState } from "react";
import { Ticket, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromoCodeTab: React.FC = () => {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    if (code.trim()) setApplied(true);
  };

  return (
    <div className="max-w-md space-y-6">
      <h2 className="text-lg font-bold text-foreground">Promo Code</h2>

      <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Enter Promo Code</span>
        </div>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value); setApplied(false); }}
            placeholder="BAZAAR2025"
            className="flex-1 rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button size="sm" onClick={handleApply}>Apply</Button>
        </div>
        {applied && (
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle className="h-4 w-4" /> Code applied!
          </div>
        )}
      </div>

      <div className="rounded-card bg-success-light p-4">
        <p className="text-sm font-semibold text-foreground">Subscription: FREE — Launch Phase 🎉</p>
        <p className="text-xs text-muted-foreground mt-1">All features are free during our launch. No credit card required.</p>
      </div>
    </div>
  );
};

export default PromoCodeTab;
