import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn, paperSurfaceClass } from "@/lib/utils";

interface TooltipContextValue {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({
  children,
  defaultOpen = false,
  open,
  onOpenChange
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const resolvedOpen = open ?? internalOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open]
  );

  return (
    <TooltipContext.Provider value={{ onOpenChange: setOpen, open: resolvedOpen }}>
      <PopoverPrimitive.Root modal={false} open={resolvedOpen} onOpenChange={setOpen}>
        {children}
      </PopoverPrimitive.Root>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  const context = React.useContext(TooltipContext);

  if (!context) {
    throw new Error("TooltipTrigger must be used inside Tooltip.");
  }

  const child = React.Children.only(children) as React.ReactElement<{
    onBlur?: React.FocusEventHandler<HTMLElement>;
    onFocus?: React.FocusEventHandler<HTMLElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  }>;

  if (asChild) {
    return (
      <PopoverPrimitive.Trigger asChild {...props}>
        {React.cloneElement(child, {
          onBlur: (event) => {
            child.props.onBlur?.(event);
            context.onOpenChange(false);
          },
          onFocus: (event) => {
            child.props.onFocus?.(event);
            context.onOpenChange(true);
          },
          onMouseEnter: (event) => {
            child.props.onMouseEnter?.(event);
            context.onOpenChange(true);
          },
          onMouseLeave: (event) => {
            child.props.onMouseLeave?.(event);
            context.onOpenChange(false);
          }
        })}
      </PopoverPrimitive.Trigger>
    );
  }

  return <PopoverPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

export function TooltipContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        className={cn(
          paperSurfaceClass,
          "z-50 max-w-56 px-3 py-2 text-xs leading-6 text-[color:var(--foreground)]",
          className
        )}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
