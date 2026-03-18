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
      className={cn("fixed inset-0 z-50 bg-[color:rgba(54,42,31,0.3)] backdrop-blur-[2px]", className)}
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
          "fixed z-50 flex flex-col gap-4 p-5 shadow-[var(--shadow-raised)]",
          side === "right" && "bottom-0 right-0 top-0 w-[min(92vw,28rem)] data-[state=open]:slide-in-from-right-12",
          side === "left" && "bottom-0 left-0 top-0 w-[min(92vw,28rem)] data-[state=open]:slide-in-from-left-12",
          side === "top" && "left-0 right-0 top-0 min-h-60 data-[state=open]:slide-in-from-top-12",
          side === "bottom" &&
            "bottom-0 left-0 right-0 min-h-60 rounded-t-[var(--radius)] data-[state=open]:slide-in-from-bottom-12",
          className
        )}
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
