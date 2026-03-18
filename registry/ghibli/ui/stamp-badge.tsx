import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, toneClasses } from "../lib/utils";

const stampBadgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-[var(--shadow-button)]",
  {
    variants: {
      tone: toneClasses
    },
    defaultVariants: {
      tone: "paper"
    }
  }
);

export interface StampBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stampBadgeVariants> {
  stamp?: string;
}

export function StampBadge({
  children,
  className,
  stamp = "Ghibli",
  tone,
  ...props
}: StampBadgeProps) {
  return (
    <div className={cn(stampBadgeVariants({ className, tone }))} {...props}>
      <span className="grid size-8 place-items-center rounded-full border border-current/35 bg-white/45 font-[var(--font-heading)] text-xs tracking-[0.18em] uppercase">
        {stamp}
      </span>
      <span>{children}</span>
    </div>
  );
}
