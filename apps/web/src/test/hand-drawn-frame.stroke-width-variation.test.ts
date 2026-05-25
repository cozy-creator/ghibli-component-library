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

// A short edge (40px) vs a long edge (400px) as single straight cubics in
// pixel space — used to prove ribbon density scales with pixel length.
const SHORT_EDGE_PATH = "M 0 0 C 13 0 27 0 40 0";
const LONG_EDGE_PATH = "M 0 0 C 133 0 267 0 400 0";

function ribbonLayers(layers: HandDrawnFrameStrokeLayer[]) {
  return layers.filter((layer) => layer.customPath);
}

describe("createStrokeWidthVariationLayers", () => {
  it("returns a single baseline layer at variation 0", () => {
    const strokeWidth = 1.55;
    const layers = createStrokeWidthVariationLayers(strokeWidth, "seed-0", 0, 5);

    expect(layers).toHaveLength(1);
    expect(numericStrokeWidth(layers[0]!)).toBe(strokeWidth);
  });

  it("brackets the baseline stroke width with both thinner and thicker layers", () => {
    const strokeWidth = 1.55;
    const layers = createStrokeWidthVariationLayers(
      strokeWidth,
      "seed-center",
      8,
      8,
    );

    expect(minStrokeWidth(layers)).toBeLessThan(strokeWidth);
    expect(maxStrokeWidth(layers)).toBeGreaterThan(strokeWidth);
  });

  it("increases width variation as the variation control rises", () => {
    const strokeWidth = 1.55;
    const seed = "seed-variation";
    const twoLayers = createStrokeWidthVariationLayers(strokeWidth, seed, 2, 8);
    const sixLayers = createStrokeWidthVariationLayers(strokeWidth, seed, 6, 8);
    const tenLayers = createStrokeWidthVariationLayers(strokeWidth, seed, 10, 8);

    expect(strokeWidthSpread(sixLayers)).toBeGreaterThan(
      strokeWidthSpread(twoLayers),
    );
    expect(strokeWidthSpread(tenLayers)).toBeGreaterThan(
      strokeWidthSpread(sixLayers),
    );
  });

  it("holds one constant width across the line at frequency 0", () => {
    // Frequency 0 = pick a single random width within the range and do not vary
    // it along the line, so every ribbon slice shares one width.
    const layers = createStrokeWidthVariationLayers(2, "seed-flat", 8, 0, {
      basePath: LONG_EDGE_PATH,
      shape: "divider",
    });
    const ribbons = ribbonLayers(layers);

    expect(ribbons.length).toBeGreaterThan(1);
    expect(strokeWidthSpread(ribbons)).toBe(0);
  });

  it("reaches further toward the range edges as frequency rises", () => {
    // Same range (variation), higher frequency → the oscillation sweeps closer
    // to the thin/thick extremes, so the observed spread grows.
    const lowFreq = createStrokeWidthVariationLayers(2, "seed-freq", 8, 2, {
      basePath: LONG_EDGE_PATH,
      shape: "divider",
    });
    const highFreq = createStrokeWidthVariationLayers(2, "seed-freq", 8, 9, {
      basePath: LONG_EDGE_PATH,
      shape: "divider",
    });

    expect(strokeWidthSpread(ribbonLayers(highFreq))).toBeGreaterThan(
      strokeWidthSpread(ribbonLayers(lowFreq)),
    );
  });

  it("stays deterministic for the same seed and inputs", () => {
    const strokeWidth = 1.55;
    const seed = "seed-repeatable";
    const first = createStrokeWidthVariationLayers(strokeWidth, seed, 8, 8);
    const second = createStrokeWidthVariationLayers(strokeWidth, seed, 8, 8);

    expect(second).toEqual(first);
  });

  it("scales ribbon slice count with edge pixel length (density is constant)", () => {
    // A long edge must get proportionally MORE ribbon slices than a short edge
    // at the same variation — this is the length-aware fix. Equal counts would
    // mean the short edge packs the same width changes into less space (jagged)
    // and the long edge spreads them thin (smooth), the reported bug.
    const shortLayers = createStrokeWidthVariationLayers(2, "seed-len", 6, 4, {
      basePath: SHORT_EDGE_PATH,
      shape: "divider",
    });
    const longLayers = createStrokeWidthVariationLayers(2, "seed-len", 6, 4, {
      basePath: LONG_EDGE_PATH,
      shape: "divider",
    });

    const shortRibbons = ribbonLayers(shortLayers).length;
    const longRibbons = ribbonLayers(longLayers).length;

    expect(longRibbons).toBeGreaterThan(shortRibbons);
    // ~10x the length should produce many more slices, not a fixed count.
    expect(longRibbons).toBeGreaterThanOrEqual(shortRibbons * 4);
  });

  it("bounds width amplitude in the same pixel envelope regardless of edge length", () => {
    // Amplitude is a pixel quantity driven by the variation control, so the
    // width envelope (the ceiling a slice can reach) is identical for a short
    // and a long edge — only the NUMBER of slices differs with length, never
    // how thick/thin the line is allowed to get.
    const strokeWidth = 2;
    const shortLayers = createStrokeWidthVariationLayers(strokeWidth, "seed-amp", 7, 7, {
      basePath: SHORT_EDGE_PATH,
      shape: "divider",
    });
    const longLayers = createStrokeWidthVariationLayers(strokeWidth, "seed-amp", 7, 7, {
      basePath: LONG_EDGE_PATH,
      shape: "divider",
    });

    // Both edges share the SAME pixel envelope — their peaks (and troughs) sit
    // within a small tolerance of each other. Any gap is sampling luck (which
    // wave point each slice lands on), never a length-driven amplitude change.
    expect(
      Math.abs(maxStrokeWidth(longLayers) - maxStrokeWidth(shortLayers)),
    ).toBeLessThan(0.3);
    expect(
      Math.abs(minStrokeWidth(longLayers) - minStrokeWidth(shortLayers)),
    ).toBeLessThan(0.3);
  });
});
