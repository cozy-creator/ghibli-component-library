import { Card, CardContent, CardHeader, CardTitle } from "@ghibli/ui";

import type { SourceSnippet } from "@/apps/web/src/data/library-docs";

export interface CodeBlockProps {
  snippet: SourceSnippet;
}

export function CodeBlock({ snippet }: CodeBlockProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-[color:var(--border)] bg-white/30">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl">{snippet.title}</CardTitle>
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
            {snippet.language}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <pre className="overflow-x-auto bg-[color:var(--paper-soft)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-strong)]">
          <code>{snippet.code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
