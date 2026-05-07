import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn, focusRingClass } from "@/lib/utils";

export function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      className={cn("flex w-full flex-col", className)}
      data-slot="accordion"
      {...props}
    />
  );
}

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("not-last:border-b", className)}
      data-slot="accordion-item"
      {...props}
    />
  );
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group/accordion-trigger relative flex w-full items-start justify-between border border-transparent py-2.5 text-left text-sm font-medium transition-all",
          "disabled:cursor-not-allowed disabled:opacity-60",
          focusRingClass,
          className,
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        <span>{children}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/accordion-trigger:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "grid overflow-hidden text-sm text-[color:var(--muted-foreground)] transition-all",
        "data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]",
        className,
      )}
      data-slot="accordion-content"
      {...props}
    >
      <div className="min-h-0 overflow-hidden pt-0 pb-2.5 leading-7 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4">
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}
