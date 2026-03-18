import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ghibli/ui";

const meta = {
  title: "Components/Navigation/Tabs"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <Tabs defaultValue="images">
      <TabsList>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="posts">Posts</TabsTrigger>
      </TabsList>
      <TabsContent value="images">Image feed content</TabsContent>
      <TabsContent value="videos">Video feed content</TabsContent>
      <TabsContent value="posts">Post feed content</TabsContent>
    </Tabs>
  )
};
