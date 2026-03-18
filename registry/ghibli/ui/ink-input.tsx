import * as React from "react";

import { cn } from "../lib/utils";
import { Input, type InputProps } from "./input";

export interface InkInputProps extends InputProps {
  error?: string;
  hint?: string;
  label: string;
}

export function InkInput({ className, error, hint, id, label, ...props }: InkInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const message = error ?? hint;

  return (
    <label className="grid gap-2.5 text-sm" htmlFor={inputId}>
      <span className="font-[var(--font-heading)] text-lg text-[color:var(--ink-strong)]">
        {label}
      </span>
      <Input
        aria-invalid={Boolean(error)}
        className={cn(
          error
            ? "border-[color:var(--clay-edge)] text-[color:var(--ink-strong)]"
            : undefined,
          className
        )}
        id={inputId}
        {...props}
      />
      {message ? (
        <span
          className={cn(
            "text-xs leading-relaxed",
            error ? "text-[color:var(--clay-edge)]" : "text-[color:var(--muted-foreground)]"
          )}
        >
          {message}
        </span>
      ) : null}
    </label>
  );
}
