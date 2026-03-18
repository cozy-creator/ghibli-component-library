import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, framedMediaClass, toneClasses } from "../lib/utils";

const posterFrameVariants = cva("p-3", {
  variants: {
    tone: toneClasses
  },
  defaultVariants: {
    tone: "paper"
  }
});

export interface PosterFrameProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof posterFrameVariants> {
  caption?: string | undefined;
}

export function PosterFrame({
  caption,
  children,
  className,
  tone,
  ...props
}: PosterFrameProps) {
  return (
    <figure className={cn(framedMediaClass, posterFrameVariants({ className, tone }))} {...props}>
      <div className="overflow-hidden rounded-[calc(var(--radius)+0.125rem)] border border-[color:var(--border)] bg-[color:var(--background)]">
        {children}
      </div>
      {caption ? (
        <figcaption className="px-2 pt-3 text-center font-[var(--font-heading)] text-sm text-[color:var(--muted-foreground)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
