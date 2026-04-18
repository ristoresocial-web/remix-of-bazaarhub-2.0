import React from "react";
import { cn } from "@/lib/utils";

type StatusVariant = "live" | "pending" | "draft" | "review" | "getting-ready" | "paused";

const variantStyles: Record<StatusVariant, string> = {
  live: "bg-bh-green-light text-bh-green-dark border border-bh-green/20",
  pending: "bg-[hsl(48_96%_89%)] text-[hsl(35_85%_30%)] border border-warning/20",
  draft: "bg-bh-surface-2 text-bh-text-secondary border border-bh-border",
  review: "bg-bh-orange-light text-bh-orange-dark border border-bh-orange/20",
  "getting-ready": "bg-bh-blue-light text-bh-blue border border-bh-blue/20",
  paused: "bg-bh-surface-2 text-bh-text-muted border border-bh-border",
};

const variantLabels: Record<StatusVariant, string> = {
  live: "● Live",
  pending: "◐ Pending",
  draft: "○ Draft",
  review: "◌ Under Review",
  "getting-ready": "◐ Getting Ready",
  paused: "○ Paused",
};

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, label, className }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-all",
      variantStyles[variant],
      className
    )}
  >
    {label || variantLabels[variant]}
  </span>
);

export default StatusBadge;
export type { StatusVariant };
