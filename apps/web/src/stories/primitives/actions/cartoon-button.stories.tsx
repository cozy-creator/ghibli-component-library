import type { Meta, StoryObj } from "@storybook/react-vite";

import { CartoonButton } from "@ghibli/ui";

const meta = {
  title: "Components/Actions/Cartoon Button"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <CartoonButton color="var(--primary-edge)" text="Generate scene" />
      <CartoonButton color="#7f5b9f" text="Save draft" />
      <CartoonButton color="#9b5a3c" text="Publish set" />
    </div>
  )
};
