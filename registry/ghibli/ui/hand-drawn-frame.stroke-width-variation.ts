import { clamp, type HandDrawnFrameShape } from "./hand-drawn-frame.geometry";
import {
  type CubicBezier,
  bezierToPathString,
  parseCubicSegments,
  subdivideCubicBezier,
} from "./hand-drawn-frame.bezier";
import { createSeededRandom } from "./hand-drawn-frame.random";

export type HandDrawnFrameSurfaceSide = "top" | "right" | "bottom" | "left";

export type HandDrawnFrameStrokePathVariant =
  | "frame"
  | HandDrawnFrameSurfaceSide;

export type HandDrawnFrameStrokeLayer = {
  customPath?: string;
  dasharray?: string;
  dashoffset?: number;
  opacity?: number;
  pathJitter?: {
    anchor: number;
    control: number;
  };
  pathLength?: number;
  pathOffset?: {
    x: number;
    y: number;
  };
  pathSeed?: string;
  pathVariant?: HandDrawnFrameStrokePathVariant;
  strokeWidth: number | string;
};

type HandDrawnFrameStrokeWidthVariationOptions = {
  basePath?: string;
  shape?: HandDrawnFrameShape;
};

type StrokeWidthVariationProfile = {
  accentBaseOpacity: number;
  accentExtraCount: number;
  centerWidth: number;
  dryAccentEnabled: boolean;
  intensity: number;
  intensityFactor: number;
  jitterScale: number;
  maxWidth: number;
  minWidth: number;
  offsetRetraceEnabled: boolean;
  ribbonSegmentsPerCurve: number;
};

type WidthCurveSeed = {
  amps: number[];
  freqs: number[];
  phases: number[];
};

const NORMALIZED_PATH_LENGTH = 100;
const SURFACE_SIDES: HandDrawnFrameSurfaceSide[] = [
  "top",
  "right",
  "bottom",
  "left",
];
const DEFAULT_SURFACE_BASE_PATH =
  "M1.4 5.3 C 25.8 4.7, 49.8 5.9, 74.4 5.2 C 83.5 5, 91.5 5.4, 98.6 5.1 C 98.1 25.1, 99 38.8, 98.6 50.2 C 98.2 63.8, 99 79, 98.4 94.8 C 74.7 95.4, 50.1 94.2, 25.1 94.9 C 16.8 95.1, 8.9 95, 1.5 94.9 C 1.9 79, 0.9 63.7, 1.4 50.2 C 1.8 37, 1 21, 1.4 5.3 Z";
const DEFAULT_DIVIDER_BASE_PATH =
  "M1.2 6 C 11.8 4.95, 22.5 7.15, 33.6 5.85 C 44.6 4.88, 55.3 7.12, 66.1 5.9 C 76.9 4.96, 87.4 6.86, 98.8 5.8";
function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function formatSvgNumber(value: number) {
  return Number(value.toFixed(3));
}

function partitionSurfaceSides(
  segments: CubicBezier[],
): Record<HandDrawnFrameSurfaceSide, CubicBezier[]> | null {
  if (segments.length < 8) {
    return null;
  }

  return {
    bottom: [segments[4]!, segments[5]!],
    left: [segments[6]!, segments[7]!],
    right: [segments[2]!, segments[3]!],
    top: [segments[0]!, segments[1]!],
  };
}

function createWidthCurveSeed(random: () => number): WidthCurveSeed {
  // 3 sines, with the dominant wave at ~2 humps per side so each edge clearly
  // reads thick → thin → thick → thin instead of one slow swell. Higher
  // harmonics break up any obvious sine regularity into hand-drawn-looking
  // micro-variation.
  return {
    amps: [0.6, 0.32, 0.13],
    freqs: [1.8 + random() * 0.9, 3.4 + random() * 1.2, 6.2 + random() * 1.6],
    phases: [
      random() * Math.PI * 2,
      random() * Math.PI * 2,
      random() * Math.PI * 2,
    ],
  };
}

function evaluateWidthCurve(seed: WidthCurveSeed, t: number) {
  let value = 0;

  for (let index = 0; index < seed.freqs.length; index += 1) {
    value +=
      Math.sin(t * Math.PI * 2 * seed.freqs[index]! + seed.phases[index]!) *
      seed.amps[index]!;
  }

  return clamp(value, -1, 1);
}

