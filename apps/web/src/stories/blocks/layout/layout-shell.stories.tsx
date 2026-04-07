import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flower2 } from "lucide-react";

import { ShellFooter, ShellHeader } from "@ghibli/ui";

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
        brand={
          <span className="inline-flex size-11 items-center justify-center border border-[color:var(--border-strong)] bg-[color:rgba(255,255,255,0.42)]">
            <Flower2 className="size-6" />
          </span>
        }
        columns={footerColumns.flatMap((column) =>
          column.links.map((link) => ({ href: link.href, text: link.label }))
        )}
        text="Header and footer blocks are installable and presentational."
      />
    </div>
  )
};
