import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import {
  Button,
  MarketingCtaSection,
  MarketingFeaturesSection,
  MarketingHeroSection
} from "@ghibli/ui";

import { CodeBlock } from "@/apps/web/src/components/docs/code-block";
import { DocItemCard } from "@/apps/web/src/components/docs/doc-item-card";
import { PageIntro } from "@/apps/web/src/components/docs/page-intro";
import { PreviewCard } from "@/apps/web/src/components/docs/preview-card";
import {
  featuredComponents,
  featuredGuides,
  featuredPatterns,
  libraryExamples
} from "@/apps/web/src/data/library-docs";
import { featureItems, featureVisualItems, marketingVisual } from "@/apps/web/src/data/demo-fixtures";

const registrySnippet = {
  code: `pnpm dlx shadcn@latest add @ghibli/style
pnpm dlx shadcn@latest add @ghibli/button`,
  language: "bash" as const,
  title: "Quick install"
};

export function HomePage() {
  return (
    <div className="docs-stack-lg">
      <PageIntro
        badge="Documentation-first library"
        description="Ghibli UI is a registry-first component library with soft paper surfaces, grouped patterns, and a docs app designed to help teams install, study, and adapt the copied source."
        title="Scenic React components built for sharing, not hiding inside one product"
        trailing={
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/guides/getting-started">Start with the guides</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/components">Browse components</Link>
            </Button>
          </div>
        }
      />
      <MarketingHeroSection
        badge="registry-first"
        description="The docs app is now the primary experience: install guides, searchable components, grouped patterns, and example compositions live in one place while Storybook stays available for isolated visual QA."
        primaryAction={
          <Button asChild>
            <Link to="/guides/installation">See the installation flow</Link>
          </Button>
        }
        secondaryAction={
          <Button asChild variant="secondary">
            <Link to="/guides/development">Run Storybook locally</Link>
          </Button>
        }
        title="A softer shadcn-style library with clearer docs and sturdier structure"
        visual={marketingVisual}
      />
      <section className="docs-stack">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-2">
            <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
              Get productive quickly
            </h2>
            <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
              Use the guides for setup and adoption, then jump into the library indexes when you know what you need.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/guides/getting-started">
              Read all guides
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="paper-grid" data-columns="3">
          {featuredGuides.map((guide) => (
            <PreviewCard description={guide.summary} key={guide.slug} title={guide.title}>
              <div className="grid gap-4">
                <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{guide.description}</p>
                <Button asChild variant="secondary">
                  <Link to={`/guides/${guide.slug}`}>Open guide</Link>
                </Button>
              </div>
            </PreviewCard>
          ))}
        </div>
      </section>
      <div className="paper-grid" data-columns="2">
        <CodeBlock snippet={registrySnippet} />
        <PreviewCard
          description="The docs app explains the same registry-first workflow that the smoke test and hosted output rely on."
          title="How the project is meant to be used"
        >
          <div className="grid gap-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            <p>Add the registry namespace, install the style item, then copy only the source files you need.</p>
            <p>Storybook mirrors the same taxonomy, but the docs app is the primary entry point for new consumers.</p>
            <Button asChild variant="secondary">
              <Link to="/guides/registry">See the registry guide</Link>
            </Button>
          </div>
        </PreviewCard>
      </div>
      <section className="docs-stack">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-2">
            <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
              Featured components
            </h2>
            <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
              Standard shadcn-style building blocks with calmer visual defaults and more intentional spacing.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/components">
              Browse all components
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="directory-grid">
          {featuredComponents.map((item) => (
            <DocItemCard item={item} key={item.name} />
          ))}
        </div>
      </section>
      <section className="docs-stack">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-2">
            <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
              Featured patterns
            </h2>
            <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
              Grouped patterns stay installable but are documented as reusable building blocks, not as full product templates.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/patterns">
              Browse all patterns
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="directory-grid">
          {featuredPatterns.map((item) => (
            <DocItemCard item={item} key={item.name} />
          ))}
        </div>
      </section>
      <MarketingFeaturesSection
        heading="Why this structure works"
        intro="The repo is organized like a library that expects outside adoption: predictable install steps, categorized browsing, reusable examples, and documentation that explains the workflow."
        items={featureItems}
      />
      <MarketingCtaSection
        action={
          <Button asChild size="lg">
            <Link to="/examples">
              Open the examples gallery
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
        description="Examples stay intentionally small: auth, forms, navigation, and marketing compositions. The goal is to demonstrate reuse without turning the repo into a template showcase."
        eyebrow="Examples"
        title="See the building blocks assembled into practical demos"
      />
      <MarketingFeaturesSection
        heading="Example themes"
        intro="The same examples power the docs gallery and a dedicated Storybook examples group so preview content stays aligned."
        items={featureVisualItems}
      />
      <section className="docs-stack">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-2">
            <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
              Example gallery
            </h2>
            <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
              Small, reusable compositions that demonstrate the library without pretending to be full product templates.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/examples">
              Browse all examples
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="paper-grid" data-columns="2">
          {libraryExamples.slice(0, 4).map((example) => (
            <PreviewCard description={example.description} key={example.id} title={example.title}>
              <div className="grid gap-4">
                {example.preview}
                <Button asChild variant="secondary">
                  <Link to="/examples">View in examples</Link>
                </Button>
              </div>
            </PreviewCard>
          ))}
        </div>
      </section>
    </div>
  );
}
