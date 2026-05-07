import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

  it("renders the generate flow with the Cozy drawer interactions", async () => {
    const user = userEvent.setup();

    window.history.pushState({}, "", "/");

    const { container } = render(<App />);
    const editorSection = container.querySelector("#pattern-generate-editor-bar");
    const generateControlsSection = container.querySelector("#pattern-generate-controls");

    expect(editorSection).not.toBeNull();
    expect(generateControlsSection).not.toBeNull();

    expect(screen.getByRole("heading", { name: "Cozy Generate Editor Bar" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Dropdown, Model, Aspect Controls" })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Quick picks")).not.toBeInTheDocument();
    expect(
      within(editorSection as HTMLElement).getByRole("button", {
        name: /Describe what you want to create/i
      })
    ).toBeInTheDocument();

    await user.click(
      within(editorSection as HTMLElement).getByRole("button", {
        name: /Describe what you want to create/i
      })
    );

    expect(screen.getByPlaceholderText("Text, image or video")).toBeInTheDocument();

    await user.upload(
      within(editorSection as HTMLElement).getByLabelText("Add photos or files"),
      new File(["preview"], "moodboard.png", { type: "image/png" })
    );

    await waitFor(() => {
      expect(
        within(editorSection as HTMLElement).getByRole("button", {
          name: "Remove moodboard.png"
        })
      ).toBeInTheDocument();
    });

    await user.click(
      within(generateControlsSection as HTMLElement).getByRole("button", { name: /9:16/i })
    );

    expect(screen.getByRole("slider", { name: "Aspect ratio" })).toBeInTheDocument();
    expect(screen.getByText("(Portrait)")).toBeInTheDocument();

  }, 10000);

  it("updates the hand-drawn frame playground with the new Cozy frame controls", async () => {
    window.history.pushState({}, "", "/");

    const { container } = render(<App />);
    const frameSection = container.querySelector("#component-hand-drawn-frame");

    expect(frameSection).not.toBeNull();
    expect(within(frameSection as HTMLElement).queryByText("Variant")).not.toBeInTheDocument();
    expect(within(frameSection as HTMLElement).queryByText("Variation")).not.toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).getByText("Crookedness")
    ).toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).getByText("Stroke Width Variation")
    ).toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).queryByText("Organic callout")
    ).not.toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).queryByRole("button", { name: "Shape" })
    ).not.toBeInTheDocument();
    const crookednessSlider = within(frameSection as HTMLElement).getByRole("slider", {
      name: "Crookedness"
    });
    const strokeWidthVariationSlider = within(frameSection as HTMLElement).getByRole("slider", {
      name: "Stroke Width Variation"
    });
    const strokeWidthSlider = within(frameSection as HTMLElement).getByRole("slider", {
      name: "Stroke Width"
    });

    expect(crookednessSlider).toBeInTheDocument();
    expect(strokeWidthVariationSlider).toBeInTheDocument();
    expect(strokeWidthSlider).toBeInTheDocument();

    fireEvent.change(strokeWidthVariationSlider, { target: { value: "8" } });

    expect(
      within(frameSection as HTMLElement).getByText("Frame preview")
    ).toBeInTheDocument();
    expect(
      within(frameSection as HTMLElement).getAllByText(/strokeWidthVariation=\{8\}/).length
    ).toBeGreaterThan(0);
    expect(
      within(frameSection as HTMLElement).queryByText(/shape="/)
    ).not.toBeInTheDocument();

    fireEvent.change(crookednessSlider, { target: { value: "10" } });

    await waitFor(() => {
      expect(
        within(frameSection as HTMLElement).getAllByText(/crookedness=\{10\}/).length
      ).toBeGreaterThan(0);
    });
  }, 10000);
});
