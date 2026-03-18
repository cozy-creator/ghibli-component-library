import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn, panelBaseClass } from "../lib/utils";

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("grid gap-4", className)} {...props} />;
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        panelBaseClass,
        "inline-flex h-auto w-fit items-center gap-2 rounded-full border-[color:var(--border-strong)] bg-[color:var(--paper)] p-1.5",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full border border-transparent px-4 text-sm font-medium transition-all",
        "text-[color:var(--muted-foreground)]",
        "data-[state=active]:border-[color:var(--primary-edge)] data-[state=active]:bg-[color:var(--primary)] data-[state=active]:text-[color:var(--primary-foreground)] data-[state=active]:shadow-[var(--shadow-button)]",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        panelBaseClass,
        "rounded-[calc(var(--radius)+0.625rem)] border-[color:var(--border-strong)] bg-[color:var(--card)] p-5",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
