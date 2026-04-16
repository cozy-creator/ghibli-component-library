import { render, screen } from "@testing-library/react";

import { HandDrawnFrame, HandDrawnRule } from "@ghibli/ui";

describe("hand-drawn frame", () => {
  it("renders the divider helper with divider geometry", () => {
    const { container } = render(<HandDrawnRule data-testid="rule" />);

    const svg = container.querySelector("[data-testid='rule'] svg");

    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("viewBox", "0 0 100 12");
    expect(container.querySelectorAll("[data-testid='rule'] svg > path").length).toBeGreaterThan(1);
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

    expect(container.querySelector("[data-testid='frame'] clipPath")).not.toBeNull();
    expect(surfaceLayer?.style.clipPath).toMatch(/^url\(#hand-drawn-frame-clip-/);
    expect(contentLayer?.style.clipPath).toMatch(/^url\(#hand-drawn-frame-clip-/);
  });

  it("uses a single stroke at thickness intensity 0", () => {
    const { container } = render(
      <HandDrawnFrame
        data-testid="frame"
        strokeWidth={2.2}
        thicknessIntensity={0}
      >
        Content
      </HandDrawnFrame>,
    );

    const paths = container.querySelectorAll("[data-testid='frame'] svg > path");

    expect(paths).toHaveLength(1);
    expect(paths[0]?.getAttribute("stroke-dasharray")).toBeNull();
  });

  it("layers multiple strokes at higher thickness intensities", () => {
    const { container } = render(
      <HandDrawnFrame
        data-testid="frame"
        strokeWidth={2.2}
        thicknessIntensity={8}
      >
        Content
      </HandDrawnFrame>,
    );

    const paths = container.querySelectorAll("[data-testid='frame'] svg > path");

    expect(paths.length).toBeGreaterThan(1);
    expect(
      Array.from(paths).some((path) => path.getAttribute("stroke-dasharray")),
    ).toBe(true);
  });
});
