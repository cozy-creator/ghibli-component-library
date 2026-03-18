import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@ghibli/ui";

const meta = {
  title: "Components/Overlay/Sheet"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Mobile navigation</SheetTitle>
        </SheetHeader>
        <div className="grid gap-2 text-sm">
          <div>Feed</div>
          <div>Generate</div>
          <div>Account</div>
        </div>
      </SheetContent>
    </Sheet>
  )
};
