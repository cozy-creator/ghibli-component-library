import type { Meta, StoryObj } from "@storybook/react-vite";

import { Footer, Header } from "@ghibli/ui";

import { footerColumns, headerBrand, headerUser, libraryNavItems, socialItems } from "@/apps/web/src/data/demo-fixtures";

const meta = {
  title: "Patterns/Layout/Layout Shell"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-4">
      <Header brand={headerBrand} currentPath="/guides/getting-started" navItems={libraryNavItems} socialItems={socialItems} user={headerUser} />
      <Footer
        columns={footerColumns}
        note="Header and footer blocks are installable and presentational."
        title="Ghibli UI"
      />
    </div>
  )
};
