import { render, screen } from "@testing-library/react";

import { TravelOverview } from "@ghibli/ui";

describe("travel overview", () => {
  it("renders the provided destinations and trip", () => {
    render(
      <TravelOverview
        destinations={[
          { id: "1", title: "Enchanted Forest", subtitle: "Quiet trails" },
          { id: "2", title: "Seaside Village", subtitle: "Salt breeze" },
          { id: "3", title: "Misty Mountains", subtitle: "Morning clouds" }
        ]}
        journalEntries={[
          { id: "j1", title: "Tea by the window", date: "April 8" },
          { id: "j2", title: "Mountain adventure", date: "March 21" }
        ]}
        trip={{
          title: "Lakeview Onsen",
          dates: "May 12 – May 15",
          summary: "A highlighted trip card."
        }}
      />
    );

    expect(screen.getByText("Enchanted Forest")).toBeInTheDocument();
    expect(screen.getByText("Lakeview Onsen")).toBeInTheDocument();
    expect(screen.getByText("Tea by the window")).toBeInTheDocument();
  });
});

