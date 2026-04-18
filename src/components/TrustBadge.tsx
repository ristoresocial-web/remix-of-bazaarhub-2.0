import React from "react";
import { cn } from "@/lib/utils";

type TrustVariant = "new" | "established" | "trusted" | "under-review";

const variantStyles: Record<TrustVariant, string> = {
  new: "bg-bh-orange-light text-bh-orange-dark border border-bh-orange/20",
  established: "bg-bh-blue-light text-bh-blue border border-bh-blue/20",
  trusted: "bg-bh-green-light text-bh-green-dark border border-bh-green/20",
  "under-review": "bg-bh-surface-2 text-bh-text-secondary border border-bh-border",
};

const variantLabels: Record<TrustVariant, string> = {
  new: "New",
  established: "Established",
  trusted: "Trusted ✓",
  "under-review": "Under Review",
};

interface TrustBadgeProps {
  variant: TrustVariant;
  label?: string;
  className?: string;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ variant, label, className }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold transition-all",
      variantStyles[variant],
      className
    )}
  >
    {label || variantLabels[variant]}
  </span>
);

export default TrustBadge;
export type { TrustVariant };
