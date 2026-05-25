import { describe, expect, it } from "vitest";

import {
  createStrokeWidthVariationLayers,
  type HandDrawnFrameStrokeLayer,
  type HandDrawnFrameStrokePathVariant,
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

function isSurfaceSideVariant(
  pathVariant: HandDrawnFrameStrokePathVariant | undefined,
): pathVariant is Exclude<HandDrawnFrameStrokePathVariant, "frame"> {
  return (
    pathVariant === "top" ||
    pathVariant === "right" ||
    pathVariant === "bottom" ||
    pathVariant === "left"
  );
}

function parseDashArray(layer: HandDrawnFrameStrokeLayer) {
  return (layer.dasharray ?? "")
    .split(/\s+/)
    .map(Number)
    .filter((segment) => Number.isFinite(segment));
}

describe("createStrokeWidthVariationLayers", () => {
  it("returns a single baseline layer at intensity 0", () => {
    const strokeWidth = 1.55;
    const layers = createStrokeWidthVariationLayers(strokeWidth, "seed-0", 0);

    expect(layers).toHaveLength(1);
    expect(numericStrokeWidth(layers[0]!)).toBe(strokeWidth);
  });

  it("keeps decorative passes on both sides of the base stroke width", () => {
    const strokeWidth = 1.55;
    const layers = createStrokeWidthVariationLayers(
      strokeWidth,
      "seed-center",
      8,
    );

    expect(minStrokeWidth(layers)).toBeLessThan(strokeWidth);
    expect(maxStrokeWidth(layers)).toBeGreaterThan(strokeWidth);
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

  it("mixes continuous and gapped decorative layers at higher intensity", () => {
    const strokeWidth = 1.55;
    const layers = createStrokeWidthVariationLayers(
      strokeWidth,
      "seed-organic-mix",
      10,
    );
    const decorativeLayers = layers.slice(1);

    expect(decorativeLayers.some((layer) => layer.dasharray)).toBe(true);
    expect(decorativeLayers.some((layer) => !layer.dasharray)).toBe(true);
    expect(decorativeLayers.some((layer) => layer.pathJitter)).toBe(true);
  });

  it("keeps at least one meaningfully thinner expressive pass for contrast", () => {
    const strokeWidth = 1.55;
    const layers = createStrokeWidthVariationLayers(
      strokeWidth,
      "seed-thin-contrast",
      10,
    );
    const decorativeLayers = layers.slice(1);

    expect(
      decorativeLayers.some(
        (layer) => numericStrokeWidth(layer) <= strokeWidth - 0.3,
      ),
    ).toBe(true);
  });

  it("pushes the expressive range toward both very thin and very thick passes near 10", () => {
    const strokeWidth = 1.55;
    const layers = createStrokeWidthVariationLayers(
      strokeWidth,
      "seed-extreme-contrast",
      10,
    );

    expect(minStrokeWidth(layers)).toBeLessThan(strokeWidth * 0.6);
    expect(maxStrokeWidth(layers)).toBeGreaterThan(strokeWidth * 1.65);
  });

  it("biases expressive surface layers toward individual side retraces", () => {
    const strokeWidth = 1.55;
    const decorativeLayers = createStrokeWidthVariationLayers(
      strokeWidth,
      "seed-side-aware",
      10,
    ).slice(1);
    const sideVariants = decorativeLayers
      .map((layer) => layer.pathVariant)
      .filter(isSurfaceSideVariant);
    const sideCounts = sideVariants.reduce<Record<string, number>>(
      (counts, sideVariant) => {
        counts[sideVariant] = (counts[sideVariant] ?? 0) + 1;
        return counts;
      },
      {},
    );

    expect(decorativeLayers.length).toBeLessThanOrEqual(120);
    expect(sideVariants.length).toBeGreaterThanOrEqual(2);
    expect(new Set(sideVariants).size).toBeGreaterThanOrEqual(2);
    expect(Math.max(...Object.values(sideCounts))).toBeGreaterThan(1);
    expect(
      sideVariants.some(
        (sideVariant) => sideVariant === "top" || sideVariant === "bottom",
      ),
    ).toBe(true);
    expect(
      sideVariants.some(
        (sideVariant) => sideVariant === "left" || sideVariant === "right",
      ),
    ).toBe(true);
  });

  it("keeps both horizontal sides engaged at the top of the expressive range", () => {
    const strokeWidth = 1.55;
    const sideVariants = createStrokeWidthVariationLayers(
      strokeWidth,
      "seed-horizontal-balance",
      10,
    )
      .slice(1)
      .map((layer) => layer.pathVariant)
      .filter(isSurfaceSideVariant);

    expect(sideVariants).toContain("top");
    expect(sideVariants).toContain("bottom");
  });

  it("can create partial horizontal retraces so top and bottom keep mixed thin and thick moments", () => {
    const strokeWidth = 1.55;
    const horizontalPartialVariants = createStrokeWidthVariationLayers(
      strokeWidth,
      "seed-horizontal-fragments",
      10,
    )
      .slice(1)
      .filter(
        (layer) =>
          layer.dasharray &&
          (layer.pathVariant === "top" || layer.pathVariant === "bottom"),
      )
      .map((layer) => layer.pathVariant);

    expect(horizontalPartialVariants.length).toBeGreaterThan(0);
  });

  it("adds subtle offset retraces so overlapping pressure passes can sit beside the scaffold", () => {
    const strokeWidth = 1.55;
    const retraceLayers = createStrokeWidthVariationLayers(
      strokeWidth,
      "seed-offset-retrace",
      10,
    )
      .slice(1)
      .filter(
        (layer) => layer.pathOffset && isSurfaceSideVariant(layer.pathVariant),
      );

    expect(retraceLayers.length).toBeGreaterThan(0);
    expect(retraceLayers.some((layer) => (layer.opacity ?? 0) < 0.7)).toBe(
      true,
    );
  });

  it("builds irregular dry gaps instead of evenly repeating stripes", () => {
    const strokeWidth = 1.55;
    const partialLayers = createStrokeWidthVariationLayers(
      strokeWidth,
      "seed-dry-gap-variation",
      10,
    )
      .slice(1)
      .filter((layer) => layer.dasharray);

    expect(
      partialLayers.some((layer) => {
        const dashArray = parseDashArray(layer);
        const gaps = dashArray.filter((_, index) => index % 2 === 1);

        if (gaps.length < 2) {
          return false;
        }

        const minGap = Math.min(...gaps);
        const maxGap = Math.max(...gaps);
        const distinctGapCount = new Set(gaps.map((gap) => gap.toFixed(1)))
          .size;

        return maxGap >= 6 && maxGap > minGap * 1.7 && distinctGapCount >= 3;
      }),
    ).toBe(true);
  });

  it("keeps divider variation on the shared path instead of splitting into sides", () => {
    const strokeWidth = 1.55;
    const decorativeLayers = createStrokeWidthVariationLayers(
      strokeWidth,
      "seed-divider",
      10,
      { shape: "divider" },
    ).slice(1);

    expect(decorativeLayers.length).toBeGreaterThan(0);
    expect(
      decorativeLayers.every(
        (layer) => !layer.pathVariant || layer.pathVariant === "frame",
      ),
    ).toBe(true);
  });

  it("stays deterministic for the same seed and inputs", () => {
    const strokeWidth = 1.55;
    const seed = "seed-repeatable";
    const first = createStrokeWidthVariationLayers(strokeWidth, seed, 8);
    const second = createStrokeWidthVariationLayers(strokeWidth, seed, 8);

    expect(second).toEqual(first);
  });
});
