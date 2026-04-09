import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "@/apps/web/src/app";
import {
  communityImageItems,
  communityVideoItems
} from "@/apps/web/src/data/demo-fixtures";

describe("showcase interactions", () => {
  it("switches auth tabs inside the interactive auth modal", async () => {
    const user = userEvent.setup();

    window.history.pushState({}, "", "/");

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Open auth modal" }));

    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Register" }));

    expect(screen.getByRole("tab", { name: "Register" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("heading", { name: "Create account" })).toBeInTheDocument();
  });

  it("opens the community image and video modals from the one-page showcase", async () => {
    const user = userEvent.setup();

    window.history.pushState({}, "", "/");

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Open image modal" }));

    expect(screen.getByText("Community image")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: communityImageItems[0]?.title ?? "Community image"
      })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(screen.queryByText("Community image")).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Open video modal" }));

    expect(
      screen.getByRole("heading", {
        name: communityVideoItems[0]?.title ?? "Video preview"
      })
    ).toBeInTheDocument();
  });

  it("renders the generate flow and opens account dialogs with local state", async () => {
    const user = userEvent.setup();

    window.history.pushState({}, "", "/");

    render(<App />);

    expect(
      screen.getAllByDisplayValue(/A quiet ferry deck at dusk, paper lantern reflections across the water/i)
    ).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Generate Job Card" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open email dialog" }));

    expect(screen.getByRole("heading", { name: "Change email" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "Change email" })).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Open password dialog" }));

    expect(screen.getByRole("heading", { name: "Change password" })).toBeInTheDocument();
  }, 10000);
});