function resolveStrokeWidthVariationProfile(
  strokeWidth: number,
  strokeWidthVariation: number,
): StrokeWidthVariationProfile {
  const intensity = clamp(strokeWidthVariation, 0, 10);
  // Steep curve: 0-5 stays subtle, 5-10 ramps to dramatic.
  const intensityFactor = (intensity / 10) ** 1.55;
  const lowerExtent = lerp(0, 0.72, intensityFactor);
  const upperExtent = lerp(0, 1.08, intensityFactor);
  const minWidth = Math.max(
    strokeWidth * (1 - lowerExtent),
    strokeWidth * 0.16,
  );
  const maxWidth = strokeWidth * (1 + upperExtent);
  const ribbonSegmentsPerCurve =
    intensity <= 0 ? 0 : clamp(Math.round(4 + intensityFactor * 7), 4, 11);

  return {
    accentBaseOpacity: 0.22 + intensityFactor * 0.32,
    accentExtraCount:
      intensityFactor >= 0.7 ? 2 : intensityFactor >= 0.35 ? 1 : 0,
    centerWidth: strokeWidth,
    dryAccentEnabled: intensityFactor >= 0.18,
    intensity,
    intensityFactor,
    jitterScale: 0.04 + intensityFactor * 0.18,
    maxWidth,
    minWidth,
    offsetRetraceEnabled: intensityFactor >= 0.42,
    ribbonSegmentsPerCurve,
  };
}

function createRibbonLayersForCurves(
  curves: CubicBezier[],
  pathVariant: HandDrawnFrameStrokePathVariant | undefined,
  profile: StrokeWidthVariationProfile,
  layerSeed: string,
): HandDrawnFrameStrokeLayer[] {
  if (curves.length === 0 || profile.ribbonSegmentsPerCurve <= 0) {
    return [];
  }

  const random = createSeededRandom(layerSeed);
  const subBeziers: CubicBezier[] = [];

  for (const curve of curves) {
    subBeziers.push(
      ...subdivideCubicBezier(curve, profile.ribbonSegmentsPerCurve),
    );
  }

  if (subBeziers.length === 0) {
    return [];
  }

  const curveSeed = createWidthCurveSeed(random);
  const slices = subBeziers.length;
  const rawNoise = subBeziers.map((_, index) => {
    const t = slices === 1 ? 0.5 : index / (slices - 1);

    return evaluateWidthCurve(curveSeed, t);
  });
  // Stretch each side's noise across its observed min/max so every side
  // actually reaches both extremes — the line truly goes thin → thick → thin
  // along its length, instead of clustering near the middle when the random
  // phases happen to land in a narrow band.
  const noiseMin = Math.min(...rawNoise);
  const noiseMax = Math.max(...rawNoise);
  const noiseSpan = noiseMax - noiseMin;
  const jitterRange =
    (profile.maxWidth - profile.minWidth) * 0.05 * profile.intensityFactor;

  return subBeziers.map((bezier, index) => {
    const normalized =
      noiseSpan > 0 ? (rawNoise[index]! - noiseMin) / noiseSpan : 0.5;
    const baseWidth = lerp(profile.minWidth, profile.maxWidth, normalized);
    const width = clamp(
      baseWidth + (random() - 0.5) * jitterRange,
      profile.minWidth,
      profile.maxWidth,
    );
    const layer: HandDrawnFrameStrokeLayer = {
      customPath: bezierToPathString(bezier),
      pathSeed: `${layerSeed}:ribbon:${index}`,
      strokeWidth: formatSvgNumber(width),
    };

    if (pathVariant) {
      layer.pathVariant = pathVariant;
    }

    return layer;
  });
}

function createIrregularDashArray(
  random: () => number,
  profile: StrokeWidthVariationProfile,
) {
  const beatCount =
    3 + Math.floor(random() * 3) + (profile.intensityFactor >= 0.5 ? 1 : 0);
  const segments: number[] = [];
  const drawLengths: number[] = [];
  const gapLengths: number[] = [];

  for (let index = 0; index < beatCount; index += 1) {
    const draw = lerp(2.4, 7.5, random()) + profile.intensityFactor * 1.4;

    drawLengths.push(draw);

    if (index === beatCount - 1) {
      continue;
    }

    // Mix tight pen-lift gaps with wide dry-stroke breathers so the irregular
    // pattern reads like hand-drawn dryness instead of a uniform stripe.
    const isWideGap = index % 2 === 0 ? random() < 0.7 : random() < 0.35;
    const gap = isWideGap
      ? lerp(6.5, 16, random()) + profile.intensityFactor * 3
      : lerp(1.4, 4, random());

    gapLengths.push(gap);
  }

  const totalUsed =
    drawLengths.reduce((sum, value) => sum + value, 0) +
    gapLengths.reduce((sum, value) => sum + value, 0);
  const remainder = Math.max(NORMALIZED_PATH_LENGTH - totalUsed, 1.2);

  for (let index = 0; index < drawLengths.length; index += 1) {
    segments.push(drawLengths[index]!);

    if (index < gapLengths.length) {
      segments.push(gapLengths[index]!);
    }
  }

  segments.push(remainder);

  return segments.map((value) => formatSvgNumber(value).toFixed(3)).join(" ");
}

