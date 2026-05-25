import { createSeededRandom } from "./hand-drawn-frame.random";

export type HandDrawnFrameShape = "surface" | "divider";

export type HandDrawnFrameSurfaceSide = "top" | "right" | "bottom" | "left";

/**
 * Geometry for the hand-drawn frame is built in *pixel space*: the SVG viewBox
 * is set to `0 0 width height` so one user unit equals one screen pixel. This is
 * the core of the length-aware perturbation scheme — because units are pixels,
 * we can give every edge the same per-pixel deviation density and the same
 * absolute (pixel) wobble amplitude regardless of how long that edge is on
 * screen. A wide-short box therefore no longer has jagged short sides and smooth
 * long sides: the top/bottom (long) accumulate many gentle wobbles while the
 * left/right (short) get only a few, exactly like a hand drawing across paper.
 */

export type Point = [number, number];

export type HandDrawnFrameSize = {
  width: number;
  height: number;
};

/** A built edge: its anchor points (in pixel space) plus which side it is. */
export type HandDrawnFrameEdge = {
  points: Point[];
  side: HandDrawnFrameSurfaceSide | "frame";
};

export type HandDrawnFrameGeometry = {
  edges: HandDrawnFrameEdge[];
  height: number;
  width: number;
  // Per-corner Bezier-handle smoothness for the four rectangle corners, in
  // [top-left, top-right, bottom-right, bottom-left] order. 1 = fully rounded
  // (the Catmull-Rom "bowed out" corner), ~0 = sharp (handles collapse to an
  // approximate right angle). Randomized per corner so a hand-drawn box mixes
  // rounded and crisp corners instead of bowing every one the same way. Empty
  // for the divider (it has no corners).
  cornerSmoothness: number[];
};

/**
 * Tunables for the length-aware perturbation. `pxPerPoint` is the *density*:
 * one wobble control point roughly every N pixels of edge length (clamped so a
 * tiny edge still gets a couple of points and a huge edge does not explode into
 * thousands). Amplitude is supplied per-call in pixels.
 */
const SURFACE_PX_PER_POINT = 26;
const SURFACE_MIN_POINTS = 2;
const SURFACE_MAX_POINTS = 64;

const DIVIDER_PX_PER_POINT = 22;
const DIVIDER_MIN_POINTS = 3;
const DIVIDER_MAX_POINTS = 80;

/**
 * `crookedness` is now interpreted as a max deviation **in pixels** at the
 * reference value of 10. e.g. crookedness=3 → up to ~1.65px of wobble off the
 * ideal line, crookedness=10 → up to ~5.5px. Amplitude is constant in pixels:
 * it does NOT shrink for short edges nor grow for long ones. Length only
 * affects how MANY wobbles accumulate (the point count above), so total
 * crookedness scales with edge length — the human-drawing intuition.
 */
const CROOKEDNESS_PX_PER_UNIT = 0.55;
/** A small inset so the wobbling stroke stays inside the element bounds. */
const SURFACE_INSET_RATIO = 0.04;
const SURFACE_INSET_MAX = 6;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Max wobble amplitude in pixels for a given crookedness control (0..10). */
export function crookednessAmplitudePx(crookedness: number) {
  return clamp(crookedness, 0, 10) * CROOKEDNESS_PX_PER_UNIT;
}

/** Odds that any given corner is drawn sharp rather than rounded. */
const CORNER_SHARP_PROBABILITY = 0.5;

/**
 * Pick a Bezier-handle smoothness for one corner: humans freehand a mix of
 * crisp ~right angles and rounded corners. ~0 collapses the handles (sharp,
 * approximate right angle); ~1 keeps the full Catmull-Rom round. We bias to the
 * two extremes (with a little jitter) rather than a uniform middle so corners
 * read as deliberately sharp OR round, not uniformly soft.
 */
export function pickCornerSmoothness(random: () => number) {
  if (random() < CORNER_SHARP_PROBABILITY) {
    return random() * 0.18; // sharp-ish: an approximate hand-drawn right angle
  }
  return 0.72 + random() * 0.28; // rounded
}

/**
 * Number of perturbation points along an edge of the given pixel length, at a
 * constant density (points per pixel). Identical formula for every edge, so all
 * four sides of a rectangle share the same per-pixel deviation density.
 */
export function pointCountForLength(
  lengthPx: number,
  pxPerPoint: number,
  minPoints: number,
  maxPoints: number,
) {
  if (!Number.isFinite(lengthPx) || lengthPx <= 0) {
    return minPoints;
  }

  return clamp(Math.round(lengthPx / pxPerPoint), minPoints, maxPoints);
}

/**
 * Distribute `count` interior points evenly along the straight segment from
 * `start` to `end`, then push each one off the ideal line (perpendicular) by a
 * seeded amount up to `amplitudePx`. Endpoints are returned unperturbed so
 * adjacent edges meet exactly at the corners. Returns the full ordered list
 * including both endpoints.
 */
