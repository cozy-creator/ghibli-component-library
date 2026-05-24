import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn, layoutContainerClass, paperSurfaceClass } from "@/lib/utils";

type PageWidth = "md" | "lg" | "xl" | "full";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  width?: PageWidth;
}

interface PageHeroProps {
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
}

interface PageSectionProps {
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
}

interface PageHeroSkeletonProps {
  className?: string;
}

const widthClassMap: Record<PageWidth, string> = {
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
  // Edge-to-edge: drop the max width so content (e.g. a media gallery grid)
  // reaches the page gutters. Only the layout container padding remains.
  full: "max-w-none"
};

export function PageShell({ children, className, width = "xl" }: PageShellProps) {
  return (
    <div className={cn(layoutContainerClass, widthClassMap[width], "pt-6 pb-6 md:pt-6 md:pb-8", className)}>
      {children}
    </div>
  );
}

export function PageHero({ className, title, children, badge, description, actions }: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden py-7 md:py-9", className)}>
      <div className="grid gap-3">
        {badge ? <div>{badge}</div> : null}
        {title ? (
          <h1 className="font-[var(--font-heading)] text-4xl leading-[0.98] text-[color:var(--ink-strong)] md:text-5xl">
            {title}
          </h1>
        ) : null}
        {description ? (
          <div className="max-w-[64ch] text-sm leading-7 text-muted-foreground">{description}</div>
        ) : null}
        {children}
        {actions ? <div className="pt-2">{actions}</div> : null}
      </div>
    </section>
  );
}

export function PageHeroSkeleton({ className }: PageHeroSkeletonProps) {
  return (
    <section
      className={cn(
        paperSurfaceClass,
        "relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.28),transparent_18rem),color-mix(in_oklab,var(--paper)_99%,white)] px-6 py-7 md:px-8 md:py-9",
        className
      )}
    >
      <div className="grid gap-5">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-7 w-24" />
          </div>
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Skeleton className="h-9 w-full max-w-[25rem] md:h-11 md:max-w-[36rem]" />
              <Skeleton className="h-9 w-3/4 max-w-[18rem] md:hidden" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-4 w-full max-w-[40rem] md:h-5" />
              <Skeleton className="h-4 w-full max-w-[32rem] md:h-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageSection({
  actions,
  children,
  className,
  description,
  title
}: PageSectionProps) {
  return (
    <section className={cn("grid gap-4", className)}>
      {(title || description || actions) ? (
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-2">
            {title ? (
              <h2 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <div className="text-sm leading-7 text-muted-foreground">{description}</div>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
