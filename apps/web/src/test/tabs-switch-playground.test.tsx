import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  buildTabsSwitchPlaygroundSnippet,
  defaultTabsSwitchPlaygroundState,
  TabsSwitchPlayground,
  type TabsSwitchPlaygroundState,
} from "@/apps/web/src/components/showcase/tabs-switch-playground";

function renderPlayground() {
  const utils = render(<TabsSwitchPlayground />);
  const preview = utils.getByTestId("tabs-switch-playground-preview");

  return { ...utils, preview };
}

describe("TabsSwitchPlayground snippet generator", () => {
  it("matches the default specimen by default", () => {
    const snippet = buildTabsSwitchPlaygroundSnippet(
      defaultTabsSwitchPlaygroundState,
    );

    expect(snippet).toContain(
      'import { TabsSwitch } from "@/components/ui/tabs-switch";',
    );
    expect(snippet).toContain('<Tabs defaultValue="live-feed">');
    expect(snippet).toContain('{ label: "Live Feed", value: "live-feed" }');
    expect(snippet).toContain('{ label: "Video", value: "video" }');
    expect(snippet).toContain('{ label: "X Posts", value: "x-posts" }');
  });

  it("updates labels, values, and disabled state from the list-driven controls", () => {
    const next: TabsSwitchPlaygroundState = {
      activeIndex: 2,
      items: [
        { disabled: false, label: "Forest Notes" },
        { disabled: true, label: "Behind the Scenes" },
        { disabled: false, label: "Launch Chatter" },
      ],
    };

    const snippet = buildTabsSwitchPlaygroundSnippet(next);

    expect(snippet).toContain('<Tabs defaultValue="launch-chatter">');
    expect(snippet).toContain(
      '{ label: "Forest Notes", value: "forest-notes" }',
    );
    expect(snippet).toContain(
      '{ label: "Behind the Scenes", value: "behind-the-scenes", disabled: true }',
    );
    expect(snippet).toContain(
      '<TabsContent value="launch-chatter">Launch Chatter content</TabsContent>',
    );
  });
});

describe("TabsSwitchPlayground component", () => {
  it("renders the default preview and snippet", () => {
    const { preview } = renderPlayground();

    expect(
      within(preview).getByRole("tab", { name: "Live Feed" }),
    ).toHaveAttribute("data-state", "active");
    expect(
      screen.getByText(
        /import \{ TabsSwitch \} from "@\/components\/ui\/tabs-switch";/,
      ),
    ).toBeInTheDocument();
  });

  it("updates the preview and snippet when controls change", async () => {
    const user = userEvent.setup();
    const { preview } = renderPlayground();

    await user.clear(screen.getByLabelText("Option 1 label"));
    await user.type(screen.getByLabelText("Option 1 label"), "Forest Notes");
    await user.click(screen.getAllByRole("checkbox", { name: "Disabled" })[1]!);
    await user.click(screen.getByRole("button", { name: "X Posts" }));

    expect(
      within(preview).getByRole("tab", { name: "Forest Notes" }),
    ).toBeInTheDocument();
    expect(within(preview).getByRole("tab", { name: "Video" })).toBeDisabled();
    expect(
      within(preview).getByRole("tab", { name: "X Posts" }),
    ).toHaveAttribute("data-state", "active");
    expect(screen.getByText(/label: "Forest Notes"/)).toBeInTheDocument();
    expect(screen.getByText(/value: "forest-notes"/)).toBeInTheDocument();
    expect(screen.getByText(/disabled: true/)).toBeInTheDocument();
  });

  it("resets the playground controls, preview, and snippet", async () => {
    const user = userEvent.setup();
    const { preview } = renderPlayground();

    await user.clear(screen.getByLabelText("Option 1 label"));
    await user.type(screen.getByLabelText("Option 1 label"), "Forest Notes");
    await user.click(screen.getAllByRole("checkbox", { name: "Disabled" })[2]!);

    expect(
      within(preview).getByRole("tab", { name: "Forest Notes" }),
    ).toBeInTheDocument();
    expect(
      within(preview).getByRole("tab", { name: "X Posts" }),
    ).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(
      within(preview).getByRole("tab", { name: "Live Feed" }),
    ).toHaveAttribute("data-state", "active");
    expect(
      within(preview).getByRole("tab", { name: "Video" }),
    ).not.toBeDisabled();
    expect(screen.getByText(/label: "Live Feed"/)).toBeInTheDocument();
    expect(screen.queryByText(/label: "Forest Notes"/)).not.toBeInTheDocument();
  });
});
