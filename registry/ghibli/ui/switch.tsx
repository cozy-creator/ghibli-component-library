import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn, focusRingClass } from "../lib/utils";

export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent bg-[color:var(--muted)] p-0.5 shadow-[var(--shadow-inset)] transition-colors",
        "data-[state=checked]:bg-[color:var(--primary)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        focusRingClass,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block size-5 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--paper)] shadow-[var(--shadow-button)] transition-transform",
          "data-[state=checked]:translate-x-5"
        )}
      />
    </SwitchPrimitive.Root>
  );
}
