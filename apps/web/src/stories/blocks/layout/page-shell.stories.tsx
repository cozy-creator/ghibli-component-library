import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, NoticeBanner, PageHero, PageSection, PageShell } from "@ghibli/ui";

const meta = {
  title: "Patterns/Layout/Page Shell"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="overflow-hidden rounded-[1.5rem] border-2 border-[color:var(--border)] bg-[color:rgba(255,255,255,0.42)]">
      <PageShell className="py-6" width="md">
        <div className="grid gap-6">
          <PageHero
            badge={<Badge variant="stamp">Page shell</Badge>}
            description="Use the shared hero and section rhythm for docs pages, settings pages, or landing compositions."
            title="Structure longer surfaces without inventing new spacing each time."
          />
          <PageSection
            description="Sections stay consistent without locking you into one product template."
            title="Reusable rhythm"
          >
            <NoticeBanner
              description="PageShell keeps width and cadence predictable while the content stays fully presentational."
              title="Compose heroes, grids, and content blocks inside the same shell."
              tone="river"
            />
          </PageSection>
        </div>
      </PageShell>
    </div>
  )
};
