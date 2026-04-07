import { Flower2 } from "lucide-react";
import { Outlet } from "react-router-dom";

import {
  Button,
  ShellFooter,
  ShellHeader
} from "@ghibli/ui";

function SiteBrand() {
  return (
    <a className="inline-flex items-center gap-3" href="/">
      <div className="inline-flex size-12 items-center justify-center rounded-full border-2 border-[color:var(--border)] bg-[color:var(--paper)]">
        <Flower2 className="size-5 text-[color:var(--ink-strong)]" />
      </div>
      <div className="grid gap-0.5">
        <span className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
          Ghibli UI
        </span>
        <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
          Cozy component library
        </span>
      </div>
    </a>
  );
}

export function SiteShell() {
  return (
    <div className="min-h-screen overflow-x-clip pb-10">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <ShellHeader
          brand={<SiteBrand />}
          navItems={[
            { href: "#install", label: "Install" },
            { href: "#component-button", label: "Components" },
            { href: "#component-footer", label: "Footer" }
          ]}
          primaryAction={
            <Button asChild size="sm">
              <a href="#storybook">Storybook</a>
            </Button>
          }
        />
        <main className="min-w-0" id="content">
          <Outlet />
        </main>
        <div className="mt-10">
          <ShellFooter
            columns={[
              { href: "#install", text: "Install" },
              { href: "#component-button", text: "Components" },
              { href: "#storybook", text: "Storybook" }
            ]}
            text="Ghibli UI component library"
          />
        </div>
      </div>
    </div>
  );
}
