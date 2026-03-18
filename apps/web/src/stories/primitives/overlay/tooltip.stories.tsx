import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ghibli/ui";

const meta = {
  title: "Components/Overlay/Tooltip"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Quiet guidance for dense control rows.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
};
