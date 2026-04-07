import type { Meta, StoryObj } from "@storybook/react-vite";

import { PreviewCard } from "@/apps/web/src/components/docs/preview-card";
import { libraryExamples } from "@/apps/web/src/data/library-docs";

const meta = {
  title: "Foundations/Showcase Gallery"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <div className="grid gap-6">
      {libraryExamples.map((example) => (
        <PreviewCard description={example.description} key={example.id} title={example.title}>
          <div className="grid gap-4">{example.preview}</div>
        </PreviewCard>
      ))}
    </div>
  )
};
