import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, HandDrawnFrame, HandDrawnRule } from "@ghibli/ui";

const meta = {
  title: "Components/Display/Hand Drawn Frame",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
      <HandDrawnFrame
        contentClassName="p-5"
        surfaceClassName="bg-white/55"
        strokeWidth={1.6}
        crookednessIntensity={0.5}
      >
        <div className="grid gap-2">
          <Badge variant="stamp">Surface</Badge>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            <code>surfaceClassName</code> handles the paper fill and <code>contentClassName</code> holds spacing.
          </p>
        </div>
      </HandDrawnFrame>
      <div className="grid gap-3">
        <Badge variant="stamp">Divider Rule</Badge>
        <HandDrawnRule
          crookednessIntensity={0.5}
          strokeWidth={1.1}
        />
      </div>
    </div>
  ),
};
