import { Outlet } from "react-router-dom";

import { HandDrawnFrame, ShellHeader } from "@ghibli/ui";

function SiteBrand() {
  return (
    <a className="inline-flex items-center gap-3" href="#install">
      <HandDrawnFrame
        className="size-12 shrink-0 bg-white/45 p-1.5"
        strokeColor="var(--border-strong)"
        strokeWidth={1.85}
      >
        <img
          alt="Cozy.art logo"
          className="size-full object-cover"
          src="/cozyart.png"
        />
      </HandDrawnFrame>
      <div className="grid gap-0.5">
        <span className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
          Ghibli UI Library
        </span>
      </div>
    </a>
  );
}

export function SiteShell() {
  return (
    <div className="ghibli-wash relative isolate min-h-screen">
      <div
        aria-hidden="true"
        className="paper-overlay pointer-events-none absolute inset-0 z-0 opacity-70 mix-blend-multiply"
      />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pt-4 md:px-6">
        <ShellHeader
          brand={<SiteBrand />}
          mobileTitle="Ghibli UI"
          navItems={[
            { href: "#install", label: "Install" },
            { href: "#shell-navigation", label: "Shell" },
            { href: "#core-primitives", label: "Primitives" },
          ]}
        />
        <main className="flex-1" id="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
