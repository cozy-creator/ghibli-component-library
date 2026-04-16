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
      className={cn("ghibli-input-frame w-full", disabled && "opacity-60")}
      surfaceClassName="bg-[color:color-mix(in_oklab,var(--paper-soft)_90%,white)]"
      strokeColor="var(--border)"
      strokeWidth={1.25}
      svgClassName="opacity-85"
      crookednessIntensity={0.3}
    >
      <input
        className={cn(
          "ghibli-input-control h-11 w-full min-w-0 border-0 bg-transparent px-3 py-2 text-sm text-[color:var(--foreground)] outline-none",
          "placeholder:text-[color:var(--muted-foreground)] disabled:cursor-not-allowed",
          "focus:outline-none focus-visible:outline-none",
          "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className,
        )}
        data-slot="input"
        disabled={disabled}
        type={type}
        {...props}
      />
    </HandDrawnFrame>
  );
}
