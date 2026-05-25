import type { HandDrawnFrameShape } from "./hand-drawn-frame.geometry";

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

type Point = [number, number];

type CubicBezier = [Point, Point, Point, Point];

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
const PATH_TOKEN_PATTERN = /[A-Za-z]|-?\d*\.?\d+/g;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function formatSvgNumber(value: number) {
  return Number(value.toFixed(3));
}

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

function lerpPoint(a: Point, b: Point, t: number): Point {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function splitCubicBezier(
  bezier: CubicBezier,
  t: number,
): [CubicBezier, CubicBezier] {
  const [p0, p1, p2, p3] = bezier;
  const p01 = lerpPoint(p0, p1, t);
  const p12 = lerpPoint(p1, p2, t);
  const p23 = lerpPoint(p2, p3, t);
  const p012 = lerpPoint(p01, p12, t);
  const p123 = lerpPoint(p12, p23, t);
  const p0123 = lerpPoint(p012, p123, t);

  return [
    [p0, p01, p012, p0123],
    [p0123, p123, p23, p3],
  ];
}

function subdivideCubicBezier(
  bezier: CubicBezier,
  count: number,
): CubicBezier[] {
  if (count <= 1) {
    return [bezier];
  }

  const subdivisions: CubicBezier[] = [];
  let remaining = bezier;

  for (let i = 1; i < count; i += 1) {
    const t = 1 / (count - i + 1);
    const [left, right] = splitCubicBezier(remaining, t);

    subdivisions.push(left);
    remaining = right;
  }

  subdivisions.push(remaining);

  return subdivisions;
}

function bezierToPathString(bezier: CubicBezier) {
  const [p0, p1, p2, p3] = bezier;

  return `M ${formatSvgNumber(p0[0])} ${formatSvgNumber(p0[1])} C ${formatSvgNumber(p1[0])} ${formatSvgNumber(p1[1])} ${formatSvgNumber(p2[0])} ${formatSvgNumber(p2[1])} ${formatSvgNumber(p3[0])} ${formatSvgNumber(p3[1])}`;
}

function parseCubicSegments(path: string): CubicBezier[] {
  const tokens = path.match(PATH_TOKEN_PATTERN) ?? [];
  const segments: CubicBezier[] = [];
  let index = 0;
  let currentX = 0;
  let currentY = 0;
  let activeCommand = "";

  while (index < tokens.length) {
    const token = tokens[index]!;

    if (/^[A-Za-z]$/.test(token)) {
      activeCommand = token;
      index += 1;
      continue;
    }

    if (activeCommand === "M" || activeCommand === "m") {
      const x = Number(tokens[index]);
      const y = Number(tokens[index + 1]);

      currentX = activeCommand === "m" ? currentX + x : x;
      currentY = activeCommand === "m" ? currentY + y : y;
      index += 2;
      activeCommand = activeCommand === "m" ? "l" : "L";
      continue;
    }

    if (activeCommand === "C" || activeCommand === "c") {
      const x1 = Number(tokens[index]);
      const y1 = Number(tokens[index + 1]);
      const x2 = Number(tokens[index + 2]);
      const y2 = Number(tokens[index + 3]);
      const x3 = Number(tokens[index + 4]);
      const y3 = Number(tokens[index + 5]);
      const isRelative = activeCommand === "c";
      const p0: Point = [currentX, currentY];
      const p1: Point = isRelative ? [currentX + x1, currentY + y1] : [x1, y1];
      const p2: Point = isRelative ? [currentX + x2, currentY + y2] : [x2, y2];
      const p3: Point = isRelative ? [currentX + x3, currentY + y3] : [x3, y3];

      segments.push([p0, p1, p2, p3]);
      currentX = p3[0];
      currentY = p3[1];
      index += 6;
      continue;
    }

    if (activeCommand === "Z" || activeCommand === "z") {
      index += 1;
      continue;
    }

    break;
  }

  return segments;
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
