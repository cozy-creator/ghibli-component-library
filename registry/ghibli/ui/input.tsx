import * as React from "react";

import { cn, paperFieldClass } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(paperFieldClass, className)} data-slot="input" type={type} {...props} />;
}
