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

const HAND_DRAWN_RECT_STRAIGHT_PATH = `M4.6 5.6
  C 22.4 5.6, 38.9 5.6, 51.1 5.6
  C 63.8 5.6, 79.7 5.6, 95.2 5.6

  C 95.2 23.6, 95.2 38.5, 95.2 50.6
  C 95.2 63.8, 95.2 79.6, 95.2 95.1

  C 78.6 95.1, 63.7 95.1, 50.8 95.1
  C 36.9 95.1, 21.9 95.1, 5.1 95.1

  C 5.1 79.7, 5.1 64.2, 5.1 50.2
  C 5.1 36.4, 5.1 20.8, 5.1 5.6`;

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

const HAND_DRAWN_PILL_STRAIGHT_PATH = `M1.4 18
  C 8.4 5.45, 21.5 5.45, 36.1 5.45
  C 46.2 5.45, 56.1 5.45, 65.8 5.45
  C 80.4 5.45, 91.6 5.45, 98.55 18

  C 98.55 25.1, 98.55 38.8, 98.55 50.2
  C 98.55 63.8, 98.55 79, 98.4 82.35

  C 91.5 94.9, 80.2 94.9, 65.9 94.9
  C 55.8 94.9, 45.8 94.9, 35.9 94.9
  C 21.7 94.9, 8.4 94.9, 1.5 82.35

  C 1.5 79, 1.5 63.7, 1.4 50.2
  C 1.4 37, 1.4 21, 1.4 18
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

const HAND_DRAWN_PANEL_STRAIGHT_PATH = `M1.5 10.2
  C 13.2 5.1, 25.1 5.1, 36.9 5.1
  C 47.3 5.1, 58.1 5.1, 68.7 5.1
  C 79 5.1, 89.2 5.1, 98.35 10.2

  C 98.35 20.5, 98.35 35.6, 98.1 50.2
  C 98.1 64.9, 98.1 79.4, 98.02 89.72

  C 89.2 94.86, 79.2 94.86, 68.8 94.86
  C 58.2 94.86, 47.5 94.86, 36.8 94.86
  C 25.2 94.86, 13.6 94.86, 1.62 89.72

  C 1.62 79.8, 1.62 64.7, 1.82 50
  C 1.82 35.2, 1.82 20.1, 1.5 10.2
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

const HAND_DRAWN_BANNER_STRAIGHT_PATH = `M0.58 7.2
  C 8.4 1.18, 16.9 1.18, 25.3 1.18
  C 34.6 1.18, 43.5 1.18, 50.7 1.18
  C 59.7 1.18, 68.8 1.18, 76.2 1.18
  C 84.2 1.18, 91.8 1.18, 99.42 7.2

  C 99.42 24.7, 99.42 49, 99.42 73.6
  C 99.42 81.8, 99.42 90.1, 99.32 92.88

  C 91.4 98.92, 84.5 98.92, 76.2 98.92
  C 68.2 98.92, 59.7 98.92, 50.4 98.92
  C 42.6 98.92, 34.3 98.92, 25.4 98.92
  C 17.2 98.92, 8.9 98.92, 0.72 92.88

  C 0.72 90.1, 0.72 81.8, 0.72 73.5
  C 0.72 49, 0.72 24.6, 0.58 7.2
  Z`;

const HAND_DRAWN_DIVIDER_PATH = `M1.2 6
  C 11.8 4.95, 22.5 7.15, 33.6 5.85
  C 44.6 4.88, 55.3 7.12, 66.1 5.9
  C 76.9 4.96, 87.4 6.86, 98.8 5.8`;

const HAND_DRAWN_DIVIDER_STRAIGHT_PATH = `M1.2 6
  C 11.8 6, 22.5 6, 33.6 6
  C 44.6 6, 55.3 6, 66.1 6
  C 76.9 6, 87.4 6, 98.8 6`;

