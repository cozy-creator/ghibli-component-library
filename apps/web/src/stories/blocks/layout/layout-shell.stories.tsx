import type { Meta, StoryObj } from "@storybook/react-vite";

import { ShellFooter, ShellHeader } from "@ghibli/ui";

import { BrandMark } from "@/apps/web/src/components/site-brand";
import { footerColumns, headerBrand, headerUser, libraryNavItems, socialItems } from "@/apps/web/src/data/demo-fixtures";

const meta = {
  title: "Patterns/Layout/Layout Shell"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-4">
      <ShellHeader
        brand={headerBrand}
        navItems={libraryNavItems.map((item, index) => ({
          ...item,
          active: index === 0
        }))}
        socialItems={socialItems}
        user={headerUser}
      />
      <ShellFooter
        brand={<BrandMark className="size-11 shrink-0" />}
        columns={footerColumns.flatMap((column) =>
          column.links.map((link) => ({ href: link.href, text: link.label }))
        )}
        text="Header and footer blocks are installable and presentational."
      />
    </div>
  )
};
