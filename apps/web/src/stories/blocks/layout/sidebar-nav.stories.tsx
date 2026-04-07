import type { Meta, StoryObj } from "@storybook/react-vite";
import { BookOpen, Compass } from "lucide-react";

import { Badge, SidebarNav } from "@ghibli/ui";

const meta = {
  title: "Patterns/Layout/Sidebar Nav"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="max-w-sm">
      <SidebarNav
        groups={[
          {
            id: "catalog",
            items: [
              {
                active: true,
                badge: <Badge variant="stamp">3</Badge>,
                description: "Install steps and registry setup",
                id: "install",
                icon: <BookOpen className="size-4" />,
                label: "Install"
              },
              {
                description: "Imports, theme ownership, and copied source",
                id: "use",
                icon: <Compass className="size-4" />,
                label: "Use"
              }
            ],
            label: "Catalog"
          }
        ]}
      />
    </div>
  )
};
