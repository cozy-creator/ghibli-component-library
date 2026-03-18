import { Link, Navigate, useParams } from "react-router-dom";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@ghibli/ui";

import { CodeBlock } from "@/apps/web/src/components/docs/code-block";
import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import { allDocItemIndex, componentDocs, componentIndex } from "@/apps/web/src/data/library-docs";

export function ComponentDetailPage() {
  const { name } = useParams();

  if (!name) {
    return <Navigate replace to="/components/button" />;
  }

  const component = componentIndex.get(name);

  if (!component) {
    return <Navigate replace to="/components/button" />;
  }

  return (
    <div className="docs-stack">
      <PageIntro
        badge={component.family}
        description={component.description}
        title={component.title}
        trailing={
          <Button asChild variant="secondary">
            <Link to="/components">Back to components</Link>
          </Button>
        }
      />
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="border-t border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--paper)_78%,white)] pt-6">
          {component.preview}
        </CardContent>
      </Card>
      <div className="detail-grid">
        <CodeBlock snippet={component.installSnippet} />
        <CodeBlock snippet={component.importSnippet} />
      </div>
      <CodeBlock snippet={component.usageSnippet} />
      <section className="docs-stack">
        <div className="grid gap-2">
          <h2 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">Examples</h2>
          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
            Every component page includes at least one example so installation and usage stay close together.
          </p>
        </div>
        <div className="paper-grid" data-columns="2">
          {component.examples.map((example) => (
            <Card className="overflow-hidden" key={example.id}>
              <CardHeader>
                <CardTitle>{example.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 border-t border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--paper)_78%,white)] pt-6">
                <div className="rounded-[calc(var(--radius)-0.2rem)] border border-[color:var(--border)] bg-white/35 p-4">
                  {example.preview}
                </div>
                <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{example.description}</p>
                <CodeBlock snippet={example.snippet} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <div className="detail-grid">
        <Card>
          <CardHeader>
            <CardTitle>API Notes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            {component.notes.map((note) => (
              <div className="rounded-[calc(var(--radius)-0.2rem)] border border-[color:var(--border)] bg-white/30 px-3 py-3" key={note}>
                {note}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Related</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {component.related.map((relatedName) => {
              const relatedItem = allDocItemIndex.get(relatedName);

              if (!relatedItem) {
                return null;
              }

              return (
                <Button asChild className="justify-start" key={relatedItem.name} variant="ghost">
                  <Link to={`/${relatedItem.kind === "component" ? "components" : "patterns"}/${relatedItem.name}`}>
                    {relatedItem.title}
                  </Link>
                </Button>
              );
            })}
            <div className="rounded-[calc(var(--radius)-0.2rem)] border border-[color:var(--border)] bg-white/30 px-3 py-3 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              Storybook: {component.storybookTitle}
            </div>
            <div className="text-sm leading-7 text-[color:var(--muted-foreground)]">
              {componentDocs.length} total components are currently documented in this library.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
