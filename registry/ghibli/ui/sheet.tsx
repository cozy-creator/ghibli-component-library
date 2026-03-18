import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, panelBaseClass } from "../lib/utils";

const sheetVariants = cva(
  cn(
    panelBaseClass,
    "fixed z-50 flex flex-col gap-5 border-[color:var(--border-strong)] bg-[color:var(--card)] p-6 shadow-[var(--shadow-paper)]"
  ),
  {
    variants: {
      side: {
        top: "inset-x-4 top-4 rounded-[calc(var(--radius)+0.875rem)]",
        bottom: "inset-x-4 bottom-4 rounded-[calc(var(--radius)+0.875rem)]",
        left: "inset-y-4 left-4 w-[min(92vw,26rem)] rounded-[calc(var(--radius)+0.875rem)]",
        right: "inset-y-4 right-4 w-[min(92vw,26rem)] rounded-[calc(var(--radius)+0.875rem)]"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);

function Sheet(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

function SheetTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />;
}

function SheetPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn("fixed inset-0 z-40 bg-[color:rgba(42,32,21,0.42)] backdrop-blur-sm", className)}
      {...props}
    />
  );
}

function SheetContent({
  children,
  className,
  side,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & VariantProps<typeof sheetVariants>) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content className={cn(sheetVariants({ className, side }))} {...props}>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full border border-transparent text-[color:var(--muted-foreground)] transition-colors hover:border-[color:var(--border)] hover:bg-[color:var(--secondary)] hover:text-[color:var(--foreground)]">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-2", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-auto flex flex-col gap-3", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "font-[var(--font-heading)] text-3xl leading-none text-[color:var(--ink-strong)]",
        className
      )}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm leading-relaxed text-[color:var(--muted-foreground)]", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger
};
