import { render, screen } from "@testing-library/react";

import { CommunityImageCard, CommunityTabsList, CommunityVideoCard, CommunityXPostCard, Tabs } from "@ghibli/ui";

describe("community cards", () => {
  it("renders image, video, and x-post cards", () => {
    render(
      <div>
        <CommunityImageCard imageUrl="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'/>" meta="2h ago" title="Forest lantern walk" />
        <CommunityVideoCard
          posterUrl="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'/>"
          title="Lantern ferry glide"
          videoUrl="https://example.com/lantern-ferry.mp4"
        />
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
    expect(screen.getByText("Lantern ferry glide")).toBeInTheDocument();
    expect(screen.getByText("Painterly component release notes.")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Video" })).toHaveAttribute("data-state", "active");
  });
});
