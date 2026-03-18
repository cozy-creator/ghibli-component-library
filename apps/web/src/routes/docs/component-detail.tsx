import { Navigate, useParams } from "react-router-dom";

import { PaperPanel } from "@ghibli/ui";

import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import { componentCatalog, componentIndex } from "@/apps/web/src/data/catalog";

export function ComponentDetailPage() {
  const { name } = useParams();

  if (!name) {
    return <Navigate replace to="/docs/components/button" />;
  }

  const component = componentIndex.get(name);

  if (!component) {
    return <Navigate replace to="/docs/components/button" />;
  }

  return (
    <div className="grid gap-8">
      <PageIntro
        badge="Component"
        description={component.description}
        title={component.title}
      />
      <PaperPanel className="grid gap-4 p-6">
        <h2 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
          Preview
        </h2>
        <div className="rounded-[calc(var(--radius)+0.5rem)] border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--paper)_78%,white)] p-5">
          {component.preview}
        </div>
      </PaperPanel>
      <div className="paper-grid" data-columns="2">
        <PaperPanel className="grid gap-3 p-6">
          <h2 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
            Install
          </h2>
          <pre className="overflow-x-auto rounded-[calc(var(--radius)+0.25rem)] border border-[color:var(--border)] bg-[color:var(--paper)] p-4 text-xs text-[color:var(--ink-strong)]">
            {component.install}
          </pre>
        </PaperPanel>
        <PaperPanel className="grid gap-3 p-6" tone="meadow">
          <h2 className="font-[var(--font-heading)] text-3xl">Inventory</h2>
          <p className="text-sm leading-7">
            Ghibli UI ships {componentCatalog.length} components in the current docs catalog, all installable as source code via shadcn.
          </p>
        </PaperPanel>
      </div>
    </div>
  );
}
