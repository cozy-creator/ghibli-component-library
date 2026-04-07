import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, NoticeBanner } from "@ghibli/ui";

const meta = {
  title: "Patterns/Feedback/Notice Banner"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <NoticeBanner
      action={<Button size="sm" variant="secondary">Read update</Button>}
      description="Ship style first, then install only the items you actually need."
      title="Registry-first adoption keeps the copied source predictable."
      tone="meadow"
    />
  )
};
