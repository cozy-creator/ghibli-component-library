import { describe, expect, it } from "vitest";

import {
  createThicknessVariationStrokeLayers,
  type HandDrawnFrameStrokeLayer,
} from "../../../../registry/ghibli/ui/hand-drawn-frame.thickness";

const HAND_DRAWN_THICKNESS_PATH_LENGTH = 100;
const LEGACY_FIVE_INTENSITY_FACTOR = Math.pow(0.5, 0.46);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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

function legacyFiveLayers(strokeWidth: number, seed: string) {
  const random = createSeededRandom(seed);
  const baseVariationSpan = clamp(strokeWidth * 0.24, 0.18, 0.5);
  const maxPositiveExpansion = clamp(
    strokeWidth * (0.34 + LEGACY_FIVE_INTENSITY_FACTOR * 0.32),
    0.3,
    1.6,
  );
  const variationSpan = clamp(
    baseVariationSpan * (0.52 + LEGACY_FIVE_INTENSITY_FACTOR * 2.1),
    0,
    maxPositiveExpansion * 0.88,
  );
  const overlayCount = clamp(
    2 + Math.round(LEGACY_FIVE_INTENSITY_FACTOR * 3),
    1,
    5,
  );
  const maxBaseInsetRatio = clamp(
    0.18 + LEGACY_FIVE_INTENSITY_FACTOR * 0.18,
    0.18,
    0.38,
  );
  const layers: HandDrawnFrameStrokeLayer[] = [
    {
      strokeWidth: formatSvgNumber(
        clamp(
          strokeWidth -
            variationSpan *
              (0.34 +
                LEGACY_FIVE_INTENSITY_FACTOR * 0.24 +
                random() * (0.16 + LEGACY_FIVE_INTENSITY_FACTOR * 0.14)),
          Math.max(
            strokeWidth * (1 - maxBaseInsetRatio),
            strokeWidth -
              variationSpan * (0.62 + LEGACY_FIVE_INTENSITY_FACTOR * 0.24),
          ),
          strokeWidth,
        ),
      ),
    },
  ];

  for (let index = 0; index < overlayCount; index += 1) {
    const dashPattern = createStrokeDashPattern(
      random,
      4 + index + Math.round(LEGACY_FIVE_INTENSITY_FACTOR * 2.5),
    );
    const layerThicknessFactor = clamp(
      0.28 +
        index * (0.22 + LEGACY_FIVE_INTENSITY_FACTOR * 0.08) +
        (random() - 0.5) * (0.12 + LEGACY_FIVE_INTENSITY_FACTOR * 0.2),
      0.18 + LEGACY_FIVE_INTENSITY_FACTOR * 0.04,
      1.02 + LEGACY_FIVE_INTENSITY_FACTOR * 0.3,
    );
    const baseOpacity = clamp(
      0.34 +
        LEGACY_FIVE_INTENSITY_FACTOR * 0.3 -
        index * (0.048 - LEGACY_FIVE_INTENSITY_FACTOR * 0.006) +
        random() * (0.05 + LEGACY_FIVE_INTENSITY_FACTOR * 0.08),
      0.24,
      0.82,
    );

    layers.push({
      dasharray: dashPattern.map((segment) => segment.toFixed(3)).join(" "),
      dashoffset: formatSvgNumber(random() * HAND_DRAWN_THICKNESS_PATH_LENGTH),
      opacity: formatSvgNumber(
        baseOpacity,
      ),
      pathLength: HAND_DRAWN_THICKNESS_PATH_LENGTH,
      strokeWidth: formatSvgNumber(
        clamp(
          strokeWidth + variationSpan * layerThicknessFactor,
          strokeWidth,
          strokeWidth + maxPositiveExpansion,
        ),
      ),
    });
  }

  return layers;
}

function numericStrokeWidth(layer: HandDrawnFrameStrokeLayer) {
  return typeof layer.strokeWidth === "number"
    ? layer.strokeWidth
    : Number(layer.strokeWidth);
}

