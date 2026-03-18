import { Badge, PaperPanel } from "@ghibli/ui";

import { PageIntro } from "@/apps/web/src/components/docs/page-intro";

const themes = [
  {
    id: "paper",
    title: "Paper",
    description: "The default warm surface with cream paper, clay ink, and soft gold highlights."
  },
  {
    id: "meadow",
    title: "Meadow",
    description: "A greener treatment for dashboards and travel cards."
  },
  {
    id: "twilight",
    title: "Twilight",
    description: "A cooler evening tone for contrast sections and cinematic panels."
  }
] as const;

export function ThemesPage() {
  return (
    <div className="grid gap-8">
      <PageIntro
        badge="Themes"
        description="Ghibli UI ships semantic color tokens first, with three default themed surfaces to help compositions feel scenic rather than flat."
        title="Paper, meadow, and twilight"
      />
      <div className="paper-grid" data-columns="3">
        {themes.map((theme) => (
          <PaperPanel className="grid gap-4 p-6" key={theme.id} tone={theme.id}>
            <Badge variant="soft">{theme.title}</Badge>
            <div className="grid gap-2">
              <h2 className="font-[var(--font-heading)] text-3xl text-current">{theme.title}</h2>
              <p className="text-sm leading-7 text-current/80">{theme.description}</p>
            </div>
            <div className="grid gap-2 rounded-[calc(var(--radius)+0.25rem)] border border-current/20 bg-white/20 p-4 text-sm">
              <span>background</span>
              <span>card</span>
              <span>primary</span>
              <span>border</span>
            </div>
          </PaperPanel>
        ))}
      </div>
      <PaperPanel className="ghibli-prose p-6">
        <p>
          Components do not depend on custom image assets. The scenic feel comes from CSS variables, textured overlays, rounded framing, and optional consumer-provided media.
        </p>
        <p>
          The docs app enables the display fonts by default, but the installed components remain usable with system fonts if the consumer skips the optional font registry item.
        </p>
      </PaperPanel>
    </div>
  );
}
