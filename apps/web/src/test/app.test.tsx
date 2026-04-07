import { render, screen } from "@testing-library/react";

import { App } from "@/apps/web/src/app";

describe("app", () => {
  it("renders the home route without crashing", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /ghibli components, displayed one by one/i
      })
    ).toBeInTheDocument();
    expect(screen.getByText("pnpm dlx shadcn@latest add @ghibli/all")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Button" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Generate Prompt Composer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Footer" })).toBeInTheDocument();
  });
});
