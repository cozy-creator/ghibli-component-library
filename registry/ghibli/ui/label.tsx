import * as React from "react";

import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium text-[color:var(--ink-strong)]",
        className
      )}
      data-slot="label"
      {...props}
    />
  );
}
