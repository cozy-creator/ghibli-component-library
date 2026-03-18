import { Link, Navigate, useParams } from "react-router-dom";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@ghibli/ui";

import { CodeBlock } from "@/apps/web/src/components/docs/code-block";
import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import { allDocItemIndex, patternDocs, patternIndex } from "@/apps/web/src/data/library-docs";

export function BlockDetailPage() {
  const { name } = useParams();

  if (!name) {
    return <Navigate replace to="/patterns/auth-forms" />;
  }

  const block = patternIndex.get(name);

  if (!block) {
    return <Navigate replace to="/patterns/auth-forms" />;
  }

  return (
    <div className="docs-stack">
      <PageIntro
        badge={block.family}
        description={block.description}
        title={block.title}
        trailing={
          <Button asChild variant="secondary">
            <Link to="/patterns">Back to patterns</Link>
          </Button>
        }
      />
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 border-t border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--paper)_78%,white)] pt-6">
          {block.preview}
        </CardContent>
      </Card>
      <div className="detail-grid">
        <CodeBlock snippet={block.installSnippet} />
        <CodeBlock snippet={block.importSnippet} />
      </div>
      <CodeBlock snippet={block.usageSnippet} />
      <div className="detail-grid">
        <Card>
          <CardHeader>
            <CardTitle>Exports</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            {block.exports?.map((entry) => (
              <div className="rounded-[calc(var(--radius)-0.2rem)] border border-[color:var(--border)] bg-white/30 px-3 py-3" key={entry}>
                {entry}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Included pieces</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            {block.inventory?.map((entry) => (
              <div className="rounded-[calc(var(--radius)-0.2rem)] border border-[color:var(--border)] bg-white/30 px-3 py-3" key={entry}>
                {entry}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <section className="docs-stack">
        <div className="grid gap-2">
          <h2 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">Examples</h2>
          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
            Patterns are documented as reusable grouped blocks with composition guidance and concrete examples.
          </p>
        </div>
        <div className="paper-grid" data-columns="2">
          {block.examples.map((example) => (
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
            <CardTitle>Composition Notes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            {block.notes.map((note) => (
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
            {block.related.map((relatedName) => {
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
              Storybook: {block.storybookTitle}
            </div>
            <div className="text-sm leading-7 text-[color:var(--muted-foreground)]">
              {patternDocs.length} total patterns are currently documented in this library.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
