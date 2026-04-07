import type { Meta, StoryObj } from "@storybook/react-vite";

import { CartoonButton, FloatingAction } from "@ghibli/ui";

const meta = {
  title: "Patterns/Feedback/Floating Action"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="relative min-h-56 overflow-hidden rounded-[1.5rem] border-2 border-[color:var(--border)] bg-[color:rgba(255,255,255,0.52)] px-5 pt-5">
      <p className="max-w-[34ch] text-sm leading-7 text-[color:var(--muted-foreground)]">
        Keep the main action reachable while the user scans content or compares outputs.
      </p>
      <FloatingAction className="bottom-0" position="sticky">
        <CartoonButton text="Generate 4 frames" />
      </FloatingAction>
    </div>
  )
};
