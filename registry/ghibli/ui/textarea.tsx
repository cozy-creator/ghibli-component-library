import * as React from "react";

import { cn, fieldBaseClass } from "../lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(fieldBaseClass, "min-h-28 resize-y py-3 leading-relaxed", className)}
      {...props}
    />
  );
}
