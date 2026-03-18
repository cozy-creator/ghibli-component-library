import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const focusRingClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]";

export const paperTextureClass =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(180deg,rgba(255,255,255,0.26),transparent_48%)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-55 after:[background-image:var(--texture-paper)]";

export const panelBaseClass = cn(
  "relative overflow-hidden border shadow-[var(--shadow-paper)] backdrop-blur-[1px]",
  paperTextureClass
);

export const fieldBaseClass = cn(
  "flex h-11 w-full rounded-[calc(var(--radius)-0.125rem)] border px-4 py-2 text-sm transition-colors",
  "border-[color:var(--border-strong)] bg-[color:var(--card)] text-[color:var(--foreground)] shadow-[var(--shadow-inset)] placeholder:text-[color:var(--muted-foreground)]",
  "selection:bg-[color:var(--sun)] selection:text-[color:var(--ink-strong)]",
  "disabled:cursor-not-allowed disabled:opacity-60",
  focusRingClass
);

export const toneClasses = {
  paper:
    "border-[color:var(--border-strong)] bg-[color:var(--card)] text-[color:var(--card-foreground)]",
  meadow:
    "border-[color:var(--meadow-border)] bg-[color:var(--meadow-surface)] text-[color:var(--meadow-ink)]",
  twilight:
    "border-[color:var(--twilight-border)] bg-[color:var(--twilight-surface)] text-[color:var(--twilight-ink)]"
} as const;

export type CozyArtTone = keyof typeof toneClasses;

export const framedMediaClass = cn(
  "relative isolate overflow-hidden rounded-[calc(var(--radius)+0.375rem)] border border-[color:var(--border-strong)] bg-[color:var(--paper)] p-2 shadow-[var(--shadow-paper)]",
  paperTextureClass
);

