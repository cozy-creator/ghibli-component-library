import { fireEvent, render, screen } from "@testing-library/react";

import { App } from "@/apps/web/src/app";

describe("docs information architecture", () => {
  it("filters the component directory", () => {
    window.history.pushState({}, "", "/components");

    render(<App />);

    expect(screen.getByRole("heading", { name: "Components" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "Tooltip" }
    });

    expect(screen.getByRole("heading", { name: "Tooltip" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Button" })).not.toBeInTheDocument();
  });

  it("renders pattern detail metadata", () => {
    window.history.pushState({}, "", "/patterns/auth-forms");

    render(<App />);

    expect(screen.getByRole("heading", { name: "Auth Forms" })).toBeInTheDocument();
    expect(
      screen.getByText("pnpm dlx shadcn@latest add @ghibli/auth-forms", { exact: true })
    ).toBeInTheDocument();
    expect(screen.getByText("LoginForm")).toBeInTheDocument();
  });

  it("treats removed reference routes as not found", () => {
    window.history.pushState({}, "", "/reference/landing");

    render(<App />);

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });
});
