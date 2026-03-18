import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const focusRingClass =
  "outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]";

export const paperSurfaceClass = cn(
  "rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)]",
  "shadow-[var(--shadow-paper)]"
);

export const paperInsetClass = cn(
  "rounded-[calc(var(--radius)-0.3rem)] border border-[color:var(--border-soft)] bg-[color:var(--paper-soft)]",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
);

export const paperFieldClass = cn(
  "h-11 w-full rounded-[calc(var(--radius)-0.35rem)] border border-[color:var(--border)]",
  "bg-[color:var(--paper-soft)] px-3 py-2 text-sm text-[color:var(--foreground)] transition-colors",
  "placeholder:text-[color:var(--muted-foreground)]",
  "disabled:cursor-not-allowed disabled:opacity-60",
  focusRingClass
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
  href: string;
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
