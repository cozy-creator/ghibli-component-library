import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  error?: React.ReactNode;
  htmlFor?: string;
  label?: React.ReactNode;
}

export function FormField({
  action,
  children,
  className,
  description,
  error,
  htmlFor,
  label
}: FormFieldProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      {(label || action) ? (
        <div className="flex items-center justify-between gap-3">
          {label ? (
            <Label htmlFor={htmlFor}>{label}</Label>
          ) : (
            <span />
          )}
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {description ? (
        <p className="text-xs leading-6 text-muted-foreground">{description}</p>
      ) : null}
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
