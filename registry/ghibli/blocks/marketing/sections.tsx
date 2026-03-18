import * as React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface MarketingHeroSectionProps {
  badge?: string;
  description: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  title: string;
  visual?: React.ReactNode;
}

export function MarketingHeroSection({
  badge,
  description,
  primaryAction,
  secondaryAction,
  title,
  visual
}: MarketingHeroSectionProps) {
  return (
    <section className="grid gap-6 rounded-[var(--radius)] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.42),rgba(246,232,205,0.86))] p-6 shadow-[var(--shadow-paper)] lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-center">
      <div className="grid gap-5">
        {badge ? <Badge tone="lantern">{badge}</Badge> : null}
        <div className="grid gap-3">
          <h1 className="max-w-[14ch] font-[var(--font-heading)] text-5xl leading-[0.94] text-[color:var(--ink-strong)] md:text-6xl">
            {title}
          </h1>
          <p className="max-w-[60ch] text-base leading-8 text-[color:var(--muted-foreground)]">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {primaryAction}
          {secondaryAction}
        </div>
      </div>
      <div className="overflow-hidden rounded-[calc(var(--radius)-0.1rem)] border border-[color:var(--border-strong)] bg-[color:var(--paper-soft)] shadow-[var(--shadow-soft)]">
        {visual}
      </div>
    </section>
  );
}

export interface MarketingFeatureItem {
  description: string;
  icon?: React.ReactNode;
  id: string;
  title: string;
}

export interface MarketingFeaturesSectionProps {
  heading: string;
  intro: string;
  items: MarketingFeatureItem[];
}

export function MarketingFeaturesSection({
  heading,
  intro,
  items
}: MarketingFeaturesSectionProps) {
  return (
    <section className="grid gap-4">
      <div className="grid gap-2">
        <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
          {heading}
        </h2>
        <p className="max-w-[64ch] text-sm leading-7 text-[color:var(--muted-foreground)]">
          {intro}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="inline-flex size-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--paper-soft)]">
                {item.icon ?? <CheckCircle2 className="size-5" />}
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

export interface MarketingCtaSectionProps {
  action?: React.ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
}

export function MarketingCtaSection({
  action,
  description,
  eyebrow,
  title
}: MarketingCtaSectionProps) {
  return (
    <section className="grid gap-4 rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:rgba(242,234,217,0.92)] p-6 shadow-[var(--shadow-paper)]">
      {eyebrow ? <Badge tone="river">{eyebrow}</Badge> : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="grid gap-2">
          <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
            {title}
          </h2>
          <p className="max-w-[56ch] text-sm leading-7 text-[color:var(--muted-foreground)]">
            {description}
          </p>
        </div>
        {action ?? (
          <Button size="lg">
            Get started
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </section>
  );
}
