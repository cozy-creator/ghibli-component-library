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
  it("returns a single uniform layer when the range is collapsed", () => {
    // min === max: width is pinned to the center (no variation possible).
    const layers = createStrokeWidthVariationLayers([1.55, 1.55], 1, "seed-0");

    expect(layers).toHaveLength(1);
    expect(numericStrokeWidth(layers[0]!)).toBe(1.55);
  });

  it("returns a single uniform layer at variation 0 over a real range", () => {
    // variation 0: pick ONE steady width inside the range and hold it — no
    // ribbon slices, no dry accent.
    const layers = createStrokeWidthVariationLayers([1, 3], 0, "seed-steady");

    expect(layers).toHaveLength(1);
    const width = numericStrokeWidth(layers[0]!);

    expect(width).toBeGreaterThanOrEqual(1);
    expect(width).toBeLessThanOrEqual(3);
  });

  it("brackets the range center with both thinner and thicker layers", () => {
    const layers = createStrokeWidthVariationLayers(
      [1, 3],
      0.8,
      "seed-center",
    );
    const center = 2;

    expect(minStrokeWidth(layers)).toBeLessThan(center);
    expect(maxStrokeWidth(layers)).toBeGreaterThan(center);
  });

  it("keeps every slice within the range bounds", () => {
    const layers = createStrokeWidthVariationLayers([1, 3], 1, "seed-bounds");

    expect(minStrokeWidth(layers)).toBeGreaterThanOrEqual(1);
    expect(maxStrokeWidth(layers)).toBeLessThanOrEqual(3);
  });

  it("reaches further toward the range edges as variation rises", () => {
    // Same range, higher variation → the oscillation sweeps closer to the
    // thin/thick extremes, so the observed spread grows.
    const low = createStrokeWidthVariationLayers([1, 3], 0.3, "seed-amount", {
      basePath: LONG_EDGE_PATH,
      shape: "divider",
    });
    const high = createStrokeWidthVariationLayers([1, 3], 1, "seed-amount", {
      basePath: LONG_EDGE_PATH,
      shape: "divider",
    });

    expect(strokeWidthSpread(ribbonLayers(high))).toBeGreaterThan(
      strokeWidthSpread(ribbonLayers(low)),
    );
  });

  it("produces multiple ribbon slices spanning toward both bounds", () => {
    const layers = createStrokeWidthVariationLayers([1, 3], 1, "seed-span", {
      basePath: LONG_EDGE_PATH,
      shape: "divider",
    });
    const ribbons = ribbonLayers(layers);

    expect(ribbons.length).toBeGreaterThan(1);
    // Slices reach toward both the thin and thick ends of the range.
    expect(minStrokeWidth(ribbons)).toBeLessThan(2);
    expect(maxStrokeWidth(ribbons)).toBeGreaterThan(2);
  });

  it("stays deterministic for the same range, variation, seed and size", () => {
    const first = createStrokeWidthVariationLayers([1, 3], 0.8, "seed-repeat");
    const second = createStrokeWidthVariationLayers([1, 3], 0.8, "seed-repeat");

    expect(second).toEqual(first);
  });

  it("scales ribbon slice count with edge pixel length (density is constant)", () => {
    // A long edge must get proportionally MORE ribbon slices than a short edge
    // at the same variation — this is the length-aware fix. Equal counts would
    // mean the short edge packs the same width changes into less space (jagged)
    // and the long edge spreads them thin (smooth), the reported bug.
    const shortLayers = createStrokeWidthVariationLayers([1, 3], 0.6, "seed-len", {
      basePath: SHORT_EDGE_PATH,
      shape: "divider",
    });
    const longLayers = createStrokeWidthVariationLayers([1, 3], 0.6, "seed-len", {
      basePath: LONG_EDGE_PATH,
      shape: "divider",
    });

    const shortRibbons = ribbonLayers(shortLayers).length;
    const longRibbons = ribbonLayers(longLayers).length;

    expect(longRibbons).toBeGreaterThan(shortRibbons);
    // ~10x the length should produce many more slices, not a fixed count.
    expect(longRibbons).toBeGreaterThanOrEqual(shortRibbons * 4);
  });

  it("bounds width in the same range envelope regardless of edge length", () => {
    // The width envelope (the bounds a slice can reach) is set by the range, so
    // it is identical for a short and a long edge — only the NUMBER of slices
    // differs with length, never how thick/thin the line is allowed to get.
    const shortLayers = createStrokeWidthVariationLayers([1, 3], 0.7, "seed-amp", {
      basePath: SHORT_EDGE_PATH,
      shape: "divider",
    });
    const longLayers = createStrokeWidthVariationLayers([1, 3], 0.7, "seed-amp", {
      basePath: LONG_EDGE_PATH,
      shape: "divider",
    });

    // Both edges share the SAME range envelope — their peaks (and troughs) sit
    // within a small tolerance of each other. Any gap is sampling luck (which
    // wave point each slice lands on), never a length-driven envelope change.
    expect(
      Math.abs(maxStrokeWidth(longLayers) - maxStrokeWidth(shortLayers)),
    ).toBeLessThan(0.3);
    expect(
      Math.abs(minStrokeWidth(longLayers) - minStrokeWidth(shortLayers)),
    ).toBeLessThan(0.3);
  });
});
