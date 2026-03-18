import { render, screen } from "@testing-library/react";

import { Button, LanternButton } from "@ghibli/ui";

describe("button", () => {
  it("renders a standard button", () => {
    render(<Button>Primary action</Button>);

    expect(
      screen.getByRole("button", { name: "Primary action" })
    ).toBeInTheDocument();
  });

  it("supports asChild rendering", () => {
    render(
      <Button asChild>
        <a href="/docs">Read docs</a>
      </Button>
    );

    expect(screen.getByRole("link", { name: "Read docs" })).toBeInTheDocument();
  });

  it("renders the highlighted lantern button", () => {
    render(<LanternButton>Join waitlist</LanternButton>);

    expect(screen.getByRole("button", { name: "Join waitlist" })).toBeInTheDocument();
  });
});

