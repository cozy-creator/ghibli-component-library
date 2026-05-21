import { useMemo, useState, type ReactNode } from "react";
import { LogOut, Palette, UserRound } from "lucide-react";

import {
  Button,
  cn,
  DocsCodeBlock,
  FormField,
  Input,
  ShellHeader,
  type ShellNavItem,
  type ShellUser,
} from "@ghibli/ui";

import { BrandMark } from "@/apps/web/src/components/site-brand";
import {
  DiscordHeaderIcon,
  GitHubHeaderIcon,
  mockHeaderAvatarUrl,
} from "@/apps/web/src/components/site-header-icons";

const repoUrl = "https://github.com/rodrigoluz/ghibli-component-library";

const navOptions: { active: boolean; href: string; label: string }[] = [
  { active: true, href: "#generate-flows", label: "Generate" },
  { active: false, href: "#community-flows", label: "Community" },
  { active: false, href: "#docs-screens", label: "Docs" },
];

export type ShellHeaderPlaygroundState = {
  activeNavItem: string;
  mobileTitle: string;
  showBrand: boolean;
  showNavItems: boolean;
  showUser: boolean;
  showUtilityItems: boolean;
  userTriggerVariant: "default" | "custom";
};

export const defaultPlaygroundState: ShellHeaderPlaygroundState = {
  activeNavItem: "#generate-flows",
  mobileTitle: "Navigation",
  showBrand: true,
  showNavItems: true,
  showUser: true,
  showUtilityItems: true,
  userTriggerVariant: "default",
};

type PreviewBuild = {
  navItems: ShellNavItem[];
  utilityItems: ShellNavItem[];
  user: ShellUser | undefined;
  brand: ReactNode | undefined;
};

function buildPreview(
  state: ShellHeaderPlaygroundState,
  onOpenThemeModal: () => void,
): PreviewBuild {
  const navItems: ShellNavItem[] = state.showNavItems
    ? navOptions.map((item) => ({
        active: item.href === state.activeNavItem,
        href: item.href,
        label: item.label,
        onClick: (event) => {
          event.preventDefault();
        },
      }))
    : [];

  const utilityItems: ShellNavItem[] = state.showUtilityItems
    ? [
        {
          href: "#playground-theme",
          icon: <Palette className="size-4" />,
          iconOnly: true,
          label: "Change theme",
          onClick: (event) => {
            event.preventDefault();
            onOpenThemeModal();
          },
        },
        {
          external: true,
          href: repoUrl,
          icon: <GitHubHeaderIcon />,
          iconOnly: true,
          label: "GitHub",
        },
        {
          external: true,
          href: "https://discord.gg/cozyart",
          icon: <DiscordHeaderIcon />,
          iconOnly: true,
          label: "Discord",
        },
      ]
    : [];

  const user: ShellUser | undefined = state.showUser
    ? {
        avatarUrl: mockHeaderAvatarUrl,
        initials: "MS",
        menuItems: [
          {
            icon: <UserRound className="size-4" />,
            id: "account",
            label: "Account",
          },
          {
            icon: <Palette className="size-4" />,
            id: "theme",
            label: "Theme",
            onSelect: () => onOpenThemeModal(),
          },
          {
            destructive: true,
            icon: <LogOut className="size-4" />,
            id: "logout",
            label: "Sign out",
          },
        ],
        name: "User",
        subtitle: "mei@ghibli-ui.test",
      }
    : undefined;

  const brand = state.showBrand ? (
    <a className="inline-flex items-center gap-3" href="#install">
      <BrandMark />
      <span className="font-[var(--font-heading)] text-2xl text-[color:var(--ink-strong)]">
        Ghibli UI
      </span>
    </a>
  ) : undefined;

  return {
    brand,
    navItems,
    user,
    utilityItems,
  };
}

const indent = (text: string, spaces: number) =>
  text
    .split("\n")
    .map((line) => (line.length > 0 ? " ".repeat(spaces) + line : line))
    .join("\n");

