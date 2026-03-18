import * as React from "react";

import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[calc(var(--radius)-0.4rem)] bg-[linear-gradient(90deg,rgba(187,165,133,0.18),rgba(255,255,255,0.5),rgba(187,165,133,0.18))] bg-[length:200%_100%]",
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}
