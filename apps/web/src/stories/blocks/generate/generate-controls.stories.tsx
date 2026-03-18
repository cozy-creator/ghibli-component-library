import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  GenerateAspectRatioSelect,
  GenerateModeToggle,
  GenerateModelSelect,
  GenerateNegativePromptMenu,
  GenerateNumImagesControl,
  GenerateUploadDialog
} from "@ghibli/ui";

import { aspectRatioOptions, modeOptions, modelOptions, sampleAttachments } from "@/apps/web/src/data/demo-fixtures";

const meta = {
  title: "Patterns/Generate/Generate Controls"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <GenerateModeToggle options={modeOptions} value="image" />
      <GenerateModelSelect options={modelOptions} value="riverlight-v3" />
      <GenerateAspectRatioSelect options={aspectRatioOptions} value="3:4" />
      <GenerateNumImagesControl value={2} />
      <GenerateNegativePromptMenu value="" />
      <GenerateUploadDialog attachments={sampleAttachments} open />
    </div>
  )
};
