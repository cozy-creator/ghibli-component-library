import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "@ghibli/ui";

const meta = {
  title: "Components/Display/Separator"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-3">
      <span>Top section</span>
      <Separator />
      <span>Bottom section</span>
    </div>
  )
};
