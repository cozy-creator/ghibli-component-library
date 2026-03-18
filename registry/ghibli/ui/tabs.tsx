import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, focusRingClass, paperInsetClass } from "@/lib/utils";

export function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("grid gap-4", className)} data-slot="tabs" {...props} />;
}

const tabsListVariants = cva(cn(paperInsetClass, "inline-flex w-fit items-center gap-2 p-1"), {
  variants: {
    variant: {
      line: "rounded-none border-x-0 border-t-0 bg-transparent px-0 py-0 shadow-none",
      soft: ""
    }
  },
  defaultVariants: {
    variant: "soft"
  }
});

export function TabsList({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      className={cn(tabsListVariants({ className, variant }))}
      data-slot="tabs-list"
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex min-w-28 items-center justify-center rounded-[calc(var(--radius)-0.45rem)] px-3 py-2 text-sm text-[color:var(--muted-foreground)] transition-all",
        "data-[state=active]:bg-[color:var(--card)] data-[state=active]:text-[color:var(--ink-strong)] data-[state=active]:shadow-[var(--shadow-soft)]",
        "hover:text-[color:var(--foreground)]",
        focusRingClass,
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("outline-none data-[state=inactive]:hidden", className)}
      data-slot="tabs-content"
      {...props}
    />
  );
}
