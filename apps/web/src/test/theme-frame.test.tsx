import { render, screen } from "@testing-library/react";

import {
  THEME_FRAME_VARIANTS,
  ThemeFrame,
  ThemeProvider,
} from "@ghibli/ui";

describe("theme frame", () => {
  it("renders a theme-aware frame with the selected variant marker", () => {
    render(
      <ThemeProvider>
        <ThemeFrame
          data-testid="frame"
          contentClassName="px-4 py-3"
          surfaceClassName="bg-[color:var(--card)]"
          variant={THEME_FRAME_VARIANTS.dialogPanel}
        >
          Dialog content
        </ThemeFrame>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("frame")).toHaveAttribute(
      "data-theme-frame-variant",
      THEME_FRAME_VARIANTS.dialogPanel,
    );
    expect(screen.getByText("Dialog content")).toBeInTheDocument();
  });
});
