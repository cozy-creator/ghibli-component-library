export type HandDrawnFrameStrokeLayer = {
  dasharray?: string;
  dashoffset?: number;
  opacity?: number;
  pathLength?: number;
  strokeWidth: number | string;
};

const HAND_DRAWN_THICKNESS_PATH_LENGTH = 100;
const THICKNESS_NEUTRAL_INTENSITY = 5;
const THICKNESS_NEUTRAL_INTENSITY_FACTOR = Math.pow(0.5, 0.46);
const THICKNESS_NEUTRAL_OVERLAY_COUNT = 4;
const THICKNESS_NEUTRAL_SEGMENT_OFFSET = Math.round(
  THICKNESS_NEUTRAL_INTENSITY_FACTOR * 2.5,
);

type HandDrawnFrameThicknessProfile = {
  baseStrokeWidth: number;
  maxBaseInsetRatio: number;
  maxPositiveExpansion: number;
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

function createNeutralThicknessProfile(strokeWidth: number) {
  const baseVariationSpan = clamp(strokeWidth * 0.24, 0.18, 0.5);
  const maxPositiveExpansion = clamp(
    strokeWidth * (0.34 + THICKNESS_NEUTRAL_INTENSITY_FACTOR * 0.32),
    0.3,
    1.6,
  );
  const variationSpan = clamp(
    baseVariationSpan * (0.52 + THICKNESS_NEUTRAL_INTENSITY_FACTOR * 2.1),
    0,
    maxPositiveExpansion * 0.88,
  );
  const maxBaseInsetRatio = clamp(
    0.18 + THICKNESS_NEUTRAL_INTENSITY_FACTOR * 0.18,
    0.18,
    0.38,
  );

  return {
    maxBaseInsetRatio,
    maxPositiveExpansion,
    variationSpan,
  };
}

function resolveThicknessProfile(
  strokeWidth: number,
  thicknessIntensity: number,
): HandDrawnFrameThicknessProfile {
  const intensity = clamp(thicknessIntensity, 0, 10);
  const lowT = clamp(
    (THICKNESS_NEUTRAL_INTENSITY - intensity) / THICKNESS_NEUTRAL_INTENSITY,
    0,
    1,
  );
  const highT = clamp(
    (intensity - THICKNESS_NEUTRAL_INTENSITY) / THICKNESS_NEUTRAL_INTENSITY,
    0,
    1,
  );
  const thinEase = lowT ** 0.8;
  const thickEase = highT ** 1.15;
  const neutralProfile = createNeutralThicknessProfile(strokeWidth);
  const baseWidthScale =
    intensity < THICKNESS_NEUTRAL_INTENSITY
      ? 1 - 0.22 * thinEase
      : 1 + 0.08 * thickEase;
  const variationScale =
    intensity < THICKNESS_NEUTRAL_INTENSITY
      ? 1 - 0.95 * thinEase
      : 1 + 1.45 * thickEase;
  const expansionScale =
    intensity < THICKNESS_NEUTRAL_INTENSITY
      ? 1 - 0.85 * thinEase
      : 1 + 1.9 * thickEase;
  const insetScale =
    intensity < THICKNESS_NEUTRAL_INTENSITY
      ? 1 - 0.55 * thinEase
      : 1 + 0.25 * thickEase;
  const opacityScale =
    intensity < THICKNESS_NEUTRAL_INTENSITY
      ? 1 - 0.75 * thinEase
      : 1 + 0.35 * thickEase;
  const overlayCount =
    intensity === 0
      ? 0
      : intensity < THICKNESS_NEUTRAL_INTENSITY
        ? clamp(
            THICKNESS_NEUTRAL_OVERLAY_COUNT - Math.ceil(thinEase * 3),
            1,
            THICKNESS_NEUTRAL_OVERLAY_COUNT,
          )
        : clamp(
            THICKNESS_NEUTRAL_OVERLAY_COUNT + Math.round(thickEase * 2),
            THICKNESS_NEUTRAL_OVERLAY_COUNT,
            6,
          );
  const segmentBoost =
    intensity < THICKNESS_NEUTRAL_INTENSITY ? 0 : Math.round(thickEase * 2);

  return {
    baseStrokeWidth: strokeWidth * baseWidthScale,
    maxBaseInsetRatio: clamp(
      neutralProfile.maxBaseInsetRatio * insetScale,
      0.08,
      0.52,
    ),
    maxPositiveExpansion: neutralProfile.maxPositiveExpansion * expansionScale,
    opacityScale,
    overlayCount,
    segmentBoost,
    variationSpan: neutralProfile.variationSpan * variationScale,
  };
}

// SVG doesn't support varying stroke width along a single path, so we layer a
// few deterministic dash-masked strokes to create a restrained hand-drawn drift.
export function createThicknessVariationStrokeLayers(
  strokeWidth: number,
  seed: string,
  thicknessIntensity: number,
) {
  const profile = resolveThicknessProfile(strokeWidth, thicknessIntensity);

  if (profile.overlayCount <= 0) {
    return [{ strokeWidth: formatSvgNumber(profile.baseStrokeWidth) }];
  }

  const random = createSeededRandom(seed);
  const layers: HandDrawnFrameStrokeLayer[] = [
    {
      strokeWidth: formatSvgNumber(
        clamp(
          profile.baseStrokeWidth -
            profile.variationSpan *
              (0.34 +
                THICKNESS_NEUTRAL_INTENSITY_FACTOR * 0.24 +
                random() * (0.16 + THICKNESS_NEUTRAL_INTENSITY_FACTOR * 0.14)),
          Math.max(
            profile.baseStrokeWidth * (1 - profile.maxBaseInsetRatio),
            profile.baseStrokeWidth -
              profile.variationSpan *
                (0.62 + THICKNESS_NEUTRAL_INTENSITY_FACTOR * 0.24),
          ),
          profile.baseStrokeWidth,
        ),
      ),
    },
  ];

  for (let index = 0; index < profile.overlayCount; index += 1) {
    const dashPattern = createStrokeDashPattern(
      random,
      4 + index + THICKNESS_NEUTRAL_SEGMENT_OFFSET + profile.segmentBoost,
    );
    const layerThicknessFactor = clamp(
      0.28 +
        index * (0.22 + THICKNESS_NEUTRAL_INTENSITY_FACTOR * 0.08) +
        (random() - 0.5) * (0.12 + THICKNESS_NEUTRAL_INTENSITY_FACTOR * 0.2),
      0.18 + THICKNESS_NEUTRAL_INTENSITY_FACTOR * 0.04,
      1.02 + THICKNESS_NEUTRAL_INTENSITY_FACTOR * 0.3,
    );
    const baseOpacity = clamp(
      0.34 +
        THICKNESS_NEUTRAL_INTENSITY_FACTOR * 0.3 -
        index * (0.048 - THICKNESS_NEUTRAL_INTENSITY_FACTOR * 0.006) +
        random() * (0.05 + THICKNESS_NEUTRAL_INTENSITY_FACTOR * 0.08),
      0.24,
      0.82,
    );

    layers.push({
      dasharray: dashPattern.map((segment) => segment.toFixed(3)).join(" "),
      dashoffset: formatSvgNumber(random() * HAND_DRAWN_THICKNESS_PATH_LENGTH),
      opacity: formatSvgNumber(
        clamp(baseOpacity * profile.opacityScale, 0.12, 0.92),
      ),
      pathLength: HAND_DRAWN_THICKNESS_PATH_LENGTH,
      strokeWidth: formatSvgNumber(
        clamp(
          profile.baseStrokeWidth + profile.variationSpan * layerThicknessFactor,
          profile.baseStrokeWidth,
          profile.baseStrokeWidth + profile.maxPositiveExpansion,
        ),
      ),
    });
  }

  return layers;
}