function maxStrokeWidth(layers: HandDrawnFrameStrokeLayer[]) {
  return Math.max(...layers.map(numericStrokeWidth));
}

function weightedThickness(layers: HandDrawnFrameStrokeLayer[]) {
  return layers.reduce(
    (sum, layer) => sum + numericStrokeWidth(layer) * (layer.opacity ?? 1),
    0,
  );
}

describe("createThicknessVariationStrokeLayers", () => {
  it("preserves the neutral midpoint rendering at thicknessIntensity 5", () => {
    const strokeWidth = 1.55;
    const seed = "surface:frame-1:thickness:0";

    expect(createThicknessVariationStrokeLayers(strokeWidth, seed, 5)).toEqual(
      legacyFiveLayers(strokeWidth, seed),
    );
  });

  it("returns a single thinner base layer at intensity 0", () => {
    const strokeWidth = 1.55;
    const layers = createThicknessVariationStrokeLayers(strokeWidth, "seed-0", 0);

    expect(layers).toHaveLength(1);
    expect(numericStrokeWidth(layers[0]!)).toBeLessThan(strokeWidth);
  });

  it("makes low intensities clearly thinner than the neutral midpoint", () => {
    const strokeWidth = 1.55;
    const seed = "seed-low";
    const neutralLayers = createThicknessVariationStrokeLayers(strokeWidth, seed, 5);
    const twoLayers = createThicknessVariationStrokeLayers(strokeWidth, seed, 2);
    const fourLayers = createThicknessVariationStrokeLayers(strokeWidth, seed, 4);

    expect(maxStrokeWidth(twoLayers)).toBeLessThan(maxStrokeWidth(neutralLayers));
    expect(weightedThickness(twoLayers)).toBeLessThan(weightedThickness(neutralLayers));
    expect(maxStrokeWidth(fourLayers)).toBeLessThan(maxStrokeWidth(neutralLayers));
    expect(weightedThickness(fourLayers)).toBeLessThan(weightedThickness(neutralLayers));
  });

  it("makes high intensities heavier than the neutral midpoint", () => {
    const strokeWidth = 1.55;
    const seed = "seed-high";
    const neutralLayers = createThicknessVariationStrokeLayers(strokeWidth, seed, 5);
    const sixLayers = createThicknessVariationStrokeLayers(strokeWidth, seed, 6);
    const eightLayers = createThicknessVariationStrokeLayers(strokeWidth, seed, 8);
    const tenLayers = createThicknessVariationStrokeLayers(strokeWidth, seed, 10);

    expect(maxStrokeWidth(sixLayers)).toBeGreaterThan(maxStrokeWidth(neutralLayers));
    expect(weightedThickness(sixLayers)).toBeGreaterThan(
      weightedThickness(neutralLayers),
    );
    expect(maxStrokeWidth(eightLayers)).toBeGreaterThan(maxStrokeWidth(neutralLayers));
    expect(weightedThickness(eightLayers)).toBeGreaterThan(
      weightedThickness(neutralLayers),
    );
    expect(maxStrokeWidth(tenLayers)).toBeGreaterThan(maxStrokeWidth(neutralLayers));
    expect(weightedThickness(tenLayers)).toBeGreaterThan(
      weightedThickness(neutralLayers),
    );
  });

  it("adds more overlays for the top end of the range", () => {
    const strokeWidth = 1.55;

    expect(createThicknessVariationStrokeLayers(strokeWidth, "seed-9", 9)).toHaveLength(
      7,
    );
    expect(createThicknessVariationStrokeLayers(strokeWidth, "seed-10", 10)).toHaveLength(
      7,
    );
  });

  it("stays deterministic for the same seed and inputs", () => {
    const strokeWidth = 1.55;
    const seed = "seed-repeatable";
    const first = createThicknessVariationStrokeLayers(strokeWidth, seed, 8);
    const second = createThicknessVariationStrokeLayers(strokeWidth, seed, 8);

    expect(second).toEqual(first);
  });
});
