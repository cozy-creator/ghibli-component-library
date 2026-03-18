import type { Meta, StoryObj } from "@storybook/react-vite";

import { CommunityImageModal, CommunityVideoModal } from "@ghibli/ui";

import { communityImageItems, communityVideoItems } from "@/apps/web/src/data/demo-fixtures";

const meta = {
  title: "Patterns/Community/Community Modals"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageModalOpen: Story = {
  render: () => (
    <CommunityImageModal currentIndex={0} images={communityImageItems} onOpenChange={() => undefined} open />
  )
};

export const VideoModalOpen: Story = {
  render: () => (
    <CommunityVideoModal currentIndex={0} onOpenChange={() => undefined} open videos={communityVideoItems} />
  )
};
