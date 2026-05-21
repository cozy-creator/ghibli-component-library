import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabsContent, TabsSwitch } from "@ghibli/ui";

const meta = {
  title: "Components/Navigation/Tabs Switch",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <Tabs defaultValue="updates">
      <TabsSwitch
        tabs={[
          { label: "Updates", value: "updates" },
          { label: "Media", value: "media" },
          { label: "Social", value: "social" },
        ]}
      />
      <TabsContent value="updates">Updates content</TabsContent>
      <TabsContent value="media">Media content</TabsContent>
      <TabsContent value="social">Social content</TabsContent>
    </Tabs>
  ),
};
