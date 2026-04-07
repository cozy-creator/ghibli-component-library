import * as React from "react";
import { type LucideIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, scenicToneClass, type ScenicTone } from "@/lib/utils";

export interface EmptyStateProps {
  action?: React.ReactNode;
  className?: string;
  description?: string;
  icon?: LucideIcon;
  tone?: ScenicTone;
  title: string;
}

export function EmptyState({
  action,
  className,
  description,
  icon: Icon = Sparkles,
  tone = "cloud",
  title
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-xl flex-col items-center justify-center border border-dashed px-8 py-12 text-center",
        scenicToneClass(tone),
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center border border-current/20 bg-white/45">
        <Icon className="text-current" size={28} />
      </div>
      <h3 className="mb-2 font-[var(--font-heading)] text-2xl leading-tight text-[color:var(--ink-strong)]">
        {title}
      </h3>
      {description ? (
        <p className="mb-4 max-w-md text-sm leading-7 text-current/80">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

export function EmptyStateAction({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button className={className} {...props}>
      {children}
    </Button>
  );
}
