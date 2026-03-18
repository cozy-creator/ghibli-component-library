import { ArrowRightIcon } from "lucide-react";

import { Button, HeroPaper, InkInput, PaperPanel, ProjectCard } from "@ghibli/ui";

import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import { SceneArt } from "@/apps/web/src/components/docs/scene-art";

export function PaperSaasMockupPage() {
  return (
    <div className="grid gap-8">
      <PageIntro
        badge="Mockup"
        description="A softer SaaS landing page that keeps the paper-and-ink treatment while using generic product copy."
        title="Paper SaaS"
      />
      <HeroPaper
        description="This is the translation of a modern product landing page into the Ghibli visual system: warmer surfaces, scenic media, and less clinical spacing."
        eyebrow="Founder mode"
        media={<SceneArt variant="studio" />}
        primaryAction={
          <Button>
            Join waitlist
            <ArrowRightIcon className="size-4" />
          </Button>
        }
        secondaryAction={<Button variant="secondary">Pricing</Button>}
        title="Turn product surfaces into something gentler"
      />
      <div className="paper-grid" data-columns="2">
        <PaperPanel className="grid gap-4 p-6">
          <InkInput label="Email" placeholder="founder@ghibli.ui" />
          <Button>Join waitlist</Button>
        </PaperPanel>
        <ProjectCard
          description="Automatic updates based on repository changes, rendered in a softer card style instead of a generic admin panel."
          slug="tweet-git"
          tags={["web", "website", "daily posts"]}
          title="TweetGit"
        />
      </div>
    </div>
  );
}
