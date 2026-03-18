import type * as React from "react";

import { Badge, cn } from "@ghibli/ui";

export interface PageIntroProps {
  badge?: string;
  description: string;
  title: string;
  trailing?: React.ReactNode;
}

export function PageIntro({
  badge,
  description,
  title,
  trailing
}: PageIntroProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="grid gap-3">
        {badge ? <Badge variant="stamp">{badge}</Badge> : null}
        <div className="grid gap-2">
          <h1 className="font-[var(--font-heading)] text-4xl leading-[0.98] text-[color:var(--ink-strong)] md:text-5xl xl:text-6xl">
            {title}
          </h1>
          <p className={cn("ghibli-prose max-w-[70ch] text-base md:text-lg")}>{description}</p>
        </div>
      </div>
      {trailing ? <div className="lg:justify-self-end">{trailing}</div> : null}
    </section>
  );
}
