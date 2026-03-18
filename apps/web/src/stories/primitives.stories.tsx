import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  InkInput,
  Input,
  LanternButton,
  PaperPanel,
  PosterFrame,
  ProgressPill,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StampBadge,
  Switch,
  Textarea
} from "@ghibli/ui";

import { SceneArt } from "@/apps/web/src/components/docs/scene-art";

const meta = {
  title: "Ghibli/Primitives"
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-6">
      <PaperPanel className="grid gap-4 p-6">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <LanternButton>Lantern</LanternButton>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="soft">Soft</Badge>
          <StampBadge tone="meadow">main</StampBadge>
        </div>
      </PaperPanel>
      <PaperPanel className="grid gap-4 p-6">
        <Input defaultValue="hello@ghibli.ui" />
        <InkInput hint="Friendly hint text." label="Email" />
        <Textarea defaultValue="Longer paper-style input surfaces." />
        <Select defaultValue="forest">
          <SelectTrigger>
            <SelectValue placeholder="Pick a place" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="forest">Enchanted Forest</SelectItem>
            <SelectItem value="coast">Seaside Village</SelectItem>
          </SelectContent>
        </Select>
      </PaperPanel>
      <PaperPanel className="grid gap-4 p-6 md:grid-cols-2">
        <div className="grid gap-3">
          <label className="inline-flex items-center gap-3">
            <Checkbox defaultChecked />
            Checkbox
          </label>
          <label className="inline-flex items-center gap-3">
            <Switch defaultChecked />
            Switch
          </label>
          <RadioGroup defaultValue="paper">
            <label className="inline-flex items-center gap-3">
              <RadioGroupItem value="paper" />
              Paper
            </label>
            <label className="inline-flex items-center gap-3">
              <RadioGroupItem value="meadow" />
              Meadow
            </label>
          </RadioGroup>
        </div>
        <div className="grid gap-4">
          <ProgressPill value={72} />
          <PosterFrame caption="Poster frame">
            <div className="aspect-[4/5]">
              <SceneArt variant="gallery" />
            </div>
          </PosterFrame>
        </div>
      </PaperPanel>
      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardDescription>Baseline paper card surface.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
            Storybook previews the same source files that the registry ships.
          </p>
        </CardContent>
      </Card>
    </div>
  )
};

