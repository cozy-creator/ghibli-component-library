import * as React from "react";

import { cn } from "@/lib/utils";

export function Separator({
  className,
  decorative = true,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & {
  decorative?: boolean;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      aria-hidden={decorative}
      className={cn(
        "shrink-0 bg-[color:var(--border)] data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        className
      )}
      data-orientation={orientation}
      data-slot="separator"
      {...props}
    />
  );
}
