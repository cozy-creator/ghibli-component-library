import * as React from "react";

import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse border border-[color:var(--theme-skeleton-border)] [background:var(--theme-skeleton-background)]",
        className,
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}
