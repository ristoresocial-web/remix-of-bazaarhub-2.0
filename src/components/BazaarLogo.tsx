import React from "react";

const BazaarLogo: React.FC<{ className?: string; showTagline?: boolean }> = ({ 
  className, 
  showTagline = false 
}) => (
  <div className={`select-none ${className || ""}`}>
    <span className="bazaar-logo-text">
      <span className="bazaar-logo-navy">Bazaar</span>
      <span className="bazaar-logo-orange">Hub</span>
    </span>
    {showTagline && (
      <p className="mt-1 text-[11px] font-semibold tracking-wide text-foreground/70 uppercase">
        Empowering Your Market Choices
      </p>
    )}
  </div>
);

export default BazaarLogo;
