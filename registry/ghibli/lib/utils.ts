import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const layoutContainerClass = "mx-auto w-full max-w-7xl px-4 md:px-6";

export const focusRingClass =
  "outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]";

export const docsCodeBlockSurfaceClass = cn(
  "relative isolate overflow-hidden rounded-[var(--theme-radius-md)] border border-[color:var(--theme-docs-code-border)] [background:var(--theme-docs-code-background)] text-[color:var(--theme-docs-code-foreground)]",
  "shadow-[inset_0_1px_0_color-mix(in_oklab,var(--paper-soft)_14%,transparent),inset_0_18px_28px_color-mix(in_oklab,var(--paper-soft)_4%,transparent),inset_0_-28px_48px_color-mix(in_oklab,var(--foreground)_22%,transparent),0_14px_28px_color-mix(in_oklab,var(--ink-strong)_10%,transparent)]",
);

export const docsCodeBlockOverlayClass =
  "paper-overlay pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply";

export const docsCodeBlockHeaderClass = cn(
  "relative flex items-center justify-between gap-3 border-b border-[color:var(--theme-docs-code-header-border)] bg-[color:var(--theme-docs-code-header-background)] px-3 py-2",
  "shadow-[inset_0_1px_0_color-mix(in_oklab,var(--paper-soft)_10%,transparent)]",
);

export const docsCodeBlockButtonClass = cn(
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-[calc(var(--theme-radius-md)-2px)] border border-[color:var(--theme-docs-code-button-border)] bg-[color:var(--theme-docs-code-button-background)] px-2.5 text-[11px] font-medium text-[color:var(--theme-docs-code-button-foreground)] transition-colors",
  "shadow-[inset_0_1px_0_color-mix(in_oklab,var(--paper-soft)_10%,transparent)]",
  "hover:bg-[color:var(--theme-docs-code-button-background-hover)] hover:text-[color:var(--theme-docs-code-button-hover-foreground)]",
  "outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--theme-docs-code-focus-ring-offset)]",
  "disabled:cursor-not-allowed disabled:opacity-60",
);

export const docsCodeBlockPreClass = cn(
  "relative overflow-x-auto px-4 py-4 font-mono text-[0.88rem] leading-7 whitespace-pre-wrap break-words text-[color:var(--theme-docs-code-foreground)]",
  "[text-shadow:var(--theme-docs-code-text-shadow)]",
);

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

export const contrastIconButtonClass = cn(
  "border border-[color:color-mix(in_oklab,var(--ink-strong)_58%,transparent)]",
  "bg-[color:color-mix(in_oklab,var(--ink-strong)_88%,transparent)]",
  "text-[color:var(--success)] transition-colors",
  "hover:bg-[color:color-mix(in_oklab,var(--ink-strong)_96%,transparent)]",
  "disabled:cursor-not-allowed disabled:opacity-60",
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
  rose: "border-[color:var(--rose-border)] bg-[color:var(--rose-surface)] text-[color:var(--rose-ink)]",
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

export async function copyTextToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back when clipboard permissions are unavailable.
    }
  }

  if (typeof document === "undefined") {
    return false;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "true");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);

  return copied;
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
  value,
}: {
  defaultValue: T;
  onChange?: ((nextValue: T) => void) | undefined;
  value?: T | undefined;
}) {
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
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
    [currentValue, isControlled, onChange],
  );

  return [currentValue, setValue] as const;
}
