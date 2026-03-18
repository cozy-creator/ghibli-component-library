import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  AccountApiCreditsSection,
  AccountLinkedAccountsSection,
  AccountProfileSection,
  AccountSubscriptionSection
} from "@ghibli/ui";

import { creditLedger, creditOffers, linkedAccounts, subscriptionOffers } from "@/apps/web/src/data/demo-fixtures";

const meta = {
  title: "Patterns/Account/Account Sections"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-4">
      <AccountProfileSection email="melina@ghibli-ui.dev" name="Melina Sketch" planLabel="Painterly Plan" />
      <AccountLinkedAccountsSection accounts={linkedAccounts} />
      <AccountSubscriptionSection
        features={["200 monthly generations", "Priority queue", "Storyboard mode", "Reviewer links"]}
        offers={subscriptionOffers}
        planName="Painterly plan"
        renewalText="Renews on April 14, 2026"
      />
      <AccountApiCreditsSection balanceLabel="128 credits" ledger={creditLedger} offers={creditOffers} />
    </div>
  )
};
