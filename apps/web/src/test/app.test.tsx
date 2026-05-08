import { render, screen } from "@testing-library/react";

import { App } from "@/apps/web/src/app";
import { brandLogoPath } from "@/apps/web/src/components/site-brand";

describe("app", () => {
  it("renders the home route without crashing", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(screen.getByText(/pnpm dlx shadcn@latest add @ghibli\/all/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Button" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cozy Generate Editor Bar" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Footer" })).toBeInTheDocument();
    const siteBrandLink = screen.getByRole("link", { name: "Ghibli UI Library" });

    expect(siteBrandLink.querySelector(`img[src="${brandLogoPath}"]`)).not.toBeNull();
    expect(siteBrandLink.querySelector("svg.lucide")).toBeNull();
  });
});
