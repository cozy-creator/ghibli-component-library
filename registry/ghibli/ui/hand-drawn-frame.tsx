import * as React from "react";

import { cn } from "@/lib/utils";
import {
  createStrokeWidthVariationLayers,
  type HandDrawnFrameStrokeLayer,
  type HandDrawnFrameStrokePathVariant,
} from "./hand-drawn-frame.stroke-width-variation";
import {
  buildHandDrawnGeometry,
  geometryToOutlinePath,
  geometryToSidePath,
  geometryViewBox,
  normalizePathToObjectBoundingBox,
  type HandDrawnFrameShape,
  type HandDrawnFrameSize,
} from "./hand-drawn-frame.geometry";

type HandDrawnFrameSurfacePathVariantMap = Partial<
  Record<HandDrawnFrameStrokePathVariant, string>
>;

// Reference pixel size used before the element has been measured (first paint /
// SSR). The geometry is rebuilt at the real size once the ResizeObserver fires;
// this just keeps the first frame sensible instead of empty.
const FALLBACK_SIZE: Record<HandDrawnFrameShape, HandDrawnFrameSize> = {
  surface: { height: 90, width: 140 },
  divider: { height: 12, width: 240 },
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
  /**
   * 0..10 hand-wobble of the border. Interpreted as a max deviation amplitude
   * in *pixels* (≈0.55px per unit), constant regardless of edge length. The
   * NUMBER of wobbles along an edge scales with the edge's pixel length, so a
   * wide-short box gets many gentle wobbles on its long sides and few on its
   * short sides — all four edges share the same per-pixel deviation density. 0
   * renders a perfectly straight rectangle.
   */
  crookedness?: number;
  /**
   * 0..10 stroke-width variation. Amplitude (thin↔thick swing) is in pixels and
   * length-independent; the number of width-varying ribbon slices scales with
   * each edge's pixel length, so the variation has the same spatial frequency
   * on every edge. 0 renders a uniform-width stroke.
   */
  strokeWidthVariation?: number;
  /**
   * 0..10 stroke-width *frequency*: how often the width oscillates within the
   * range set by `strokeWidthVariation`, along the line. 0 = pick one random
   * width within the range and hold it (uniform along this line, but still
   * uneven from one component to the next). Higher = more frequent oscillation
   * that also reaches further toward the range's thin/thick edges.
   */
  strokeWidthFrequency?: number;
  strokeWidth?: number | string;
  svgClassName?: string;
}

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

// Dispatcher: when the sketch is fully "off" (no crookedness and no width
// variation) a surface is just a rectangle — render it with a plain CSS border
// instead of paying for a ResizeObserver, pixel-space geometry, SVG path
// generation and a clip-path. This branch has NO hooks, so the expensive
// sketched component never mounts in that case (e.g. the modern/sunset/ocean
// themes flatten every variant to 0/0).
export function HandDrawnFrame(props: HandDrawnFrameProps) {
  const shape = props.shape ?? "surface";
  // Default OFF: an unconfigured frame is a plain rectangle (flat CSS path).
  // Sketchiness is opt-in via crookedness / strokeWidthVariation.
  const crookedness = props.crookedness ?? 0;
  const strokeWidthVariation = props.strokeWidthVariation ?? 0;
  const isFlat =
    shape === "surface" &&
    Math.min(Math.max(crookedness, 0), 10) === 0 &&
    strokeWidthVariation === 0;

  return isFlat ? (
    <HandDrawnFrameFlat {...props} />
  ) : (
    <HandDrawnFrameSketched {...props} />
  );
}

function HandDrawnFrameFlat({
  children,
  className,
  contentClassName,
  surfaceClassName,
  strokeColor = "var(--border)",
  fillColor,
  strokeWidth = 2.4,
  // Sketch-only props: irrelevant on the flat CSS path, destructured out so
  // they are not spread onto the DOM node.
  crookedness,
  strokeWidthVariation,
  strokeWidthFrequency,
  texture,
  textureOpacity,
  pathClassName,
  svgClassName,
  shape,
  ...props
}: HandDrawnFrameProps) {
  void crookedness;
  void strokeWidthVariation;
  void strokeWidthFrequency;
  void texture;
  void textureOpacity;
  void pathClassName;
  void svgClassName;
  void shape;

  const numericStrokeWidth = resolveNumericStrokeWidth(strokeWidth);
  const borderWidth =
    numericStrokeWidth && numericStrokeWidth > 0 ? numericStrokeWidth : 0;

  return (
    <div
      className={cn("relative rounded-[var(--theme-radius-md)]", className)}
      {...props}
    >
      {fillColor !== undefined ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
          style={{ background: fillColor }}
        />
      ) : surfaceClassName ? (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]",
            surfaceClassName,
          )}
        />
      ) : null}
      <div
        className={cn(
          "relative z-10 overflow-hidden rounded-[inherit]",
          contentClassName,
        )}
      >
        {children}
      </div>
      {borderWidth > 0 ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
          style={{ border: `${borderWidth}px solid ${strokeColor}` }}
        />
      ) : null}
    </div>
  );
}

