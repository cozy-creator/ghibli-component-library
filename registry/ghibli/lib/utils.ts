import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const layoutContainerClass = "mx-auto w-full max-w-7xl px-4 md:px-6";

export const focusRingClass =
  "outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]";

export const fieldFocusClass = cn(
  "outline-none focus:outline-none focus-visible:outline-none",
  "focus:border-[color:var(--theme-field-focus-border)] focus-visible:border-[color:var(--theme-field-focus-border)]",
  "focus:ring-0 focus-visible:ring-0",
);

export const panelSurfaceClass = cn(
  "rounded-[var(--theme-radius-lg)] border-solid [border-width:var(--theme-panel-border-width)] border-[color:var(--theme-panel-border)] bg-[color:var(--theme-panel-background)]",
);

export const insetSurfaceClass = cn(
  "rounded-[var(--theme-radius-md)] border-solid [border-width:var(--theme-inset-border-width)] border-[color:var(--theme-inset-border)] bg-[color:var(--theme-inset-background)]",
);

export const paperSurfaceClass = panelSurfaceClass;

export const paperInsetClass = insetSurfaceClass;

export const fieldSurfaceClass = cn(
  "h-11 w-full rounded-[var(--theme-radius-md)] border-solid [border-width:var(--theme-field-border-width)] border-[color:var(--theme-field-border)]",
  "bg-[color:var(--theme-field-background)] px-3 py-2 text-sm text-[color:var(--theme-field-foreground)] transition-colors",
  "placeholder:text-[color:var(--theme-field-placeholder)] disabled:cursor-not-allowed",
  fieldFocusClass,
);

export const paperFieldClass = fieldSurfaceClass;

export const dialogFrameSurfaceClass =
  "[background:var(--theme-dialog-frame-background)]";

export const dialogPrimaryActionClass = cn(
  "border-[color:var(--theme-dialog-primary-border)]",
  "[border-width:var(--theme-dialog-primary-border-width)]",
  "text-[color:var(--theme-dialog-primary-foreground)]",
  "[font-family:var(--theme-dialog-primary-font-family)]",
  "shadow-[var(--theme-dialog-primary-shadow)]",
  "hover:translate-y-[var(--theme-dialog-primary-hover-y)]",
  "hover:bg-[color:var(--theme-dialog-primary-hover-background)]",
  "hover:text-[color:var(--theme-dialog-primary-hover-foreground)]",
  "active:translate-y-[var(--theme-dialog-primary-active-y)]",
  "active:shadow-[var(--theme-dialog-primary-active-shadow)]",
);

export const cartoonButtonFrameClass = cn(
  "border-2 border-[color:color-mix(in_oklab,var(--border)_58%,var(--ink-strong))] font-medium shadow-[inset_0_1px_0_color-mix(in_oklab,var(--paper-soft)_60%,transparent),0_3px_0_color-mix(in_oklab,var(--ink-strong)_38%,transparent)]",
  "[font-family:'Comic_Sans_MS','Chalkboard_SE',cursive]",
  "hover:-translate-y-[1px] active:translate-y-[2px]",
  "active:shadow-[inset_0_1px_0_color-mix(in_oklab,var(--paper-soft)_48%,transparent),0_1px_0_color-mix(in_oklab,var(--ink-strong)_44%,transparent)]"
);

export const contrastIconButtonClass = cn(
  "border border-[color:color-mix(in_oklab,var(--ink-strong)_58%,transparent)]",
  "bg-[color:color-mix(in_oklab,var(--ink-strong)_88%,transparent)]",
  "text-[color:var(--success)] transition-colors",
  "hover:bg-[color:color-mix(in_oklab,var(--ink-strong)_96%,transparent)]",
  "disabled:cursor-not-allowed disabled:opacity-60"
);

export const scenicToneClasses = {
  cloud:
    "border-[color:var(--cloud-border)] bg-[color:var(--cloud-surface)] text-[color:var(--cloud-ink)]",
  lantern:
    "border-[color:var(--lantern-edge)] bg-[color:var(--lantern)] text-[color:var(--ink-strong)]",
  meadow:
    "border-[color:var(--meadow-border)] bg-[color:var(--meadow-surface)] text-[color:var(--meadow-ink)]",
  river:
    "border-[color:var(--river-border)] bg-[color:var(--river-surface)] text-[color:var(--river-ink)]",
  rose:
    "border-[color:var(--rose-border)] bg-[color:var(--rose-surface)] text-[color:var(--rose-ink)]"
} as const;

export type ScenicTone = keyof typeof scenicToneClasses;

export function scenicToneClass(tone: ScenicTone = "cloud") {
  return scenicToneClasses[tone];
}

export function createRange(length: number) {
  return Array.from({ length }, (_, index) => index);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export interface NavItem {
  active?: boolean;
  external?: boolean;
  href: string;
  icon?: React.ReactNode;
  label: string;
}

export interface MediaItem {
  alt?: string;
  caption?: string;
  id: string;
  imageUrl?: string;
  meta?: string;
  title: string;
}

export interface SelectOption {
  description?: string;
  disabled?: boolean;
  label: string;
  value: string;
}

export function useControllableState<T>({
  defaultValue,
  onChange,
  value
}: {
  defaultValue: T;
  onChange?: ((nextValue: T) => void) | undefined;
  value?: T | undefined;
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;

  const setValue = React.useCallback(
    (nextValue: React.SetStateAction<T>) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (previousValue: T) => T)(currentValue)
          : nextValue;

      if (!isControlled) {
        setUncontrolledValue(resolvedValue);
      }

      onChange?.(resolvedValue);
    },
    [currentValue, isControlled, onChange]
  );

  return [currentValue, setValue] as const;
}
