import * as React from "react";

import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse border border-[color:var(--border-soft)] bg-[linear-gradient(110deg,rgba(255,255,255,0.32),rgba(250,236,232,0.95),rgba(255,255,255,0.32))]",
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}
