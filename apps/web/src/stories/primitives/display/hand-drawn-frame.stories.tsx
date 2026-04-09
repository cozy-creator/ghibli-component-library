import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, HandDrawnFrame } from "@ghibli/ui";

const meta = {
  title: "Components/Display/Hand Drawn Frame"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <HandDrawnFrame className="bg-white/55 p-5" shape="organic" strokeWidth={2.4} variant={0.7}>
        <div className="grid gap-2">
          <Badge variant="stamp">Organic</Badge>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            <code>shape="organic" variant=&#123;0.7&#125;</code>
          </p>
        </div>
      </HandDrawnFrame>
      <HandDrawnFrame className="bg-[color:rgba(255,255,255,0.55)] p-5" shape="steady" strokeWidth={1.4} variant={0.45} variation={1}>
        <div className="grid gap-2">
          <Badge variant="stamp">Steady</Badge>
          <p className="text-sm text-[color:var(--muted-foreground)]"><code>variation=&#123;1&#125;</code> keeps the same shape with a new wobble.</p>
        </div>
      </HandDrawnFrame>
      <HandDrawnFrame className="bg-[color:var(--paper)] px-4 py-3" shape="pill" strokeWidth={1.35} variant={0.9}>
        <div className="text-sm font-medium text-[color:var(--ink-strong)]">Pill navigation</div>
      </HandDrawnFrame>
      <HandDrawnFrame className="bg-[color:rgba(255,255,255,0.55)] p-5" shape="panel" strokeWidth={1.6} variant={0.5}>
        <div className="text-sm text-[color:var(--ink-strong)]">Panel framing for grouped UI.</div>
      </HandDrawnFrame>
      <HandDrawnFrame className="bg-[color:rgba(255,255,255,0.58)] p-5" shape="surface" strokeWidth={1.4} variant={0.35}>
        <div className="text-sm text-[color:var(--ink-strong)]">Surface framing for quieter blocks.</div>
      </HandDrawnFrame>
      <HandDrawnFrame className="overflow-hidden bg-[linear-gradient(180deg,rgba(249,243,226,0.98),rgba(239,227,193,0.98))]" clipContent shape="card" strokeWidth={1.55} variant={0.6} variation={1}>
        <div className="aspect-[4/5] bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(63,43,19,0.18))]" />
      </HandDrawnFrame>
      <HandDrawnFrame className="bg-[color:var(--paper)] p-5" shape="banner" strokeWidth={1.25} variant={0.3}>
        <div className="text-sm text-[color:var(--ink-strong)]">Banner framing for inputs and toolbars.</div>
      </HandDrawnFrame>
    </div>
  )
};
