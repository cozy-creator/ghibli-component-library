import { clamp, type HandDrawnFrameShape } from "./hand-drawn-frame.geometry";
import {
  type CubicBezier,
  approximateCubicLength,
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
  pathLength?: number;
  pathVariant?: HandDrawnFrameStrokePathVariant;
  strokeWidth: number | string;
};

type HandDrawnFrameStrokeWidthVariationOptions = {
  /**
   * Pixel-space path the stroke ribbon should follow. When omitted (tests, or
   * the very first render before the element is measured), a synthetic
   * reference path is used so the layer math still produces deterministic
   * output.
   */
  basePath?: string;
  shape?: HandDrawnFrameShape;
};

type StrokeWidthVariationProfile = {
  accentBaseOpacity: number;
  centerWidth: number;
  dryAccentEnabled: boolean;
  // 0..1 amount the width varies WITHIN [minWidth, maxWidth]. It drives BOTH how
  // often the width oscillates (sine frequency) AND how far toward the range
  // edges it reaches. 0 = a single steady width (no variation); 1 = the full
  // range with fast, active oscillation.
  variationFactor: number;
  maxWidth: number;
  minWidth: number;
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

/**
 * Length-aware ribbon density. SVG cannot vary stroke width along one path, so
 * each cubic is subdivided into many short sub-segments rendered at their own
 * width. The number of sub-segments is proportional to the cubic's *pixel
 * length* (one ribbon slice roughly every N px), so a long edge gets many
 * slices and a short edge gets few — the width variation has the SAME spatial
 * frequency on every edge regardless of its length, matching the crookedness
 * fix. (The old code used a fixed slice count per cubic, which packed the same
 * number of width changes onto short edges → jagged, and spread them thin on
 * long edges → smooth. This is the bug being fixed.)
 */
const RIBBON_PX_PER_SLICE = 9;
const RIBBON_MIN_SLICES = 2;
const RIBBON_MAX_SLICES = 48;

// Synthetic reference paths (pixel-space, ~140x90 surface / 240px divider) used
// only when no measured basePath is supplied (e.g. unit tests).
const DEFAULT_SURFACE_BASE_PATH =
  "M 6 6 C 50 4 90 8 134 6 C 136 30 138 60 134 84 C 90 86 50 82 6 84 C 4 60 8 30 6 6 Z";
const DEFAULT_DIVIDER_BASE_PATH =
  "M 4 6 C 60 4 120 8 180 6 C 200 5 220 7 236 6";

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function formatSvgNumber(value: number) {
  return Number(value.toFixed(3));
}

function partitionSurfaceSides(
  segments: CubicBezier[],
): Record<HandDrawnFrameSurfaceSide, CubicBezier[]> | null {
  // The pixel-space surface outline is one cubic per side (4 cubics total).
  if (segments.length === 4) {
    return {
      bottom: [segments[2]!],
      left: [segments[3]!],
      right: [segments[1]!],
      top: [segments[0]!],
    };
  }

  // Older 8-cubic outlines (2 per side) are still partitioned correctly.
  if (segments.length >= 8) {
    return {
      bottom: [segments[4]!, segments[5]!],
      left: [segments[6]!, segments[7]!],
      right: [segments[2]!, segments[3]!],
      top: [segments[0]!, segments[1]!],
    };
  }

  return null;
}

function createWidthCurveSeed(
  random: () => number,
  variationFactor: number,
): WidthCurveSeed {
  // 3 sines summed. The dominant wavelength scales with the variation amount:
  // low variation → few long thick↔thin sweeps; high variation → many rapid
  // ones. Higher harmonics break up the obvious sine regularity into
  // hand-drawn-looking micro-variation. At variation 0 the caller short-circuits
  // to a single constant width, so this curve only runs for variation > 0.
  const base = variationFactor * 5;

  return {
    amps: [0.6, 0.32, 0.13],
    freqs: [
      base + random() * 0.4,
      base * 1.9 + random() * 0.6,
      base * 3.4 + random() * 0.9,
    ],
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

// Resolves the oscillation profile from an absolute pixel range and a 0..1
// "amount it varies" knob. The range fixes the [minWidth, maxWidth] envelope the
// stroke is allowed to span; `variation` decides how often the width oscillates
// and how far toward those bounds it reaches. The width envelope is therefore an
// honest pixel quantity (set by the range) — `variation` only changes the
// behaviour inside it, never the bounds themselves.
function resolveStrokeWidthVariationProfile(
  range: [number, number],
  variation: number,
): StrokeWidthVariationProfile {
  const variationFactor = clamp(variation, 0, 1);
  const minWidth = Math.min(range[0], range[1]);
  const maxWidth = Math.max(range[0], range[1]);
  const centerWidth = (minWidth + maxWidth) / 2;

  return {
    accentBaseOpacity: 0.22 + variationFactor * 0.32,
    centerWidth,
    dryAccentEnabled: variationFactor >= 0.18,
    variationFactor,
    maxWidth,
    minWidth,
  };
}

/**
 * Slices to use for a cubic of the given pixel length, at constant density.
 * Returns 0 when variation is disabled.
 */
function ribbonSlicesForLength(lengthPx: number, variationFactor: number) {
  if (variationFactor <= 0 || !Number.isFinite(lengthPx) || lengthPx <= 0) {
    return 0;
  }

  // Densify slices as variation rises so rapid oscillations are actually
  // sampled (not aliased) by the ribbon. pxPerSlice shrinks from the base
  // toward ~1/3 of it at full variation.
  const pxPerSlice = RIBBON_PX_PER_SLICE / (1 + variationFactor * 2);

  return clamp(
    Math.round(lengthPx / pxPerSlice),
    RIBBON_MIN_SLICES,
    RIBBON_MAX_SLICES,
  );
}

function createRibbonLayersForCurves(
  curves: CubicBezier[],
  pathVariant: HandDrawnFrameStrokePathVariant | undefined,
  profile: StrokeWidthVariationProfile,
  layerSeed: string,
): HandDrawnFrameStrokeLayer[] {
  if (curves.length === 0 || profile.variationFactor <= 0) {
    return [];
  }

  const random = createSeededRandom(layerSeed);
  const subBeziers: CubicBezier[] = [];

  // Length-proportional subdivision: every curve contributes a slice count
  // matching its pixel length, so width-variation density is uniform across
  // long and short edges alike.
  for (const curve of curves) {
    const slices = ribbonSlicesForLength(
      approximateCubicLength(curve),
      profile.variationFactor,
    );

    if (slices <= 0) {
      continue;
    }

    subBeziers.push(...subdivideCubicBezier(curve, slices));
  }

  if (subBeziers.length === 0) {
    return [];
  }

  const center = (profile.minWidth + profile.maxWidth) / 2;
  const halfRange = (profile.maxWidth - profile.minWidth) / 2;

  // Reach: how far toward the range edges the oscillation swings. Low variation
  // hugs the mean; high variation sweeps the full [min, max].
  const reach = lerp(0.4, 1, profile.variationFactor);
  const curveSeed = createWidthCurveSeed(random, profile.variationFactor);
  const slices = subBeziers.length;
  const jitterRange = halfRange * 0.08 * profile.variationFactor;

  return subBeziers.map((bezier, index) => {
    const t = slices === 1 ? 0.5 : index / (slices - 1);
    const wave = evaluateWidthCurve(curveSeed, t); // -1..1
    const width = clamp(
      center + wave * halfRange * reach + (random() - 0.5) * jitterRange,
      profile.minWidth,
      profile.maxWidth,
    );
    const layer: HandDrawnFrameStrokeLayer = {
      customPath: bezierToPathString(bezier),
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
    3 + Math.floor(random() * 3) + (profile.variationFactor >= 0.5 ? 1 : 0);
  const segments: number[] = [];
  const drawLengths: number[] = [];
  const gapLengths: number[] = [];

  for (let index = 0; index < beatCount; index += 1) {
    const draw = lerp(2.4, 7.5, random()) + profile.variationFactor * 1.4;

    drawLengths.push(draw);

    if (index === beatCount - 1) {
      continue;
    }

    // Mix tight pen-lift gaps with wide dry-stroke breathers so the irregular
    // pattern reads like hand-drawn dryness instead of a uniform stripe.
    const isWideGap = index % 2 === 0 ? random() < 0.7 : random() < 0.35;
    const gap = isWideGap
      ? lerp(6.5, 16, random()) + profile.variationFactor * 3
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
  // Sit close to the base width so the accent reads as ink dryness, not a
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
    pathLength: NORMALIZED_PATH_LENGTH,
    strokeWidth: formatSvgNumber(strokeWidth),
  };

  if (pathVariant) {
    layer.pathVariant = pathVariant;
  }

  return layer;
}

function createSurfaceLayers(
  basePath: string,
  seed: string,
  profile: StrokeWidthVariationProfile,
): HandDrawnFrameStrokeLayer[] {
  const cubics = parseCubicSegments(basePath);
  const surfaceSides = partitionSurfaceSides(cubics);
  const layers: HandDrawnFrameStrokeLayer[] = [
    {
      strokeWidth: formatSvgNumber(profile.centerWidth),
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
  }

  return layers;
}

function createDividerLayers(
  basePath: string,
  seed: string,
  profile: StrokeWidthVariationProfile,
): HandDrawnFrameStrokeLayer[] {
  const cubics = parseCubicSegments(basePath);
  const layers: HandDrawnFrameStrokeLayer[] = [
    {
      strokeWidth: formatSvgNumber(profile.centerWidth),
    },
  ];

  layers.push(
    ...createRibbonLayersForCurves(cubics, "frame", profile, `${seed}:divider`),
  );

  if (profile.dryAccentEnabled) {
    layers.push(createDryAccentLayer("frame", profile, `${seed}:divider:dry`));
  }

  return layers;
}

// Builds the stack of stroke layers (base outline + per-side width-varying
// ribbon slices + optional dry-ink accent) for the frame's stroke. The width is
// expressed as an absolute pixel `range` [min, max]; `variation` (0..1) is the
// amount the width varies WITHIN that range — it drives both the oscillation
// rate and how far toward the bounds it reaches. Slice counts come from pixel
// length so density is uniform across edges of any length.
//
// When the range collapses (min === max) OR `variation` <= 0 a single uniform
// stroke layer is returned: a collapsed range pins the width to the center,
// while a real range with variation 0 holds one seeded-random width inside it.
export function createStrokeWidthVariationLayers(
  range: [number, number],
  variation: number,
  seed: string,
  options: HandDrawnFrameStrokeWidthVariationOptions = {},
): HandDrawnFrameStrokeLayer[] {
  const profile = resolveStrokeWidthVariationProfile(range, variation);
  const halfRange = (profile.maxWidth - profile.minWidth) / 2;

  if (halfRange <= 0 || profile.variationFactor <= 0) {
    // halfRange <= 0: the range is collapsed, so the width is exactly the
    // center. Otherwise (variation 0 over a real range): pick a single steady
    // width inside [min, max] and hold it — deterministic for this seed.
    const width =
      halfRange <= 0
        ? profile.centerWidth
        : lerp(
            profile.minWidth,
            profile.maxWidth,
            createSeededRandom(`${seed}:steady`)(),
          );

    return [{ strokeWidth: formatSvgNumber(width) }];
  }

  const shape = options.shape ?? "surface";
  const basePath =
    options.basePath ??
    (shape === "divider"
      ? DEFAULT_DIVIDER_BASE_PATH
      : DEFAULT_SURFACE_BASE_PATH);

  if (shape === "divider") {
    return createDividerLayers(basePath, seed, profile);
  }

  return createSurfaceLayers(basePath, seed, profile);
}