const navItemsLiteral = (state: ShellHeaderPlaygroundState) => {
  if (!state.showNavItems) {
    return null;
  }

  const lines = navOptions.map((item) => {
    const isActive = item.href === state.activeNavItem;
    const parts: string[] = [];

    if (isActive) {
      parts.push("active: true");
    }

    parts.push(`href: ${JSON.stringify(item.href)}`);
    parts.push(`label: ${JSON.stringify(item.label)}`);
    return `  { ${parts.join(", ")} },`;
  });

  return `[\n${lines.join("\n")}\n]`;
};

const utilityItemsLiteral = (state: ShellHeaderPlaygroundState) => {
  if (!state.showUtilityItems) {
    return null;
  }

  return `[
  { href: "#change-theme", icon: <Palette />, iconOnly: true, label: "Change theme", onClick: openThemeModal },
  { external: true, href: "https://github.com/...", icon: <GitHubIcon />, iconOnly: true, label: "GitHub" },
  { external: true, href: "https://discord.gg/...", icon: <DiscordIcon />, iconOnly: true, label: "Discord" },
]`;
};

const userLiteral = (state: ShellHeaderPlaygroundState) => {
  if (!state.showUser) {
    return null;
  }

  return `{
  avatarUrl: "/examples/user-avatar.png",
  initials: "MS",
  name: "User",
  subtitle: "mei@ghibli-ui.test",
  menuItems: [
    { id: "account", icon: <UserRound />, label: "Account" },
    { id: "theme", icon: <Palette />, label: "Theme", onSelect: openThemeModal },
    { id: "logout", destructive: true, icon: <LogOut />, label: "Sign out" },
  ],
}`;
};

export function buildPlaygroundSnippet(
  state: ShellHeaderPlaygroundState,
): string {
  const lines: string[] = [];

  if (state.showBrand) {
    lines.push(`brand={<BrandLink />}`);
  }

  const navLiteral = navItemsLiteral(state);

  if (navLiteral) {
    lines.push(`navItems={${navLiteral}}`);
  }

  const utilityLiteral = utilityItemsLiteral(state);

  if (utilityLiteral) {
    lines.push(`utilityItems={${utilityLiteral}}`);
  }

  const userJson = userLiteral(state);

  if (userJson) {
    lines.push(`user={${userJson}}`);
  }

  if (state.showUser && state.userTriggerVariant === "custom") {
    lines.push(
      `renderUserTrigger={(user) => (\n  <Button variant="outline">{user.name}</Button>\n)}`,
    );
  }

  if (state.mobileTitle && state.mobileTitle !== "Navigation") {
    lines.push(`mobileTitle=${JSON.stringify(state.mobileTitle)}`);
  }

  if (lines.length === 0) {
    return `<ShellHeader />`;
  }

  return `<ShellHeader\n${lines.map((line) => indent(line, 2)).join("\n")}\n/>`;
}

