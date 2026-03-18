import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  PaperPanel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@ghibli/ui";

const meta = {
  title: "Ghibli/Interactive"
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-6">
      <Tabs defaultValue="tabs">
        <TabsList>
          <TabsTrigger value="tabs">Tabs</TabsTrigger>
          <TabsTrigger value="scroll">Scroll area</TabsTrigger>
        </TabsList>
        <TabsContent value="tabs">Themed tab content area.</TabsContent>
        <TabsContent value="scroll">
          <ScrollArea className="h-40 rounded-[calc(var(--radius)+0.5rem)] border border-[color:var(--border)] p-4">
            <div className="grid gap-3 pr-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <PaperPanel className="p-4" key={index}>
                  Scenic note {index + 1}
                </PaperPanel>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <Separator />
      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog</DialogTitle>
              <DialogDescription>Paper-framed modal content.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent>Contextual scenic content.</PopoverContent>
        </Popover>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet</SheetTitle>
              <SheetDescription>Slide-in paper panel.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <Button>Save</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
};

