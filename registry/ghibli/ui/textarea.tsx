import * as React from "react";

import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <HandDrawnFrame
      className="w-full"
      surfaceClassName="bg-[color:color-mix(in_oklab,var(--paper-soft)_90%,white)]"
      strokeColor="var(--border)"
      strokeWidthRange={[1.25, 1.25]}
      svgClassName="opacity-85"
      crookedness={0.3}
    >
      <textarea
        className={cn(
          "min-h-28 w-full resize-y border-0 bg-transparent px-3 py-3 text-sm text-[color:var(--foreground)] outline-none",
          "placeholder:text-[color:var(--muted-foreground)]",
          "focus:outline-none focus-visible:outline-none",
          className,
        )}
        data-slot="textarea"
        {...props}
      />
    </HandDrawnFrame>
  );
}
