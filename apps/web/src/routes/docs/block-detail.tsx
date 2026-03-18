import { Navigate, useParams } from "react-router-dom";

import { PaperPanel } from "@ghibli/ui";

import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import { blockCatalog, blockIndex } from "@/apps/web/src/data/catalog";

export function BlockDetailPage() {
  const { name } = useParams();

  if (!name) {
    return <Navigate replace to="/docs/blocks/hero-paper" />;
  }

  const block = blockIndex.get(name);

  if (!block) {
    return <Navigate replace to="/docs/blocks/hero-paper" />;
  }

  return (
    <div className="grid gap-8">
      <PageIntro badge="Block" description={block.description} title={block.title} />
      <PaperPanel className="grid gap-4 p-6">
        <h2 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
          Preview
        </h2>
        <div className="grid gap-4">{block.preview}</div>
      </PaperPanel>
      <div className="paper-grid" data-columns="2">
        <PaperPanel className="grid gap-3 p-6">
          <h2 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
            Install
          </h2>
          <pre className="overflow-x-auto rounded-[calc(var(--radius)+0.25rem)] border border-[color:var(--border)] bg-[color:var(--paper)] p-4 text-xs text-[color:var(--ink-strong)]">
            {block.install}
          </pre>
        </PaperPanel>
        <PaperPanel className="grid gap-3 p-6" tone="twilight">
          <h2 className="font-[var(--font-heading)] text-3xl">Catalog</h2>
          <p className="text-sm leading-7">
            Ghibli UI currently exposes {blockCatalog.length} installable signature blocks for more opinionated layouts.
          </p>
        </PaperPanel>
      </div>
    </div>
  );
}
