import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cartoonButtonFrameClass, cn } from "@/lib/utils";

type BaseButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "onClick"
>;

export interface CartoonButtonProps extends BaseButtonProps {
  color?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | null;
  text: string;
}

export function CartoonButton({
  className,
  color = "var(--primary-edge)",
  disabled = false,
  icon,
  loading = false,
  loadingText = "Loading...",
  onClick = null,
  size = "lg",
  style,
  text,
  type = "button",
  ...props
}: CartoonButtonProps) {
  const resolvedStyle = {
    ...style,
    "--cartoon-button-bg": color
  } as React.CSSProperties;
  const needsClickHandler = type === "button" && onClick === null;

  return (
    <Button
      className={cn(
        cartoonButtonFrameClass,
        "bg-[var(--cartoon-button-bg)] text-white hover:bg-[color:color-mix(in_oklab,var(--cartoon-button-bg)_76%,white)] hover:text-[color:var(--foreground)] hover:brightness-100",
        className
      )}
      disabled={disabled || loading || needsClickHandler}
      onClick={onClick ?? undefined}
      size={size}
      style={resolvedStyle}
      type={type}
      variant="secondary"
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {loading ? loadingText : text}
    </Button>
  );
}
