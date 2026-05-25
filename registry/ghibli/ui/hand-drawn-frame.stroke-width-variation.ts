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
  // 0..1 from strokeWidthFrequency: how often the width oscillates within the
  // [minWidth, maxWidth] range along the line, and how far toward those edges it
  // reaches. 0 = pick one random width in range and hold it (no variation).
  frequencyFactor: number;
  intensity: number;
  intensityFactor: number;
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
  frequencyFactor: number,
): WidthCurveSeed {
  // 3 sines summed. The dominant wavelength scales with strokeWidthFrequency:
  // low frequency → few long thick↔thin sweeps; high frequency → many rapid
  // ones. Higher harmonics break up the obvious sine regularity into
  // hand-drawn-looking micro-variation. At frequency 0 the base is ~0 so the
  // curve is effectively flat (the caller picks a single constant width).
  const base = frequencyFactor * 5;

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

// Constant-pixel width swing at full intensity (strokeWidthVariation = 10).
// The wobble is an absolute pixel amount that does NOT scale with the base
// stroke width, so a thin line and a thick line get the same hand-drawn
// pen-pressure variation (matching the constant-pixel crookedness model).
// Asymmetric — a pen swells thicker more readily than it starves to nothing —
// keeping the old ~1.5:1 up:down ratio.
const STROKE_VARIATION_UP_PX = 1.5;
const STROKE_VARIATION_DOWN_PX = 1.0;
// Floor so a thin stroke never wobbles down to invisibility.
const STROKE_VARIATION_MIN_WIDTH_PX = 0.45;

function resolveStrokeWidthVariationProfile(
  strokeWidth: number,
  strokeWidthVariation: number,
  strokeWidthFrequency: number,
): StrokeWidthVariationProfile {
  const intensity = clamp(strokeWidthVariation, 0, 10);
  // Steep curve: 0-5 stays subtle, 5-10 ramps to dramatic.
  const intensityFactor = (intensity / 10) ** 1.55;
  // Pixel swing is independent of strokeWidth (constant-pixel model). This sets
  // the RANGE [minWidth, maxWidth] the width can take.
  const downPx = STROKE_VARIATION_DOWN_PX * intensityFactor;
  const upPx = STROKE_VARIATION_UP_PX * intensityFactor;
  const minWidth = Math.max(
    strokeWidth - downPx,
    STROKE_VARIATION_MIN_WIDTH_PX,
  );
  const maxWidth = Math.max(strokeWidth + upPx, minWidth);
  const frequencyFactor = clamp(strokeWidthFrequency, 0, 10) / 10;

  return {
    accentBaseOpacity: 0.22 + intensityFactor * 0.32,
    centerWidth: strokeWidth,
    dryAccentEnabled: intensityFactor >= 0.18 && frequencyFactor > 0,
    frequencyFactor,
    intensity,
    intensityFactor,
    maxWidth,
    minWidth,
  };
}

/**
 * Slices to use for a cubic of the given pixel length, at constant density.
 * Returns 0 when variation is disabled.
 */
function ribbonSlicesForLength(
  lengthPx: number,
  intensityFactor: number,
  frequencyFactor: number,
) {
  if (intensityFactor <= 0 || !Number.isFinite(lengthPx) || lengthPx <= 0) {
    return 0;
  }

  // Densify slices as frequency rises so rapid oscillations are actually
  // sampled (not aliased) by the ribbon. pxPerSlice shrinks from the base
  // toward ~1/3 of it at full frequency.
  const pxPerSlice = RIBBON_PX_PER_SLICE / (1 + frequencyFactor * 2);

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
  if (curves.length === 0 || profile.intensityFactor <= 0) {
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
      profile.intensityFactor,
      profile.frequencyFactor,
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

  // Frequency 0: pick ONE random width within the range and hold it along the
  // whole line — uneven across components, but flat within this one.
  if (profile.frequencyFactor <= 0) {
    const flatWidth = lerp(profile.minWidth, profile.maxWidth, random());

    return subBeziers.map((bezier) => {
      const layer: HandDrawnFrameStrokeLayer = {
        customPath: bezierToPathString(bezier),
        strokeWidth: formatSvgNumber(flatWidth),
      };

      if (pathVariant) {
        layer.pathVariant = pathVariant;
      }

      return layer;
    });
  }

  // Reach: how far toward the range edges the oscillation swings. Low frequency
  // hugs the mean; high frequency sweeps the full [min, max].
  const reach = lerp(0.4, 1, profile.frequencyFactor);
  const curveSeed = createWidthCurveSeed(random, profile.frequencyFactor);
  const slices = subBeziers.length;
  const jitterRange = halfRange * 0.08 * profile.frequencyFactor;

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

  layers.push(
    ...createRibbonLayersForCurves(cubics, "frame", profile, `${seed}:divider`),
  );

  if (profile.dryAccentEnabled) {
    layers.push(createDryAccentLayer("frame", profile, `${seed}:divider:dry`));
  }

  return layers;
}

// Builds the stack of stroke layers (base outline + per-side width-varying
// ribbon slices + optional dry-ink accent) for the frame's stroke. `strokeWidth`
// and the variation amplitude are expressed in pixels; slice counts come from
// pixel length so density is uniform across edges of any length.
export function createStrokeWidthVariationLayers(
  strokeWidth: number,
  seed: string,
  strokeWidthVariation: number,
  strokeWidthFrequency: number,
  options: HandDrawnFrameStrokeWidthVariationOptions = {},
): HandDrawnFrameStrokeLayer[] {
  const profile = resolveStrokeWidthVariationProfile(
    strokeWidth,
    strokeWidthVariation,
    strokeWidthFrequency,
  );

  if (profile.intensity <= 0 || profile.intensityFactor <= 0) {
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
