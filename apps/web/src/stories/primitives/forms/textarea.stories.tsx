import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "@ghibli/ui";

const meta = {
  title: "Components/Forms/Textarea"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <Textarea defaultValue="Warm morning light in a paper-walled room, watercolor sky outside the window." />
  )
};