function perturbSegment(
  start: Point,
  end: Point,
  count: number,
  amplitudePx: number,
  random: () => number,
): Point[] {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.hypot(dx, dy);

  if (length === 0 || count <= 0 || amplitudePx <= 0) {
    // No interior wobble: return a straight run of evenly spaced points so the
    // downstream Bezier smoothing still has something to chew on, but every
    // point lies exactly on the ideal line (perfectly straight edge).
    const points: Point[] = [start];
    const steps = Math.max(count, 0);

    for (let index = 1; index <= steps; index += 1) {
      const t = index / (steps + 1);
      points.push([start[0] + dx * t, start[1] + dy * t]);
    }

    points.push(end);

    return points;
  }

  // Unit perpendicular to the edge direction.
  const nx = -dy / length;
  const ny = dx / length;
  const points: Point[] = [start];

  for (let index = 1; index <= count; index += 1) {
    const t = index / (count + 1);
    // Ease the offset toward zero near the endpoints so corners stay crisp.
    const taper = Math.sin(t * Math.PI);
    const offset = (random() * 2 - 1) * amplitudePx * taper;
    const baseX = start[0] + dx * t;
    const baseY = start[1] + dy * t;

    points.push([baseX + nx * offset, baseY + ny * offset]);
  }

  points.push(end);

  return points;
}

/**
 * Build the four rounded-rectangle edges (or the single divider span) in pixel
 * space. Each edge's point count is proportional to its pixel length and its
 * wobble amplitude is constant in pixels — the fix for length-blind jitter.
 */
export function buildHandDrawnGeometry(
  shape: HandDrawnFrameShape,
  size: HandDrawnFrameSize,
  crookedness: number,
  seed: string,
): HandDrawnFrameGeometry {
  const width = Math.max(size.width, 1);
  const height = Math.max(size.height, 1);
  const amplitude = crookednessAmplitudePx(crookedness);
  const random = createSeededRandom(seed);

  if (shape === "divider") {
    const inset = Math.min(width * 0.01, 2);
    const left = inset;
    const right = width - inset;
    const midY = height / 2;
    const count = pointCountForLength(
      Math.abs(right - left),
      DIVIDER_PX_PER_POINT,
      DIVIDER_MIN_POINTS,
      DIVIDER_MAX_POINTS,
    );
    const points = perturbSegment(
      [left, midY],
      [right, midY],
      count,
      amplitude,
      random,
    );

    return { edges: [{ points, side: "frame" }], height, width, cornerSmoothness: [] };
  }

  const inset = Math.min(
    Math.min(width, height) * SURFACE_INSET_RATIO,
    SURFACE_INSET_MAX,
  );
  const x0 = inset;
  const y0 = inset;
  const x1 = width - inset;
  const y1 = height - inset;

  const topLeft: Point = [x0, y0];
  const topRight: Point = [x1, y0];
  const bottomRight: Point = [x1, y1];
  const bottomLeft: Point = [x0, y1];

  const horizontalLength = Math.abs(x1 - x0);
  const verticalLength = Math.abs(y1 - y0);
  const horizontalCount = pointCountForLength(
    horizontalLength,
    SURFACE_PX_PER_POINT,
    SURFACE_MIN_POINTS,
    SURFACE_MAX_POINTS,
  );
  const verticalCount = pointCountForLength(
    verticalLength,
    SURFACE_PX_PER_POINT,
    SURFACE_MIN_POINTS,
    SURFACE_MAX_POINTS,
  );

  const edges: HandDrawnFrameEdge[] = [
    {
      points: perturbSegment(
        topLeft,
        topRight,
        horizontalCount,
        amplitude,
        random,
      ),
      side: "top",
    },
    {
      points: perturbSegment(
        topRight,
        bottomRight,
        verticalCount,
        amplitude,
        random,
      ),
      side: "right",
    },
    {
      points: perturbSegment(
        bottomRight,
        bottomLeft,
        horizontalCount,
        amplitude,
        random,
      ),
      side: "bottom",
    },
    {
      points: perturbSegment(
        bottomLeft,
        topLeft,
        verticalCount,
        amplitude,
        random,
      ),
      side: "left",
    },
  ];

  // One smoothness draw per corner (TL, TR, BR, BL). Consumed after the edge
  // perturbation so existing edge wobble for a given seed is unchanged.
  const cornerSmoothness = [
    pickCornerSmoothness(random),
    pickCornerSmoothness(random),
    pickCornerSmoothness(random),
    pickCornerSmoothness(random),
  ];

  return { edges, height, width, cornerSmoothness };
}

function formatSvgNumber(value: number) {
  return Number(value.toFixed(3));
}

/**
 * Convert an ordered list of points into a smooth open path using a
 * Catmull-Rom → cubic-Bezier conversion. The smoothing keeps the wobble from
 * looking like hard polyline kinks. `closed` joins the last point back to the
 * first (for the full rectangle outline).
 */
