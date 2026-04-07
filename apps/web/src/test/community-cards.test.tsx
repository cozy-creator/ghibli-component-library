import { render, screen } from "@testing-library/react";

import { CommunityImageCard, CommunityTabsList, CommunityXPostCard, Tabs } from "@ghibli/ui";

describe("community cards", () => {
  it("renders image and x-post cards", () => {
    render(
      <div>
        <CommunityImageCard imageUrl="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'/>" meta="2h ago" title="Forest lantern walk" />
        <CommunityXPostCard
          author="Melina Sketch"
          body="Painterly component release notes."
          handle="melina"
          metrics={{ likes: "20", replies: "4", reposts: "5" }}
        />
        <Tabs value="video">
          <CommunityTabsList activeTab="video" />
        </Tabs>
      </div>
    );

    expect(screen.getByText("Forest lantern walk")).toBeInTheDocument();
    expect(screen.getByText("Painterly component release notes.")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Video" })).toHaveAttribute("data-state", "active");
  });
});
