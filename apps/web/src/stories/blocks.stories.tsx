import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  CreatorGallery,
  HeroPaper,
  KitchenSinkPoster,
  LanternButton,
  ProjectCard,
  TravelOverview
} from "@ghibli/ui";

import { SceneArt } from "@/apps/web/src/components/docs/scene-art";

const meta = {
  title: "Ghibli/Blocks"
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-8">
      <HeroPaper
        description="Hero block composed entirely from registry primitives."
        eyebrow="Hero Paper"
        media={<SceneArt variant="meadow" />}
        primaryAction={<LanternButton>Get started</LanternButton>}
        secondaryAction={<Button variant="secondary">View docs</Button>}
        title="A scenic first impression"
      />
      <CreatorGallery
        heading="Creator gallery"
        sections={[
          {
            id: "gallery",
            label: "Gallery",
            items: [
              {
                id: "1",
                title: "Forest light",
                description: "Poster cards with scenic media.",
                media: <SceneArt variant="forest" />,
                meta: "May 2026"
              },
              {
                id: "2",
                title: "Sunset field",
                description: "Tabbed collections for editorial layouts.",
                media: <SceneArt variant="sunset" />,
                meta: "April 2026"
              }
            ]
          }
        ]}
      />
      <TravelOverview
        destinations={[
          { id: "1", title: "Forest", subtitle: "Quiet trails", media: <SceneArt variant="forest" /> },
          { id: "2", title: "Coast", subtitle: "Sea air", media: <SceneArt variant="coast" /> },
          { id: "3", title: "Mountains", subtitle: "Cloud path", media: <SceneArt variant="mountain" /> }
        ]}
        journalEntries={[
          { id: "j1", title: "Tea by the window", date: "April 8", media: <SceneArt variant="studio" /> },
          { id: "j2", title: "Mountain walk", date: "March 21", media: <SceneArt variant="mountain" /> }
        ]}
        trip={{
          title: "Lakeview Onsen",
          dates: "May 12 – May 15",
          summary: "Broad highlight card.",
          media: <SceneArt variant="coast" />
        }}
      />
      <ProjectCard
        description="Softer project cards for repo and dashboard interfaces."
        slug="tweet-git"
        tags={["web", "updates"]}
        title="TweetGit"
      />
      <KitchenSinkPoster />
    </div>
  )
};