function pointsToSmoothPath(
  points: Point[],
  closed: boolean,
  smoothness?: number[],
) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${formatSvgNumber(points[0]![0])} ${formatSvgNumber(points[0]![1])}`;
  }

  const first = points[0]!;
  let path = `M ${formatSvgNumber(first[0])} ${formatSvgNumber(first[1])}`;
  const count = points.length;
  const lastIndex = closed ? count : count - 1;
  // Per-point handle scale: 1 = full Catmull-Rom round, ~0 = collapse the
  // handle to the point (a sharp corner). Missing/undefined → fully smooth.
  const handleScale = (i: number) =>
    smoothness && Number.isFinite(smoothness[i]!) ? smoothness[i]! : 1;

  for (let index = 0; index < lastIndex; index += 1) {
    const p0 = points[(index - 1 + count) % count] ?? points[index]!;
    const i1 = index % count;
    const i2 = (index + 1) % count;
    const p1 = points[i1]!;
    const p2 = points[i2]!;
    const p3 = points[(index + 2) % count]!;

    const prev = closed || index > 0 ? p0 : p1;
    const next = closed || index + 2 < count ? p3 : p2;

    // Scale the leaving handle by p1's smoothness and the arriving handle by
    // p2's smoothness, so a sharp point collapses the handles on both of its
    // segments and the curve makes an angle there instead of bowing.
    const s1 = handleScale(i1);
    const s2 = handleScale(i2);
    const c1x = p1[0] + ((p2[0] - prev[0]) / 6) * s1;
    const c1y = p1[1] + ((p2[1] - prev[1]) / 6) * s1;
    const c2x = p2[0] - ((next[0] - p1[0]) / 6) * s2;
    const c2y = p2[1] - ((next[1] - p1[1]) / 6) * s2;

    path += ` C ${formatSvgNumber(c1x)} ${formatSvgNumber(c1y)} ${formatSvgNumber(c2x)} ${formatSvgNumber(c2y)} ${formatSvgNumber(p2[0])} ${formatSvgNumber(p2[1])}`;
  }

  return path;
}

/** Full closed outline path (used for fill + clip + the base stroke). */
export function geometryToOutlinePath(geometry: HandDrawnFrameGeometry) {
  if (geometry.edges.length === 1) {
    // Divider: a single open span.
    return pointsToSmoothPath(geometry.edges[0]!.points, false);
  }

  // Surface: concatenate the four edges into one closed loop. Each edge shares
  // its start corner with the previous edge's end, so drop that duplicate START
  // — but KEEP the END corner, otherwise the corner anchor disappears and the
  // Catmull-Rom smoothing cuts straight across it (this previously crushed the
  // bottom-right and bottom-left corners). Only the final edge also drops its
  // END, which is the top-left point the closed loop already returns to.
  const lastIndex = geometry.edges.length - 1;
  const segments = geometry.edges.map((edge, edgeIndex) => {
    if (edgeIndex === 0) return edge.points;
    if (edgeIndex === lastIndex) return edge.points.slice(1, -1);
    return edge.points.slice(1);
  });

  const ordered: Point[] = segments.flat();
  const smoothness = ordered.map(() => 1);

  // Mark the four shared corners with their randomized smoothness. Corner k
  // (TL, TR, BR, BL) is the END of segment k for k<3, and TL is ordered[0].
  if (geometry.cornerSmoothness.length === 4 && segments.length === 4) {
    const cornerIndices = [
      0,
      segments[0]!.length - 1,
      segments[0]!.length + segments[1]!.length - 1,
      segments[0]!.length + segments[1]!.length + segments[2]!.length - 1,
    ];
    cornerIndices.forEach((orderedIndex, cornerIndex) => {
      if (orderedIndex >= 0 && orderedIndex < smoothness.length) {
        smoothness[orderedIndex] = geometry.cornerSmoothness[cornerIndex]!;
      }
    });
  }

  return `${pointsToSmoothPath(ordered, true, smoothness)} Z`;
}

/** Per-side smooth open path (used by the stroke-width ribbon layers). */
export function geometryToSidePath(edge: HandDrawnFrameEdge) {
  return pointsToSmoothPath(edge.points, false);
}

export function geometryViewBox(geometry: HandDrawnFrameGeometry) {
  return `0 0 ${formatSvgNumber(geometry.width)} ${formatSvgNumber(geometry.height)}`;
}

/**
 * Normalize a pixel-space path to the 0..1 object-bounding-box space SVG
 * clipPaths require. Divides every X by width and Y by height.
 */
export function normalizePathToObjectBoundingBox(
  path: string,
  width: number,
  height: number,
) {
  const safeWidth = width > 0 ? width : 1;
  const safeHeight = height > 0 ? height : 1;
  const tokenPattern = /[A-Za-z]|-?\d*\.?\d+/g;
  const tokens = path.match(tokenPattern) ?? [];
  let axisIsX = true;

  const normalized = tokens
    .map((token) => {
      if (/^[A-Za-z]$/.test(token)) {
        axisIsX = true;

        return token;
      }

      const value = Number(token);

      if (Number.isNaN(value)) {
        return token;
      }

      const result = axisIsX ? value / safeWidth : value / safeHeight;

      axisIsX = !axisIsX;

      return result.toFixed(6);
    })
    .join(" ");

  return /[Zz]\s*$/.test(normalized) ? normalized : `${normalized} Z`;
}
