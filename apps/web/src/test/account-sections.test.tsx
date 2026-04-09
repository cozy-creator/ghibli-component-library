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
          features={["200 monthly generations", "Priority queue"]}
          offers={[{ id: "plan", label: "Monthly", priceLabel: "$24 / month" }]}
          planName="Painterly plan"
        />
        <AccountApiCreditsSection
          balanceLabel="128 credits"
          ledger={[{ deltaLabel: "-12", id: "entry", title: "Generation batch" }]}
          offers={[{ id: "credits", label: "Starter credits", priceLabel: "$8" }]}
        />
      </div>
    );

    expect(screen.getAllByText("User")).not.toHaveLength(0);
    expect(screen.getByText("64 Total generations")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getAllByText("Painterly plan")).not.toHaveLength(0);
    expect(screen.getByText("128 credits")).toBeInTheDocument();
  });
});
