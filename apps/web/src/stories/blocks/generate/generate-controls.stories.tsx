import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  GenerateAspectRatioSelect,
  GenerateButton,
  GenerateModeToggle,
  GenerateModelSelect
} from "@ghibli/ui";

import {
  aspectRatioOptions,
  generateModelItems,
  generateModelsByBase,
  modeOptions
} from "@/apps/web/src/data/demo-fixtures";

const meta = {
  title: "Patterns/Generate/Generate Controls"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <GenerateModeToggle options={modeOptions} value="image" />
      <GenerateModelSelect
        model="flux-dev"
        modelsByBase={generateModelsByBase}
        selectedModel={generateModelItems[0]}
      />
      <GenerateAspectRatioSelect options={aspectRatioOptions} value="9/16" />
      <GenerateButton isAuthenticated />
    </div>
  )
};
