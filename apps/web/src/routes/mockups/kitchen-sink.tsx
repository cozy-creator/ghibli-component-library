import { KitchenSinkPoster } from "@ghibli/ui";

import { PageIntro } from "@/apps/web/src/components/docs/page-intro";

export function KitchenSinkMockupPage() {
  return (
    <div className="grid gap-8">
      <PageIntro
        badge="Mockup"
        description="A single poster-like composition for quickly checking how buttons, fields, toggles, tabs, and surfaces behave together."
        title="Kitchen sink poster"
      />
      <KitchenSinkPoster />
    </div>
  );
}
