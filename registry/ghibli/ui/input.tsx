import * as React from "react";

import { cn, fieldBaseClass } from "../lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...props }: InputProps) {
  return <input className={cn(fieldBaseClass, className)} type={type} {...props} />;
}
