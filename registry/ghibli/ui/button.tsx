import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, focusRingClass } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border text-sm font-medium transition-all duration-200",
    "font-[var(--font-body)] select-none disabled:pointer-events-none disabled:opacity-60",
    "active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    focusRingClass
  ),
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--primary-edge)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:-translate-y-0.5 hover:brightness-[1.02]",
        outline:
          "border-[color:var(--border-strong)] bg-[color:var(--card)] text-[color:var(--foreground)] hover:bg-[color:var(--paper-soft)]",
        secondary:
          "border-[color:var(--border)] bg-[color:var(--paper)] text-[color:var(--foreground)] hover:-translate-y-0.5 hover:bg-[color:var(--paper-soft)]",
        ghost:
          "border-transparent bg-transparent text-[color:var(--foreground)] shadow-none hover:bg-[color:var(--paper-soft)]",
        destructive:
          "border-[color:var(--danger-edge)] bg-[color:var(--danger)] text-[color:var(--danger-foreground)] hover:-translate-y-0.5",
        link:
          "border-transparent bg-transparent p-0 text-[color:var(--ink-strong)] shadow-none underline-offset-4 hover:underline"
      },
      size: {
        default:
          "h-11 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 px-2.5 text-[0.7rem] uppercase tracking-[0.12em] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 px-5 text-[0.95rem]",
        xl: "h-14 px-6 text-base",
        icon: "size-11 p-0",
        "icon-xs": "size-7 p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 p-0",
        "icon-lg": "size-12 p-0"
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
  asChild = false,
  className,
  size,
  variant,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ className, size, variant }))}
      data-size={size}
      data-slot="button"
      data-variant={variant}
      {...props}
    />
  );
}

export { buttonVariants };
