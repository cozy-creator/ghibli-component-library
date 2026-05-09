import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button, ShellHeader } from "@ghibli/ui";

describe("layout shell header", () => {
  it("prefers utilityItems over the legacy socialItems alias", () => {
    render(
      <ShellHeader
        brand={<span>Brand</span>}
        navItems={[]}
        socialItems={[{ href: "#legacy", label: "Legacy utility" }]}
        utilityItems={[{ href: "#utility", label: "Utility link" }]}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Utility link" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Legacy utility" }),
    ).not.toBeInTheDocument();
  });

  it("renders optional start and end regions without requiring a brand or nav items", () => {
    const { container } = render(
      <ShellHeader
        endContent={<button type="button">Help</button>}
        navItems={[]}
        slotClassNames={{
          end: "end-slot",
          root: "root-slot",
          start: "start-slot",
        }}
        startContent={<div>Filters</div>}
      />,
    );

    expect(container.querySelector('[data-slot="root"]')).toHaveClass(
      "root-slot",
    );
    expect(container.querySelector('[data-slot="start"]')).toHaveClass(
      "start-slot",
    );
    expect(container.querySelector('[data-slot="end"]')).toHaveClass(
      "end-slot",
    );
    expect(container.querySelector('[data-slot="nav"]')).toBeNull();
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Help" })).toBeInTheDocument();
  });

  it("renders nav-only and nav-without-suffix variants without requiring extra regions", () => {
    const { rerender } = render(
      <ShellHeader navItems={[{ href: "#docs", label: "Docs" }]} />,
    );

    expect(screen.getByRole("link", { name: "Docs" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toBeInTheDocument();

    rerender(
      <ShellHeader
        brand={<span>Brand</span>}
        navItems={[{ href: "#install", label: "Install" }]}
      />,
    );

    expect(screen.getByText("Brand")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Install" })).toBeInTheDocument();
  });

  it("supports a custom user trigger without nesting interactive elements", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { container } = render(
      <ShellHeader
        navItems={[]}
        renderUserTrigger={(headerUser) => (
          <Button variant="outline">{headerUser.name}</Button>
        )}
        user={{
          menuItems: [{ id: "account", label: "Account", onSelect }],
          name: "Mina",
        }}
      />,
    );

    expect(container.querySelectorAll("button button")).toHaveLength(0);

    await user.click(screen.getByRole("button", { name: "Mina" }));
    await user.click(screen.getByRole("menuitem", { name: "Account" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("closes the mobile sheet after activating nav and utility links", async () => {
    const user = userEvent.setup();

    render(
      <ShellHeader
        navItems={[
          {
            href: "#docs",
            label: "Docs",
            onClick: (event) => event.preventDefault(),
          },
        ]}
        utilityItems={[
          {
            href: "#github",
            label: "GitHub",
            onClick: (event) => event.preventDefault(),
          },
        ]}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    let sheet = screen.getByRole("dialog");
    await user.click(within(sheet).getByRole("link", { name: "Docs" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    sheet = screen.getByRole("dialog");
    await user.click(within(sheet).getByRole("link", { name: "GitHub" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
