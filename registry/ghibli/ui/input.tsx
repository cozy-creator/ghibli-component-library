import * as React from "react";

import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { cn, paperFieldClass } from "@/lib/utils";

export function Input({
  className,
  disabled = false,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <HandDrawnFrame
      className={cn("ghibli-input-frame w-full", disabled && "opacity-60")}
      contentClassName="theme-field-frame-content"
      surfaceClassName="theme-field-frame-surface bg-[color:var(--theme-field-background)]"
      strokeColor="var(--theme-field-border)"
      strokeWidthRange={[1.25, 1.25]}
      svgClassName="opacity-85"
      crookedness={0.3}
    >
      <input
        className={cn(
          paperFieldClass,
          "ghibli-input-control min-w-0 border-0 bg-transparent focus:border-transparent focus-visible:border-transparent",
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