export type HandDrawnFrameShape =
  | "organic"
  | "steady"
  | "pill"
  | "panel"
  | "surface"
  | "card"
  | "banner"
  | "divider";

type HandDrawnFrameJitterConfig = {
  anchor: number;
  control: number;
};

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

type HandDrawnFrameStrokeLayer = {
  dasharray?: string;
  dashoffset?: number;
  opacity?: number;
  pathLength?: number;
  strokeWidth: number | string;
};

const HAND_DRAWN_THICKNESS_PATH_LENGTH = 100;

function hashSeed(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seed: string) {
  let state = hashSeed(seed) || 0x6d2b79f5;

  return () => {
    state += 0x6d2b79f5;

    let value = state;

    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function parseViewBox(viewBox: string) {
  const [rawMinX = 0, rawMinY = 0, rawWidth = 0, rawHeight = 0] = viewBox
    .trim()
    .split(/\s+/)
    .map(Number);
  const minX = Number.isFinite(rawMinX) ? rawMinX : 0;
  const minY = Number.isFinite(rawMinY) ? rawMinY : 0;
  const width = Number.isFinite(rawWidth) ? rawWidth : 0;
  const height = Number.isFinite(rawHeight) ? rawHeight : 0;

  return {
    height,
    maxX: minX + width,
    maxY: minY + height,
    minX,
    minY,
    width,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function coordinateRole(command: string, coordinateIndex: number) {
  switch (command) {
    case "M":
    case "L":
    case "T":
      return "anchor";
    case "H":
    case "V":
      return "anchor";
    case "Q":
      return coordinateIndex % 4 < 2 ? "control" : "anchor";
    case "S":
      return coordinateIndex % 4 < 2 ? "control" : "anchor";
    case "C":
      return coordinateIndex % 6 < 4 ? "control" : "anchor";
    default:
      return null;
  }
}

function coordinateAxis(command: string, coordinateIndex: number) {
  if (command === "H") return "x";
  if (command === "V") return "y";

  return coordinateIndex % 2 === 0 ? "x" : "y";
}

function perturbPath(
  path: string,
  viewBox: string,
  jitter: HandDrawnFrameJitterConfig,
  seed: string,
) {
  if (jitter.anchor <= 0 && jitter.control <= 0) {
    return path;
  }

  const bounds = parseViewBox(viewBox);
  const tokens = path.match(/[A-Za-z]|-?\d*\.?\d+/g) ?? [];
  const random = createSeededRandom(seed);
  let axis: "x" | "y" = "x";
  let command = "";
  let coordinateIndex = 0;

  return tokens
    .map((token) => {
      if (/^[A-Za-z]$/.test(token)) {
        command = token;
        coordinateIndex = 0;

        if (/[MLCQST]/.test(token)) {
          axis = "x";
        } else if (token === "H") {
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

      const role = coordinateRole(command, coordinateIndex);
      const resolvedAxis = coordinateAxis(command, coordinateIndex) ?? axis;
      const jitterAmount =
        role === "control"
          ? jitter.control
          : role === "anchor"
            ? jitter.anchor
            : 0;

      coordinateIndex += 1;
      axis = resolvedAxis === "x" ? "y" : "x";

      if (!role || jitterAmount <= 0) {
        return token;
      }

      const delta = (random() * 2 - 1) * jitterAmount;
      const min = resolvedAxis === "x" ? bounds.minX : bounds.minY;
      const max = resolvedAxis === "x" ? bounds.maxX : bounds.maxY;

      return clamp(value + delta, min, max).toFixed(3);
    })
    .join(" ");
}

function interpolatePath(fromPath: string, toPath: string, intensity: number) {
  if (intensity <= 0) {
    return fromPath;
  }

  if (intensity >= 1) {
    return toPath;
  }

  const fromTokens = fromPath.match(/[A-Za-z]|-?\d*\.?\d+/g) ?? [];
  const toTokens = toPath.match(/[A-Za-z]|-?\d*\.?\d+/g) ?? [];

  if (fromTokens.length !== toTokens.length) {
    return intensity < 0.5 ? fromPath : toPath;
  }

  return fromTokens
    .map((fromToken, index) => {
      const toToken = toTokens[index];

      if (!toToken) {
        return fromToken;
      }

      if (/^[A-Za-z]$/.test(fromToken) || /^[A-Za-z]$/.test(toToken)) {
        return fromToken === toToken ? fromToken : toToken;
      }

      const fromValue = Number(fromToken);
      const toValue = Number(toToken);

      if (Number.isNaN(fromValue) || Number.isNaN(toValue)) {
        return toToken;
      }

      return (fromValue + (toValue - fromValue) * intensity).toFixed(3);
    })
    .join(" ");
}

function normalizePathToObjectBoundingBox(path: string, viewBox: string) {
  const bounds = parseViewBox(viewBox);
  const tokens = path.match(/[A-Za-z]|-?\d*\.?\d+/g) ?? [];
  let axis: "x" | "y" = "x";
  let command = "";

  const normalized = tokens
    .map((token) => {
      if (/^[A-Za-z]$/.test(token)) {
        command = token;

        if (/[MLCQST]/.test(token)) {
          axis = "x";
        } else if (token === "H") {
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
        return ((value - bounds.minX) / bounds.width).toFixed(6);
      }

      if (command === "V") {
        return ((value - bounds.minY) / bounds.height).toFixed(6);
      }

      const normalizedValue =
        axis === "x"
          ? (value - bounds.minX) / bounds.width
          : (value - bounds.minY) / bounds.height;

      axis = axis === "x" ? "y" : "x";

      return normalizedValue.toFixed(6);
    })
    .join(" ");

  return /[Zz]\s*$/.test(normalized) ? normalized : `${normalized} Z`;
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

function formatSvgNumber(value: number) {
  return Number(value.toFixed(3));
}

function createStrokeDashPattern(
  random: () => number,
  segmentCount: number,
  length = HAND_DRAWN_THICKNESS_PATH_LENGTH,
) {
  const segments: number[] = [];

  for (let index = 0; index < segmentCount; index += 1) {
    segments.push(1.25 + random() * 1.35);
    segments.push(0.85 + random() * 1.05);
  }

  const totalLength = segments.reduce((sum, segment) => sum + segment, 0);

  return segments.map((segment) => (segment / totalLength) * length);
}

// SVG doesn't support varying stroke width along a single path, so we layer a
// few deterministic dash-masked strokes to create a restrained hand-drawn drift.
function createThicknessVariationStrokeLayers(
  strokeWidth: number,
  seed: string,
) {
  const random = createSeededRandom(seed);
  const variationSpan = clamp(strokeWidth * 0.22, 0.16, 0.42);
  const layers: HandDrawnFrameStrokeLayer[] = [
    {
      strokeWidth: formatSvgNumber(
        clamp(
          strokeWidth - variationSpan * (0.28 + random() * 0.12),
          Math.max(strokeWidth * 0.82, strokeWidth - variationSpan * 0.5),
          strokeWidth,
        ),
      ),
    },
  ];

  for (let index = 0; index < 3; index += 1) {
    const dashPattern = createStrokeDashPattern(random, 3 + index);
    const thicknessFactor = clamp(
      0.18 + index * 0.24 + (random() - 0.5) * 0.08,
      0.12,
      0.72,
    );

    layers.push({
      dasharray: dashPattern.map((segment) => segment.toFixed(3)).join(" "),
      dashoffset: formatSvgNumber(random() * HAND_DRAWN_THICKNESS_PATH_LENGTH),
      opacity: formatSvgNumber(
        clamp(0.42 - index * 0.08 + random() * 0.06, 0.2, 0.5),
      ),
      pathLength: HAND_DRAWN_THICKNESS_PATH_LENGTH,
      strokeWidth: formatSvgNumber(
        strokeWidth + variationSpan * thicknessFactor,
      ),
    });
  }

  return layers;
}

const HAND_DRAWN_FRAME_SHAPES: Record<
  HandDrawnFrameShape,
  HandDrawnFrameShapeConfig
> = {
  organic: {
    defaultIntensity: 0.7,
    jitter: { anchor: 0.2, control: 0.82 },
    paths: [
      {
        crooked: HAND_DRAWN_RECT_PATH,
        straight: HAND_DRAWN_RECT_STRAIGHT_PATH,
      },
    ],
    viewBox: "0 0 100 100",
  },
  steady: {
    defaultIntensity: 0.45,
    jitter: { anchor: 0.14, control: 0.54 },
    paths: [
      {
        crooked: HAND_DRAWN_STEADY_PATH,
        straight: HAND_DRAWN_STEADY_STRAIGHT_PATH,
      },
    ],
    // Active nav pills read better when the stroke hugs the container more tightly.
    viewBox: "0.95 0 98.1 100",
  },
  pill: {
    defaultIntensity: 0.55,
    jitter: { anchor: 0.16, control: 0.58 },
    paths: [
      {
        crooked: HAND_DRAWN_PILL_PATH,
        straight: HAND_DRAWN_PILL_STRAIGHT_PATH,
      },
    ],
    // Nav pills need a bit more wobble on the top and bottom while staying snug.
    viewBox: "0.95 3.8 98.1 92.8",
  },
  panel: {
    defaultIntensity: 0.5,
    jitter: { anchor: 0.15, control: 0.5 },
    paths: [
      {
        crooked: HAND_DRAWN_PANEL_PATH,
        straight: HAND_DRAWN_PANEL_STRAIGHT_PATH,
      },
    ],
    // Compact panels benefit from a balanced wobble on all sides with tight padding.
    viewBox: "0.95 2.8 98.1 94.2",
  },
  surface: {
    defaultIntensity: 0.35,
    jitter: { anchor: 0.14, control: 0.46 },
    paths: [
      {
        crooked: HAND_DRAWN_STEADY_PATH,
        straight: HAND_DRAWN_STEADY_STRAIGHT_PATH,
      },
    ],
    // Account surfaces read better with a calmer grade-2 wobble while staying
    // tightly cropped against the real edges of the container.
    viewBox: "1.24 4.15 97.52 91.5",
  },
  card: {
    defaultIntensity: 0.6,
    jitter: { anchor: 0.18, control: 0.62 },
    paths: [
      {
        crooked: HAND_DRAWN_STEADY_PATH,
        straight: HAND_DRAWN_STEADY_STRAIGHT_PATH,
      },
    ],
    // Portrait cards are tall, so we tighten the vertical crop more aggressively
    // to keep the border visually glued to the real top and bottom edges.
    viewBox: "1.3 4.95 97.55 90.15",
  },
  banner: {
    defaultIntensity: 0.3,
    jitter: { anchor: 0.12, control: 0.4 },
    paths: [
      {
        crooked: HAND_DRAWN_BANNER_PATH,
        straight: HAND_DRAWN_BANNER_STRAIGHT_PATH,
      },
    ],
    // Wide banners amplify tiny offsets, so we tighten the frame on both axes.
    // This keeps the border close to the box while preserving a subtle wobble.
    viewBox: "0.45 0.4 99.1 99.2",
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
    // Dividers should stay horizontal and calm, with only a light hand-drawn drift.
    viewBox: "0 0 100 12",
  },
};

export interface HandDrawnFrameProps
  extends React.HTMLAttributes<HTMLDivElement> {
  clipContent?: boolean;
  contentClassName?: string;
  deformationIntensity?: number;
  pathClassName?: string;
  seed?: number | string;
  shape?: HandDrawnFrameShape;
  strokeColor?: string;
  strokeWidth?: number | string;
  svgClassName?: string;
  useDeformationVariation?: boolean;
  useThicknessVariation?: boolean;
}

export function HandDrawnFrame({
  children,
  className,
  clipContent = false,
  contentClassName,
  deformationIntensity = 5,
  pathClassName,
  useDeformationVariation = true,
  useThicknessVariation = true,
  seed,
  shape = "organic",
  strokeColor = "var(--border)",
  strokeWidth = 2.4,
  svgClassName,
  ...props
}: HandDrawnFrameProps) {
  const { defaultIntensity, jitter, paths, viewBox } =
    HAND_DRAWN_FRAME_SHAPES[shape];
  const frameId = React.useId();
  const resolvedSeed = React.useMemo(
    () => String(seed ?? frameId),
    [frameId, seed],
  );
  const resolvedIntensity = React.useMemo(
    () => clamp(deformationIntensity ?? defaultIntensity, 0, 10),
    [defaultIntensity, deformationIntensity],
  );
  const resolvedUseDeformationVariationKey = React.useMemo(
    () => (useDeformationVariation ? "1" : "0"),
    [useDeformationVariation],
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
        interpolatePath(straight, crooked, resolvedIntensity),
        viewBox,
        scaledJitter,
        `${shape}:${resolvedSeed}:${resolvedUseDeformationVariationKey}:${index}`,
      ),
    );
  }, [
    jitter.anchor,
    jitter.control,
    paths,
    resolvedIntensity,
    resolvedSeed,
    resolvedUseDeformationVariationKey,
    shape,
    viewBox,
  ]);
  const strokeLayersByPath = React.useMemo<HandDrawnFrameStrokeLayer[][]>(
    () => {
      if (
        !useThicknessVariation ||
        resolvedNumericStrokeWidth === null ||
        resolvedNumericStrokeWidth <= 0
      ) {
        return generatedPaths.map(() => [{ strokeWidth }]);
      }

      return generatedPaths.map((_, index) =>
        createThicknessVariationStrokeLayers(
          resolvedNumericStrokeWidth,
          `${shape}:${resolvedSeed}:thickness:${index}`,
        ),
      );
    },
    [
      generatedPaths,
      resolvedNumericStrokeWidth,
      resolvedSeed,
      shape,
      strokeWidth,
      useThicknessVariation,
    ],
  );
  const clipPathId = React.useMemo(
    () => `hand-drawn-frame-clip-${frameId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [frameId],
  );
  const clipPath = React.useMemo(
    () => normalizePathToObjectBoundingBox(generatedPaths[0] ?? paths[0]!.crooked, viewBox),
    [generatedPaths, paths, viewBox],
  );
  const contentStyle = clipContent
    ? ({
        WebkitClipPath: `url(#${clipPathId})`,
        clipPath: `url(#${clipPathId})`,
      } as React.CSSProperties)
    : undefined;

  return (
    <div className={cn("relative", className)} {...props}>
      <div
        className={cn(
          "relative z-10",
          clipContent && "overflow-hidden",
          contentClassName,
        )}
        style={contentStyle}
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
        {clipContent ? (
          <defs>
            <clipPath clipPathUnits="objectBoundingBox" id={clipPathId}>
              <path d={clipPath} />
            </clipPath>
          </defs>
        ) : null}
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
  "children" | "clipContent" | "contentClassName" | "shape"
>;

export function HandDrawnRule({
  className,
  deformationIntensity = 0.5,
  strokeColor = "var(--border)",
  strokeWidth = 1.1,
  svgClassName = "opacity-90",
  ...props
}: HandDrawnRuleProps) {
  return (
    <HandDrawnFrame
      {...props}
      aria-hidden="true"
      className={cn("pointer-events-none h-3 w-full", className)}
      deformationIntensity={deformationIntensity}
      shape="divider"
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
      svgClassName={svgClassName}
    />
  );
}
