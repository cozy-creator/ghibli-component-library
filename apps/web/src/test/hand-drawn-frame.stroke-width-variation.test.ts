import { describe, expect, it } from "vitest";

import {
  createStrokeWidthVariationLayers,
  type HandDrawnFrameStrokeLayer,
} from "../../../../registry/ghibli/ui/hand-drawn-frame.stroke-width-variation";

function numericStrokeWidth(layer: HandDrawnFrameStrokeLayer) {
  return typeof layer.strokeWidth === "number"
    ? layer.strokeWidth
    : Number(layer.strokeWidth);
}

function maxStrokeWidth(layers: HandDrawnFrameStrokeLayer[]) {
  return Math.max(...layers.map(numericStrokeWidth));
}

function minStrokeWidth(layers: HandDrawnFrameStrokeLayer[]) {
  return Math.min(...layers.map(numericStrokeWidth));
}

function strokeWidthSpread(layers: HandDrawnFrameStrokeLayer[]) {
  return maxStrokeWidth(layers) - minStrokeWidth(layers);
}

describe("createStrokeWidthVariationLayers", () => {
  it("returns a single baseline layer at intensity 0", () => {
    const strokeWidth = 1.55;
    const layers = createStrokeWidthVariationLayers(strokeWidth, "seed-0", 0);

    expect(layers).toHaveLength(1);
    expect(numericStrokeWidth(layers[0]!)).toBe(strokeWidth);
  });

  it("keeps stroke width as the center of the varied range", () => {
    const strokeWidth = 1.55;
    const layers = createStrokeWidthVariationLayers(
      strokeWidth,
      "seed-center",
      8,
    );
    const rangeCenter = (minStrokeWidth(layers) + maxStrokeWidth(layers)) / 2;

    expect(minStrokeWidth(layers)).toBeLessThan(strokeWidth);
    expect(maxStrokeWidth(layers)).toBeGreaterThan(strokeWidth);
    expect(rangeCenter).toBeCloseTo(strokeWidth, 1);
  });

  it("increases width variation as intensity rises", () => {
    const strokeWidth = 1.55;
    const seed = "seed-variation";
    const twoLayers = createStrokeWidthVariationLayers(strokeWidth, seed, 2);
    const sixLayers = createStrokeWidthVariationLayers(strokeWidth, seed, 6);
    const tenLayers = createStrokeWidthVariationLayers(strokeWidth, seed, 10);

    expect(strokeWidthSpread(sixLayers)).toBeGreaterThan(
      strokeWidthSpread(twoLayers),
    );
    expect(strokeWidthSpread(tenLayers)).toBeGreaterThan(
      strokeWidthSpread(sixLayers),
    );
  });

  it("adds more overlays for the top end of the range", () => {
    const strokeWidth = 1.55;

    expect(
      createStrokeWidthVariationLayers(strokeWidth, "seed-9", 9),
    ).toHaveLength(7);
    expect(
      createStrokeWidthVariationLayers(strokeWidth, "seed-10", 10),
    ).toHaveLength(7);
  });

  it("stays deterministic for the same seed and inputs", () => {
    const strokeWidth = 1.55;
    const seed = "seed-repeatable";
    const first = createStrokeWidthVariationLayers(strokeWidth, seed, 8);
    const second = createStrokeWidthVariationLayers(strokeWidth, seed, 8);

    expect(second).toEqual(first);
  });
});
