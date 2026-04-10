import type { Meta, StoryObj } from "@storybook/react-vite";

import { GenerateEditorBar } from "@ghibli/ui";

import { aspectRatioOptions, modeOptions, modelOptions, sampleAttachments } from "@/apps/web/src/data/demo-fixtures";

const meta = {
  title: "Patterns/Generate/Generate Editor Bar"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-6">
      <GenerateEditorBar
        aspectRatio="3:4"
        aspectRatioOptions={aspectRatioOptions}
        attachments={sampleAttachments}
        defaultExpanded
        estimateLabel="~18s / image"
        mode="image"
        modeOptions={modeOptions}
        model="riverlight-v3"
        modelOptions={modelOptions}
        negativePrompt=""
        numImages={2}
        prompt="A quiet ferry deck at dusk, watercolor sea reflections, paper lantern glow."
      />
    </div>
  )
};
