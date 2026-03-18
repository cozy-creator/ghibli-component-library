import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  CreatorGallery,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  HeroPaper,
  InkInput,
  Input,
  KitchenSinkPoster,
  LanternButton,
  PaperPanel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PosterFrame,
  ProgressPill,
  ProjectCard,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  StampBadge,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  TravelOverview
} from "@ghibli/ui";

import { SceneArt } from "@/apps/web/src/components/docs/scene-art";

export interface CatalogEntry {
  description: string;
  install: string;
  name: string;
  preview: React.ReactNode;
  title: string;
}

export const componentCatalog: CatalogEntry[] = [
  {
    name: "button",
    title: "Button",
    description: "Soft paper buttons with subtle lift and lantern warmth.",
    install: "pnpm dlx shadcn@latest add @ghibli/button",
    preview: (
      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <LanternButton>Lantern</LanternButton>
      </div>
    )
  },
  {
    name: "input",
    title: "Input",
    description: "Rounded text fields that feel inked onto warm paper.",
    install: "pnpm dlx shadcn@latest add @ghibli/input",
    preview: <Input defaultValue="hello@ghibli.ui" />
  },
  {
    name: "textarea",
    title: "Textarea",
    description: "Long-form entry with the same paper inset treatment as inputs.",
    install: "pnpm dlx shadcn@latest add @ghibli/textarea",
    preview: (
      <Textarea defaultValue="Travel notes, creator descriptions, and editorial copy all work well here." />
    )
  },
  {
    name: "select",
    title: "Select",
    description: "A Radix select themed like a paper dropdown.",
    install: "pnpm dlx shadcn@latest add @ghibli/select",
    preview: (
      <Select defaultValue="forest">
        <SelectTrigger>
          <SelectValue placeholder="Pick a place" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="forest">Enchanted Forest</SelectItem>
          <SelectItem value="coast">Seaside Village</SelectItem>
          <SelectItem value="mountain">Misty Mountains</SelectItem>
        </SelectContent>
      </Select>
    )
  },
  {
    name: "badge",
    title: "Badge",
    description: "Tiny stamped labels for metadata and section cues.",
    install: "pnpm dlx shadcn@latest add @ghibli/badge",
    preview: (
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="soft">Soft</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="stamp">Stamp</Badge>
      </div>
    )
  },
  {
    name: "card",
    title: "Card",
    description: "Layered paper surfaces for grouped content.",
    install: "pnpm dlx shadcn@latest add @ghibli/card",
    preview: (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Paper Card</CardTitle>
          <CardDescription>A foundational surface for layouts.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
            Use it for dashboards, settings, or editorial chunks with a little more warmth than a plain panel.
          </p>
        </CardContent>
      </Card>
    )
  },
  {
    name: "tabs",
    title: "Tabs",
    description: "Rounded tab pills for switching scenic sections.",
    install: "pnpm dlx shadcn@latest add @ghibli/tabs",
    preview: (
      <Tabs className="max-w-xl" defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">Live feed</TabsTrigger>
          <TabsTrigger value="two">Video</TabsTrigger>
          <TabsTrigger value="three">X-posts</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Paper content area for feed previews.</TabsContent>
        <TabsContent value="two">A scenic tab for motion or media.</TabsContent>
        <TabsContent value="three">Social cards styled with softer edges.</TabsContent>
      </Tabs>
    )
  },
  {
    name: "checkbox",
    title: "Checkbox",
    description: "Simple Radix checkbox with paper and moss colors.",
    install: "pnpm dlx shadcn@latest add @ghibli/checkbox",
    preview: (
      <label className="inline-flex items-center gap-3 text-sm">
        <Checkbox defaultChecked />
        Gentle completion state
      </label>
    )
  },
  {
    name: "radio-group",
    title: "Radio Group",
    description: "Paper-like radios for choosing between themes or modes.",
    install: "pnpm dlx shadcn@latest add @ghibli/radio-group",
    preview: (
      <RadioGroup defaultValue="paper">
        <label className="inline-flex items-center gap-3 text-sm">
          <RadioGroupItem value="paper" />
          Paper
        </label>
        <label className="inline-flex items-center gap-3 text-sm">
          <RadioGroupItem value="meadow" />
          Meadow
        </label>
      </RadioGroup>
    )
  },
  {
    name: "switch",
    title: "Switch",
    description: "Compact toggles for preferences and settings.",
    install: "pnpm dlx shadcn@latest add @ghibli/switch",
    preview: (
      <label className="inline-flex items-center gap-3 text-sm">
        <Switch defaultChecked />
        Enable scenic mode
      </label>
    )
  },
  {
    name: "dialog",
    title: "Dialog",
    description: "A Radix dialog in the same paper frame system as the cards.",
    install: "pnpm dlx shadcn@latest add @ghibli/dialog",
    preview: (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paper Dialog</DialogTitle>
            <DialogDescription>
              Use this for forms, confirmations, or richer storytelling overlays.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary">Cancel</Button>
            <LanternButton>Continue</LanternButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
  {
    name: "popover",
    title: "Popover",
    description: "Quick floating panels with the same textured surface treatment.",
    install: "pnpm dlx shadcn@latest add @ghibli/popover",
    preview: (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
            Popovers are useful for filters, tips, or mini editors.
          </p>
        </PopoverContent>
      </Popover>
    )
  },
  {
    name: "sheet",
    title: "Sheet",
    description: "Slide-in dialog surfaces for side panels and mobile menus.",
    install: "pnpm dlx shadcn@latest add @ghibli/sheet",
    preview: (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Paper Sheet</SheetTitle>
            <SheetDescription>
              Great for sidebars, cart drawers, and mobile stacks.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <LanternButton>Save settings</LanternButton>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  },
  {
    name: "separator",
    title: "Separator",
    description: "Fine paper divider lines between sections.",
    install: "pnpm dlx shadcn@latest add @ghibli/separator",
    preview: (
      <div className="grid gap-3">
        <span className="text-sm">Section one</span>
        <Separator />
        <span className="text-sm">Section two</span>
      </div>
    )
  },
  {
    name: "scroll-area",
    title: "Scroll Area",
    description: "Radix scroll areas with themed thumbs and tracks.",
    install: "pnpm dlx shadcn@latest add @ghibli/scroll-area",
    preview: (
      <ScrollArea className="h-48 rounded-[calc(var(--radius)+0.5rem)] border border-[color:var(--border)] p-4">
        <div className="grid gap-3 pr-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <PaperPanel key={index} className="p-4">
              Scenic note {index + 1}
            </PaperPanel>
          ))}
        </div>
      </ScrollArea>
    )
  },
  {
    name: "paper-panel",
    title: "Paper Panel",
    description: "A signature Ghibli surface with tone variants.",
    install: "pnpm dlx shadcn@latest add @ghibli/paper-panel",
    preview: (
      <div className="grid gap-4 md:grid-cols-3">
        <PaperPanel tone="paper">Paper</PaperPanel>
        <PaperPanel tone="meadow">Meadow</PaperPanel>
        <PaperPanel tone="twilight">Twilight</PaperPanel>
      </div>
    )
  },
  {
    name: "poster-frame",
    title: "Poster Frame",
    description: "Framed media slots for scenic images and posters.",
    install: "pnpm dlx shadcn@latest add @ghibli/poster-frame",
    preview: (
      <PosterFrame caption="Scenic demo">
        <div className="aspect-[4/5]">
          <SceneArt variant="gallery" />
        </div>
      </PosterFrame>
    )
  },
  {
    name: "stamp-badge",
    title: "Stamp Badge",
    description: "Circular stamp labels with a playful printed feel.",
    install: "pnpm dlx shadcn@latest add @ghibli/stamp-badge",
    preview: <StampBadge tone="meadow">main branch</StampBadge>
  },
  {
    name: "ink-input",
    title: "Ink Input",
    description: "Labeled input composition for friendlier forms.",
    install: "pnpm dlx shadcn@latest add @ghibli/ink-input",
    preview: <InkInput hint="We only use this for release notes." label="Email address" />
  },
  {
    name: "lantern-button",
    title: "Lantern Button",
    description: "A warmer, highlighted CTA with an amber glow.",
    install: "pnpm dlx shadcn@latest add @ghibli/lantern-button",
    preview: <LanternButton>Join waitlist</LanternButton>
  },
  {
    name: "progress-pill",
    title: "Progress Pill",
    description: "Soft progress bars for status and reading flows.",
    install: "pnpm dlx shadcn@latest add @ghibli/progress-pill",
    preview: <ProgressPill value={72} />
  }
];