function HandDrawnFrameSketched({
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
  crookedness = 0,
  strokeWidthVariation = 0,
  strokeWidthFrequency = 5,
  strokeWidth = 2.4,
  svgClassName,
  ...props
}: HandDrawnFrameProps) {
  const frameId = React.useId();
  const frameRef = React.useRef<HTMLDivElement | null>(null);
  const [frameSize, setFrameSize] = React.useState<HandDrawnFrameSize | null>(
    null,
  );
  const resolvedCrookedness = Math.min(Math.max(crookedness, 0), 10);

  React.useEffect(() => {
    const node = frameRef.current;

    if (!node || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateFrameSize = (width: number, height: number) => {
      const roundedWidth = Math.round(width);
      const roundedHeight = Math.round(height);

      if (roundedWidth <= 0 || roundedHeight <= 0) {
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

  // Geometry is built in pixel space at the measured (or fallback) size so the
  // perturbation density and amplitude are honest screen pixels.
  const geometrySize = frameSize ?? FALLBACK_SIZE[shape];
  const geometry = React.useMemo(
    () =>
      buildHandDrawnGeometry(
        shape,
        geometrySize,
        resolvedCrookedness,
        `${shape}:${frameId}`,
      ),
    [shape, geometrySize, resolvedCrookedness, frameId],
  );

  const viewBox = React.useMemo(() => geometryViewBox(geometry), [geometry]);
  const outlinePath = React.useMemo(
    () => geometryToOutlinePath(geometry),
    [geometry],
  );

  // Per-side smooth paths so the stroke-width ribbon can follow each edge.
  const sidePaths = React.useMemo<HandDrawnFrameSurfacePathVariantMap>(() => {
    if (shape !== "surface") {
      return { frame: outlinePath };
    }

    const map: HandDrawnFrameSurfacePathVariantMap = { frame: outlinePath };

    for (const edge of geometry.edges) {
      if (edge.side !== "frame") {
        map[edge.side] = geometryToSidePath(edge);
      }
    }

    return map;
  }, [geometry, outlinePath, shape]);

  const resolvedNumericStrokeWidth = React.useMemo(
    () => resolveNumericStrokeWidth(strokeWidth),
    [strokeWidth],
  );

  const strokeLayers = React.useMemo<HandDrawnFrameStrokeLayer[]>(() => {
    if (
      resolvedNumericStrokeWidth === null ||
      resolvedNumericStrokeWidth <= 0
    ) {
      return [{ strokeWidth }];
    }

    return createStrokeWidthVariationLayers(
      resolvedNumericStrokeWidth,
      `${shape}:${frameId}:stroke-width-variation`,
      strokeWidthVariation,
      strokeWidthFrequency,
      { basePath: outlinePath, shape },
    );
  }, [
    resolvedNumericStrokeWidth,
    shape,
    frameId,
    strokeWidth,
    strokeWidthVariation,
    strokeWidthFrequency,
    outlinePath,
  ]);

  const renderedStrokePaths = React.useMemo(
    () =>
      strokeLayers.map((layer) => {
        if (layer.customPath) {
          return layer.customPath;
        }

        const variant = layer.pathVariant ?? "frame";

        return sidePaths[variant] ?? outlinePath;
      }),
    [strokeLayers, sidePaths, outlinePath],
  );

  const clipPathId = React.useMemo(
    () => `hand-drawn-frame-clip-${frameId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [frameId],
  );
  const clipPath = React.useMemo(
    () =>
      normalizePathToObjectBoundingBox(
        outlinePath,
        geometry.width,
        geometry.height,
      ),
    [outlinePath, geometry.width, geometry.height],
  );
  const clippedLayerStyle = React.useMemo(
    () => ({
      WebkitClipPath: `url(#${clipPathId})`,
      clipPath: `url(#${clipPathId})`,
    }),
    [clipPathId],
  );

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

        {strokeLayers.map((layer, layerIndex) => (
          <path
            key={`${shape}-${layerIndex}`}
            className={pathClassName}
            d={renderedStrokePaths[layerIndex] ?? outlinePath}
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
        ))}
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
  crookedness = 0,
  strokeWidthVariation = 0,
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
