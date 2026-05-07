import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  AccountApiCreditsSection,
  AccountLinkedAccountsSection,
  AccountProfileSection,
  AccountSubscriptionSection,
  AccountUserDisplayBox
} from "@/cozy-examples/account/sections";

import { creditLedger, linkedAccounts, subscriptionOffers } from "@/apps/web/src/data/demo-fixtures";

const meta = {
  title: "Patterns/Account/Account Sections"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-4">
      <AccountUserDisplayBox email="mei@ghibli-ui.test" generatedCount={128} name="User" />
      <AccountProfileSection email="melina@ghibli-ui.dev" name="Melina Sketch" planLabel="Monthly Studio" />
      <AccountLinkedAccountsSection accounts={linkedAccounts} />
      <AccountSubscriptionSection
        activeOfferId="monthly"
        balanceLabel="$24.00"
        offers={subscriptionOffers}
        planName="Monthly Studio"
        priceName="$24 / month"
        renewalText="April 14, 2026"
      />
      <AccountApiCreditsSection ledger={creditLedger} />
    </div>
  )
};
