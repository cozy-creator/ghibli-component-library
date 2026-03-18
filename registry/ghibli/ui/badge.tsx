import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.16em] uppercase shadow-[var(--shadow-button)]",
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--primary-edge)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]",
        soft:
          "border-[color:var(--border-strong)] bg-[color:var(--paper)] text-[color:var(--foreground)]",
        outline:
          "border-[color:var(--border-strong)] bg-transparent text-[color:var(--foreground)]",
        stamp:
          "border-[color:var(--sun-edge)] bg-[color:var(--sun-soft)] text-[color:var(--ink-strong)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ className, variant }))} {...props} />;
}
