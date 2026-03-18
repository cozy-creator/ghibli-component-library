import type { Meta, StoryObj } from "@storybook/react-vite";

import { DocsFaqAccordion } from "@ghibli/ui";

import { faqItems } from "@/apps/web/src/data/demo-fixtures";

const meta = {
  title: "Patterns/Marketing/Docs FAQ Accordion"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => <DocsFaqAccordion items={faqItems} />
};
