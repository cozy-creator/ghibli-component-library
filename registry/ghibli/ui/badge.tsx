import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, scenicToneClasses, type ScenicTone } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border px-2.5 py-1 text-xs font-medium tracking-[0.04em] whitespace-nowrap transition-all [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      tone: scenicToneClasses,
      variant: {
        default:
          "border-[color:var(--primary-edge)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]",
        secondary:
          "border-[color:var(--border)] bg-[color:var(--paper)] text-[color:var(--foreground)]",
        destructive:
          "border-[color:var(--danger-edge)] bg-[color:rgba(202,117,93,0.14)] text-[color:var(--danger)]",
        outline:
          "border-[color:var(--border-strong)] bg-transparent text-[color:var(--foreground)]",
        ghost: "border-transparent bg-transparent text-[color:var(--muted-foreground)]",
        link:
          "border-transparent bg-transparent p-0 text-[color:var(--ink-strong)] underline-offset-4 hover:underline",
        soft: "border-[color:var(--border)] bg-[color:var(--paper-soft)] text-[color:var(--foreground)]",
        solid:
          "border-[color:var(--primary-edge)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]",
        stamp:
          "border-[color:var(--ink-soft)] bg-[color:var(--paper)] text-[color:var(--ink-strong)]"
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
  tone?: ScenicTone;
}

export function Badge({
  asChild = false,
  className,
  tone,
  variant,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      className={cn(badgeVariants({ className, tone, variant }))}
      data-slot="badge"
      data-variant={variant}
      {...props}
    />
  );
}

export { badgeVariants };
