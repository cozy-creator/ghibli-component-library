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

interface DropdownMenuRadioGroupContextValue {
  onValueChange?: ((value: string) => void) | undefined;
  value?: string | undefined;
}

const DropdownMenuRadioGroupContext =
  React.createContext<DropdownMenuRadioGroupContextValue | null>(null);

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

export function DropdownMenuPortal(props: React.ComponentProps<typeof PopoverPrimitive.Portal>) {
  return <PopoverPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

export function DropdownMenuTrigger(
  props: React.ComponentProps<typeof PopoverPrimitive.Trigger>
) {
  return <PopoverPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

export function DropdownMenuContent({
  align = "start",
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <DropdownMenuPortal>
      <PopoverPrimitive.Content
        align={align}
        className={cn(paperSurfaceClass, "z-50 min-w-56 p-2", className)}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPortal>
  );
}

export function DropdownMenuGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} data-slot="dropdown-menu-group" {...props} />;
}

export function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-2 py-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]",
        className
      )}
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

type DropdownMenuItemSelectEvent = React.MouseEvent<HTMLButtonElement>;

export interface DropdownMenuItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  inset?: boolean;
  onSelect?: ((event: DropdownMenuItemSelectEvent) => void) | undefined;
  variant?: "default" | "destructive";
}

export function DropdownMenuItem({
  className,
  inset,
  onClick,
  onSelect,
  variant = "default",
  ...props
}: DropdownMenuItemProps) {
  const context = React.useContext(DropdownMenuContext);

  return (
    <button
      className={cn(
        "group/dropdown-menu-item relative flex w-full items-center gap-1.5 px-1.5 py-1 text-left text-sm outline-hidden select-none",
        "focus:bg-[color:var(--paper-soft)] focus:text-[color:var(--foreground)]",
        "data-[inset=true]:pl-7 data-[variant=destructive]:text-[color:var(--destructive)] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        focusRingClass,
        className
      )}
      data-disabled={props.disabled ? "true" : undefined}
      data-inset={inset ? "true" : undefined}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      onClick={(event) => {
        onSelect?.(event);
        onClick?.(event);

        if (!event.defaultPrevented) {
          context?.closeMenu();
        }
      }}
      type="button"
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({
  checked,
  children,
  className,
  onCheckedChange,
  ...props
}: Omit<DropdownMenuItemProps, "onSelect"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <DropdownMenuItem
      className={cn("justify-between", className)}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span>{children}</span>
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        {checked ? <Check className="size-4" /> : null}
      </span>
    </DropdownMenuItem>
  );
}

export interface DropdownMenuRadioGroupProps {
  children: React.ReactNode;
  className?: string;
  onValueChange?: ((value: string) => void) | undefined;
  value?: string | undefined;
}

export function DropdownMenuRadioGroup({
  children,
  className,
  onValueChange,
  value
}: DropdownMenuRadioGroupProps) {
  return (
    <DropdownMenuRadioGroupContext.Provider value={{ onValueChange, value }}>
      <div className={className} data-slot="dropdown-menu-radio-group">
        {children}
      </div>
    </DropdownMenuRadioGroupContext.Provider>
  );
}

export interface DropdownMenuRadioItemProps
  extends Omit<DropdownMenuItemProps, "children" | "onSelect"> {
  children: React.ReactNode;
  itemValue?: string;
  onSelect?: ((event: DropdownMenuItemSelectEvent) => void) | undefined;
  value?: string;
}

export function DropdownMenuRadioItem({
  children,
  className,
  itemValue,
  onClick,
  onSelect,
  value,
  ...props
}: DropdownMenuRadioItemProps) {
  const context = React.useContext(DropdownMenuContext);
  const radioGroupContext = React.useContext(DropdownMenuRadioGroupContext);
  const resolvedValue = value ?? itemValue ?? "";
  const isActive = radioGroupContext?.value === resolvedValue;

  return (
    <button
      className={cn(
        "group/dropdown-menu-radio-item relative flex w-full items-center gap-1.5 py-1 pr-8 pl-1.5 text-left text-sm outline-hidden select-none",
        "focus:bg-[color:var(--paper-soft)] focus:text-[color:var(--foreground)] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        focusRingClass,
        className
      )}
      data-disabled={props.disabled ? "true" : undefined}
      data-slot="dropdown-menu-radio-item"
      data-state={isActive ? "checked" : "unchecked"}
      onClick={(event) => {
        onSelect?.(event);
        onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        radioGroupContext?.onValueChange?.(resolvedValue);
        context?.closeMenu();
      }}
      type="button"
      {...props}
    >
      {children}
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        {isActive ? <Check className="size-4" /> : null}
      </span>
    </button>
  );
}

export function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-[0.18em] text-[color:var(--muted-foreground)]",
        className
      )}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  );
}

export function DropdownMenuSub({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="dropdown-menu-sub" {...props}>
      {children}
    </div>
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

export function DropdownMenuSubContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(paperSurfaceClass, "z-50 min-w-32 p-1", className)}
      data-slot="dropdown-menu-sub-content"
      {...props}
    />
  );
}
