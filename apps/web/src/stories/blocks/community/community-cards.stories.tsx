import type { Meta, StoryObj } from "@storybook/react-vite";

import { CommunityImageCard, CommunityTabsList, CommunityVideoCard, Tabs } from "@ghibli/ui";

import { communityImageItems, communityVideoItems } from "@/apps/web/src/data/demo-fixtures";

const meta = {
  title: "Patterns/Community/Cards"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-6">
      <Tabs value="live-feed">
        <CommunityTabsList activeTab="live-feed" />
      </Tabs>
      <div className="grid gap-4 md:grid-cols-2">
        {communityImageItems.slice(0, 2).map((item) => (
          <CommunityImageCard imageUrl={item.imageUrl} key={item.id} meta={item.meta} title={item.title} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {communityVideoItems.slice(0, 2).map((item) => (
          <CommunityVideoCard
            key={item.id}
            posterUrl={item.posterUrl ?? ""}
            title={item.title}
            videoUrl={item.videoUrl}
          />
        ))}
      </div>
    </div>
  )
};
