import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, focusRingClass } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--radius)-0.35rem)] border text-sm font-medium transition-all duration-200",
    "font-[var(--font-body)] disabled:pointer-events-none disabled:opacity-60",
    "active:translate-y-px",
    focusRingClass
  ),
  {
    variants: {
      size: {
        default: "h-11 px-4",
        icon: "size-11 p-0",
        lg: "h-12 px-5 text-[0.95rem]",
        sm: "h-9 px-3 text-xs",
        xl: "h-14 px-6 text-base"
      },
      variant: {
        default:
          "border-[color:var(--primary-edge)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-[var(--shadow-raised)] hover:-translate-y-0.5 hover:brightness-[1.02]",
        destructive:
          "border-[color:var(--danger-edge)] bg-[color:var(--danger)] text-[color:var(--danger-foreground)] shadow-[var(--shadow-raised)] hover:-translate-y-0.5",
        ghost:
          "border-transparent bg-transparent text-[color:var(--foreground)] shadow-none hover:bg-[color:var(--paper-soft)]",
        link: "border-transparent bg-transparent p-0 text-[color:var(--ink-strong)] shadow-none underline-offset-4 hover:underline",
        outline:
          "border-[color:var(--border-strong)] bg-[color:var(--card)] text-[color:var(--foreground)] shadow-[var(--shadow-soft)] hover:bg-[color:var(--paper-soft)]",
        secondary:
          "border-[color:var(--border)] bg-[color:var(--paper)] text-[color:var(--foreground)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[color:var(--paper-soft)]"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  asChild = false,
  className,
  size,
  variant,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={cn(buttonVariants({ className, size, variant }))} {...props} />
  );
}

export { buttonVariants };
