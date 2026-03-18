import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "@ghibli/ui";

const meta = {
  title: "Components/Forms/Input"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => <Input defaultValue="melina@ghibli-ui.dev" />
};

export const States: Story = {
  render: () => (
    <div className="grid gap-3">
      <Input placeholder="Enabled" />
      <Input disabled placeholder="Disabled" />
    </div>
  )
};
