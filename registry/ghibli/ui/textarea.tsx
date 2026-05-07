import * as React from "react";

import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { cn, fieldFocusClass } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <HandDrawnFrame
      className="w-full"
      surfaceClassName="bg-[color:var(--theme-field-background)]"
      strokeColor="var(--theme-field-border)"
      strokeWidth={1.25}
      svgClassName="opacity-85"
      crookednessIntensity={0.3}
    >
      <textarea
        className={cn(
          "min-h-28 w-full resize-y border-0 bg-transparent px-3 py-3 text-sm text-[color:var(--theme-field-foreground)] outline-none",
          "placeholder:text-[color:var(--theme-field-placeholder)] disabled:cursor-not-allowed",
          "focus:outline-none focus-visible:outline-none",
          fieldFocusClass,
          className,
        )}
        data-slot="textarea"
        {...props}
      />
    </HandDrawnFrame>
  );
}
