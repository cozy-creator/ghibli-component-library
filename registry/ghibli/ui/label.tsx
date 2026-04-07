import * as React from "react";

import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 text-sm font-medium leading-none text-[color:var(--ink-strong)] select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      data-slot="label"
      {...props}
    />
  );
}
