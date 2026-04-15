import React from "react";
import { cn } from "@/lib/utils";

type TrustVariant = "new" | "established" | "trusted" | "under-review";

const variantStyles: Record<TrustVariant, string> = {
  new: "border border-primary text-primary bg-transparent",
  established: "bg-accent text-accent-foreground",
  trusted: "bg-success/15 text-success",
  "under-review": "border border-warning text-warning bg-transparent",
};

const variantLabels: Record<TrustVariant, string> = {
  new: "New",
  established: "Established",
  trusted: "Trusted",
  "under-review": "Under Review",
};

interface TrustBadgeProps {
  variant: TrustVariant;
  label?: string;
  className?: string;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ variant, label, className }) => (
  <span className={cn("inline-flex items-center rounded-pill px-2 py-0.5 text-xs font-semibold", variantStyles[variant], className)}>
    {label || variantLabels[variant]}
  </span>
);

export default TrustBadge;
export type { TrustVariant };
