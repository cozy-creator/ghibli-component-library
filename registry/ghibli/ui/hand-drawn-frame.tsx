import * as React from "react";

import { cn } from "@/lib/utils";
import {
  createStrokeWidthVariationLayers,
  type HandDrawnFrameStrokeLayer,
} from "./hand-drawn-frame.stroke-width-variation";
import {
  clamp,
  interpolatePath,
  normalizePathToObjectBoundingBox,
  perturbPath,
  resolveCrookednessCompensation,
  type HandDrawnFrameCrookednessCompensation,
  type HandDrawnFrameJitterConfig,
  type HandDrawnFrameShape,
} from "./hand-drawn-frame.geometry";

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

const HAND_DRAWN_STEADY_STRAIGHT_PATH = `M1.4 5.3
  C 25.8 5.3, 49.8 5.3, 74.4 5.3
  C 83.5 5.3, 91.5 5.3, 98.6 5.3

  C 98.6 25.1, 98.6 38.8, 98.6 50.2
  C 98.6 63.8, 98.6 79, 98.6 94.8

  C 74.7 94.8, 50.1 94.8, 25.1 94.8
  C 16.8 94.8, 8.9 94.8, 1.5 94.8

  C 1.5 79, 1.5 63.7, 1.5 50.2
  C 1.5 37, 1.5 21, 1.5 5.3
  Z`;

const HAND_DRAWN_DIVIDER_PATH = `M1.2 6
  C 11.8 4.95, 22.5 7.15, 33.6 5.85
  C 44.6 4.88, 55.3 7.12, 66.1 5.9
  C 76.9 4.96, 87.4 6.86, 98.8 5.8`;

const HAND_DRAWN_DIVIDER_STRAIGHT_PATH = `M1.2 6
  C 11.8 6, 22.5 6, 33.6 6
  C 44.6 6, 55.3 6, 66.1 6
  C 76.9 6, 87.4 6, 98.8 6`;

type HandDrawnFramePathConfig = {
  crooked: string;
  straight: string;
};

type HandDrawnFrameShapeConfig = {
  defaultIntensity: number;
  jitter: HandDrawnFrameJitterConfig;
  paths: HandDrawnFramePathConfig[];
  viewBox: string;
};

type HandDrawnFrameSize = {
  width: number;
  height: number;
};

function resolveNumericStrokeWidth(strokeWidth: number | string) {
  if (typeof strokeWidth === "number") {
    return Number.isFinite(strokeWidth) ? strokeWidth : null;
  }

  const trimmedStrokeWidth = strokeWidth.trim();

  if (!/^-?(?:\d+\.?\d*|\.\d+)$/.test(trimmedStrokeWidth)) {
    return null;
  }

  const numericStrokeWidth = Number(trimmedStrokeWidth);

  return Number.isFinite(numericStrokeWidth) ? numericStrokeWidth : null;
}

const HAND_DRAWN_FRAME_SHAPES: Record<
  HandDrawnFrameShape,
  HandDrawnFrameShapeConfig
> = {
  surface: {
    defaultIntensity: 5,
    jitter: { anchor: 0.14, control: 0.46 },
    paths: [
      {
        crooked: HAND_DRAWN_STEADY_PATH,
        straight: HAND_DRAWN_STEADY_STRAIGHT_PATH,
      },
    ],
    viewBox: "1.24 4.15 97.52 91.5",
  },
  divider: {
    defaultIntensity: 0.5,
    jitter: { anchor: 0.08, control: 0.26 },
    paths: [
      {
        crooked: HAND_DRAWN_DIVIDER_PATH,
        straight: HAND_DRAWN_DIVIDER_STRAIGHT_PATH,
      },
    ],
    viewBox: "0 0 100 12",
  },
};

export interface HandDrawnFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  contentClassName?: string;
  pathClassName?: string;
  shape?: HandDrawnFrameShape;
  surfaceClassName?: string;
  strokeColor?: string;
  crookedness?: number;
  strokeWidthVariation?: number;
  strokeWidth?: number | string;
  svgClassName?: string;
}

