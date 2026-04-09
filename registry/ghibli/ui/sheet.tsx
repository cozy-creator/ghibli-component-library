import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, paperSurfaceClass } from "@/lib/utils";

export function Sheet(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

export function SheetTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

export function SheetClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn("ghibli-sheet-overlay", className)}
      data-slot="sheet-overlay"
      {...props}
    />
  );
}

export function SheetContent({
  children,
  className,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <DialogPrimitive.Content
        className={cn(
          paperSurfaceClass,
          "ghibli-sheet-content",
          className
        )}
        data-side={side}
        data-slot="sheet-content"
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close asChild>
            <Button className="absolute right-3 top-3" size="sm" variant="ghost">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-1", className)} data-slot="sheet-header" {...props} />;
}

export function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]", className)}
      data-slot="sheet-title"
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm leading-7 text-[color:var(--muted-foreground)]", className)}
      data-slot="sheet-description"
      {...props}
    />
  );
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-auto flex flex-col gap-2", className)} data-slot="sheet-footer" {...props} />;
}
