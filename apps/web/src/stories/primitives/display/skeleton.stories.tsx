import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "@ghibli/ui";

const meta = {
  title: "Components/Display/Skeleton"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-3 max-w-md">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
};
