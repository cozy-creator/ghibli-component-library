import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronRight } from "lucide-react";

import { cn, focusRingClass, paperSurfaceClass, useControllableState } from "@/lib/utils";

interface DropdownMenuContextValue {
  closeMenu: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

export function DropdownMenu({
  children,
  defaultOpen = false,
  onOpenChange,
  open
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const [isOpen, setIsOpen] = useControllableState({
    defaultValue: defaultOpen,
    onChange: onOpenChange,
    value: open
  });

  return (
    <DropdownMenuContext.Provider
      value={{ closeMenu: () => setIsOpen(false), open: isOpen, setOpen: setIsOpen }}
    >
      <PopoverPrimitive.Root modal={false} onOpenChange={setIsOpen} open={isOpen}>
        {children}
      </PopoverPrimitive.Root>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger(
  props: React.ComponentProps<typeof PopoverPrimitive.Trigger>
) {
  return <PopoverPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

export function DropdownMenuContent({
  align = "start",
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        className={cn(
          paperSurfaceClass,
          "z-50 min-w-56 p-2",
          className
        )}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-2 py-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]", className)}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("my-1 h-px bg-[color:var(--border)]", className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
}

export function DropdownMenuItem({
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(DropdownMenuContext);

  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 px-2 py-2 text-left text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--paper-soft)]",
        focusRingClass,
        className
      )}
      data-slot="dropdown-menu-item"
      onClick={(event) => {
        onClick?.(event);
        context?.closeMenu();
      }}
      type="button"
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({
  checked,
  className,
  onCheckedChange,
  children,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <DropdownMenuItem
      className={cn("justify-between", className)}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span>{children}</span>
      {checked ? <Check className="size-4" /> : null}
    </DropdownMenuItem>
  );
}

interface DropdownMenuRadioGroupProps {
  className?: string;
  children: React.ReactNode;
  onValueChange?: ((value: string) => void) | undefined;
  value?: string | undefined;
}

const DropdownMenuRadioGroupContext = React.createContext<DropdownMenuRadioGroupProps | null>(
  null
);

export function DropdownMenuRadioGroup({
  children,
  className,
  onValueChange,
  value
}: DropdownMenuRadioGroupProps) {
  return (
    <DropdownMenuRadioGroupContext.Provider value={{ children, onValueChange, value }}>
      <div className={className} data-slot="dropdown-menu-radio-group">
        {children}
      </div>
    </DropdownMenuRadioGroupContext.Provider>
  );
}

export function DropdownMenuRadioItem({
  children,
  className,
  itemValue,
  value,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  itemValue?: string;
  value?: string;
}) {
  const context = React.useContext(DropdownMenuRadioGroupContext);
  const resolvedValue = value ?? itemValue ?? "";
  const isActive = context?.value === resolvedValue;

  return (
    <DropdownMenuItem
      className={cn("justify-between", className)}
      onClick={() => context?.onValueChange?.(resolvedValue)}
      {...props}
    >
      <span>{children}</span>
      {isActive ? <Check className="size-4" /> : null}
    </DropdownMenuItem>
  );
}

export function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("ml-auto text-xs tracking-[0.18em] text-[color:var(--muted-foreground)]", className)} data-slot="dropdown-menu-shortcut" {...props} />
  );
}

export function DropdownMenuSubTrigger({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 px-2 py-2 text-left text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--paper-soft)]",
        focusRingClass,
        className
      )}
      data-slot="dropdown-menu-sub-trigger"
      type="button"
      {...props}
    >
      <span>{children}</span>
      <ChevronRight className="ml-auto size-4" />
    </button>
  );
}
