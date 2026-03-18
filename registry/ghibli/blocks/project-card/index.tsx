import * as React from "react";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "../../ui/card";
import { StampBadge } from "../../ui/stamp-badge";

export interface ProjectCardProps {
  description: string;
  slug: string;
  status?: string;
  tags?: string[];
  title: string;
}

export function ProjectCard({
  description,
  slug,
  status = "main",
  tags = [],
  title
}: ProjectCardProps) {
  return (
    <Card className="max-w-2xl">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="grid gap-2">
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-[color:var(--muted-foreground)]">{slug}</p>
          </div>
          <StampBadge tone="meadow">{status}</StampBadge>
        </div>
        <p className="max-w-[58ch] text-sm leading-7 text-[color:var(--muted-foreground)]">
          {description}
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="soft">
            {tag}
          </Badge>
        ))}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3">
        <Button variant="secondary">Details</Button>
        <Button variant="outline">Campaigns</Button>
        <Button variant="lantern">Delete</Button>
      </CardFooter>
    </Card>
  );
}
