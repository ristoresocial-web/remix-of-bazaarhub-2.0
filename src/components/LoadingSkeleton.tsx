import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-card bg-muted", className)} {...props} />;
}

const ProductCardSkeleton: React.FC = () => (
  <div className="rounded-card border border-border bg-card p-4 shadow-card">
    <Skeleton className="mb-3 aspect-square w-full" />
    <Skeleton className="mb-2 h-4 w-3/4" />
    <Skeleton className="mb-2 h-3 w-1/2" />
    <Skeleton className="h-6 w-1/3" />
  </div>
);

export { Skeleton, ProductCardSkeleton };