export const blockCatalog: CatalogEntry[] = [
  {
    name: "hero-paper",
    title: "Hero Paper",
    description: "A scenic hero block with actions and framed media.",
    install: "pnpm dlx shadcn@latest add @ghibli/hero-paper",
    preview: (
      <HeroPaper
        description="Use it for landing pages, dashboards, and editorial introductions."
        eyebrow="Registry-first"
        media={<SceneArt variant="meadow" />}
        primaryAction={<LanternButton>Primary action</LanternButton>}
        secondaryAction={<Button variant="secondary">Secondary</Button>}
        title="Soft interface blocks with painted atmosphere"
      />
    )
  },
  {
    name: "creator-gallery",
    title: "Creator Gallery",
    description: "Tabbed poster layouts inspired by illustrated creator boards.",
    install: "pnpm dlx shadcn@latest add @ghibli/creator-gallery",
    preview: (
      <CreatorGallery
        description="A gallery block for feeds, creator profiles, or generative art showcases."
        heading="Curated scenic collections"
        sections={[
          {
            id: "collection",
            label: "Collection",
            items: [
              {
                id: "1",
                title: "Field Notes",
                description: "Poster-like cards with room for captions and metadata.",
                media: <SceneArt variant="gallery" />,
                meta: "May 2026"
              },
              {
                id: "2",
                title: "Warm Studio",
                description: "Use them for dashboards, portfolios, or themed grids.",
                media: <SceneArt variant="studio" />,
                meta: "April 2026"
              },
              {
                id: "3",
                title: "Forest Light",
                description: "Built from the same primitives as the rest of the system.",
                media: <SceneArt variant="forest" />,
                meta: "March 2026"
              }
            ]
          }
        ]}
      />
    )
  },
  {
    name: "travel-overview",
    title: "Travel Overview",
    description: "A composed dashboard block for scenic app layouts.",
    install: "pnpm dlx shadcn@latest add @ghibli/travel-overview",
    preview: (
      <TravelOverview
        destinations={[
          {
            id: "a",
            title: "Enchanted Forest",
            subtitle: "Quiet trails",
            media: <SceneArt variant="forest" />
          },
          {
            id: "b",
            title: "Seaside Village",
            subtitle: "Salt breeze",
            media: <SceneArt variant="coast" />
          },
          {
            id: "c",
            title: "Misty Mountains",
            subtitle: "Morning clouds",
            media: <SceneArt variant="mountain" />
          }
        ]}
        journalEntries={[
          {
            id: "j1",
            title: "Tea by the window",
            date: "April 8",
            media: <SceneArt variant="studio" />
          },
          {
            id: "j2",
            title: "Mountain adventure",
            date: "March 21",
            media: <SceneArt variant="mountain" />
          }
        ]}
        trip={{
          title: "Lakeview Onsen",
          dates: "May 12 – May 15",
          summary: "A broad highlight card for dates, details, and a scenic hero image.",
          media: <SceneArt variant="coast" />
        }}
      />
    )
  },
  {
    name: "project-card",
    title: "Project Card",
    description: "A softer card pattern for repo-like project listings.",
    install: "pnpm dlx shadcn@latest add @ghibli/project-card",
    preview: (
      <ProjectCard
        description="Automatic posting based on the user's GitHub repository, updating users in public about progress and feature implementations."
        slug="tweet-git"
        tags={["web", "website", "daily updates"]}
        title="TweetGit"
      />
    )
  },
  {
    name: "kitchen-sink-poster",
    title: "Kitchen Sink Poster",
    description: "An all-in-one poster layout that proves the primitive set.",
    install: "pnpm dlx shadcn@latest add @ghibli/kitchen-sink-poster",
    preview: <KitchenSinkPoster />
  }
];

export const componentIndex = new Map(componentCatalog.map((item) => [item.name, item]));
export const blockIndex = new Map(blockCatalog.map((item) => [item.name, item]));
