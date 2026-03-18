import { Card, CardContent, CardHeader, CardTitle } from "@ghibli/ui";

import { CodeBlock } from "@/apps/web/src/components/docs/code-block";
import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import { PreviewCard } from "@/apps/web/src/components/docs/preview-card";
import { libraryExamples } from "@/apps/web/src/data/library-docs";

export function ExamplesPage() {
  return (
    <div className="docs-stack">
      <PageIntro
        badge="Examples"
        description="Small, reusable compositions that demonstrate how the library fits together without crossing into full product templates."
        title="Generic examples built from the same installable source"
      />
      <div className="paper-grid" data-columns="2">
        {libraryExamples.map((example) => (
          <PreviewCard description={example.description} key={example.id} title={example.title}>
            <div className="grid gap-5">
              {example.preview}
              <CodeBlock snippet={example.snippet} />
            </div>
          </PreviewCard>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>How to use the examples</CardTitle>
        </CardHeader>
        <CardContent className="ghibli-prose">
          Start from the closest example, then swap in the exact components or patterns you want from the detail pages. The examples exist to show composition and spacing rhythm, not to prescribe application templates.
        </CardContent>
      </Card>
    </div>
  );
}
