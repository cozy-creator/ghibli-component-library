export type Point = [number, number];

export type CubicBezier = [Point, Point, Point, Point];

const PATH_TOKEN_PATTERN = /[A-Za-z]|-?\d*\.?\d+/g;

function formatSvgNumber(value: number) {
  return Number(value.toFixed(3));
}

function lerpPoint(a: Point, b: Point, t: number): Point {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function splitCubicBezier(
  bezier: CubicBezier,
  t: number,
): [CubicBezier, CubicBezier] {
  const [p0, p1, p2, p3] = bezier;
  const p01 = lerpPoint(p0, p1, t);
  const p12 = lerpPoint(p1, p2, t);
  const p23 = lerpPoint(p2, p3, t);
  const p012 = lerpPoint(p01, p12, t);
  const p123 = lerpPoint(p12, p23, t);
  const p0123 = lerpPoint(p012, p123, t);

  return [
    [p0, p01, p012, p0123],
    [p0123, p123, p23, p3],
  ];
}

export function subdivideCubicBezier(
  bezier: CubicBezier,
  count: number,
): CubicBezier[] {
  if (count <= 1) {
    return [bezier];
  }

  const subdivisions: CubicBezier[] = [];
  let remaining = bezier;

  for (let i = 1; i < count; i += 1) {
    const t = 1 / (count - i + 1);
    const [left, right] = splitCubicBezier(remaining, t);

    subdivisions.push(left);
    remaining = right;
  }

  subdivisions.push(remaining);

  return subdivisions;
}

/**
 * Cheap polyline approximation of a cubic Bezier's arc length (in the same
 * units as its control points — pixels here). Samples the curve and sums the
 * chord lengths; accurate enough to drive length-proportional subdivision.
 */
export function approximateCubicLength(bezier: CubicBezier, samples = 8) {
  const [p0, p1, p2, p3] = bezier;
  let length = 0;
  let prevX = p0[0];
  let prevY = p0[1];

  for (let index = 1; index <= samples; index += 1) {
    const t = index / samples;
    const mt = 1 - t;
    const a = mt * mt * mt;
    const b = 3 * mt * mt * t;
    const c = 3 * mt * t * t;
    const d = t * t * t;
    const x = a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0];
    const y = a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1];

    length += Math.hypot(x - prevX, y - prevY);
    prevX = x;
    prevY = y;
  }

  return length;
}

export function bezierToPathString(bezier: CubicBezier) {
  const [p0, p1, p2, p3] = bezier;

  return `M ${formatSvgNumber(p0[0])} ${formatSvgNumber(p0[1])} C ${formatSvgNumber(p1[0])} ${formatSvgNumber(p1[1])} ${formatSvgNumber(p2[0])} ${formatSvgNumber(p2[1])} ${formatSvgNumber(p3[0])} ${formatSvgNumber(p3[1])}`;
}

export function parseCubicSegments(path: string): CubicBezier[] {
  const tokens = path.match(PATH_TOKEN_PATTERN) ?? [];
  const segments: CubicBezier[] = [];
  let index = 0;
  let currentX = 0;
  let currentY = 0;
  let activeCommand = "";

  while (index < tokens.length) {
    const token = tokens[index]!;

    if (/^[A-Za-z]$/.test(token)) {
      activeCommand = token;
      index += 1;
      continue;
    }

    if (activeCommand === "M" || activeCommand === "m") {
      const x = Number(tokens[index]);
      const y = Number(tokens[index + 1]);

      currentX = activeCommand === "m" ? currentX + x : x;
      currentY = activeCommand === "m" ? currentY + y : y;
      index += 2;
      activeCommand = activeCommand === "m" ? "l" : "L";
      continue;
    }

    if (activeCommand === "C" || activeCommand === "c") {
      const x1 = Number(tokens[index]);
      const y1 = Number(tokens[index + 1]);
      const x2 = Number(tokens[index + 2]);
      const y2 = Number(tokens[index + 3]);
      const x3 = Number(tokens[index + 4]);
      const y3 = Number(tokens[index + 5]);
      const isRelative = activeCommand === "c";
      const p0: Point = [currentX, currentY];
      const p1: Point = isRelative ? [currentX + x1, currentY + y1] : [x1, y1];
      const p2: Point = isRelative ? [currentX + x2, currentY + y2] : [x2, y2];
      const p3: Point = isRelative ? [currentX + x3, currentY + y3] : [x3, y3];

      segments.push([p0, p1, p2, p3]);
      currentX = p3[0];
      currentY = p3[1];
      index += 6;
      continue;
    }

    if (activeCommand === "Z" || activeCommand === "z") {
      index += 1;
      continue;
    }

    break;
  }

  return segments;
}
