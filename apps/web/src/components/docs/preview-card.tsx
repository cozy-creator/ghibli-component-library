import type * as React from "react";

import { Card, CardContent, CardHeader, CardTitle, cn } from "@ghibli/ui";

export interface PreviewCardProps {
  children: React.ReactNode;
  description?: string;
  title: string;
}

export function PreviewCard({
  children,
  description,
  title
}: PreviewCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="gap-2">
        <CardTitle>{title}</CardTitle>
        {description ? (
          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent
        className={cn(
          "flex-1 rounded-b-[inherit] border-t border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--paper)_78%,white)] pt-6"
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
