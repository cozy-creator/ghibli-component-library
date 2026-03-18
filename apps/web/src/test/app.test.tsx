import { render, screen } from "@testing-library/react";

import { App } from "@/apps/web/src/app";

describe("app", () => {
  it("renders the home route without crashing", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /scenic react components built for sharing, not hiding inside one product/i
      })
    ).toBeInTheDocument();
  });
});
