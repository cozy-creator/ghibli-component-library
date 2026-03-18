import { useDeferredValue, useState } from "react";

import { Button, Input } from "@ghibli/ui";

import { DocItemCard } from "@/apps/web/src/components/docs/doc-item-card";
import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import type { DocItem } from "@/apps/web/src/data/library-docs";

export interface ItemDirectoryProps {
  description: string;
  emptyMessage: string;
  families: string[];
  items: DocItem[];
  title: string;
}

export function ItemDirectory({
  description,
  emptyMessage,
  families,
  items,
  title
}: ItemDirectoryProps) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<string>("All");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    const matchesFamily = family === "All" || item.family === family;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.summary.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery);

    return matchesFamily && matchesQuery;
  });

  return (
    <div className="docs-stack">
      <PageIntro
        badge={`${items.length} items`}
        description={description}
        title={title}
      />
      <section className="docs-surface docs-stack">
        <div className="directory-toolbar">
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]" htmlFor={`${title}-search`}>
              Search
            </label>
            <Input
              id={`${title}-search`}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              value={query}
            />
          </div>
          <div className="grid gap-2">
            <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              Family
            </span>
            <div className="flex flex-wrap gap-2">
              {["All", ...families].map((familyOption) => (
                <Button
                  key={familyOption}
                  onClick={() => setFamily(familyOption)}
                  size="sm"
                  variant={familyOption === family ? "secondary" : "ghost"}
                >
                  {familyOption}
                </Button>
              ))}
            </div>
          </div>
        </div>
        {filteredItems.length ? (
          <div className="directory-grid">
            {filteredItems.map((item) => (
              <DocItemCard item={item} key={item.name} />
            ))}
          </div>
        ) : (
          <div className="rounded-[calc(var(--radius)-0.2rem)] border border-dashed border-[color:var(--border)] bg-white/25 px-5 py-10 text-center text-sm leading-7 text-[color:var(--muted-foreground)]">
            {emptyMessage}
          </div>
        )}
      </section>
    </div>
  );
}
