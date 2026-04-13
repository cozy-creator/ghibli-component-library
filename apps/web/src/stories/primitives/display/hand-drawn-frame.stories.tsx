import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, HandDrawnFrame, HandDrawnRule } from "@ghibli/ui";

const meta = {
  title: "Components/Display/Hand Drawn Frame",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <HandDrawnFrame
        className="bg-white/55 p-5"
        deformationIntensity={0.7}
        seed="story-organic"
        shape="organic"
        strokeWidth={2.4}
      >
        <div className="grid gap-2">
          <Badge variant="stamp">Organic</Badge>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            <code>shape="organic" deformationIntensity=&#123;0.7&#125;</code>
          </p>
        </div>
      </HandDrawnFrame>
      <HandDrawnFrame
        className="bg-[color:rgba(255,255,255,0.55)] p-5"
        deformationIntensity={0.45}
        seed="story-steady-alt"
        shape="steady"
        strokeWidth={1.4}
      >
        <div className="grid gap-2">
          <Badge variant="stamp">Steady</Badge>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            <code>seed="story-steady-alt"</code> changes the wobble without
            bringing back the old variation prop.
          </p>
        </div>
      </HandDrawnFrame>
      <HandDrawnFrame
        className="bg-[color:var(--paper)] px-4 py-3"
        deformationIntensity={0.9}
        seed="story-pill"
        shape="pill"
        strokeWidth={1.35}
      >
        <div className="text-sm font-medium text-[color:var(--ink-strong)]">
          Pill navigation
        </div>
      </HandDrawnFrame>
      <HandDrawnFrame
        className="bg-[color:rgba(255,255,255,0.55)] p-5"
        deformationIntensity={0.5}
        seed="story-panel"
        shape="panel"
        strokeWidth={1.6}
      >
        <div className="text-sm text-[color:var(--ink-strong)]">
          Panel framing for grouped UI.
        </div>
      </HandDrawnFrame>
      <HandDrawnFrame
        className="bg-[color:rgba(255,255,255,0.58)] p-5"
        deformationIntensity={0.35}
        seed="story-surface"
        shape="surface"
        strokeWidth={1.4}
        useThicknessVariation={false}
      >
        <div className="text-sm text-[color:var(--ink-strong)]">
          Surface framing with thickness variation disabled.
        </div>
      </HandDrawnFrame>
      <HandDrawnFrame
        className="overflow-hidden bg-[linear-gradient(180deg,rgba(249,243,226,0.98),rgba(239,227,193,0.98))]"
        clipContent
        deformationIntensity={0.6}
        seed="story-card"
        shape="card"
        strokeWidth={1.55}
      >
        <div className="aspect-[4/5] bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(63,43,19,0.18))]" />
      </HandDrawnFrame>
      <HandDrawnFrame
        className="bg-[color:var(--paper)] p-5"
        deformationIntensity={0.3}
        seed="story-banner"
        shape="banner"
        strokeWidth={1.25}
      >
        <div className="text-sm text-[color:var(--ink-strong)]">
          Banner framing for inputs and toolbars.
        </div>
      </HandDrawnFrame>
      <div className="grid gap-3 md:col-span-2 xl:col-span-3">
        <Badge variant="stamp">Divider Rule</Badge>
        <HandDrawnRule
          deformationIntensity={0.5}
          seed="story-divider"
          strokeWidth={1.1}
        />
      </div>
    </div>
  ),
};
