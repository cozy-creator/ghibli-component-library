import * as React from "react";
import { Check } from "lucide-react";

import { cn, focusRingClass } from "@/lib/utils";
import type { ThemeOption, ThemeOptionId } from "@/lib/theme";

export interface ThemeOptionCardProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "onSelect"> {
  onSelect: (themeId: ThemeOptionId) => void;
  option: ThemeOption;
  selected: boolean;
}

export const ThemeOptionCard = React.forwardRef<
  HTMLButtonElement,
  ThemeOptionCardProps
>(function ThemeOptionCard(
  { className, onClick, onSelect, option, selected, type = "button", ...props },
  ref
) {
  const isAvailable = option.available;

  return (
    <button
      {...props}
      ref={ref}
      aria-checked={selected}
      aria-disabled={!isAvailable}
      aria-label={
        option.availabilityLabel
          ? `${option.name}. ${option.previewAlt}. ${option.availabilityLabel}.`
          : `${option.name}. ${option.previewAlt}`
      }
      className={cn(
        "group relative overflow-hidden border bg-[color:var(--surface-overlay-strong)] text-left text-[color:var(--ink-strong)] transition-all duration-200",
        "border-[color:var(--surface-highlight-border)] shadow-[0_1px_0_color-mix(in_oklab,var(--surface-overlay-strong)_72%,transparent)]",
        isAvailable
          ? "hover:-translate-y-0.5 hover:bg-[color:var(--surface-overlay-stronger)]"
          : "cursor-not-allowed opacity-65",
        "data-[state=checked]:border-[color:var(--border)] data-[state=checked]:bg-[color:var(--surface-overlay-stronger)] data-[state=checked]:shadow-[0_0_0_1px_var(--border),0_8px_18px_color-mix(in_oklab,var(--ink-strong)_14%,transparent)]",
        focusRingClass,
        className
      )}
      data-state={selected ? "checked" : "unchecked"}
      disabled={!isAvailable}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && isAvailable) {
          onSelect(option.id);
        }
      }}
      role="radio"
      type={type}
    >
      <div className="relative aspect-[1.72/1] overflow-hidden border-b border-[color:var(--surface-highlight-border)] bg-[color:var(--surface-highlight)]">
        {!isAvailable && option.availabilityLabel ? (
          <span className="absolute left-2 top-2 z-10 inline-flex items-center border border-[color:var(--surface-highlight-border)] bg-[color:var(--surface-overlay-stronger)] px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]">
            {option.availabilityLabel}
          </span>
        ) : null}
        <img
          alt=""
          aria-hidden="true"
          className={cn(
            "size-full object-cover transition-transform duration-300",
            isAvailable
              ? "group-hover:scale-[1.02]"
              : "scale-100 saturate-[0.85]"
          )}
          src={option.previewSrc}
        />
      </div>
      <div className="flex min-h-11 items-center justify-center px-3 py-2 text-center text-[0.82rem] leading-tight font-medium">
        <span>{option.name}</span>
      </div>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-2 bottom-2 inline-flex size-[1.125rem] items-center justify-center rounded-full border text-[color:var(--primary-foreground)] transition-all duration-200",
          selected
            ? "border-[color:var(--primary-edge)] bg-[color:var(--success)] opacity-100"
            : isAvailable
              ? "border-[color:var(--surface-highlight-border)] bg-[color:var(--surface-overlay-strong)] opacity-0 group-hover:opacity-100"
              : "border-[color:var(--surface-highlight-border)] bg-[color:var(--surface-overlay-strong)] opacity-0"
        )}
      >
        <Check className="size-3" strokeWidth={2.6} />
      </span>
    </button>
  );
});
