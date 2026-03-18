import { Link, Navigate, useParams } from "react-router-dom";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@ghibli/ui";

import { CodeBlock } from "@/apps/web/src/components/docs/code-block";
import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import { guideIndex, guides } from "@/apps/web/src/data/library-docs";

export function GuideDetailPage() {
  const { slug } = useParams();

  if (!slug) {
    return <Navigate replace to="/guides/getting-started" />;
  }

  const guide = guideIndex.get(slug);

  if (!guide) {
    return <Navigate replace to="/guides/getting-started" />;
  }

  return (
    <div className="docs-stack">
      <PageIntro
        badge="Guide"
        description={guide.description}
        title={guide.title}
        trailing={
          <Button asChild variant="secondary">
            <a href="#guide-sections">Jump to steps</a>
          </Button>
        }
      />
      <div className="directory-grid">
        {guide.sections.map((section, index) => (
          <Card id={index === 0 ? "guide-sections" : undefined} key={section.title}>
            <CardHeader className="gap-3">
              <div className="flex items-center gap-3">
                <Badge tone="river" variant="soft">{`${index + 1}`.padStart(2, "0")}</Badge>
                <CardTitle>{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="ghibli-prose">{section.text}</p>
              {section.items?.length ? (
                <ul className="grid gap-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                  {section.items.map((item) => (
                    <li className="rounded-[calc(var(--radius)-0.25rem)] border border-[color:var(--border)] bg-white/35 px-3 py-2" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.snippet ? <CodeBlock snippet={section.snippet} /> : null}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>More guides</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {guides
            .filter((entry) => entry.slug !== guide.slug)
            .map((entry) => (
              <Button asChild key={entry.slug} size="sm" variant="ghost">
                <Link to={`/guides/${entry.slug}`}>{entry.title}</Link>
              </Button>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