export function HandDrawnFrame({
  children,
  className,
  contentClassName,
  pathClassName,
  shape = "surface",
  surfaceClassName,
  strokeColor = "var(--border)",
  crookedness = 5,
  strokeWidthVariation = 4,
  strokeWidth = 2.4,
  svgClassName,
  ...props
}: HandDrawnFrameProps) {
  const { defaultIntensity, jitter, paths, viewBox } =
    HAND_DRAWN_FRAME_SHAPES[shape];
  const frameId = React.useId();
  const frameRef = React.useRef<HTMLDivElement | null>(null);
  const [frameSize, setFrameSize] = React.useState<HandDrawnFrameSize | null>(
    null,
  );
  const resolvedIntensity = React.useMemo(
    () => clamp(crookedness ?? defaultIntensity, 0, 10),
    [defaultIntensity, crookedness],
  );

  React.useEffect(() => {
    const node = frameRef.current;

    if (!node || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateFrameSize = (width: number, height: number) => {
      const roundedWidth = Math.round(width);
      const roundedHeight = Math.round(height);

      if (roundedWidth <= 0 || roundedHeight <= 0) {
        setFrameSize(null);

        return;
      }

      setFrameSize((currentSize) => {
        if (
          currentSize?.width === roundedWidth &&
          currentSize?.height === roundedHeight
        ) {
          return currentSize;
        }

        return {
          height: roundedHeight,
          width: roundedWidth,
        };
      });
    };

    const { height, width } = node.getBoundingClientRect();
    updateFrameSize(width, height);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        updateFrameSize(entry.contentRect.width, entry.contentRect.height);
      }
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const crookednessCompensation =
    React.useMemo<HandDrawnFrameCrookednessCompensation>(
      () =>
        resolveCrookednessCompensation(
          shape,
          viewBox,
          frameSize?.width,
          frameSize?.height,
        ),
      [frameSize?.height, frameSize?.width, shape, viewBox],
    );
  const resolvedNumericStrokeWidth = React.useMemo(
    () => resolveNumericStrokeWidth(strokeWidth),
    [strokeWidth],
  );
  const generatedPaths = React.useMemo(() => {
    const scaledJitter = {
      anchor: jitter.anchor * resolvedIntensity,
      control: jitter.control * resolvedIntensity,
    };

    return paths.map(({ crooked, straight }, index) =>
      perturbPath(
        interpolatePath(
          straight,
          crooked,
          resolvedIntensity,
          crookednessCompensation,
        ),
        viewBox,
        scaledJitter,
        `${shape}:${frameId}:1:${index}`,
        crookednessCompensation,
      ),
    );
  }, [
    crookednessCompensation,
    jitter.control,
    jitter.anchor,
    paths,
    frameId,
    resolvedIntensity,
    viewBox,
    shape,
  ]);
  const strokeLayersByPath = React.useMemo<
    HandDrawnFrameStrokeLayer[][]
  >(() => {
    if (
      resolvedNumericStrokeWidth === null ||
      resolvedNumericStrokeWidth <= 0
    ) {
      return generatedPaths.map(() => [{ strokeWidth }]);
    }

    return generatedPaths.map((_, index) =>
      createStrokeWidthVariationLayers(
        resolvedNumericStrokeWidth,
        `${shape}:${frameId}:stroke-width-variation:${index}`,
        strokeWidthVariation,
      ),
    );
  }, [
    generatedPaths,
    resolvedNumericStrokeWidth,
    frameId,
    shape,
    strokeWidth,
    strokeWidthVariation,
  ]);
  const clipPathId = React.useMemo(
    () => `hand-drawn-frame-clip-${frameId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [frameId],
  );
  const clipPath = React.useMemo(
    () =>
      normalizePathToObjectBoundingBox(
        generatedPaths[0] ?? paths[0]!.crooked,
        viewBox,
      ),
    [generatedPaths, paths, viewBox],
  );
  const clippedLayerStyle = React.useMemo(
    () =>
      ({
        WebkitClipPath: `url(#${clipPathId})`,
        clipPath: `url(#${clipPathId})`,
      }) as React.CSSProperties,
    [clipPathId],
  );

  return (
    <div className={cn("relative", className)} ref={frameRef} {...props}>
      {surfaceClassName ? (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-0 overflow-hidden",
            surfaceClassName,
          )}
          style={clippedLayerStyle}
        />
      ) : null}
      <div
        className={cn("relative z-10 overflow-hidden", contentClassName)}
        style={clippedLayerStyle}
      >
        {children}
      </div>
      <svg
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-20 block h-full w-full overflow-visible",
          svgClassName,
        )}
        preserveAspectRatio="none"
        viewBox={viewBox}
      >
        <defs>
          <clipPath clipPathUnits="objectBoundingBox" id={clipPathId}>
            <path d={clipPath} />
          </clipPath>
        </defs>

        {generatedPaths.map((path, pathIndex) =>
          strokeLayersByPath[pathIndex]!.map((layer, layerIndex) => (
            <path
              key={`${shape}-${pathIndex}-${layerIndex}`}
              className={pathClassName}
              d={path}
              fill="none"
              pathLength={layer.pathLength}
              strokeDasharray={layer.dasharray}
              strokeDashoffset={layer.dashoffset}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={layer.strokeWidth}
              style={{
                opacity: layer.opacity,
                stroke: strokeColor,
              }}
              vectorEffect="non-scaling-stroke"
            />
          )),
        )}
      </svg>
    </div>
  );
}

export type HandDrawnRuleProps = Omit<
  HandDrawnFrameProps,
  "children" | "contentClassName" | "shape" | "surfaceClassName"
>;

export function HandDrawnRule({
  className,
  strokeColor = "var(--border)",
  crookedness = 0.5,
  strokeWidthVariation = 5,
  strokeWidth = 1.1,
  svgClassName = "opacity-90",
  ...props
}: HandDrawnRuleProps) {
  return (
    <HandDrawnFrame
      {...props}
      aria-hidden="true"
      className={cn("pointer-events-none h-3 w-full", className)}
      shape="divider"
      strokeColor={strokeColor}
      strokeWidthVariation={strokeWidthVariation}
      strokeWidth={strokeWidth}
      svgClassName={svgClassName}
      crookedness={crookedness}
    />
  );
}

export type { HandDrawnFrameShape } from "./hand-drawn-frame.geometry";
