import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ghibli/ui";

import { SceneArt } from "@/apps/web/src/components/docs/scene-art";

const meta = {
  title: "Foundations/Style"
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Paper-and-ink foundation</CardTitle>
          <CardDescription>
            One core theme drives all components, grouped patterns, and example compositions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-3">
            <div className="rounded-full border border-[color:var(--border)] bg-[color:var(--paper)] px-4 py-2 text-sm">
              `--background`, `--paper`, `--primary`, `--meadow-surface`
            </div>
            <div className="h-16 rounded-[calc(var(--radius)-0.3rem)] bg-[color:var(--paper)]" />
            <div className="h-16 rounded-[calc(var(--radius)-0.3rem)] bg-[color:var(--meadow-surface)]" />
            <div className="h-16 rounded-[calc(var(--radius)-0.3rem)] bg-[color:var(--river-surface)]" />
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-[calc(var(--radius)-0.2rem)] border border-[color:var(--border)]">
            <SceneArt variant="meadow" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
};
