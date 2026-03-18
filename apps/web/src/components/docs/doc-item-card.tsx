import { Link } from "react-router-dom";

import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ghibli/ui";

import type { DocItem } from "@/apps/web/src/data/library-docs";

export interface DocItemCardProps {
  item: DocItem;
}

export function DocItemCard({ item }: DocItemCardProps) {
  const href = item.kind === "component" ? `/components/${item.name}` : `/patterns/${item.name}`;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="stamp">{item.family}</Badge>
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
            {item.kind}
          </span>
        </div>
        <div className="grid gap-2">
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.summary}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 border-t border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--paper)_78%,white)] pt-5">
        <div className="grid gap-4">
          <div className="rounded-[calc(var(--radius)-0.2rem)] border border-[color:var(--border)] bg-white/35 p-4">
            {item.preview}
          </div>
          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
            {item.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3 border-t border-[color:var(--border)] bg-white/20">
        <span className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
          {item.storybookTitle}
        </span>
        <Button asChild variant="secondary">
          <Link to={href}>View details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
