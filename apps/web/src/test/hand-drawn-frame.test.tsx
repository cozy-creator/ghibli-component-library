import { render, screen } from "@testing-library/react";

import { HandDrawnFrame, HandDrawnRule } from "@ghibli/ui";

describe("hand-drawn frame", () => {
  it("renders the divider helper with divider geometry", () => {
    const { container } = render(<HandDrawnRule data-testid="rule" />);

    const svg = container.querySelector("[data-testid='rule'] svg");

    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("viewBox", "0 0 100 12");
    expect(
      container.querySelectorAll("[data-testid='rule'] svg > path").length,
    ).toBeGreaterThan(1);
  });

  it("always clips the content layer to the generated frame", () => {
    const { container } = render(
      <HandDrawnFrame
        contentClassName="px-4 py-4"
        data-testid="frame"
        surfaceClassName="bg-[color:var(--card)]"
        strokeWidth={1.55}
      >
        <div>Clipped content</div>
      </HandDrawnFrame>,
    );

    const root = screen.getByTestId("frame");
    const surfaceLayer = root.firstElementChild as HTMLElement | null;
    const contentLayer = root.children[1] as HTMLElement | null;

    expect(
      container.querySelector("[data-testid='frame'] clipPath"),
    ).not.toBeNull();
    expect(surfaceLayer?.style.clipPath).toMatch(
      /^url\(#hand-drawn-frame-clip-/,
    );
    expect(contentLayer?.style.clipPath).toMatch(
      /^url\(#hand-drawn-frame-clip-/,
    );
  });

  it("uses a single stroke at stroke-width variation 0", () => {
    const { container } = render(
      <HandDrawnFrame
        data-testid="frame"
        strokeWidth={2.2}
        strokeWidthVariation={0}
      >
        Content
      </HandDrawnFrame>,
    );

    const paths = container.querySelectorAll(
      "[data-testid='frame'] svg > path",
    );

    expect(paths).toHaveLength(1);
    expect(paths[0]?.getAttribute("stroke-dasharray")).toBeNull();
  });

  it("layers multiple strokes at higher stroke-width variation", () => {
    const { container } = render(
      <HandDrawnFrame
        data-testid="frame"
        strokeWidth={2.2}
        strokeWidthVariation={8}
      >
        Content
      </HandDrawnFrame>,
    );

    const paths = container.querySelectorAll(
      "[data-testid='frame'] svg > path",
    );

    expect(paths.length).toBeGreaterThan(1);
    expect(
      Array.from(paths).some((path) => path.getAttribute("stroke-dasharray")),
    ).toBe(true);
  });

  it("renders open side retraces for expressive surface variation", () => {
    const { container } = render(
      <HandDrawnFrame
        data-testid="frame"
        strokeWidth={2.2}
        strokeWidthVariation={10}
      >
        Content
      </HandDrawnFrame>,
    );

    const pathData = Array.from(
      container.querySelectorAll("[data-testid='frame'] svg > path"),
    ).map((path) => path.getAttribute("d") ?? "");

    expect(pathData.some((path) => /[Zz]\s*$/.test(path))).toBe(true);
    expect(
      pathData.some((path) => path.length > 0 && !/[Zz]\s*$/.test(path)),
    ).toBe(true);
  });

  it.each([0, 5, 10])(
    "keeps expressive side retraces stable at crookedness %s",
    (crookedness) => {
      const props = {
        children: "Content",
        crookedness,
        "data-testid": "frame",
        strokeWidth: 2.2,
        strokeWidthVariation: 10,
      } as const;
      const { container, rerender } = render(<HandDrawnFrame {...props} />);

      const snapshot = Array.from(
        container.querySelectorAll("[data-testid='frame'] svg > path"),
      ).map((path) => ({
        d: path.getAttribute("d"),
        dasharray: path.getAttribute("stroke-dasharray"),
        strokeWidth: path.getAttribute("stroke-width"),
      }));

      expect(
        snapshot.some(
          (layer) =>
            layer.d !== null && layer.d.length > 0 && !/[Zz]\s*$/.test(layer.d),
        ),
      ).toBe(true);

      rerender(<HandDrawnFrame {...props} />);

      expect(
        Array.from(
          container.querySelectorAll("[data-testid='frame'] svg > path"),
        ).map((path) => ({
          d: path.getAttribute("d"),
          dasharray: path.getAttribute("stroke-dasharray"),
          strokeWidth: path.getAttribute("stroke-width"),
        })),
      ).toEqual(snapshot);
    },
  );

  it("keeps the layered pattern stable across rerenders while varying decorative path traces", () => {
    const props = {
      children: "Content",
      "data-testid": "frame",
      crookedness: 5,
      strokeWidth: 2.2,
      strokeWidthVariation: 10,
    } as const;
    const { container, rerender } = render(<HandDrawnFrame {...props} />);

    const readLayerSnapshot = () =>
      Array.from(
        container.querySelectorAll("[data-testid='frame'] svg > path"),
      ).map((path) => ({
        d: path.getAttribute("d"),
        dasharray: path.getAttribute("stroke-dasharray"),
        dashoffset: path.getAttribute("stroke-dashoffset"),
        opacity: (path as SVGPathElement).style.opacity,
        strokeWidth: path.getAttribute("stroke-width"),
      }));

    const firstSnapshot = readLayerSnapshot();

    expect(new Set(firstSnapshot.map((layer) => layer.d)).size).toBeGreaterThan(
      1,
    );
    expect(
      firstSnapshot.some(
        (layer) =>
          layer.d !== null && layer.d.length > 0 && !/[Zz]\s*$/.test(layer.d),
      ),
    ).toBe(true);

    rerender(<HandDrawnFrame {...props} />);

    expect(readLayerSnapshot()).toEqual(firstSnapshot);
  });
});
