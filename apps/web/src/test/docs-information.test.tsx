import { render, screen, waitFor } from "@testing-library/react";

import { App } from "@/apps/web/src/app";

describe("docs information architecture", () => {
  it("renders the single-page specimen sheet in order", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(screen.getAllByText("pnpm dlx shadcn@latest add @ghibli/all")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Button" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tabs Switch" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "User Display Box" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Community Cards" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Storybook" })).toBeInTheDocument();
  });

  it("redirects legacy item routes to the matching anchor on the showcase", async () => {
    window.history.pushState({}, "", "/patterns/auth-forms");

    render(<App />);

    await waitFor(() => {
      expect(window.location.hash).toBe("#pattern-auth-forms");
    });

    expect(screen.getByRole("heading", { name: "Auth Forms" })).toBeInTheDocument();
    expect(screen.getAllByText("Sign in")).not.toHaveLength(0);
    expect(screen.queryByText("pnpm dlx shadcn@latest add @ghibli/auth-forms")).not.toBeInTheDocument();
  });

  it("treats removed reference routes as not found", () => {
    window.history.pushState({}, "", "/reference/landing");

    render(<App />);

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });
});
