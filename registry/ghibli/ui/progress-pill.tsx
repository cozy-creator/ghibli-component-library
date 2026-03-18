import * as React from "react";

import { cn } from "../lib/utils";

export interface ProgressPillProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export function ProgressPill({
  className,
  value,
  ...props
}: ProgressPillProps) {
  const boundedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <div className="h-4 overflow-hidden rounded-full border border-[color:var(--border-strong)] bg-[color:var(--paper)] p-1 shadow-[var(--shadow-inset)]">
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={boundedValue}
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--sky))] shadow-[var(--shadow-button)] transition-[width]"
          role="progressbar"
          style={{ width: `${boundedValue}%` }}
        />
      </div>
      <span className="text-sm text-[color:var(--muted-foreground)]">{boundedValue}% complete</span>
    </div>
  );
}
