import * as React from "react";

import { cn, panelSurfaceClass } from "@/lib/utils";

export function Card({
  className,
  size = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "sm";
}) {
  return (
    <div
      className={cn(
        panelSurfaceClass,
        "group/card flex flex-col gap-4 overflow-hidden py-5 text-sm text-card-foreground has-data-[slot=card-footer]:pb-0 data-[size=sm]:gap-3 data-[size=sm]:py-4",
        className,
      )}
      data-size={size}
      data-slot="card"
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-2 px-5 group-data-[size=sm]/card:px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        className,
      )}
      data-slot="card-header"
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <div
      className={cn(
        "font-[var(--font-heading)] text-2xl leading-tight text-[color:var(--ink-strong)] group-data-[size=sm]/card:text-xl",
        className,
      )}
      data-slot="card-title"
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn(
        "text-sm leading-7 text-[color:var(--muted-foreground)]",
        className,
      )}
      data-slot="card-description"
      {...props}
    />
  );
}

export function CardAction({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      data-slot="card-action"
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-5 group-data-[size=sm]/card:px-4", className)}
      data-slot="card-content"
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center border-t border-[color:var(--theme-panel-border)] bg-[color:var(--surface-footer)] px-5 py-4 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:py-3",
        className,
      )}
      data-slot="card-footer"
      {...props}
    />
  );
}
