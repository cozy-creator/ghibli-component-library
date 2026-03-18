import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@ghibli/ui";

const meta = {
  title: "Components/Display/Badge"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="cloud">cloud</Badge>
      <Badge tone="meadow">meadow</Badge>
      <Badge tone="river">river</Badge>
      <Badge tone="lantern">lantern</Badge>
      <Badge variant="outline">outline</Badge>
      <Badge variant="stamp">stamp</Badge>
    </div>
  )
};
