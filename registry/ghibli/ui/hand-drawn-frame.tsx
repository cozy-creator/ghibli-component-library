import * as React from "react";

import { cn } from "@/lib/utils";
import {
  createStrokeWidthVariationLayers,
  type HandDrawnFrameStrokeLayer,
  type HandDrawnFrameStrokePathVariant,
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

const HAND_DRAWN_FRAME_PATH_TOKEN_PATTERN = /[A-Za-z]|-?\d*\.?\d+/g;

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

type HandDrawnFrameSurfacePathVariantMap = Partial<
  Record<HandDrawnFrameStrokePathVariant, string>
>;

type HandDrawnFrameSurfacePathSegment = {
  start: [string, string];
  values: [string, string, string, string, string, string];
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

function offsetPath(
  path: string,
  offset: HandDrawnFrameStrokeLayer["pathOffset"],
) {
  if (!offset || (offset.x === 0 && offset.y === 0)) {
    return path;
  }

  const tokens = path.match(HAND_DRAWN_FRAME_PATH_TOKEN_PATTERN) ?? [];
  let axis: "x" | "y" = "x";
  let command = "";

  return tokens
    .map((token) => {
      if (/^[A-Za-z]$/.test(token)) {
        command = token;

        if (/[MLCQST]/.test(token) || token === "H") {
          axis = "x";
        } else if (token === "V") {
          axis = "y";
        }

        return token;
      }

      const value = Number(token);

      if (Number.isNaN(value)) {
        return token;
      }

      if (command === "H") {
        return (value + offset.x).toFixed(3);
      }

      if (command === "V") {
        return (value + offset.y).toFixed(3);
      }

      const translatedValue =
        axis === "x" ? value + offset.x : value + offset.y;

      axis = axis === "x" ? "y" : "x";

      return translatedValue.toFixed(3);
    })
    .join(" ");
}

function resolveSurfacePathVariantMap(
  path: string,
): HandDrawnFrameSurfacePathVariantMap | null {
  const tokens = path.match(HAND_DRAWN_FRAME_PATH_TOKEN_PATTERN) ?? [];

  if (tokens[0] !== "M" || tokens.length < 10) {
    return null;
  }

  let tokenIndex = 1;
  const moveX = tokens[tokenIndex];
  const moveY = tokens[tokenIndex + 1];

  if (!moveX || !moveY) {
    return null;
  }

  tokenIndex += 2;

  const segments: HandDrawnFrameSurfacePathSegment[] = [];
  let currentPoint: [string, string] = [moveX, moveY];

  while (tokenIndex < tokens.length) {
    const command = tokens[tokenIndex];

    tokenIndex += 1;

    if (command === "Z" || command === "z") {
      break;
    }

    if (command !== "C") {
      return null;
    }

    const values = tokens.slice(tokenIndex, tokenIndex + 6);

    if (
      values.length < 6 ||
      values.some((value) => !value || /[A-Za-z]/.test(value))
    ) {
      return null;
    }

    const resolvedValues = [
      values[0]!,
      values[1]!,
      values[2]!,
      values[3]!,
      values[4]!,
      values[5]!,
    ] as [string, string, string, string, string, string];

    segments.push({
      start: currentPoint,
      values: resolvedValues,
    });
    currentPoint = [resolvedValues[4], resolvedValues[5]];
    tokenIndex += 6;
  }

  if (segments.length !== 8) {
    return null;
  }

  const createSidePath = (startIndex: number) => {
    const sideSegments = segments.slice(startIndex, startIndex + 2);
    const startPoint = sideSegments[0]?.start;

    if (!startPoint || sideSegments.length !== 2) {
      return null;
    }

    return `M ${startPoint[0]} ${startPoint[1]} ${sideSegments
      .map((segment) => `C ${segment.values.join(" ")}`)
      .join(" ")}`;
  };

  const top = createSidePath(0);
  const right = createSidePath(2);
  const bottom = createSidePath(4);
  const left = createSidePath(6);

  if (!top || !right || !bottom || !left) {
    return null;
  }

  return {
    bottom,
    frame: path,
    left,
    right,
    top,
  } satisfies HandDrawnFrameSurfacePathVariantMap;
}

function resolveStrokePathVariantMap(
  shape: HandDrawnFrameShape,
  path: string,
): HandDrawnFrameSurfacePathVariantMap {
  if (shape !== "surface") {
    return { frame: path } satisfies HandDrawnFrameSurfacePathVariantMap;
  }

  return resolveSurfacePathVariantMap(path) ?? { frame: path };
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
  /**
   * Solid color used to fill the crooked path itself, so the filled region's
   * edges wobble in lockstep with the stroke instead of being a straight
   * rectangle behind it. When set, the SVG paints the fill and the
   * `surfaceClassName` <div> is skipped. Leave undefined for surfaces that need
   * a CSS background (gradients, images, backdrop-blur) — those keep using the
   * clipped `surfaceClassName` layer.
   */
  fillColor?: string;
  /**
   * Adds a subtle paper-grain texture over the fill. Defaults to on for
   * `fillColor` surfaces (buttons); large CSS-background panels can opt out.
   */
  texture?: boolean;
  /** 0..1 opacity of the paper-grain overlay. */
  textureOpacity?: number;
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
  fillColor,
  texture,
  textureOpacity = 0.06,
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

    return generatedPaths.map((path, index) =>
      createStrokeWidthVariationLayers(
        resolvedNumericStrokeWidth,
        `${shape}:${frameId}:stroke-width-variation:${index}`,
        strokeWidthVariation,
        { basePath: path, shape },
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
  const strokePathVariantsByPath = React.useMemo<
    HandDrawnFrameSurfacePathVariantMap[]
  >(
    () =>
      generatedPaths.map((path) => resolveStrokePathVariantMap(shape, path)),
    [generatedPaths, shape],
  );
  const renderedStrokePathsByPath = React.useMemo(
    () =>
      generatedPaths.map((path, pathIndex) =>
        strokeLayersByPath[pathIndex]!.map((layer, layerIndex) => {
          const variantBasePath =
            layer.customPath ??
            strokePathVariantsByPath[pathIndex]?.[
              layer.pathVariant ?? "frame"
            ] ??
            path;
          const offsetBasePath = layer.pathOffset
            ? offsetPath(variantBasePath, layer.pathOffset)
            : variantBasePath;

          return layer.pathJitter
            ? perturbPath(
                offsetBasePath,
                viewBox,
                layer.pathJitter,
                layer.pathSeed ??
                  `${shape}:${frameId}:stroke-layer-path:${pathIndex}:${layerIndex}`,
                crookednessCompensation,
              )
            : offsetBasePath;
        }),
      ),
    [
      crookednessCompensation,
      frameId,
      generatedPaths,
      shape,
      strokePathVariantsByPath,
      strokeLayersByPath,
      viewBox,
    ],
  );
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
    () => ({
      WebkitClipPath: `url(#${clipPathId})`,
      clipPath: `url(#${clipPathId})`,
    }),
    [clipPathId],
  );

  // The crooked outline path shared by the fill, stroke, and clip.
  const outlinePath = generatedPaths[0] ?? paths[0]!.crooked;
  // Texture defaults on for solid-color fills (buttons), off for CSS-background
  // surfaces unless explicitly enabled — large panels stay clean by default.
  const showTexture =
    shape === "surface" &&
    (texture ?? (fillColor !== undefined && surfaceClassName === undefined));
  const textureFilterId = `hand-drawn-frame-grain-${frameId.replace(
    /[^a-zA-Z0-9_-]/g,
    "",
  )}`;

  return (
    <div className={cn("relative", className)} ref={frameRef} {...props}>
      {/* Fill: paint the crooked path itself so the filled region's edges wobble
          in lockstep with the stroke (no straight rectangle behind it). */}
      {fillColor !== undefined ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 block h-full w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox={viewBox}
        >
          {showTexture ? (
            <defs>
              <filter id={textureFilterId}>
                <feTurbulence
                  baseFrequency="0.9"
                  numOctaves={2}
                  result="grain"
                  seed={1}
                  stitchTiles="stitch"
                  type="fractalNoise"
                />
                <feColorMatrix in="grain" type="saturate" values="0" />
              </filter>
            </defs>
          ) : null}
          <path d={outlinePath} fill={fillColor} stroke="none" />
          {showTexture ? (
            <path
              d={outlinePath}
              fill="black"
              stroke="none"
              style={{ filter: `url(#${textureFilterId})`, opacity: textureOpacity }}
            />
          ) : null}
        </svg>
      ) : surfaceClassName ? (
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
              d={renderedStrokePathsByPath[pathIndex]![layerIndex] ?? path}
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
