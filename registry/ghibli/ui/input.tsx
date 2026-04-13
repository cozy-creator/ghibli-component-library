import * as React from "react";

import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { cn } from "@/lib/utils";

export function Input({
  className,
  disabled = false,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <HandDrawnFrame
      className={cn(
        "ghibli-input-frame w-full bg-[color:color-mix(in_oklab,var(--paper-soft)_90%,white)]",
        disabled && "opacity-60"
      )}
      deformationIntensity={0.3}
      shape="banner"
      strokeColor="var(--border)"
      strokeWidth={1.25}
      svgClassName="opacity-85"
    >
      <input
        className={cn(
          "ghibli-input-control w-full min-w-0 border-0 bg-transparent",
          "focus:outline-none focus-visible:outline-none",
          "file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className
        )}
        data-slot="input"
        disabled={disabled}
        type={type}
        {...props}
      />
    </HandDrawnFrame>
  );
}
