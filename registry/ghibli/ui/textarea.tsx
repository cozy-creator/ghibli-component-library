import * as React from "react";

import { cn, paperFieldClass } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn("min-h-28 resize-y py-3", paperFieldClass, className)}
      data-slot="textarea"
      {...props}
    />
  );
}
