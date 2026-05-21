import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  buildPlaygroundSnippet,
  defaultPlaygroundState,
  ShellHeaderPlayground,
  type ShellHeaderPlaygroundState,
} from "@/apps/web/src/components/showcase/shell-header-playground";

function renderPlayground() {
  const onOpenThemeModal = vi.fn();
  const utils = render(
    <ShellHeaderPlayground onOpenThemeModal={onOpenThemeModal} />,
  );

  const preview = utils.getByTestId("shell-header-playground-preview");
  return { ...utils, onOpenThemeModal, preview };
}

function getCheckbox(label: string) {
  return screen.getByRole("checkbox", { name: new RegExp(`^${label}`, "i") });
}

describe("ShellHeaderPlayground snippet generator", () => {
  it("matches the default specimen by default", () => {
    const snippet = buildPlaygroundSnippet(defaultPlaygroundState);

    expect(snippet).toContain("brand={<BrandLink />}");
    expect(snippet).toContain('navItems={[');
    expect(snippet).toContain('active: true, href: "#create"');
    expect(snippet).toContain("utilityItems={[");
    expect(snippet).toContain("user={{");
    expect(snippet).not.toContain("socialItems={");
    expect(snippet).not.toContain("renderUserTrigger");
    expect(snippet).not.toContain("primaryAction");
    expect(snippet).not.toContain("endContent");
    expect(snippet).not.toContain("startContent");
    expect(snippet).not.toContain("mobileTitle=");
  });

  it("omits sections when toggled off and switches the active nav item", () => {
    const next: ShellHeaderPlaygroundState = {
      ...defaultPlaygroundState,
      activeNavItem: "#resources",
      showBrand: false,
      showUser: false,
      showUtilityItems: false,
    };

    const snippet = buildPlaygroundSnippet(next);

    expect(snippet).not.toContain("brand=");
    expect(snippet).not.toContain("user=");
    expect(snippet).not.toContain("utilityItems=");
    expect(snippet).not.toContain("socialItems=");
    expect(snippet).toContain('active: true, href: "#resources"');
    expect(snippet).not.toContain('active: true, href: "#create"');
  });

  it("uses the legacy socialItems alias when requested", () => {
    const snippet = buildPlaygroundSnippet({
      ...defaultPlaygroundState,
      useLegacySocialItems: true,
    });

    expect(snippet).toContain("socialItems={");
    expect(snippet).not.toContain("utilityItems={");
  });

  it("emits a custom user trigger renderer when selected", () => {
    const snippet = buildPlaygroundSnippet({
      ...defaultPlaygroundState,
      userTriggerVariant: "custom",
    });

    expect(snippet).toContain("renderUserTrigger=");
    expect(snippet).toContain('<Button variant="outline">{user.name}</Button>');
  });

  it("includes a custom mobileTitle", () => {
    const snippet = buildPlaygroundSnippet({
      ...defaultPlaygroundState,
      mobileTitle: "Studio menu",
    });

    expect(snippet).toContain('mobileTitle="Studio menu"');
  });

  it("returns a self-closing tag when every slot is hidden", () => {
    const snippet = buildPlaygroundSnippet({
      ...defaultPlaygroundState,
      showBrand: false,
      showNavItems: false,
      showUser: false,
      showUtilityItems: false,
    });

    expect(snippet).toBe("<ShellHeader />");
  });
});

describe("ShellHeaderPlayground component", () => {
  it("renders the default specimen sections in the preview", () => {
    const { preview } = renderPlayground();

    expect(within(preview).getByText("Ghibli UI")).toBeInTheDocument();
    expect(
      within(preview).getByRole("link", { name: "Create" }),
    ).toBeInTheDocument();
    expect(
      within(preview).getByRole("link", { name: "Change theme" }),
    ).toBeInTheDocument();
    expect(
      within(preview).getByRole("button", { name: "User" }),
    ).toBeInTheDocument();
  });

  it("hides sections when the matching control is unchecked", async () => {
    const user = userEvent.setup();
    const { preview } = renderPlayground();

    await user.click(getCheckbox("Brand"));
    expect(within(preview).queryByText("Ghibli UI")).not.toBeInTheDocument();

    await user.click(getCheckbox("Nav items"));
    expect(
      within(preview).queryByRole("link", { name: "Create" }),
    ).not.toBeInTheDocument();

    await user.click(getCheckbox("Utility items"));
    expect(
      within(preview).queryByRole("link", { name: "Change theme" }),
    ).not.toBeInTheDocument();

    await user.click(getCheckbox("User"));
    expect(
      within(preview).queryByRole("button", { name: "User" }),
    ).not.toBeInTheDocument();
  });

  it("updates the generated code snippet when controls change", async () => {
    const user = userEvent.setup();
    renderPlayground();

    await user.click(getCheckbox("Brand"));

    const codeAfterHide = screen.getByRole("button", { name: /Copy code block/i });
    expect(codeAfterHide).toBeInTheDocument();

    expect(screen.queryByText(/brand=\{<BrandLink \/>\}/)).not.toBeInTheDocument();

    await user.click(getCheckbox("Brand"));

    expect(screen.getByText(/brand=\{<BrandLink \/>\}/)).toBeInTheDocument();
  });

  it("changes the active nav item via the segmented control", async () => {
    const user = userEvent.setup();
    const { preview } = renderPlayground();

    expect(
      within(preview).getByRole("link", { name: "Create" }),
    ).toHaveAttribute("aria-current", "page");

    await user.click(screen.getByRole("button", { name: "Resources", pressed: false }));

    expect(
      within(preview).getByRole("link", { name: "Resources" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(preview).getByRole("link", { name: "Create" }),
    ).not.toHaveAttribute("aria-current", "page");
  });

  it("resets preview and snippet to defaults", async () => {
    const user = userEvent.setup();
    const { preview } = renderPlayground();

    await user.click(getCheckbox("Brand"));
    await user.click(getCheckbox("User"));

    expect(within(preview).queryByText("Ghibli UI")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(within(preview).getByText("Ghibli UI")).toBeInTheDocument();
    expect(
      within(preview).getByRole("button", { name: "User" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/brand=\{<BrandLink \/>\}/)).toBeInTheDocument();
  });
});
