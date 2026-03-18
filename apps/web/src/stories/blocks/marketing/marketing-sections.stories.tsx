import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, MarketingCtaSection, MarketingFeaturesSection, MarketingHeroSection } from "@ghibli/ui";

import { featureVisualItems, marketingVisual } from "@/apps/web/src/data/demo-fixtures";

const meta = {
  title: "Patterns/Marketing/Marketing Sections"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-6">
      <MarketingHeroSection
        badge="registry-first"
        description="A calm hero section built from generic installable marketing blocks."
        primaryAction={<Button>Get started</Button>}
        secondaryAction={<Button variant="secondary">View docs</Button>}
        title="Paper-and-ink creative interfaces"
        visual={marketingVisual}
      />
      <MarketingFeaturesSection
        heading="What ships"
        intro="The grouped marketing blocks are deliberately generic."
        items={featureVisualItems}
      />
      <MarketingCtaSection
        description="Use this as the final action band on a landing or docs page."
        title="Push the user to one clear action"
      />
    </div>
  )
};