function ToggleField({
  description,
  label,
  onChange,
  value,
}: {
  description?: string;
  label: string;
  onChange: (next: boolean) => void;
  value: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 border border-[color:var(--border-soft)] bg-[color:var(--paper-soft)] px-3 py-2.5 text-left transition-colors",
        value
          ? "text-[color:var(--ink-strong)]"
          : "text-[color:var(--muted-foreground)]",
      )}
    >
      <input
        checked={value}
        className="mt-0.5 size-4 cursor-pointer accent-[color:var(--ink-strong)]"
        onChange={(event) => onChange(event.currentTarget.checked)}
        type="checkbox"
      />
      <span className="grid gap-0.5">
        <span className="text-sm leading-none font-medium">{label}</span>
        {description ? (
          <span className="text-xs leading-5 text-[color:var(--muted-foreground)]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function SegmentedField<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (next: T) => void;
  options: { label: string; value: T }[];
  value: T;
}) {
  return (
    <FormField label={label}>
      <div
        className="grid gap-1.5"
        role="radiogroup"
        aria-label={label}
        style={{
          gridTemplateColumns: `repeat(${Math.min(options.length, 3)}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              aria-pressed={isActive}
              className={cn(
                "border px-2.5 py-2 text-xs leading-none transition-colors",
                isActive
                  ? "border-[color:var(--border)] bg-[color:var(--paper)] text-[color:var(--ink-strong)]"
                  : "border-[color:var(--border-soft)] bg-[color:var(--paper-soft)] text-[color:var(--muted-foreground)] hover:text-[color:var(--ink-strong)]",
              )}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </FormField>
  );
}

function PlaygroundCodeBlock({ children }: { children: string }) {
  return (
    <DocsCodeBlock className="mb-0 max-w-full" codeText={children}>
      {children}
    </DocsCodeBlock>
  );
}

export type ShellHeaderPlaygroundProps = {
  onOpenThemeModal: () => void;
};

export function ShellHeaderPlayground({
  onOpenThemeModal,
}: ShellHeaderPlaygroundProps) {
  const [state, setState] = useState<ShellHeaderPlaygroundState>(
    defaultPlaygroundState,
  );

  const previewBuild = useMemo(
    () => buildPreview(state, onOpenThemeModal),
    [state, onOpenThemeModal],
  );

  const snippet = useMemo(() => buildPlaygroundSnippet(state), [state]);

  const update = <K extends keyof ShellHeaderPlaygroundState>(
    key: K,
    value: ShellHeaderPlaygroundState[K],
  ) => setState((current) => ({ ...current, [key]: value }));

  const navOptionsForActive = navOptions
    .filter(() => state.showNavItems)
    .map((item) => ({ label: item.label, value: item.href }));

  const renderUserTrigger =
    state.showUser && state.userTriggerVariant === "custom"
      ? (user: ShellUser) => <Button variant="outline">{user.name}</Button>
      : undefined;

  const utilityProp = { utilityItems: previewBuild.utilityItems };

  return (
    <div className="grid gap-4" data-testid="shell-header-playground">
      <div
        className="min-w-0 border border-[color:var(--border-soft)] bg-[color:rgba(255,255,255,0.35)] p-4"
        data-testid="shell-header-playground-preview"
      >
        <div className="[&>header]:static">
          <ShellHeader
            brand={previewBuild.brand}
            mobileTitle={state.mobileTitle}
            navItems={previewBuild.navItems}
            renderUserTrigger={renderUserTrigger}
            user={previewBuild.user}
            {...utilityProp}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        <div className="grid content-start gap-3 border border-[color:var(--border-soft)] bg-[color:rgba(255,255,255,0.35)] p-4">
          <div className="grid gap-1">
            <p className="font-[var(--font-heading)] text-lg text-[color:var(--ink-strong)]">
              Header playground
            </p>
            <p className="text-xs leading-6 text-[color:var(--muted-foreground)]">
              Toggle slots to preview how the navbar reflows.
            </p>
          </div>

          <div className="grid gap-2">
            <ToggleField
              label="Brand"
              onChange={(next) => update("showBrand", next)}
              value={state.showBrand}
            />
            <ToggleField
              label="Nav items"
              onChange={(next) => update("showNavItems", next)}
              value={state.showNavItems}
            />
            <ToggleField
              label="Utility items"
              onChange={(next) => update("showUtilityItems", next)}
              value={state.showUtilityItems}
            />
            <ToggleField
              label="User"
              onChange={(next) => update("showUser", next)}
              value={state.showUser}
            />
          </div>

          {state.showNavItems && navOptionsForActive.length > 0 ? (
            <SegmentedField
              label="Active nav item"
              onChange={(next) => update("activeNavItem", next)}
              options={navOptionsForActive}
              value={state.activeNavItem}
            />
          ) : null}

          {state.showUser ? (
            <SegmentedField
              label="User trigger"
              onChange={(next) => update("userTriggerVariant", next)}
              options={[
                { label: "Default chip", value: "default" },
                { label: "Custom button", value: "custom" },
              ]}
              value={state.userTriggerVariant}
            />
          ) : null}

          <FormField
            description="Sheet title shown in the mobile drawer."
            htmlFor="shell-header-playground-mobile-title"
            label="Mobile title"
          >
            <Input
              id="shell-header-playground-mobile-title"
              onChange={(event) =>
                update("mobileTitle", event.currentTarget.value)
              }
              value={state.mobileTitle}
            />
          </FormField>

          <Button
            className="mt-1"
            onClick={() => setState(defaultPlaygroundState)}
            type="button"
            variant="secondary"
          >
            Reset
          </Button>
        </div>

        <div className="min-w-0">
          <PlaygroundCodeBlock>{snippet}</PlaygroundCodeBlock>
        </div>
      </div>
    </div>
  );
}

export { navOptions as shellHeaderPlaygroundNavOptions };
