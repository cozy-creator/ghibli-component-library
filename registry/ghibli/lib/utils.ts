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
  "focus:border-[color:var(--border)] focus-visible:border-[color:var(--border)]",
  "focus:ring-0 focus-visible:ring-0"
);

export const paperSurfaceClass = cn(
  "border-2 border-[color:var(--border)] bg-[color:var(--card)]"
);

export const paperInsetClass = cn(
  "border border-[color:var(--border-soft)] bg-[color:var(--paper-soft)]"
);

export const paperFieldClass = cn(
  "h-11 w-full border border-[color:var(--border)]",
  "bg-[color:color-mix(in_oklab,var(--paper-soft)_90%,white)] px-3 py-2 text-sm text-[color:var(--foreground)] transition-colors",
  "placeholder:text-[color:var(--muted-foreground)] disabled:cursor-not-allowed disabled:opacity-60",
  fieldFocusClass
);

export const cartoonButtonFrameClass = cn(
  "border-2 border-[#7a5a2b] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_3px_0_rgba(122,90,43,0.58)]",
  "[font-family:'Comic_Sans_MS','Chalkboard_SE',cursive]",
  "hover:-translate-y-[1px] active:translate-y-[2px]",
  "active:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_1px_0_rgba(122,90,43,0.55)]"
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
