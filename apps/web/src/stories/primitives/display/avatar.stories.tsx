import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarGroup } from "@ghibli/ui";

const meta = {
  title: "Components/Display/Avatar"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>MS</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>GI</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarFallback>AA</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>BB</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>CC</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </div>
  )
};
