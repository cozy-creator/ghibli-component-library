import { CreatorGallery } from "@ghibli/ui";

import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import { SceneArt } from "@/apps/web/src/components/docs/scene-art";

export function CreatorGalleryMockupPage() {
  return (
    <div className="grid gap-8">
      <PageIntro
        badge="Mockup"
        description="A gallery-style interface inspired by illustrated posters, built from the CreatorGallery block and core primitives."
        title="Creator gallery"
      />
      <CreatorGallery
        description="Treat the provided moodboards as atmosphere rather than layouts to reproduce. The goal is softness, paper texture, and illustrated calm."
        heading="Collections with an editorial rhythm"
        sections={[
          {
            id: "live-feed",
            label: "Live feed",
            items: [
              {
                id: "1",
                title: "Field character portrait",
                description: "Poster cards with room for scenic illustration and metadata.",
                media: <SceneArt variant="gallery" />,
                meta: "May 2026"
              },
              {
                id: "2",
                title: "Meadow bloom",
                description: "Warm borders, simple captions, and a little paper grain go a long way.",
                media: <SceneArt variant="meadow" />,
                meta: "April 2026"
              },
              {
                id: "3",
                title: "Forest messenger",
                description: "Tabs and poster frames build the whole layout.",
                media: <SceneArt variant="forest" />,
                meta: "March 2026"
              }
            ]
          },
          {
            id: "x-posts",
            label: "X-posts",
            items: [
              {
                id: "4",
                title: "Quiet mountain path",
                description: "The same block can also feel calmer and more scenic.",
                media: <SceneArt variant="mountain" />,
                meta: "February 2026"
              },
              {
                id: "5",
                title: "Paper sunset",
                description: "The registry ships the pieces; the consumer owns the content.",
                media: <SceneArt variant="sunset" />,
                meta: "January 2026"
              }
            ]
          }
        ]}
      />
    </div>
  );
}

