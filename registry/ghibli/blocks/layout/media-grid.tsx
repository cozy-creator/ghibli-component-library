import * as React from "react";

import { cn } from "@/lib/utils";

export interface MediaGridTile {
  /** Stable identity for the tile. */
  key: string;
  /**
   * Intrinsic aspect ratio (width / height) of the media. Ultra-wide tiles
   * (>= WIDE_ASPECT) span two columns so they read as panoramic instead of a
   * squashed strip. Omit when unknown (e.g. skeletons).
   */
  aspectRatio?: number;
  node: React.ReactNode;
}

interface MediaGridProps {
  tiles: MediaGridTile[];
  className?: string;
}

const WIDE_ASPECT = 1.7;
const DEFAULT_ASPECT = 4 / 5;
// [minContainerWidthPx, columns]. Container-based (not viewport) so page
// padding is accounted for and there is no viewport-vs-scrollbar edge case.
const COLUMN_STEPS: ReadonlyArray<readonly [number, number]> = [
  [0, 2],
  [760, 3],
  [1100, 4],
  [1340, 5],
  [1600, 6],
  [1820, 7],
  [2040, 8],
];

function colsForWidth(width: number): number {
  let cols = 2;
  for (const [min, c] of COLUMN_STEPS) if (width >= min) cols = c;
  return cols;
}

// Gap is keyed to the column count, not raw width, so it only changes at a
// column breakpoint (where the grid already reflows). Keying it to width would
// shift every tile mid-breakpoint and read as a phantom jump.
function gapForColumns(cols: number): number {
  return cols <= 2 ? 12 : 16;
}

function sameNumbers(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

interface Placement {
  colStart: number;
  colSpan: number;
}

/**
 * Assign each tile to its column(s). Deterministic and width-INDEPENDENT: it
 * packs using aspect-ratio-only relative heights, so the result depends solely
 * on the tiles and the column count. A plain resize (same column count) never
 * changes the assignment, so tiles don't hop columns; they only re-flow when a
 * breakpoint actually adds/removes a column. Prefix-stable, so infinite-scroll
 * appends never reshuffle tiles already placed.
 */
function packTiles(tiles: MediaGridTile[], cols: number): Placement[] {
  const colUnits = new Array<number>(cols).fill(0);
  return tiles.map((tile) => {
    const ar = tile.aspectRatio && tile.aspectRatio > 0 ? tile.aspectRatio : DEFAULT_ASPECT;
    const span =
      cols >= 2 && !!tile.aspectRatio && tile.aspectRatio >= WIDE_ASPECT ? 2 : 1;

    let bestStart = 0;
    let bestFill = Infinity;
    for (let s = 0; s + span <= cols; s++) {
      let windowMax = 0;
      for (let k = 0; k < span; k++) windowMax = Math.max(windowMax, colUnits[s + k]!);
      if (windowMax < bestFill - 1e-9) {
        bestFill = windowMax;
        bestStart = s;
      }
    }

    // Relative height in units of one column width: a 2-col tile is `span` wide
    // so it is span/ar tall. Caption height is intentionally excluded to keep
    // the assignment width-independent.
    const next = bestFill + span / ar;
    for (let k = 0; k < span; k++) colUnits[bestStart + k] = next;
    return { colStart: bestStart, colSpan: span };
  });
}

/**
 * Masonry media grid for the community feed and the user's generation gallery
 * (issue #36). Tiles render at their true aspect ratio (no cropping); the
 * column count grows with container width from 2 up to 8, and ultra-wide tiles
 * span two columns. The column assignment is computed once per column count
 * (see packTiles) and only pixel positions rescale on resize, so tiles never
 * jump columns until a breakpoint changes. Meant to live in a full-width /
 * edge-to-edge container; it imposes no max width of its own.
 */
export function MediaGrid({ tiles, className }: MediaGridProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef(new Map<string, HTMLDivElement>());
  const [width, setWidth] = React.useState(0);
  const [tops, setTops] = React.useState<number[]>([]);
  const [height, setHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let frame = 0;
    const commit = () => {
      frame = 0;
      const next = el.clientWidth;
      setWidth((prev) => (prev === next ? prev : next));
    };

    setWidth(el.clientWidth);

    // Defer the state update out of the ResizeObserver callback. We set the
    // container's height from state below, and the observer watches this same
    // element; updating synchronously would re-enter the observer in the same
    // frame ("ResizeObserver loop" error / glitchy resize). rAF coalesces it.
    const observer = new ResizeObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(commit);
    });
    observer.observe(el);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const cols = colsForWidth(width || 1);
  const gap = gapForColumns(cols);
  // Assignment only recomputes when the tiles or the column count change.
  const placements = React.useMemo(() => packTiles(tiles, cols), [tiles, cols]);
  const colWidth = width ? (width - (cols - 1) * gap) / cols : 0;

  const geom = React.useMemo(
    () =>
      placements.map((p) => ({
        left: p.colStart * (colWidth + gap),
        width: p.colSpan * colWidth + (p.colSpan - 1) * gap,
      })),
    [placements, colWidth, gap]
  );

  React.useLayoutEffect(() => {
    if (!width) return;
    const colHeights = new Array<number>(cols).fill(0);
    const nextTops = placements.map((p, i) => {
      const top = Math.max(0, ...colHeights.slice(p.colStart, p.colStart + p.colSpan));
      const node = itemRefs.current.get(tiles[i]!.key);
      const measured = node ? node.getBoundingClientRect().height : 0;
      const fallback = geom[i]!.width / (tiles[i]!.aspectRatio || DEFAULT_ASPECT);
      const h = measured || fallback;
      for (let k = 0; k < p.colSpan; k++) colHeights[p.colStart + k] = top + h + gap;
      return top;
    });
    const nextHeight = Math.max(0, ...colHeights) - gap;
    // Bail when nothing moved so a redundant effect run (e.g. the parent
    // re-rendering with a fresh tiles array) doesn't trigger a no-op re-render.
    setTops((prev) => (sameNumbers(prev, nextTops) ? prev : nextTops));
    setHeight((prev) => (prev === nextHeight ? prev : nextHeight));
  }, [width, cols, gap, placements, geom, tiles]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      style={{ height: height || undefined }}
    >
      {tiles.map((tile, i) => (
        <div
          key={tile.key}
          ref={(node) => {
            if (node) itemRefs.current.set(tile.key, node);
            else itemRefs.current.delete(tile.key);
          }}
          className="absolute"
          style={{ left: geom[i]?.left ?? 0, top: tops[i] ?? 0, width: geom[i]?.width ?? 0 }}
        >
          {tile.node}
        </div>
      ))}
    </div>
  );
}
