import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, panelBaseClass, toneClasses } from "../lib/utils";

const paperPanelVariants = cva(
  cn(
    panelBaseClass,
    "rounded-[calc(var(--radius)+0.75rem)] p-5 md:p-6"
  ),
  {
    variants: {
      tone: toneClasses
    },
    defaultVariants: {
      tone: "paper"
    }
  }
);

export interface PaperPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paperPanelVariants> {}

export function PaperPanel({ className, tone, ...props }: PaperPanelProps) {
  return <section className={cn(paperPanelVariants({ className, tone }))} {...props} />;
}