function createDryAccentLayer(
  pathVariant: HandDrawnFrameStrokePathVariant | undefined,
  profile: StrokeWidthVariationProfile,
  layerSeed: string,
): HandDrawnFrameStrokeLayer {
  const random = createSeededRandom(layerSeed);
  // Sit close to the base width so the accent reads as ink dryness, not as a
  // second silhouette stacked on top of the ribbon.
  const widthSwing = (random() - 0.5) * 0.18 * profile.centerWidth;
  const strokeWidth = clamp(
    profile.centerWidth * 0.94 + widthSwing,
    profile.minWidth * 1.05,
    profile.centerWidth * 1.08,
  );

  const layer: HandDrawnFrameStrokeLayer = {
    dasharray: createIrregularDashArray(random, profile),
    dashoffset: formatSvgNumber(random() * NORMALIZED_PATH_LENGTH),
    opacity: formatSvgNumber(
      clamp(profile.accentBaseOpacity + (random() - 0.5) * 0.12, 0.18, 0.68),
    ),
    pathJitter: {
      anchor: formatSvgNumber(profile.jitterScale * 0.4),
      control: formatSvgNumber(profile.jitterScale * 1.05),
    },
    pathLength: NORMALIZED_PATH_LENGTH,
    pathSeed: `${layerSeed}:dry`,
    strokeWidth: formatSvgNumber(strokeWidth),
  };

  if (pathVariant) {
    layer.pathVariant = pathVariant;
  }

  return layer;
}

function resolveSurfacePathOffset(
  side: HandDrawnFrameSurfaceSide,
  offsetDistance: number,
  driftDistance: number,
  direction: number,
) {
  switch (side) {
    case "top":
      return {
        x: formatSvgNumber(driftDistance),
        y: formatSvgNumber(offsetDistance * direction),
      };
    case "right":
      return {
        x: formatSvgNumber(offsetDistance * direction),
        y: formatSvgNumber(driftDistance),
      };
    case "bottom":
      return {
        x: formatSvgNumber(-driftDistance),
        y: formatSvgNumber(-offsetDistance * direction),
      };
    case "left":
      return {
        x: formatSvgNumber(-offsetDistance * direction),
        y: formatSvgNumber(-driftDistance),
      };
  }
}

function createOffsetRetraceLayer(
  side: HandDrawnFrameSurfaceSide,
  profile: StrokeWidthVariationProfile,
  layerSeed: string,
): HandDrawnFrameStrokeLayer {
  const random = createSeededRandom(layerSeed);
  const offsetDistance = clamp(
    0.08 + profile.intensityFactor * 0.22 + random() * 0.1,
    0.08,
    0.42,
  );
  const driftDistance = (random() - 0.5) * 0.18 * profile.intensityFactor;
  const direction = random() < 0.5 ? -1 : 1;

  return {
    opacity: formatSvgNumber(
      clamp(0.32 + profile.intensityFactor * 0.18 + random() * 0.06, 0.18, 0.6),
    ),
    pathJitter: {
      anchor: formatSvgNumber(profile.jitterScale * 0.7),
      control: formatSvgNumber(profile.jitterScale * 1.4),
    },
    pathOffset: resolveSurfacePathOffset(
      side,
      offsetDistance,
      driftDistance,
      direction,
    ),
    pathSeed: `${layerSeed}:offset`,
    pathVariant: side,
    strokeWidth: formatSvgNumber(
      clamp(
        profile.centerWidth * (0.78 + random() * 0.22),
        profile.minWidth * 1.05,
        profile.maxWidth * 0.92,
      ),
    ),
  } satisfies HandDrawnFrameStrokeLayer;
}

function pickRandomSurfaceSides(
  random: () => number,
  count: number,
): HandDrawnFrameSurfaceSide[] {
  const pool = [...SURFACE_SIDES];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));

    [pool[index], pool[swapIndex]] = [pool[swapIndex]!, pool[index]!];
  }

  return pool.slice(0, clamp(count, 0, pool.length));
}

