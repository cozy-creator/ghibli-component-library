import { BookOpenIcon, PaintbrushIcon, SparklesIcon } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { PaperPanel, cn } from "@ghibli/ui";

const docsLinks = [
  { href: "/docs/getting-started", label: "Getting started" },
  { href: "/docs/themes", label: "Themes" },
  { href: "/docs/components/button", label: "Components" },
  { href: "/docs/blocks/hero-paper", label: "Blocks" }
];

const mockupLinks = [
  { href: "/mockups/creator-gallery", label: "Creator gallery" },
  { href: "/mockups/travel-dashboard", label: "Travel dashboard" },
  { href: "/mockups/paper-saas", label: "Paper SaaS" },
  { href: "/mockups/kitchen-sink", label: "Kitchen sink" }
];

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          "rounded-[calc(var(--radius)-0.125rem)] border px-4 py-3 text-sm transition-colors",
          isActive
            ? "border-[color:var(--primary-edge)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
            : "border-[color:var(--border)] bg-white/30 text-[color:var(--foreground)] hover:bg-white/50"
        )
      }
      to={href}
    >
      {label}
    </NavLink>
  );
}

export function SiteShell() {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-[92rem] gap-6 px-4 py-5 lg:grid-cols-[19rem_minmax(0,1fr)] lg:px-6 lg:py-6">
      <aside className="grid gap-4 lg:sticky lg:top-6 lg:self-start">
        <PaperPanel className="grid gap-6 p-5" tone="meadow">
          <div className="grid gap-2">
            <div className="inline-flex size-12 items-center justify-center rounded-full border border-white/45 bg-white/45 shadow-[var(--shadow-button)]">
              <SparklesIcon className="size-5 text-[color:var(--ink-strong)]" />
            </div>
            <div>
              <h1 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
                Ghibli UI
              </h1>
              <p className="mt-1 text-sm leading-7 text-[color:var(--muted-foreground)]">
                Registry-first React components with paper textures, soft edges, and scenic mockups.
              </p>
            </div>
          </div>
          <nav className="grid gap-5">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-[color:var(--muted-foreground)]">
                <BookOpenIcon className="size-4" />
                Docs
              </div>
              <div className="grid gap-2">
                {docsLinks.map((link) => (
                  <SidebarLink key={link.href} {...link} />
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-[color:var(--muted-foreground)]">
                <PaintbrushIcon className="size-4" />
                Mockups
              </div>
              <div className="grid gap-2">
                {mockupLinks.map((link) => (
                  <SidebarLink key={link.href} {...link} />
                ))}
              </div>
            </div>
          </nav>
        </PaperPanel>
      </aside>
      <main className="grid gap-5">
        <PaperPanel className="p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-[color:var(--muted-foreground)]">
                shadcn registry + Storybook
              </p>
              <h2 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
                Copy-paste components, not a package dependency
              </h2>
            </div>
            <div className="rounded-full border border-[color:var(--border)] bg-white/35 px-4 py-2 text-sm text-[color:var(--muted-foreground)]">
              `pnpm dlx shadcn@latest add @ghibli/button`
            </div>
          </div>
        </PaperPanel>
        <PaperPanel className="ghibli-page min-h-[calc(100vh-13rem)] p-5 md:p-7">
          <Outlet />
        </PaperPanel>
      </main>
    </div>
  );
}
