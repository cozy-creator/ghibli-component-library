import * as React from "react";
import { Loader2 } from "lucide-react";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { cn } from "@/lib/utils";

type CartoonButtonSize = "sm" | "default" | "lg";

export interface CartoonButtonProps
  extends Omit<React.ComponentProps<"button">, "color" | "onClick"> {
  color?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | null;
  size?: CartoonButtonSize;
  text: string;
}

// Bigger, friendlier text than before, sized per button. The crooked border +
// fill come from HandDrawnFrame so buttons match the hand-drawn paper aesthetic.
const SIZE_CONTENT: Record<CartoonButtonSize, string> = {
  sm: "min-w-[6rem] px-5 py-2.5 text-base gap-2",
  default: "min-w-[7.5rem] px-7 py-3 text-lg gap-2.5",
  lg: "min-w-[9rem] px-8 py-3.5 text-xl gap-3",
};

const BUTTON_TEXT_CLASS =
  "inline-block origin-center scale-x-[1.14] transform-gpu px-[0.12em]";

export function CartoonButton({
  className,
  color = "var(--primary-edge)",
  disabled = false,
  icon,
  loading = false,
  loadingText = "Loading...",
  onClick = null,
  size = "default",
  style,
  text,
  type = "button",
  ...props
}: CartoonButtonProps) {
  // Preserve the old contract: a button-typed CartoonButton with no onClick is
  // treated as disabled (used for "current plan" style affordances).
  const needsClickHandler = type === "button" && onClick === null;
  const isDisabled = disabled || loading || needsClickHandler;

  return (
    <button
      className={cn(
        "group relative inline-flex select-none rounded-[var(--theme-radius-md)] transition-transform duration-150",
        "hover:-translate-y-[1px] active:translate-y-[1px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2",
        isDisabled && "pointer-events-none opacity-60",
        className,
      )}
      disabled={isDisabled}
      onClick={onClick ?? undefined}
      style={{ ...style, "--cartoon-button-bg": color } as React.CSSProperties}
      type={type}
      {...props}
    >
      <HandDrawnFrame
        className="w-full transition-[filter] duration-150 group-hover:brightness-[1.05]"
        crookedness={3}
        strokeWidthRange={[1.4, 2.6]}
        strokeWidthVariation={0.5}
        strokeColor="color-mix(in oklab, var(--cartoon-button-bg) 45%, var(--ink-strong))"
        fillColor="var(--cartoon-button-bg)"
        contentClassName={cn(
          "flex items-center justify-center font-semibold tracking-[0.055em] text-[color:var(--primary-foreground)]",
          "[font-family:var(--font-hand)]",
          SIZE_CONTENT[size],
        )}
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
        <span className={BUTTON_TEXT_CLASS}>{loading ? loadingText : text}</span>
      </HandDrawnFrame>
    </button>
  );
}
