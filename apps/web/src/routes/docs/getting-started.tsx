import { Link } from "react-router-dom";

import { Button, Card, CardContent, CardHeader, CardTitle, PaperPanel } from "@ghibli/ui";

import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import { PreviewCard } from "@/apps/web/src/components/docs/preview-card";
import { componentCatalog } from "@/apps/web/src/data/catalog";

const installSteps = [
  "Add the namespace to components.json.",
  "Run the shadcn CLI against the Ghibli registry.",
  "Use the copied source files like local project code."
];

export function GettingStartedPage() {
  return (
    <div className="grid gap-8">
      <PageIntro
        badge="Getting started"
        description="Ghibli UI follows shadcn’s copy-paste model. Consumers install source code via the registry instead of adding a compiled component package dependency."
        title="Registry-first setup"
      />
      <div className="paper-grid" data-columns="2">
        <Card>
          <CardHeader>
            <CardTitle>Install flow</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="ghibli-prose text-sm">
              <p>
                Add this namespace to <code>components.json</code>:
              </p>
              <pre className="overflow-x-auto rounded-[calc(var(--radius)+0.25rem)] border border-[color:var(--border)] bg-[color:var(--paper)] p-4 text-xs text-[color:var(--ink-strong)]">
                {`{
  "registries": {
    "@ghibli": "https://<your-domain>/r/{name}.json"
  }
}`}
              </pre>
              <p>
                Then install components with <code>pnpm dlx shadcn@latest add @ghibli/button</code>.
              </p>
            </div>
            <div className="grid gap-2">
              {installSteps.map((step, index) => (
                <PaperPanel className="p-4" key={step} tone={index === 1 ? "meadow" : "paper"}>
                  {step}
                </PaperPanel>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Workspace standards</CardTitle>
          </CardHeader>
          <CardContent className="ghibli-prose text-sm">
            <p>
              The docs app, Storybook, and registry all point at the same source files in{" "}
              <code>registry/ghibli</code>.
            </p>
            <p>
              <code>packages/ui</code> is only a thin re-export layer for internal development. It is not the public product.
            </p>
            <p>
              Shared styles stay global and small. Individual component styling lives with the component source.
            </p>
          </CardContent>
        </Card>
      </div>
      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
              Start with the essentials
            </h2>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
              These are the components most projects will copy first.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link to="/docs/themes">Review themes</Link>
          </Button>
        </div>
        <div className="paper-grid" data-columns="3">
          {componentCatalog.slice(0, 6).map((component) => (
            <PreviewCard key={component.name} title={component.title}>
              <div className="grid gap-4">
                {component.preview}
                <pre className="overflow-x-auto rounded-[calc(var(--radius)+0.25rem)] border border-[color:var(--border)] bg-[color:var(--paper)] p-3 text-xs text-[color:var(--ink-strong)]">
                  {component.install}
                </pre>
              </div>
            </PreviewCard>
          ))}
        </div>
      </section>
    </div>
  );
}
