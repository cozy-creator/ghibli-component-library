import * as React from "react";

import { type CozyArtTone, cn } from "@/registry/ghibli/lib/utils";
import { Badge } from "@/registry/ghibli/ui/badge";
import { PaperPanel } from "@/registry/ghibli/ui/paper-panel";

export interface HeroPaperProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  media?: React.ReactNode;
  tone?: CozyArtTone;
}

export function HeroPaper({
  description,
  eyebrow,
  media,
  primaryAction,
  secondaryAction,
  title,
  tone = "paper"
}: HeroPaperProps) {
  return (
    <PaperPanel
      className="grid gap-8 p-6 md:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.9fr)] md:items-center md:p-8"
      tone={tone}
    >
      <div className="grid gap-5">
        {eyebrow ? <Badge variant="soft">{eyebrow}</Badge> : null}
        <div className="grid gap-3">
          <h1 className="max-w-[14ch] font-[var(--font-heading)] text-5xl leading-[0.98] text-[color:var(--ink-strong)] md:text-6xl">
            {title}
          </h1>
          <p className="max-w-[55ch] text-base leading-8 text-[color:var(--muted-foreground)]">
            {description}
          </p>
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col gap-3 sm:flex-row">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
      </div>
      <div
        className={cn(
          "relative min-h-80 overflow-hidden rounded-[calc(var(--radius)+0.875rem)] border shadow-[var(--shadow-paper)]",
          tone === "paper" && "border-[color:var(--border-strong)] bg-[color:var(--secondary)]",
          tone === "meadow" && "border-[color:var(--meadow-border)] bg-[color:color-mix(in_oklab,var(--meadow-surface)_74%,white)]",
          tone === "twilight" && "border-[color:var(--twilight-border)] bg-[color:color-mix(in_oklab,var(--twilight-surface)_78%,white)]"
        )}
      >
        {media}
      </div>
    </PaperPanel>
  );
}