function createSurfaceLayers(
  basePath: string,
  strokeWidth: number,
  seed: string,
  profile: StrokeWidthVariationProfile,
): HandDrawnFrameStrokeLayer[] {
  const cubics = parseCubicSegments(basePath);
  const surfaceSides = partitionSurfaceSides(cubics);
  const layers: HandDrawnFrameStrokeLayer[] = [
    {
      strokeWidth: formatSvgNumber(strokeWidth),
    },
  ];

  if (!surfaceSides) {
    // Fallback: subdivide the whole path as one ribbon.
    layers.push(
      ...createRibbonLayersForCurves(
        cubics,
        undefined,
        profile,
        `${seed}:frame`,
      ),
    );

    return layers;
  }

  for (const side of SURFACE_SIDES) {
    layers.push(
      ...createRibbonLayersForCurves(
        surfaceSides[side],
        side,
        profile,
        `${seed}:${side}`,
      ),
    );
  }

  if (profile.dryAccentEnabled) {
    const dryRandom = createSeededRandom(`${seed}:dry:plan`);
    // Anchor the irregular-gap accent on a horizontal side so the visible dry
    // strokes show up where users actually look first.
    const horizontalSides: HandDrawnFrameSurfaceSide[] = ["top", "bottom"];
    const primarySide =
      horizontalSides[Math.floor(dryRandom() * horizontalSides.length)]!;

    layers.push(
      createDryAccentLayer(primarySide, profile, `${seed}:dry:${primarySide}`),
    );

    if (profile.accentExtraCount >= 1) {
      const secondarySides: HandDrawnFrameSurfaceSide[] = SURFACE_SIDES.filter(
        (side) => side !== primarySide,
      );
      const secondarySide =
        secondarySides[Math.floor(dryRandom() * secondarySides.length)]!;

      layers.push(
        createDryAccentLayer(
          secondarySide,
          profile,
          `${seed}:dry:${secondarySide}`,
        ),
      );
    }
  }

  if (profile.offsetRetraceEnabled) {
    const offsetRandom = createSeededRandom(`${seed}:offset:plan`);
    const offsetSides = pickRandomSurfaceSides(
      offsetRandom,
      profile.intensityFactor >= 0.75 ? 2 : 1,
    );

    for (const side of offsetSides) {
      layers.push(
        createOffsetRetraceLayer(side, profile, `${seed}:offset:${side}`),
      );
    }
  }

  return layers;
}

function createDividerLayers(
  basePath: string,
  strokeWidth: number,
  seed: string,
  profile: StrokeWidthVariationProfile,
): HandDrawnFrameStrokeLayer[] {
  const cubics = parseCubicSegments(basePath);
  const layers: HandDrawnFrameStrokeLayer[] = [
    {
      strokeWidth: formatSvgNumber(strokeWidth),
    },
  ];

  const dividerProfile: StrokeWidthVariationProfile = {
    ...profile,
    // Divider is one long Bezier — double the segment count so the ribbon
    // stays visually smooth across the full span.
    ribbonSegmentsPerCurve:
      profile.ribbonSegmentsPerCurve > 0
        ? clamp(profile.ribbonSegmentsPerCurve * 2, 6, 18)
        : 0,
  };

  layers.push(
    ...createRibbonLayersForCurves(
      cubics,
      "frame",
      dividerProfile,
      `${seed}:divider`,
    ),
  );

  if (profile.dryAccentEnabled) {
    layers.push(createDryAccentLayer("frame", profile, `${seed}:divider:dry`));
  }

  return layers;
}

// SVG cannot vary stroke width along a single path, so we subdivide each cubic
// Bezier into many small sub-segments and render each at its own width. The
// result reads as smooth thin → thick → thin variation along the line, instead
// of the discrete dasharray "blobs" the previous implementation produced.
export function createStrokeWidthVariationLayers(
  strokeWidth: number,
  seed: string,
  strokeWidthVariation: number,
  options: HandDrawnFrameStrokeWidthVariationOptions = {},
): HandDrawnFrameStrokeLayer[] {
  const profile = resolveStrokeWidthVariationProfile(
    strokeWidth,
    strokeWidthVariation,
  );

  if (profile.intensity <= 0 || profile.ribbonSegmentsPerCurve <= 0) {
    return [{ strokeWidth: formatSvgNumber(strokeWidth) }];
  }

  const shape = options.shape ?? "surface";
  const basePath =
    options.basePath ??
    (shape === "divider"
      ? DEFAULT_DIVIDER_BASE_PATH
      : DEFAULT_SURFACE_BASE_PATH);

  if (shape === "divider") {
    return createDividerLayers(basePath, strokeWidth, seed, profile);
  }

  return createSurfaceLayers(basePath, strokeWidth, seed, profile);
}
