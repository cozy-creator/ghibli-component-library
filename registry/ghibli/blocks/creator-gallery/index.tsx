import * as React from "react";

import { Badge } from "../../ui/badge";
import { PosterFrame } from "../../ui/poster-frame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { cn } from "../../lib/utils";

export interface CreatorGalleryItem {
  id: string;
  title: string;
  description: string;
  media?: React.ReactNode;
  meta?: string;
}

export interface CreatorGallerySection {
  id: string;
  label: string;
  items: CreatorGalleryItem[];
}

export interface CreatorGalleryProps {
  description?: string;
  heading: string;
  sections: CreatorGallerySection[];
}

export function CreatorGallery({
  description,
  heading,
  sections
}: CreatorGalleryProps) {
  const firstSection = sections[0]?.id;

  if (!firstSection) {
    return null;
  }

  return (
    <Tabs className="grid gap-6" defaultValue={firstSection}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3">
          <Badge variant="stamp">Creator Gallery</Badge>
          <div className="grid gap-2">
            <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
              {heading}
            </h2>
            {description ? (
              <p className="max-w-[60ch] text-sm leading-7 text-[color:var(--muted-foreground)]">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <TabsList className="w-full justify-start lg:w-auto">
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {sections.map((section) => (
        <TabsContent key={section.id} value={section.id}>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {section.items.map((item, index) => (
              <article
                className={cn(
                  "grid gap-3",
                  index === 0 && section.items.length > 2 && "xl:col-span-2 xl:grid-cols-[1.15fr_0.85fr]"
                )}
                key={item.id}
              >
                <PosterFrame caption={item.meta}>
                  <div className="aspect-[4/5] bg-[color:var(--background)]">{item.media}</div>
                </PosterFrame>
                <div className="grid content-start gap-2 px-2">
                  <h3 className="font-[var(--font-heading)] text-2xl text-[color:var(--ink-strong)]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
