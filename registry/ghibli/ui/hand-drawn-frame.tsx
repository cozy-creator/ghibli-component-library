import * as React from "react";

import { cn } from "@/lib/utils";

const HAND_DRAWN_RECT_PATH = `M4.6 5.6
  C 22.4 4.9, 38.9 6.5, 51.1 5.7
  C 63.8 4.9, 79.7 6.2, 95.2 5.5

  C 94.4 23.6, 95.7 38.5, 94.8 50.6
  C 94 63.8, 95.3 79.6, 94.7 95.1

  C 78.6 94.3, 63.7 95.5, 50.8 94.8
  C 36.9 94, 21.9 95.5, 5.1 94.9

  C 5.8 79.7, 4.4 64.2, 5.2 50.2
  C 6 36.4, 4.8 20.8, 4.6 5.6`;

const HAND_DRAWN_STEADY_PATH = `M1.4 5.3
  C 25.8 4.7, 49.8 5.9, 74.4 5.2
  C 83.5 5, 91.5 5.4, 98.6 5.1

  C 98.1 25.1, 99 38.8, 98.6 50.2
  C 98.2 63.8, 99 79, 98.4 94.8

  C 74.7 95.4, 50.1 94.2, 25.1 94.9
  C 16.8 95.1, 8.9 95, 1.5 94.9

  C 1.9 79, 0.9 63.7, 1.4 50.2
  C 1.8 37, 1 21, 1.4 5.3
  Z`;

const HAND_DRAWN_PILL_PATH = `M1.4 5.45
  C 12.8 4.15, 24.2 6.45, 36.1 5.05
  C 46.2 4.08, 56.1 6.28, 65.8 5.1
  C 76 4.12, 86.5 6.18, 98.55 5

  C 98.1 25.1, 99 38.8, 98.6 50.2
  C 98.2 63.8, 99 79, 98.4 94.8

  C 86.4 95.92, 76.2 93.58, 65.9 94.95
  C 55.8 95.94, 45.8 93.82, 35.9 95.12
  C 24.3 96.08, 13.1 93.74, 1.5 94.9

  C 1.9 79, 0.9 63.7, 1.4 50.2
  C 1.8 37, 1 21, 1.4 5.45
  Z`;

const HAND_DRAWN_PANEL_PATH = `M1.5 5.1
  C 13.2 3.8, 25.1 6.35, 36.9 4.95
  C 47.3 3.92, 58.1 6.08, 68.7 5.08
  C 79 4.1, 89.2 6.2, 98.35 5.05

  C 97.35 20.5, 99.22 35.6, 98.1 50.2
  C 97.08 64.9, 99.02 79.4, 98.02 94.8

  C 88.6 96.02, 79.2 93.56, 68.8 94.96
  C 58.2 95.98, 47.5 93.72, 36.8 95.08
  C 25.2 96.18, 13.6 93.7, 1.62 94.86

  C 2.38 79.8, 0.72 64.7, 1.82 50
  C 2.82 35.2, 0.82 20.1, 1.5 5.1
  Z`;

const HAND_DRAWN_BANNER_PATH = `M0.58 1.18
  C 8.4 0.1, 16.9 2.42, 25.3 0.9
  C 34.6 0.06, 43.5 2.22, 50.7 1.16
  C 59.7 0.16, 68.8 2.38, 76.2 0.94
  C 84.2 0.12, 91.8 2.06, 99.42 1.06

  C 99.18 24.7, 99.6 49, 99.38 73.6
  C 99.3 81.8, 99.42 90.1, 99.32 98.9

  C 91.4 99.84, 84.5 97.6, 76.2 99.18
  C 68.2 99.92, 59.7 97.66, 50.4 98.98
  C 42.6 99.86, 34.3 97.72, 25.4 99.22
  C 17.2 99.9, 8.9 97.74, 0.72 98.92

  C 0.84 90.1, 0.48 81.8, 0.63 73.5
  C 0.82 49, 0.38 24.6, 0.58 1.18
  Z`;

type HandDrawnFrameVariant =
  | "organic"
  | "steady"
  | "pill"
  | "panel"
  | "surface"
  | "card"
  | "banner";

type HandDrawnFrameVariantConfig = {
  paths: string[];
  viewBox: string;
};

const HAND_DRAWN_FRAME_VARIANTS: Record<
  HandDrawnFrameVariant,
  HandDrawnFrameVariantConfig
> = {
  organic: {
    paths: [HAND_DRAWN_RECT_PATH],
    viewBox: "0 0 100 100"
  },
  steady: {
    paths: [HAND_DRAWN_STEADY_PATH],
    viewBox: "0.95 0 98.1 100"
  },
  pill: {
    paths: [HAND_DRAWN_PILL_PATH],
    viewBox: "0.95 3.8 98.1 92.8"
  },
  panel: {
    paths: [HAND_DRAWN_PANEL_PATH],
    viewBox: "0.95 2.8 98.1 94.2"
  },
  surface: {
    paths: [HAND_DRAWN_STEADY_PATH],
    viewBox: "1.24 4.15 97.52 91.5"
  },
  card: {
    paths: [HAND_DRAWN_STEADY_PATH],
    viewBox: "1.3 4.95 97.55 90.15"
  },
  banner: {
    paths: [HAND_DRAWN_BANNER_PATH],
    viewBox: "0.45 0.4 99.1 99.2"
  }
};

export interface HandDrawnFrameProps
  extends React.HTMLAttributes<HTMLDivElement> {
  contentClassName?: string;
  pathClassName?: string;
  strokeColor?: string;
  strokeWidth?: number | string;
  svgClassName?: string;
  variant?: HandDrawnFrameVariant;
}

export function HandDrawnFrame({
  children,
  className,
  contentClassName,
  pathClassName,
  strokeColor = "var(--border)",
  strokeWidth = 2.4,
  svgClassName,
  variant = "organic",
  ...props
}: HandDrawnFrameProps) {
  const { paths, viewBox } = HAND_DRAWN_FRAME_VARIANTS[variant];

  return (
    <div className={cn("relative", className)} {...props}>
      <div className={cn("relative z-10", contentClassName)}>{children}</div>
      <svg
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-20 block h-full w-full overflow-visible",
          svgClassName
        )}
        preserveAspectRatio="none"
        viewBox={viewBox}
      >
        {paths.map((path) => (
          <path
            className={pathClassName}
            d={path}
            fill="none"
            key={path}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            style={{ stroke: strokeColor }}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
