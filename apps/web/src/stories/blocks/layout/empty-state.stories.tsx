import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, EmptyState } from "@ghibli/ui";

const meta = {
  title: "Patterns/Layout/Empty State"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <EmptyState
      action={<Button>Create first project</Button>}
      description="Use this for blank feeds, empty job histories, or missing settings pages."
      title="Nothing here yet"
    />
  )
};
