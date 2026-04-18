import React from "react";

const BazaarLogo: React.FC<{ className?: string; showTagline?: boolean }> = ({
  className,
  showTagline = false,
}) => (
  <div className={`select-none ${className || ""}`}>
    <div className="font-display flex items-baseline leading-none tracking-tight" style={{ fontWeight: 800, fontSize: "1.5rem" }}>
      <span className="text-bh-orange">Bazaar</span>
      <span className="text-bh-green">Hub</span>
    </div>
    {showTagline && (
      <p className="mt-1 text-[10px] font-bold tracking-[0.15em] text-bh-text-muted uppercase">
        Empowering Your Market Choices
      </p>
    )}
  </div>
);

export default BazaarLogo;
