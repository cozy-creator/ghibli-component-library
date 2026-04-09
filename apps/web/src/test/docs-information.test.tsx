import { render, screen, waitFor } from "@testing-library/react";

import { App } from "@/apps/web/src/app";

describe("docs information architecture", () => {
  it("renders the grouped single-page showcase in the planned order", () => {
    window.history.pushState({}, "", "/");

    const { container } = render(<App />);
    const orderedSectionIds = [
      "shell-navigation",
      "core-primitives",
      "auth-flows",
      "community-flows",
      "generate-flows",
      "docs-screens",
      "account-flows",
      "footer-endmatter"
    ];

    expect(screen.getAllByText("pnpm dlx shadcn@latest add @ghibli/components")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Button" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tabs Switch" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "User Display Box" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cards" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Storybook" })).toBeInTheDocument();

    const orderedSections = orderedSectionIds.map((id) => {
      const section = container.querySelector(`#${id}`);

      expect(section).not.toBeNull();

      return section as HTMLElement;
    });

    for (let index = 0; index < orderedSections.length - 1; index += 1) {
      const currentSection = orderedSections[index]!;
      const nextSection = orderedSections[index + 1]!;

      expect(
        currentSection.compareDocumentPosition(nextSection) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    }
  });

  it("redirects legacy component routes to the matching anchor on the showcase", async () => {
    window.history.pushState({}, "", "/components/button");

    render(<App />);

    await waitFor(() => {
      expect(window.location.hash).toBe("#component-button");
    });

    expect(screen.getByRole("heading", { name: "Button" })).toBeInTheDocument();
    expect(screen.queryByText("pnpm dlx shadcn@latest add @ghibli/button")).not.toBeInTheDocument();
  });

  it("redirects legacy item routes to the matching anchor on the showcase", async () => {
    window.history.pushState({}, "", "/patterns/auth-forms");

    render(<App />);

    await waitFor(() => {
      expect(window.location.hash).toBe("#pattern-auth-forms");
    });

    expect(screen.getByRole("heading", { name: "Auth Forms" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Sign in" })).not.toHaveLength(0);
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
    expect(screen.queryByText("pnpm dlx shadcn@latest add @ghibli/auth-forms")).not.toBeInTheDocument();
  });

  it("redirects the removed sheet showcase route to the header specimen", async () => {
    window.history.pushState({}, "", "/components/sheet");

    render(<App />);

    await waitFor(() => {
      expect(window.location.hash).toBe("#component-user-popup");
    });

    expect(screen.getByRole("heading", { name: "Header / User Popup" })).toBeInTheDocument();
  });

  it("redirects the removed page-shell showcase route to the reference screens specimen", async () => {
    window.history.pushState({}, "", "/patterns/page-shell");

    render(<App />);

    await waitFor(() => {
      expect(window.location.hash).toBe("#reference-screens");
    });

    expect(screen.getByRole("heading", { name: "Info, Legal, Reset, Not Found" })).toBeInTheDocument();
  });

  it("treats removed reference routes as not found", () => {
    window.history.pushState({}, "", "/reference/landing");

    render(<App />);

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });
});
