import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ghibli/ui";

const meta = {
  title: "Components/Display/Card"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Paper card</CardTitle>
        <CardDescription>Core surface used across the documentation-first library.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
          Cards now carry the default paper theme and are shared across grouped blocks.
        </p>
      </CardContent>
      <CardFooter>Footer actions or metadata live here.</CardFooter>
    </Card>
  )
};
