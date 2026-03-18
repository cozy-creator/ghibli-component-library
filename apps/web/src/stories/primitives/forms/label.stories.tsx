import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input, Label } from "@ghibli/ui";

const meta = {
  title: "Components/Forms/Label"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="label-story">Prompt title</Label>
      <Input id="label-story" placeholder="Breakfast study" />
    </div>
  )
};
