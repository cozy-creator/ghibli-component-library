import { createSeededRandom } from "./hand-drawn-frame.random";

export type HandDrawnFrameShape = "surface" | "divider";

export type HandDrawnFrameAxis = "x" | "y";

export type HandDrawnFrameCoordinateRole = "anchor" | "control";

/**
 * Per-axis jitter/morph multiplier. The SVG viewBox is stretched to fill the
 * frame with preserveAspectRatio="none", so wobble authored in viewBox units
 * renders larger on the more-stretched axis. To keep the hand-drawn drift even
 * in *rendered pixels*, the weaker (less-stretched) axis is amplified by the
 * stretch ratio; the dominant axis stays at 1. A square frame is {x:1, y:1}.
 */
export type HandDrawnFrameAxisScale = {
  x: number;
  y: number;
};

export type HandDrawnFrameJitterConfig = {
  anchor: number;
  control: number;
};

const PATH_TOKEN_PATTERN = /[A-Za-z]|-?\d*\.?\d+/g;
const NEUTRAL_SCALE_RATIO_THRESHOLD = 1.01;
const NEUTRAL_AXIS_SCALE: HandDrawnFrameAxisScale = { x: 1, y: 1 };

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function parseViewBox(viewBox: string) {
  const [rawMinX = 0, rawMinY = 0, rawWidth = 0, rawHeight = 0] = viewBox
    .trim()
    .split(/\s+/)
    .map(Number);
  const minX = Number.isFinite(rawMinX) ? rawMinX : 0;
  const minY = Number.isFinite(rawMinY) ? rawMinY : 0;
  const width = Number.isFinite(rawWidth) ? rawWidth : 0;
  const height = Number.isFinite(rawHeight) ? rawHeight : 0;

  return {
    height,
    maxX: minX + width,
    maxY: minY + height,
    minX,
    minY,
    width,
  };
}

function coordinateRole(
  command: string,
  coordinateIndex: number,
): HandDrawnFrameCoordinateRole | null {
  switch (command) {
    case "M":
    case "L":
    case "T":
    case "H":
    case "V":
      return "anchor";
    case "Q":
    case "S":
      return coordinateIndex % 4 < 2 ? "control" : "anchor";
    case "C":
      return coordinateIndex % 6 < 4 ? "control" : "anchor";
    default:
      return null;
  }
}

function coordinateAxis(command: string, coordinateIndex: number) {
  if (command === "H") return "x";
  if (command === "V") return "y";

  return coordinateIndex % 2 === 0 ? "x" : "y";
}

// Mirrors the original command-letter axis seeding so output is unchanged.
function axisForCommandToken(token: string, current: HandDrawnFrameAxis) {
  if (/[MLCQST]/.test(token)) return "x";
  if (token === "H") return "x";
  if (token === "V") return "y";

  return current;
}

/**
 * Compute the per-axis amplification needed for even rendered wobble. Replaces
 * the previous nested compensation tables (Record<axis, Record<role>>): the
 * weaker axis ends up at the stretch ratio, the dominant axis at 1, which
 * equalises pixel drift across axes. Returns neutral for dividers, square-ish
 * frames, or invalid sizes.
 */
export function resolveAxisJitterScale(
  shape: HandDrawnFrameShape,
  viewBox: string,
  width?: number | null,
  height?: number | null,
): HandDrawnFrameAxisScale {
  if (shape !== "surface" || !width || !height || width <= 0 || height <= 0) {
    return NEUTRAL_AXIS_SCALE;
  }

  const bounds = parseViewBox(viewBox);
  const scaleX = width / bounds.width;
  const scaleY = height / bounds.height;

  if (
    !Number.isFinite(scaleX) ||
    !Number.isFinite(scaleY) ||
    scaleX <= 0 ||
    scaleY <= 0
  ) {
    return NEUTRAL_AXIS_SCALE;
  }

  const dominantScale = Math.max(scaleX, scaleY);
  const scaleRatio = dominantScale / Math.min(scaleX, scaleY);

  if (!Number.isFinite(scaleRatio) || scaleRatio <= NEUTRAL_SCALE_RATIO_THRESHOLD) {
    return NEUTRAL_AXIS_SCALE;
  }

  // Dominant axis -> dominant/dominant = 1; weaker axis -> dominant/weaker = ratio.
  return { x: dominantScale / scaleX, y: dominantScale / scaleY };
}

