export type HandDrawnFrameStrokeLayer = {
  dasharray?: string;
  dashoffset?: number;
  opacity?: number;
  pathLength?: number;
  strokeWidth: number | string;
};

const HAND_DRAWN_STROKE_WIDTH_VARIATION_PATH_LENGTH = 100;

type HandDrawnFrameStrokeWidthVariationProfile = {
  maxStrokeWidth: number;
  minStrokeWidth: number;
  opacityScale: number;
  overlayCount: number;
  segmentBoost: number;
  variationSpan: number;
};

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
  length = HAND_DRAWN_STROKE_WIDTH_VARIATION_PATH_LENGTH,
) {
  const segments: number[] = [];

  for (let index = 0; index < segmentCount; index += 1) {
    segments.push(1.25 + random() * 1.35);
    segments.push(0.85 + random() * 1.05);
  }

  const totalLength = segments.reduce((sum, segment) => sum + segment, 0);

  return segments.map((segment) => (segment / totalLength) * length);
}

function resolveStrokeWidthVariationProfile(
  strokeWidth: number,
  strokeWidthVariation: number,
): HandDrawnFrameStrokeWidthVariationProfile {
  const intensity = clamp(strokeWidthVariation, 0, 10);
  const intensityFactor = (intensity / 10) ** 0.82;
  const variationSpan = clamp(
    strokeWidth * 0.72 * intensityFactor,
    0,
    strokeWidth * 0.72,
  );
  const overlayCount =
    intensity === 0 ? 0 : clamp(Math.ceil(1 + intensityFactor * 5), 1, 6);
  const halfVariation = variationSpan / 2;

  return {
    maxStrokeWidth: strokeWidth + halfVariation,
    minStrokeWidth: Math.max(strokeWidth - halfVariation, strokeWidth * 0.35),
    opacityScale: 0.68 + intensityFactor * 0.14,
    overlayCount,
    segmentBoost: Math.round(intensityFactor * 3),
    variationSpan,
  };
}

// SVG doesn't support varying stroke width along a single path, so we layer a
// few deterministic dash-masked strokes to create a restrained hand-drawn drift.
export function createStrokeWidthVariationLayers(
  strokeWidth: number,
  seed: string,
  strokeWidthVariation: number,
) {
  const profile = resolveStrokeWidthVariationProfile(
    strokeWidth,
    strokeWidthVariation,
  );

  if (profile.overlayCount <= 0) {
    return [{ strokeWidth: formatSvgNumber(strokeWidth) }];
  }

  const random = createSeededRandom(seed);
  const layerFloor =
    profile.minStrokeWidth + profile.variationSpan * 0.08 * random();
  const layers: HandDrawnFrameStrokeLayer[] = [
    {
      strokeWidth: formatSvgNumber(layerFloor),
    },
  ];

  for (let index = 0; index < profile.overlayCount; index += 1) {
    const layerT =
      profile.overlayCount === 1 ? 1 : index / (profile.overlayCount - 1);
    const dashPattern = createStrokeDashPattern(
      random,
      4 + index + profile.segmentBoost,
    );
    const layerVariationFactor = clamp(
      0.36 + layerT * 0.64 + (random() - 0.5) * 0.22,
      0.24,
      1,
    );
    const baseOpacity = clamp(
      0.42 - layerT * 0.18 + random() * 0.1,
      0.18,
      0.58,
    );

    layers.push({
      dasharray: dashPattern.map((segment) => segment.toFixed(3)).join(" "),
      dashoffset: formatSvgNumber(
        random() * HAND_DRAWN_STROKE_WIDTH_VARIATION_PATH_LENGTH,
      ),
      opacity: formatSvgNumber(
        clamp(baseOpacity * profile.opacityScale, 0.12, 0.92),
      ),
      pathLength: HAND_DRAWN_STROKE_WIDTH_VARIATION_PATH_LENGTH,
      strokeWidth: formatSvgNumber(
        clamp(
          profile.minStrokeWidth + profile.variationSpan * layerVariationFactor,
          profile.minStrokeWidth,
          profile.maxStrokeWidth,
        ),
      ),
    });
  }

  return layers;
}
