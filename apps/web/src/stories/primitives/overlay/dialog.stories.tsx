import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@ghibli/ui";

const meta = {
  title: "Components/Overlay/Dialog"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>Paper-framed dialog content with a single scenic theme.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};
