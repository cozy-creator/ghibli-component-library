import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn, focusRingClass } from "../lib/utils";

export function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer size-5 shrink-0 rounded-[0.4rem] border border-[color:var(--border-strong)] bg-[color:var(--card)] shadow-[var(--shadow-inset)] transition-colors",
        "data-[state=checked]:border-[color:var(--primary-edge)] data-[state=checked]:bg-[color:var(--primary)] data-[state=checked]:text-[color:var(--primary-foreground)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        focusRingClass,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <CheckIcon className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
