import React from "react";

const AffiliateDisclaimer: React.FC = () => (
  <p className="text-xs text-muted-foreground">
    Online prices via affiliate APIs — last updated {new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}. May vary.
  </p>
);

export default AffiliateDisclaimer;
