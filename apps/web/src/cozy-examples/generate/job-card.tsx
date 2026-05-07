import * as React from "react";
import { Clock3, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface GenerateJobOutput {
  id: string;
  imageAlt?: string;
  imageUrl: string;
}

export interface GenerateJobCardProps {
  outputs?: GenerateJobOutput[] | undefined;
  primaryAction?: React.ReactNode | undefined;
  progress?: number | undefined;
  prompt: string;
  secondaryAction?: React.ReactNode | undefined;
  status: "done" | "failed" | "processing" | "queued";
  subtitle?: string | undefined;
  title?: string | undefined;
}

const statusTone = {
  done: "meadow",
  failed: "rose",
  processing: "river",
  queued: "cloud"
} as const;

export function GenerateJobCard({
  outputs = [],
  primaryAction,
  progress,
  prompt,
  secondaryAction,
  status,
  subtitle,
  title = "Generation"
}: GenerateJobCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="grid gap-2">
            <Badge tone={statusTone[status]} variant="soft">
              {status}
            </Badge>
            <CardTitle>{title}</CardTitle>
            {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
          </div>
          {status === "processing" || status === "queued" ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--paper-soft)] px-3 py-2 text-xs text-[color:var(--muted-foreground)]">
              <Clock3 className="size-4" />
              {progress ? `${progress}% complete` : "In progress"}
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-[calc(var(--radius)-0.25rem)] border border-[color:var(--border)] bg-[color:var(--paper-soft)] px-4 py-3 text-sm leading-7 text-[color:var(--foreground)]">
          {prompt}
        </div>
        {progress !== undefined && status !== "done" ? (
          <div className="grid gap-2">
            <div className="h-3 overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:var(--paper)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--river-border))]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
        {outputs.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {outputs.map((output) => (
              <div
                className="overflow-hidden rounded-[calc(var(--radius)-0.25rem)] border border-[color:var(--border)] bg-[color:var(--paper-soft)]"
                key={output.id}
              >
                <img alt={output.imageAlt ?? ""} className="aspect-square w-full object-cover" src={output.imageUrl} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-[calc(var(--radius)-0.25rem)] border border-dashed border-[color:var(--border)] bg-[color:var(--paper-soft)] px-4 py-5 text-sm text-[color:var(--muted-foreground)]">
            <Sparkles className="size-4" />
            Outputs will appear here when the generation finishes.
          </div>
        )}
      </CardContent>
      {(primaryAction || secondaryAction) ? (
        <CardFooter className="gap-2">
          {primaryAction ?? <Button>View output</Button>}
          {secondaryAction}
        </CardFooter>
      ) : null}
    </Card>
  );
}
