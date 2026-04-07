import * as React from "react";
import { Info, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn, scenicToneClass, type ScenicTone } from "@/lib/utils";

export interface NoticeBannerProps {
  action?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  icon?: LucideIcon;
  title: React.ReactNode;
  tone?: ScenicTone;
}

export function NoticeBanner({
  action,
  className,
  description,
  icon: Icon = Info,
  title,
  tone = "cloud"
}: NoticeBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border px-4 py-4 sm:flex-row sm:items-start sm:justify-between",
        scenicToneClass(tone),
        className
      )}
    >
      <div className="flex min-w-0 gap-3">
        <div className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center border border-current/15 bg-white/45">
          <Icon className="size-4" />
        </div>
        <div className="grid gap-1">
          <Badge className="w-fit" tone={tone} variant="stamp">
            Notice
          </Badge>
          <div className="text-sm font-semibold text-[color:var(--ink-strong)]">{title}</div>
          {description ? (
            <div className="text-sm leading-7 text-current/80">{description}</div>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