export function interpolatePath(
  fromPath: string,
  toPath: string,
  intensity: number,
  axisScale: HandDrawnFrameAxisScale = NEUTRAL_AXIS_SCALE,
) {
  const baseIntensity = clamp(intensity, 0, 1);

  if (baseIntensity <= 0) {
    return fromPath;
  }

  const fromTokens = fromPath.match(PATH_TOKEN_PATTERN) ?? [];
  const toTokens = toPath.match(PATH_TOKEN_PATTERN) ?? [];

  if (fromTokens.length !== toTokens.length) {
    return baseIntensity < 0.5 ? fromPath : toPath;
  }

  let axis: HandDrawnFrameAxis = "x";
  let command = "";
  let coordinateIndex = 0;

  return fromTokens
    .map((fromToken, index) => {
      const toToken = toTokens[index];

      if (!toToken) {
        return fromToken;
      }

      if (/^[A-Za-z]$/.test(fromToken) || /^[A-Za-z]$/.test(toToken)) {
        if (/^[A-Za-z]$/.test(fromToken)) {
          command = fromToken;
          coordinateIndex = 0;
          axis = axisForCommandToken(fromToken, axis);
        }

        return fromToken === toToken ? fromToken : toToken;
      }

      const fromValue = Number(fromToken);
      const toValue = Number(toToken);

      if (Number.isNaN(fromValue) || Number.isNaN(toValue)) {
        return toToken;
      }

      const role = coordinateRole(command, coordinateIndex);
      const resolvedAxis = coordinateAxis(command, coordinateIndex) ?? axis;
      // Morph amplification applies only to control points (the curve bulge) on
      // the weaker axis; anchors stay at base intensity so corners don't
      // overshoot the frame.
      const morphScale = role === "control" ? axisScale[resolvedAxis] : 1;
      const coordinateIntensity = clamp(baseIntensity * morphScale, 0, morphScale);

      coordinateIndex += 1;
      axis = resolvedAxis === "x" ? "y" : "x";

      return (fromValue + (toValue - fromValue) * coordinateIntensity).toFixed(3);
    })
    .join(" ");
}

export function perturbPath(
  path: string,
  viewBox: string,
  jitter: HandDrawnFrameJitterConfig,
  seed: string,
  axisScale: HandDrawnFrameAxisScale = NEUTRAL_AXIS_SCALE,
) {
  if (jitter.anchor <= 0 && jitter.control <= 0) {
    return path;
  }

  const bounds = parseViewBox(viewBox);
  const tokens = path.match(PATH_TOKEN_PATTERN) ?? [];
  const random = createSeededRandom(seed);
  let axis: HandDrawnFrameAxis = "x";
  let command = "";
  let coordinateIndex = 0;

  return tokens
    .map((token) => {
      if (/^[A-Za-z]$/.test(token)) {
        command = token;
        coordinateIndex = 0;
        axis = axisForCommandToken(token, axis);

        return token;
      }

      const value = Number(token);

      if (Number.isNaN(value)) {
        return token;
      }

      const role = coordinateRole(command, coordinateIndex);
      const resolvedAxis = coordinateAxis(command, coordinateIndex) ?? axis;
      // Jitter amplification applies to both anchors and control points.
      const scale = axisScale[resolvedAxis];
      const jitterAmount =
        role === "control"
          ? jitter.control * scale
          : role === "anchor"
            ? jitter.anchor * scale
            : 0;

      coordinateIndex += 1;
      axis = resolvedAxis === "x" ? "y" : "x";

      if (!role || jitterAmount <= 0) {
        return token;
      }

      const delta = (random() * 2 - 1) * jitterAmount;
      const min = resolvedAxis === "x" ? bounds.minX : bounds.minY;
      const max = resolvedAxis === "x" ? bounds.maxX : bounds.maxY;

      return clamp(value + delta, min, max).toFixed(3);
    })
    .join(" ");
}

export function normalizePathToObjectBoundingBox(path: string, viewBox: string) {
  const bounds = parseViewBox(viewBox);
  const tokens = path.match(PATH_TOKEN_PATTERN) ?? [];
  let axis: HandDrawnFrameAxis = "x";
  let command = "";

  const normalized = tokens
    .map((token) => {
      if (/^[A-Za-z]$/.test(token)) {
        command = token;
        axis = axisForCommandToken(token, axis);

        return token;
      }

      const value = Number(token);

      if (Number.isNaN(value)) {
        return token;
      }

      if (command === "H") {
        return ((value - bounds.minX) / bounds.width).toFixed(6);
      }

      if (command === "V") {
        return ((value - bounds.minY) / bounds.height).toFixed(6);
      }

      const normalizedValue =
        axis === "x"
          ? (value - bounds.minX) / bounds.width
          : (value - bounds.minY) / bounds.height;

      axis = axis === "x" ? "y" : "x";

      return normalizedValue.toFixed(6);
    })
    .join(" ");

  return /[Zz]\s*$/.test(normalized) ? normalized : `${normalized} Z`;
}
