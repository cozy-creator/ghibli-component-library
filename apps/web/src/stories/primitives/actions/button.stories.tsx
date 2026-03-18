import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@ghibli/ui";

const meta = {
  title: "Components/Actions/Button"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Generate</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">+</Button>
    </div>
  )
};
