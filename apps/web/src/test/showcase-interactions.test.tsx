import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "@/apps/web/src/app";
import {
  communityImageItems,
  communityVideoItems
} from "@/apps/web/src/data/demo-fixtures";

describe("showcase interactions", () => {
  it("opens the auth modal from Cozy-style trigger buttons", async () => {
    const user = userEvent.setup();

    window.history.pushState({}, "", "/");

    const { container } = render(<App />);
    const authSection = container.querySelector("#pattern-auth-forms");

    expect(authSection).not.toBeNull();

    await user.click(
      within(authSection as HTMLElement).getByRole("button", { name: "Sign in" })
    );

    expect(await screen.findByRole("heading", { name: "Welcome back" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "Welcome back" })).not.toBeInTheDocument();
    });

    await user.click(
      within(authSection as HTMLElement).getByRole("button", { name: "Create account" })
    );

    expect(await screen.findByRole("tab", { name: "Register" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
  }, 10000);

  it("opens the community image and video modals from the one-page showcase", async () => {
    const user = userEvent.setup();

    window.history.pushState({}, "", "/");

    const { container } = render(<App />);
    const imageSection = container.querySelector("#pattern-community-cards");
    const videoSection = container.querySelector("#pattern-community-video-card");

    expect(imageSection).not.toBeNull();
    expect(videoSection).not.toBeNull();

    await user.click(
      within(imageSection as HTMLElement).getByText(communityImageItems[0]?.title ?? "Forest lantern walk")
    );

    expect(
      await screen.findByRole("heading", {
        name: communityImageItems[0]?.title ?? "Community image"
      })
    ).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Close expanded image viewer" })[0]!);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: communityImageItems[0]?.title ?? "Community image"
        })
      ).not.toBeInTheDocument();
    });

    await user.click(
      within(videoSection as HTMLElement).getByText(communityVideoItems[0]?.title ?? "Lantern ferry glide")
    );

    expect(
      await screen.findByRole("heading", {
        name: communityVideoItems[0]?.title ?? "Video preview"
      })
    ).toBeInTheDocument();
  }, 10000);

  it("renders the generate flow and opens account dialogs with local state", async () => {
    const user = userEvent.setup();

    window.history.pushState({}, "", "/");

    render(<App />);

    expect(
      screen.getByDisplayValue(/A quiet ferry deck at dusk, paper lantern reflections across the water/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Generate Editor Bar" })).toBeInTheDocument();
    expect(screen.queryByText("Quick picks")).not.toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: /9:16/i })[0]!);

    expect(screen.getByRole("button", { name: /9:16 portrait/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open email dialog" }));

    expect(screen.getByRole("heading", { name: "Change email" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "Change email" })).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Open password dialog" }));

    expect(screen.getByRole("heading", { name: "Change password" })).toBeInTheDocument();
  }, 10000);

  it("updates the hand-drawn frame playground with the new Cozy frame controls", async () => {
    const user = userEvent.setup();

    window.history.pushState({}, "", "/");

    const { container } = render(<App />);
    const frameSection = container.querySelector("#component-hand-drawn-frame");

    expect(frameSection).not.toBeNull();
    expect(within(frameSection as HTMLElement).queryByText("Variant")).not.toBeInTheDocument();
    expect(within(frameSection as HTMLElement).queryByText("Variation")).not.toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).getByText("Crookedness Intensity")
    ).toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).getByText("Thickness Intensity")
    ).toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).queryByText("Organic callout")
    ).not.toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).queryByRole("button", { name: "Shape" })
    ).not.toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).getByRole("radiogroup", {
        name: "Crookedness Intensity"
      })
    ).toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).getByRole("radiogroup", {
        name: "Thickness Intensity"
      })
    ).toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).getByRole("radiogroup", {
        name: "Stroke Width"
      })
    ).toBeInTheDocument();

    await user.click(
      within(frameSection as HTMLElement).getByRole("radio", {
        name: "Thickness Intensity 8"
      })
    );

    expect(
      within(frameSection as HTMLElement).getByText("Frame preview")
    ).toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).getAllByText(/thicknessIntensity=\{8\}/).length
    ).toBeGreaterThan(0);
    expect(
      within(frameSection as HTMLElement).queryByText(/shape="/)
    ).not.toBeInTheDocument();
  }, 10000);
});
