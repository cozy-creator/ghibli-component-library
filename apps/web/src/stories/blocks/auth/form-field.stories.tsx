import type { Meta, StoryObj } from "@storybook/react-vite";

import { FormField, Input, Textarea } from "@ghibli/ui";

const meta = {
  title: "Patterns/Auth/Form Field"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-4 md:max-w-xl">
      <FormField description="Short helper copy sits above the field." label="Prompt">
        <Input readOnly value="Lantern alley at dusk with watercolor clouds" />
      </FormField>
      <FormField error="Describe the mood in a little more detail." label="Notes">
        <Textarea readOnly value="Gentle steam, warm lights, soft rain reflections." />
      </FormField>
    </div>
  )
};
