import React from "react";
import { cn } from "@/lib/utils";

type StatusVariant = "live" | "pending" | "draft" | "review" | "getting-ready" | "paused";

const variantStyles: Record<StatusVariant, string> = {
  live: "bg-success/15 text-success",
  pending: "bg-primary/15 text-primary",
  draft: "bg-muted text-muted-foreground",
  review: "border border-primary text-primary bg-transparent",
  "getting-ready": "bg-primary/15 text-primary",
  paused: "bg-muted text-muted-foreground",
};

const variantLabels: Record<StatusVariant, string> = {
  live: "Live",
  pending: "Pending",
  draft: "Draft",
  review: "Under Review",
  "getting-ready": "Getting Ready",
  paused: "Paused",
};

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, label, className }) => (
  <span className={cn("inline-flex items-center rounded-pill px-2 py-0.5 text-xs font-semibold", variantStyles[variant], className)}>
    {label || variantLabels[variant]}
  </span>
);

export default StatusBadge;
export type { StatusVariant };
