import React from "react";
import bazaarLogo from "@/assets/bazaarhub-logo.png";

const BazaarLogo: React.FC<{ className?: string; showTagline?: boolean }> = ({ 
  className, 
  showTagline = false 
}) => (
  <div className={`select-none ${className || ""}`}>
    <img 
      src={bazaarLogo} 
      alt="Bazaar Hub" 
      className="h-8 w-auto object-contain"
    />
    {showTagline && (
      <p className="mt-1 text-[11px] font-semibold tracking-wide text-foreground/70 uppercase">
        Empowering Your Market Choices
      </p>
    )}
  </div>
);

export default BazaarLogo;
