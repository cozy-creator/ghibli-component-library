import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  HeroPaper
} from "@ghibli/ui";

import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import { PreviewCard } from "@/apps/web/src/components/docs/preview-card";
import { SceneArt } from "@/apps/web/src/components/docs/scene-art";
import { blockCatalog, componentCatalog } from "@/apps/web/src/data/catalog";

const featuredComponents = componentCatalog.slice(0, 6);
const featuredBlocks = blockCatalog.slice(0, 3);

export function HomePage() {
  return (
    <div className="grid gap-8">
      <PageIntro
        badge="Ghibli UI"
        description="A registry-first React component library built for copy-paste installation through the shadcn CLI, with Storybook and a Vite docs app for exploration."
        title="Painted surfaces, soft controls, and scenic blocks"
      />
      <HeroPaper
        description="The registry is the product. The docs app and Storybook exist to let you see and verify the components before you copy them into your own project."
        eyebrow="shadcn add @ghibli/*"
        media={<SceneArt variant="meadow" />}
        primaryAction={
          <Button asChild>
            <Link to="/docs/getting-started">Start with the registry</Link>
          </Button>
        }
        secondaryAction={
          <Button asChild variant="secondary">
            <Link to="/mockups/creator-gallery">See the mockups</Link>
          </Button>
        }
        title="A copy-paste UI kit with hand-touched paper atmosphere"
      />
      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
              Foundation Components
            </h2>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
              Core shadcn-style primitives adapted to a softer, warmer visual language.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/docs/components/button">
              Browse components
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="paper-grid" data-columns="3">
          {featuredComponents.map((component) => (
            <PreviewCard
              description={component.description}
              key={component.name}
              title={component.title}
            >
              <div className="grid gap-4">
                {component.preview}
                <Button asChild variant="secondary">
                  <Link to={`/docs/components/${component.name}`}>View details</Link>
                </Button>
              </div>
            </PreviewCard>
          ))}
        </div>
      </section>
      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
              Signature Blocks
            </h2>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
              Installable compositions built entirely from the same registry items.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/docs/blocks/hero-paper">
              Browse blocks
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="paper-grid" data-columns="2">
          {featuredBlocks.map((block) => (
            <Card key={block.name}>
              <CardHeader>
                <Badge variant="soft">Block</Badge>
                <CardTitle>{block.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {block.preview}
                <Button asChild variant="secondary">
                  <Link to={`/docs/blocks/${block.name}`}>View details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

