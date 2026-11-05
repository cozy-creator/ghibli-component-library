import { useState } from "react";
import { LogOut, Palette, UserRound } from "lucide-react";
import { Outlet } from "react-router-dom";

import { ChangeThemeModal, ShellHeader } from "@ghibli/ui";

import { BrandMark } from "@/apps/web/src/components/site-brand";
import {
  DiscordHeaderIcon,
  GitHubHeaderIcon,
  mockHeaderAvatarUrl,
} from "@/apps/web/src/components/site-header-icons";

const repoUrl = "https://github.com/cozy-creator/ghibli-component-library";
const discordUrl = "#";

function jumpToAnchor(anchorId: string) {
  window.location.hash = anchorId;
}

function SiteBrand() {
  return (
    <a className="inline-flex items-center gap-3" href="#install">
      <BrandMark />
      <div className="grid gap-0.5">
        <span className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
          Ghibli UI Library
        </span>
      </div>
    </a>
  );
}

export function SiteShell() {
  const [isChangeThemeOpen, setIsChangeThemeOpen] = useState(false);

  return (
    <div className="relative isolate min-h-screen">
      <div
        aria-hidden="true"
        className="app-backdrop pointer-events-none fixed inset-0 z-0"
      />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pt-4 md:px-6">
        <ShellHeader
          brand={<SiteBrand />}
          mobileTitle="Ghibli UI"
          navItems={[]}
          renderLink={(item, className, children) =>
            item.external ? (
              <a
                className={className}
                href={item.href}
                onClick={item.onClick}
                rel="noreferrer"
                target="_blank"
              >
                {children}
              </a>
            ) : (
              <a className={className} href={item.href} onClick={item.onClick}>
                {children}
              </a>
            )
          }
          utilityItems={[
            {
              href: "#",
              icon: <Palette className="size-4" />,
              iconOnly: true,
              label: "Change theme",
              onClick: (event) => {
                event.preventDefault();
                setIsChangeThemeOpen(true);
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
              href: discordUrl,
              icon: <DiscordHeaderIcon />,
              iconOnly: true,
              label: "Discord",
            },
          ]}
          user={{
            avatarUrl: mockHeaderAvatarUrl,
            initials: "MS",
            menuItems: [
              {
                icon: <UserRound className="size-4" />,
                id: "account",
                label: "Account",
                onSelect: () => jumpToAnchor("account-screens"),
              },
              {
                icon: <Palette className="size-4" />,
                id: "theme",
                label: "Theme",
                onSelect: () => setIsChangeThemeOpen(true),
              },
              {
                destructive: true,
                icon: <LogOut className="size-4" />,
                id: "sign-out",
                label: "Sign out",
              },
            ],
            name: "User",
            subtitle: "mei@ghibli-ui.test",
          }}
        />
        <main className="flex-1" id="content">
          <Outlet />
        </main>
      </div>
      <div
        aria-hidden="true"
        className="paper-overlay pointer-events-none absolute inset-0 z-30 mix-blend-multiply"
        style={{ opacity: "var(--texture-overlay-opacity)" }}
      />

      <ChangeThemeModal
        onOpenChange={setIsChangeThemeOpen}
        open={isChangeThemeOpen}
      />
    </div>
  );
}
