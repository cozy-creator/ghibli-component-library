import type { ReactNode } from "react";

import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { cn } from "@/lib/utils";

const detailsPanelFillClass =
  "bg-[color:color-mix(in_oklab,var(--foreground)_82%,transparent)]";
const detailsPanelStrokeColor =
  "color-mix(in oklab, var(--primary-foreground) 16%, transparent)";
const detailsPanelStrongTextClass = "text-[color:var(--primary-foreground)]";
const detailsPanelMutedTextClass =
  "text-[color:color-mix(in_oklab,var(--primary-foreground)_88%,transparent)]";
const detailsPanelMetaTextClass =
  "text-[color:color-mix(in_oklab,var(--primary-foreground)_92%,transparent)]";

interface CommunityAssetDetailsPanelProps {
  action?: ReactNode;
  actionWrapperClassName?: string;
  authorName: string;
  className?: string;
  contentClassName?: string;
  createdAtLabel: string;
  modelLabel: string;
  negativePromptText?: string;
  promptText: string;
}

export function CommunityAssetDetailsPanel({
  action,
  actionWrapperClassName,
  authorName,
  className,
  contentClassName,
  createdAtLabel,
  modelLabel,
  negativePromptText,
  promptText,
}: CommunityAssetDetailsPanelProps) {
  return (
    <HandDrawnFrame
      className={cn("relative mt-4 sm:mt-5", className)}
      surfaceClassName={detailsPanelFillClass}
      contentClassName={cn(
        "relative h-full px-4 py-4 backdrop-blur-sm sm:px-5",
        detailsPanelStrongTextClass,
      )}
      strokeColor={detailsPanelStrokeColor}
      strokeWidthRange={[1.15, 1.15]}
      svgClassName="opacity-90"
      crookedness={0.3}
    >
      {action ? (
        <div
          className={cn("absolute top-2 right-2 z-10", actionWrapperClassName)}
        >
          {action}
        </div>
      ) : null}

      <div className={cn("min-w-0", contentClassName)}>
        <p
          className={cn(
            "font-[var(--font-body)] text-sm leading-6 font-semibold sm:text-[0.95rem]",
            detailsPanelMetaTextClass,
          )}
        >
          {authorName} - {createdAtLabel}
        </p>
        <p
          className={cn(
            "mt-2.5 font-[var(--font-body)] text-sm leading-6 sm:text-[0.95rem]",
            detailsPanelStrongTextClass,
          )}
        >
          <span className="font-semibold">Model:</span> {modelLabel}
        </p>
        <p
          className={cn(
            "mt-2.5 font-[var(--font-body)] text-sm leading-6 sm:text-[0.95rem]",
            detailsPanelMutedTextClass,
          )}
        >
          <span className={cn("font-semibold", detailsPanelStrongTextClass)}>
            Prompt:
          </span>{" "}
          {promptText}
        </p>
        {negativePromptText ? (
          <p
            className={cn(
              "mt-2.5 font-[var(--font-body)] text-sm leading-6 sm:text-[0.95rem]",
              detailsPanelMutedTextClass,
            )}
          >
            <span className={cn("font-semibold", detailsPanelStrongTextClass)}>
              Negative prompt:
            </span>{" "}
            {negativePromptText}
          </p>
        ) : null}
      </div>
    </HandDrawnFrame>
  );
}
