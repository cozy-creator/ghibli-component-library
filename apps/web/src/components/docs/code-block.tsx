import { Card, CardContent, CardHeader, CardTitle } from "@ghibli/ui";

import type { SourceSnippet } from "@/apps/web/src/data/library-docs";

export interface CodeBlockProps {
  snippet: SourceSnippet;
}

export function CodeBlock({ snippet }: CodeBlockProps) {
  return (
    <Card className="relative overflow-hidden border-[color:var(--theme-docs-code-border)] [background:var(--theme-docs-code-background)] text-[color:var(--theme-docs-code-foreground)]">
      <div className="pointer-events-none absolute inset-0 paper-overlay opacity-[0.05]" />
      <CardHeader className="relative border-b border-[color:var(--theme-docs-code-header-border)] bg-[color:var(--theme-docs-code-header-background)]">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl text-[color:var(--theme-docs-code-foreground)]">
            {snippet.title}
          </CardTitle>
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--theme-docs-code-button-foreground)]">
            {snippet.language}
          </span>
        </div>
      </CardHeader>
      <CardContent className="relative p-0">
        <pre className="overflow-x-auto px-4 py-4 text-sm leading-7 text-[color:var(--theme-docs-code-foreground)] [text-shadow:var(--theme-docs-code-text-shadow)]">
          <code>{snippet.code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
