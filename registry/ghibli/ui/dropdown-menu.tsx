import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";

import { cn, focusRingClass, paperSurfaceClass } from "@/lib/utils";

export function DropdownMenu(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>,
) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

export function DropdownMenuPortal(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>,
) {
  return (
    <DropdownMenuPrimitive.Portal
      data-slot="dropdown-menu-portal"
      {...props}
    />
  );
}

export function DropdownMenuTrigger(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>,
) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

export function DropdownMenuContent({
  align = "start",
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content
        align={align}
        className={cn(paperSurfaceClass, "z-50 min-w-56 p-2", className)}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPortal>
  );
}

export function DropdownMenuGroup(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Group>,
) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-2 py-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]",
        "data-[inset=true]:pl-7",
        className,
      )}
      data-inset={inset ? "true" : undefined}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("my-1 h-px bg-[color:var(--border)]", className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
}

export function DropdownMenuItem({
  className,
  disabled,
  inset,
  variant = "default",
  ...props
}: Omit<React.ComponentProps<typeof DropdownMenuPrimitive.Item>, "disabled"> & {
  disabled?: boolean | undefined;
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "group/dropdown-menu-item relative flex w-full cursor-default items-center gap-1.5 px-1.5 py-1 text-left text-sm outline-hidden select-none",
        "focus:bg-[color:var(--paper-soft)] focus:text-[color:var(--foreground)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset=true]:pl-7 data-[variant=destructive]:text-[color:var(--destructive)]",
        focusRingClass,
        className,
      )}
      data-inset={inset ? "true" : undefined}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      {...(disabled === undefined ? {} : { disabled })}
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({
  checked,
  children,
  className,
  disabled,
  ...props
}: Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>,
  "checked" | "disabled"
> & {
  checked?: React.ComponentProps<
    typeof DropdownMenuPrimitive.CheckboxItem
  >["checked"];
  disabled?: boolean | undefined;
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      className={cn(
        "group/dropdown-menu-checkbox-item relative flex w-full cursor-default items-center justify-between gap-1.5 py-1 pr-8 pl-1.5 text-left text-sm outline-hidden select-none",
        "focus:bg-[color:var(--paper-soft)] focus:text-[color:var(--foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        focusRingClass,
        className,
      )}
      data-slot="dropdown-menu-checkbox-item"
      {...(checked === undefined ? {} : { checked })}
      {...(disabled === undefined ? {} : { disabled })}
      {...props}
    >
      <span>{children}</span>
      <DropdownMenuPrimitive.ItemIndicator
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <Check className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuRadioGroup(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>,
) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

export function DropdownMenuRadioItem({
  children,
  className,
  disabled,
  itemValue,
  value,
  ...props
}: Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>,
  "disabled" | "value"
> & {
  disabled?: boolean | undefined;
  itemValue?: string;
  value?: string;
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        "group/dropdown-menu-radio-item relative flex w-full cursor-default items-center gap-1.5 py-1 pr-8 pl-1.5 text-left text-sm outline-hidden select-none",
        "focus:bg-[color:var(--paper-soft)] focus:text-[color:var(--foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        focusRingClass,
        className,
      )}
      data-slot="dropdown-menu-radio-item"
      value={value ?? itemValue ?? ""}
      {...(disabled === undefined ? {} : { disabled })}
      {...props}
    >
      {children}
      <DropdownMenuPrimitive.ItemIndicator
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <Check className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.RadioItem>
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
        className,
      )}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  );
}

export function DropdownMenuSub(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>,
) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

export function DropdownMenuSubTrigger({
  children,
  className,
  disabled,
  inset,
  ...props
}: Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>,
  "disabled"
> & {
  disabled?: boolean | undefined;
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "flex w-full cursor-default items-center gap-2 px-2 py-2 text-left text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--paper-soft)] focus:bg-[color:var(--paper-soft)] data-[inset=true]:pl-7",
        focusRingClass,
        className,
      )}
      {...(disabled === undefined ? {} : { disabled })}
      data-inset={inset ? "true" : undefined}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      <span>{children}</span>
      <ChevronRight className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

export function DropdownMenuSubContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.SubContent
        className={cn(paperSurfaceClass, "z-50 min-w-32 p-1", className)}
        data-slot="dropdown-menu-sub-content"
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPortal>
  );
}
