import { BookCopy, Flower2, LayoutPanelLeft, LibraryBig, Shapes } from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, cn } from "@ghibli/ui";

import { componentDocs, guides, patternDocs } from "@/apps/web/src/data/library-docs";

const topNavItems = [
  { href: "/", label: "Home" },
  { href: "/guides/getting-started", label: "Guides" },
  { href: "/components", label: "Components" },
  { href: "/patterns", label: "Patterns" },
  { href: "/examples", label: "Examples" }
];

const browseItems = [
  { href: "/components", label: "All components" },
  { href: "/patterns", label: "All patterns" },
  { href: "/examples", label: "Example gallery" }
];

function TopNavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      className={cn(
        "rounded-full px-3 py-2 text-sm transition-colors",
        active
          ? "bg-[color:var(--paper)] text-[color:var(--ink-strong)] shadow-[var(--shadow-soft)]"
          : "text-[color:var(--muted-foreground)] hover:bg-white/45 hover:text-[color:var(--foreground)]"
      )}
      to={href}
    >
      {label}
    </Link>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          "rounded-[calc(var(--radius)-0.35rem)] px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-[color:var(--paper)] text-[color:var(--ink-strong)] shadow-[var(--shadow-soft)]"
            : "text-[color:var(--muted-foreground)] hover:bg-white/45 hover:text-[color:var(--foreground)]"
        )
      }
      to={href}
    >
      {label}
    </NavLink>
  );
}

export function SiteShell() {
  const location = useLocation();

  return (
    <div className="docs-site">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="docs-container">
          <div className="site-header-row">
            <Link className="site-brand" to="/">
              <span className="site-brand-mark">
                <Flower2 className="size-5 text-[color:var(--ink-strong)]" />
              </span>
              <span className="grid gap-0.5">
                <span className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">Ghibli UI</span>
                <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                  Documentation-first registry
                </span>
              </span>
            </Link>
            <nav className="site-nav" aria-label="Primary">
              {topNavItems.map((item) => (
                <TopNavLink href={item.href} key={item.href} label={item.label} pathname={location.pathname} />
              ))}
            </nav>
            <div className="site-actions">
              <Button asChild size="sm" variant="secondary">
                <Link to="/guides/getting-started">Install guide</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link to="/guides/development">Storybook</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="docs-container">
        <div className="docs-layout">
          <aside className="docs-sidebar">
            <Card>
              <CardHeader>
                <CardTitle>Library map</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                    <BookCopy className="size-4" />
                    Guides
                  </div>
                  <div className="grid gap-1">
                    {guides.map((guide) => (
                      <SidebarLink href={`/guides/${guide.slug}`} key={guide.slug} label={guide.title} />
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                    <LibraryBig className="size-4" />
                    Browse
                  </div>
                  <div className="grid gap-1">
                    {browseItems.map((item) => (
                      <SidebarLink href={item.href} key={item.href} label={item.label} />
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                    <LayoutPanelLeft className="size-4" />
                    At a glance
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="river">{`${componentDocs.length} components`}</Badge>
                    <Badge tone="meadow">{`${patternDocs.length} patterns`}</Badge>
                  </div>
                </div>
                <div className="rounded-[calc(var(--radius)-0.35rem)] border border-[color:var(--border)] bg-[color:var(--paper-soft)] p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[color:var(--ink-strong)]">
                    <Shapes className="size-4" />
                    Storybook mirrors the same taxonomy
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                    Foundations, Components, Patterns, and Examples stay aligned with the docs app.
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
          <main className="docs-main" id="content">
            <div className="docs-banner">
              <div className="grid gap-1">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                  Registry + docs + storybook
                </p>
                <h2 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)] md:text-4xl">
                  Installable scenic UI with clearer docs and steadier structure
                </h2>
              </div>
              <div className="rounded-full border border-[color:var(--border)] bg-white/40 px-4 py-2 text-sm text-[color:var(--muted-foreground)]">
                pnpm dlx shadcn@latest add @ghibli/style
              </div>
            </div>
            <div className="docs-page">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <footer className="site-footer">
        <div className="docs-container">
          <div className="site-footer-grid">
            <div className="grid gap-2">
              <h2 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
                Ghibli UI
              </h2>
              <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
                A shareable registry-first component library with guides, examples, and grouped installable patterns.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="grid gap-2">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">Guides</p>
                <div className="grid gap-2">
                  <Link className="text-sm hover:underline" to="/guides/getting-started">Getting started</Link>
                  <Link className="text-sm hover:underline" to="/guides/installation">Installation</Link>
                </div>
              </div>
              <div className="grid gap-2">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">Library</p>
                <div className="grid gap-2">
                  <Link className="text-sm hover:underline" to="/components">Components</Link>
                  <Link className="text-sm hover:underline" to="/patterns">Patterns</Link>
                </div>
              </div>
              <div className="grid gap-2">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">Workflow</p>
                <div className="grid gap-2">
                  <Link className="text-sm hover:underline" to="/examples">Examples</Link>
                  <Link className="text-sm hover:underline" to="/guides/development">Development</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
