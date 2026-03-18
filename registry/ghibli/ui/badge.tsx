import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, scenicToneClasses } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium tracking-[0.04em]",
  {
    variants: {
      tone: scenicToneClasses,
      variant: {
        outline: "border-[color:var(--border-strong)] bg-transparent text-[color:var(--foreground)]",
        soft: "border-[color:var(--border)] bg-[color:var(--paper-soft)] text-[color:var(--foreground)]",
        solid: "border-[color:var(--primary-edge)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]",
        stamp:
          "border-[color:var(--ink-soft)] bg-[color:var(--paper)] text-[color:var(--ink-strong)] shadow-[var(--shadow-soft)]"
      }
    },
    compoundVariants: [
      { tone: "cloud", variant: "soft", className: scenicToneClasses.cloud },
      { tone: "meadow", variant: "soft", className: scenicToneClasses.meadow },
      { tone: "river", variant: "soft", className: scenicToneClasses.river },
      { tone: "rose", variant: "soft", className: scenicToneClasses.rose },
      { tone: "lantern", variant: "soft", className: scenicToneClasses.lantern }
    ],
    defaultVariants: {
      tone: "cloud",
      variant: "soft"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

export function Badge({
  asChild = false,
  className,
  tone,
  variant,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return <Comp className={cn(badgeVariants({ className, tone, variant }))} {...props} />;
}

export { badgeVariants };
