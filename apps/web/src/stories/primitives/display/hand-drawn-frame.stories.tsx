import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, HandDrawnFrame } from "@ghibli/ui";

const meta = {
  title: "Components/Display/Hand Drawn Frame"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <HandDrawnFrame className="bg-white/55 p-5" variant="card">
        <div className="grid gap-2">
          <Badge variant="stamp">Card</Badge>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Use irregular framing around previews, callouts, and scenic surfaces.
          </p>
        </div>
      </HandDrawnFrame>
      <div className="grid gap-4">
        <HandDrawnFrame className="bg-[color:var(--paper)] px-4 py-2" variant="pill">
          <div className="text-sm font-medium text-[color:var(--ink-strong)]">Pill navigation</div>
        </HandDrawnFrame>
        <HandDrawnFrame className="bg-[color:rgba(255,255,255,0.55)] p-5" variant="panel">
          <div className="text-sm text-[color:var(--ink-strong)]">Panel framing for grouped UI.</div>
        </HandDrawnFrame>
      </div>
    </div>
  )
};
