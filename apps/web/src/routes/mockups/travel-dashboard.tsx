import { TravelOverview } from "@ghibli/ui";

import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import { SceneArt } from "@/apps/web/src/components/docs/scene-art";

export function TravelDashboardMockupPage() {
  return (
    <div className="grid gap-8">
      <PageIntro
        badge="Mockup"
        description="A mobile-friendly scenic dashboard based on the travel-inspired moodboard and built from the TravelOverview block."
        title="Travel dashboard"
      />
      <TravelOverview
        destinations={[
          {
            id: "forest",
            title: "Enchanted Forest",
            subtitle: "Filtered light",
            media: <SceneArt variant="forest" />
          },
          {
            id: "coast",
            title: "Seaside Village",
            subtitle: "Salt wind",
            media: <SceneArt variant="coast" />
          },
          {
            id: "mountain",
            title: "Misty Mountains",
            subtitle: "Cloud path",
            media: <SceneArt variant="mountain" />
          }
        ]}
        journalEntries={[
          {
            id: "entry-1",
            title: "Tea by the window",
            date: "April 8",
            media: <SceneArt variant="studio" />
          },
          {
            id: "entry-2",
            title: "Mountain adventure",
            date: "March 21",
            media: <SceneArt variant="mountain" />
          }
        ]}
        trip={{
          title: "Lakeview Onsen",
          dates: "May 12 – May 15",
          summary: "A highlighted trip card with scenic framing, CTA, and a softer dashboard rhythm.",
          media: <SceneArt variant="coast" />
        }}
      />
    </div>
  );
}

