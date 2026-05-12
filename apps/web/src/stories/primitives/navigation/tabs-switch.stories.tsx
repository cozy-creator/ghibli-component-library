import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabsContent, TabsSwitch } from "@ghibli/ui";

const meta = {
  title: "Components/Navigation/Tabs Switch",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <Tabs defaultValue="live-feed">
      <TabsSwitch
        tabs={[
          { label: "Live Feed", value: "live-feed" },
          { label: "Video", value: "video" },
          { label: "X Posts", value: "x-posts" },
        ]}
      />
      <TabsContent value="live-feed">Live Feed content</TabsContent>
      <TabsContent value="video">Video content</TabsContent>
      <TabsContent value="x-posts">X Posts content</TabsContent>
    </Tabs>
  ),
};
