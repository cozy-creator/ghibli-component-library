import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, focusRingClass } from "../lib/utils";

const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--radius)-0.125rem)] border text-sm font-medium transition-all duration-300",
    "font-[var(--font-body)] shadow-[var(--shadow-button)]",
    "disabled:pointer-events-none disabled:opacity-60",
    "data-[state=open]:scale-[0.98]",
    focusRingClass
  ),
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--primary-edge)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:-translate-y-0.5 hover:brightness-[1.03]",
        secondary:
          "border-[color:var(--border-strong)] bg-[color:var(--card)] text-[color:var(--foreground)] hover:-translate-y-0.5 hover:bg-[color:var(--paper)]",
        outline:
          "border-[color:var(--border-strong)] bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--secondary)]",
        ghost:
          "border-transparent bg-transparent text-[color:var(--foreground)] shadow-none hover:bg-[color:var(--secondary)]",
        lantern:
          "border-[color:var(--sun-edge)] bg-[color:var(--sun)] text-[color:var(--ink-strong)] shadow-[var(--shadow-lantern)] hover:-translate-y-0.5 hover:brightness-[1.03]"
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-[calc(var(--radius)-0.25rem)] px-3.5",
        lg: "h-12 px-6 text-base",
        icon: "size-11 p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={cn(buttonVariants({ className, size, variant }))} {...props} />
  );
}

export { buttonVariants };
