export type HandDrawnFrameShape = "surface" | "divider";

export type HandDrawnFrameAxis = "x" | "y";

export type HandDrawnFrameCoordinateRole = "anchor" | "control";

type HandDrawnFrameAxisRoleCompensation = Record<
  HandDrawnFrameAxis,
  Record<HandDrawnFrameCoordinateRole, number>
>;

export type HandDrawnFrameCrookednessCompensation = {
  jitter: HandDrawnFrameAxisRoleCompensation;
  morph: HandDrawnFrameAxisRoleCompensation;
};

export type HandDrawnFrameJitterConfig = {
  anchor: number;
  control: number;
};

const PATH_TOKEN_PATTERN = /[A-Za-z]|-?\d*\.?\d+/g;
const NEUTRAL_SCALE_RATIO_THRESHOLD = 1.01;

function createNeutralAxisRoleCompensation(): HandDrawnFrameAxisRoleCompensation {
  return {
    x: { anchor: 1, control: 1 },
    y: { anchor: 1, control: 1 },
  };
}

function createNeutralCrookednessCompensation(): HandDrawnFrameCrookednessCompensation {
  return {
    jitter: createNeutralAxisRoleCompensation(),
    morph: createNeutralAxisRoleCompensation(),
  };
}

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

function resolveCrookednessCompensationValue(
  compensation?: HandDrawnFrameCrookednessCompensation,
) {
  return compensation ?? createNeutralCrookednessCompensation();
}

export function resolveCrookednessCompensation(
  shape: HandDrawnFrameShape,
  viewBox: string,
  width?: number | null,
  height?: number | null,
): HandDrawnFrameCrookednessCompensation {
  const neutralCompensation = createNeutralCrookednessCompensation();

  if (shape !== "surface" || !width || !height || width <= 0 || height <= 0) {
    return neutralCompensation;
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
    return neutralCompensation;
  }

  const dominantScale = Math.max(scaleX, scaleY);
  const weakerScale = Math.min(scaleX, scaleY);
  const scaleRatio = dominantScale / weakerScale;

  if (
    !Number.isFinite(scaleRatio) ||
    scaleRatio <= 0 ||
    scaleRatio <= NEUTRAL_SCALE_RATIO_THRESHOLD
  ) {
    return neutralCompensation;
  }

  const weakerAxis: HandDrawnFrameAxis = scaleX < scaleY ? "x" : "y";
  const compensation = createNeutralCrookednessCompensation();

  compensation.morph[weakerAxis].control = scaleRatio;
  compensation.jitter[weakerAxis].anchor = scaleRatio;
  compensation.jitter[weakerAxis].control = scaleRatio;

  return compensation;
}

function resolveCoordinateCompensation(
  compensation: HandDrawnFrameAxisRoleCompensation,
  axis: HandDrawnFrameAxis,
  role: HandDrawnFrameCoordinateRole | null,
) {
  if (!role) {
    return 1;
  }

  return compensation[axis][role];
}

function resolveInterpolationIntensity(
  baseIntensity: number,
  compensation: HandDrawnFrameCrookednessCompensation,
  axis: HandDrawnFrameAxis,
  role: HandDrawnFrameCoordinateRole | null,
) {
  const coordinateCompensation = resolveCoordinateCompensation(
    compensation.morph,
    axis,
    role,
  );

  return clamp(
    baseIntensity * coordinateCompensation,
    0,
    coordinateCompensation,
  );
}

export function interpolatePath(
  fromPath: string,
  toPath: string,
  intensity: number,
  compensation?: HandDrawnFrameCrookednessCompensation,
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

  const resolvedCompensation =
    resolveCrookednessCompensationValue(compensation);
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

          if (/[MLCQST]/.test(fromToken)) {
            axis = "x";
          } else if (fromToken === "H") {
            axis = "x";
          } else if (fromToken === "V") {
            axis = "y";
          }
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
      const coordinateIntensity = resolveInterpolationIntensity(
        baseIntensity,
        resolvedCompensation,
        resolvedAxis,
        role,
      );

      coordinateIndex += 1;
      axis = resolvedAxis === "x" ? "y" : "x";

      return (fromValue + (toValue - fromValue) * coordinateIntensity).toFixed(
        3,
      );
    })
    .join(" ");
}

export function perturbPath(
  path: string,
  viewBox: string,
  jitter: HandDrawnFrameJitterConfig,
  seed: string,
  compensation?: HandDrawnFrameCrookednessCompensation,
) {
  if (jitter.anchor <= 0 && jitter.control <= 0) {
    return path;
  }

  const bounds = parseViewBox(viewBox);
  const tokens = path.match(PATH_TOKEN_PATTERN) ?? [];
  const resolvedCompensation =
    resolveCrookednessCompensationValue(compensation);
  const random = createSeededRandom(seed);
  let axis: HandDrawnFrameAxis = "x";
  let command = "";
  let coordinateIndex = 0;

  return tokens
    .map((token) => {
      if (/^[A-Za-z]$/.test(token)) {
        command = token;
        coordinateIndex = 0;

        if (/[MLCQST]/.test(token)) {
          axis = "x";
        } else if (token === "H") {
          axis = "x";
        } else if (token === "V") {
          axis = "y";
        }

        return token;
      }

      const value = Number(token);

      if (Number.isNaN(value)) {
        return token;
      }

      const role = coordinateRole(command, coordinateIndex);
      const resolvedAxis = coordinateAxis(command, coordinateIndex) ?? axis;
      const coordinateCompensation = resolveCoordinateCompensation(
        resolvedCompensation.jitter,
        resolvedAxis,
        role,
      );
      const jitterAmount =
        role === "control"
          ? jitter.control * coordinateCompensation
          : role === "anchor"
            ? jitter.anchor * coordinateCompensation
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

export function normalizePathToObjectBoundingBox(
  path: string,
  viewBox: string,
) {
  const bounds = parseViewBox(viewBox);
  const tokens = path.match(PATH_TOKEN_PATTERN) ?? [];
  let axis: HandDrawnFrameAxis = "x";
  let command = "";

  const normalized = tokens
    .map((token) => {
      if (/^[A-Za-z]$/.test(token)) {
        command = token;

        if (/[MLCQST]/.test(token)) {
          axis = "x";
        } else if (token === "H") {
          axis = "x";
        } else if (token === "V") {
          axis = "y";
        }

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
