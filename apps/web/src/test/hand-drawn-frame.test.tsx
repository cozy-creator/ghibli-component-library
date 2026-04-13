import { render, screen } from "@testing-library/react";

import { HandDrawnFrame, HandDrawnRule } from "@ghibli/ui";

describe("hand-drawn frame", () => {
  it("renders the divider helper with divider geometry", () => {
    const { container } = render(<HandDrawnRule data-testid="rule" />);

    const svg = container.querySelector("[data-testid='rule'] svg");

    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("viewBox", "0 0 100 12");
    expect(container.querySelectorAll("[data-testid='rule'] svg > path")).toHaveLength(4);
  });

  it("layers stroke thickness when thickness variation is enabled", () => {
    const { container } = render(
      <HandDrawnFrame
        data-testid="frame"
        deformationIntensity={0.7}
        seed="thickness-on"
        shape="organic"
        strokeWidth={2.2}
      >
        Content
      </HandDrawnFrame>,
    );

    const paths = container.querySelectorAll("[data-testid='frame'] svg > path");

    expect(paths).toHaveLength(4);
    expect(
      Array.from(paths).some((path) => path.getAttribute("stroke-dasharray")),
    ).toBe(true);
  });

  it("falls back to a single stroke when thickness variation is disabled", () => {
    const { container } = render(
      <HandDrawnFrame
        data-testid="frame"
        deformationIntensity={0.7}
        seed="thickness-off"
        shape="organic"
        strokeWidth={2.2}
        useThicknessVariation={false}
      >
        Content
      </HandDrawnFrame>,
    );

    const paths = container.querySelectorAll("[data-testid='frame'] svg > path");

    expect(paths).toHaveLength(1);
    expect(paths[0]?.getAttribute("stroke-dasharray")).toBeNull();
  });

  it("keeps seeded deformation deterministic", () => {
    const { container } = render(
      <div>
        <HandDrawnFrame
          data-testid="frame-a"
          deformationIntensity={0.7}
          seed="same-seed"
          shape="panel"
          strokeWidth={1.6}
          useThicknessVariation={false}
        >
          A
        </HandDrawnFrame>
        <HandDrawnFrame
          data-testid="frame-b"
          deformationIntensity={0.7}
          seed="same-seed"
          shape="panel"
          strokeWidth={1.6}
          useThicknessVariation={false}
        >
          B
        </HandDrawnFrame>
        <HandDrawnFrame
          data-testid="frame-c"
          deformationIntensity={0.7}
          seed="different-seed"
          shape="panel"
          strokeWidth={1.6}
          useThicknessVariation={false}
        >
          C
        </HandDrawnFrame>
      </div>,
    );

    const frameAPath = container.querySelector("[data-testid='frame-a'] svg > path");
    const frameBPath = container.querySelector("[data-testid='frame-b'] svg > path");
    const frameCPath = container.querySelector("[data-testid='frame-c'] svg > path");

    expect(frameAPath?.getAttribute("d")).toBe(frameBPath?.getAttribute("d"));
    expect(frameAPath?.getAttribute("d")).not.toBe(frameCPath?.getAttribute("d"));
  });

  it("preserves clipContent support with the generated clip path", () => {
    const { container } = render(
      <HandDrawnFrame
        clipContent
        data-testid="clip-frame"
        deformationIntensity={0.6}
        seed="clip-demo"
        shape="card"
        strokeWidth={1.55}
      >
        <div>Clipped content</div>
      </HandDrawnFrame>,
    );

    const root = screen.getByTestId("clip-frame");
    const contentLayer = root.firstElementChild as HTMLElement | null;

    expect(container.querySelector("[data-testid='clip-frame'] clipPath")).not.toBeNull();
    expect(contentLayer).not.toBeNull();
    expect(contentLayer?.style.clipPath).toMatch(/^url\(#hand-drawn-frame-clip-/);
  });
});
