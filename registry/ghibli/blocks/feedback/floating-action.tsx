import * as React from "react";

import { cn } from "@/lib/utils";

export interface FloatingActionProps {
  backdropClassName?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  position?: "fixed" | "sticky";
}

export function FloatingAction({
  backdropClassName,
  children,
  className,
  contentClassName,
  position = "sticky"
}: FloatingActionProps) {
  return (
    <div
      className={cn(
        "pointer-events-none z-40 flex justify-center pt-8",
        position === "fixed"
          ? "fixed inset-x-0 bottom-0 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
          : "sticky bottom-0 pb-6",
        className
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-36 overflow-hidden",
          backdropClassName
        )}
      >
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(163,182,143,0.46)_0%,rgba(197,185,120,0.28)_38%,rgba(223,230,197,0.12)_62%,transparent_100%)] backdrop-blur-[18px] [mask-image:linear-gradient(to_top,black_18%,black_56%,transparent)]" />
        <div className="absolute left-1/2 bottom-2 h-24 w-[min(34rem,86vw)] -translate-x-1/2 bg-[radial-gradient(circle,rgba(199,189,114,0.34)_0%,rgba(134,160,115,0.22)_46%,rgba(207,214,168,0.08)_72%,transparent_88%)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(181,176,108,0.36),transparent)]" />
      </div>
      <div className={cn("pointer-events-auto relative", contentClassName)}>{children}</div>
    </div>
  );
}
