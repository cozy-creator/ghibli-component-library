import { render, screen } from "@testing-library/react";

import {
  AccountApiCreditsSection,
  AccountLinkedAccountsSection,
  AccountProfileSection,
  AccountSubscriptionSection,
  AccountUserDisplayBox
} from "@ghibli/ui";

describe("account sections", () => {
  it("renders grouped account content", () => {
    render(
      <div>
        <AccountUserDisplayBox email="mei@ghibli-ui.test" generatedCount={64} name="User" />
        <AccountProfileSection email="melina@ghibli-ui.dev" name="Melina Sketch" planLabel="Painterly plan" />
        <AccountLinkedAccountsSection
          accounts={[
            { actionLabel: "Manage", id: "github", name: "GitHub", state: "connected" }
          ]}
        />
        <AccountSubscriptionSection
          activeOfferId="plan"
          balanceLabel="$24.00"
          offers={[{ id: "plan", name: "Monthly", priceLabel: "$24", subtitle: "Billed monthly" }]}
          planName="Painterly plan"
          priceName="$24 / month"
        />
        <AccountApiCreditsSection
          ledger={[{ activity: "Generation batch", amountLabel: "-$1.20", date: "Apr 20, 2026", direction: "debit", id: "entry" }]}
        />
      </div>
    );

    expect(screen.getAllByText("User")).not.toHaveLength(0);
    expect(screen.getByText("64 Total generations")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getAllByText("Painterly plan")).not.toHaveLength(0);
    expect(screen.getByText("$24.00")).toBeInTheDocument();
  });
});
