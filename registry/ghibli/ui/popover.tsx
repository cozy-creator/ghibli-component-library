import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn, panelBaseClass } from "../lib/utils";

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root {...props} />;
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger {...props} />;
}

function PopoverContent({
  align = "center",
  className,
  sideOffset = 10,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        className={cn(
          panelBaseClass,
          "z-50 w-80 rounded-[calc(var(--radius)+0.625rem)] border-[color:var(--border-strong)] bg-[color:var(--card)] p-4 text-[color:var(--card-foreground)] shadow-[var(--shadow-paper)] outline-none",
          className
        )}
        sideOffset={sideOffset}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
