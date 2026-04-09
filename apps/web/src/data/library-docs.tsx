import type { ReactNode } from "react";

import {
  AccountApiCreditsSection,
  AccountLinkedAccountsSection,
  AccountProfileSection,
  AccountSubscriptionSection,
  AuthDialog,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CommunityImageCard,
  CommunityVideoCard,
  CommunityXPostCard,
  DocsFaqAccordion,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  Footer,
  GenerateAspectRatioSelect,
  GenerateEditorBar,
  GenerateModeToggle,
  GenerateModelSelect,
  GenerateNegativePromptMenu,
  GenerateNumImagesControl,
  GenerateJobCard,
  Header,
  Input,
  Label,
  LoginForm,
  MarketingCtaSection,
  MarketingFeaturesSection,
  MarketingHeroSection,
  RegisterForm,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@ghibli/ui";

import {
  aspectRatioOptions,
  communityImageItems,
  communityVideoItems,
  creditLedger,
  creditOffers,
  faqItems,
  featureItems,
  featureVisualItems,
  footerColumns,
  formVisual,
  headerBrand,
  headerUser,
  libraryNavItems,
  linkedAccounts,
  marketingVisual,
  modeOptions,
  modelOptions,
  navigationVisual,
  sampleAttachments,
  sampleJobs,
  socialItems,
  subscriptionOffers,
  xPostDemo
} from "@/apps/web/src/data/demo-fixtures";
import {
  AppleAuthIcon,
  DiscordAuthIcon,
  GitHubAuthIcon,
  GoogleAuthIcon,
} from "@/apps/web/src/components/auth-provider-icons";

export interface SourceSnippet {
  code: string;
  language: "bash" | "tsx" | "json" | "css" | "text";
  title: string;
}

export interface DocExample {
  description: string;
  id: string;
  preview: ReactNode;
  snippet: SourceSnippet;
  title: string;
}

export interface DocSection {
  items?: string[];
  snippet?: SourceSnippet;
  text: string;
  title: string;
}

export interface GuidePage {
  description: string;
  sections: DocSection[];
  slug: string;
  summary: string;
  title: string;
}

export interface DocItem {
  description: string;
  examples: DocExample[];
  exports?: string[];
  family: string;
  importSnippet: SourceSnippet;
  installSnippet: SourceSnippet;
  inventory?: string[];
  kind: "component" | "pattern";
  name: string;
  notes: string[];
  preview: ReactNode;
  related: string[];
  storybookTitle: string;
  summary: string;
  title: string;
  usageSnippet: SourceSnippet;
}

export interface LibraryExample {
  description: string;
  id: string;
  preview: ReactNode;
  related: string[];
  snippet: SourceSnippet;
  title: string;
}

function snippet(title: string, language: SourceSnippet["language"], code: string): SourceSnippet {
  return { code, language, title };
}

function installSnippet(name: string): SourceSnippet {
  return snippet("Install", "bash", `pnpm dlx shadcn@latest add @ghibli/${name}`);
}

export const guides: GuidePage[] = [
  {
    description: "Go from empty project to working components with the least amount of setup.",
    slug: "getting-started",
    summary: "The shortest path to installing the style item and your first components.",
    title: "Getting Started",
    sections: [
      {
        text:
          "Start by adding the registry namespace to your consumer app. This lets `shadcn add` resolve the Ghibli UI items from your hosted registry output.",
        title: "Add the registry namespace",
        snippet: snippet(
          "components.json",
          "json",
          `{
  "registries": {
    "@ghibli": "https://<your-domain>/r/{name}.json"
  }
}`
        )
      },
      {
        text:
          "Install the `style` item first. It provides the paper theme variables, typography, shadows, and base surface rules used by every component.",
        title: "Install the foundation",
        snippet: installSnippet("style")
      },
      {
        text:
          "After the style item is in place, add only the components or patterns your app needs. The source lands directly in your project, ready to customize.",
        title: "Add individual items",
        items: [
          "`pnpm dlx shadcn@latest add @ghibli/button` for a first primitive",
          "`pnpm dlx shadcn@latest add @ghibli/dialog` for an overlay primitive",
          "`pnpm dlx shadcn@latest add @ghibli/generate-editor-bar` for a grouped pattern"
        ]
      }
    ]
  },
  {
    description: "Install the library in the same way most shadcn registries expect to be consumed.",
    slug: "installation",
    summary: "A step-by-step installation guide for the registry, theme, and follow-up items.",
    title: "Installation",
    sections: [
      {
        text:
          "Use the docs pages to find the exact item you want, then copy the install command from the Install section. Every page follows the same structure.",
        title: "Pick an item from the docs"
      },
      {
        text:
          "Install the theme before any UI item. This keeps the copied source aligned with the expected CSS variables and paper surface helpers.",
        title: "Install the theme first",
        items: [
          "Add `@ghibli/style` once per app",
          "Then add primitives such as `button`, `card`, or `tooltip`",
          "Then add grouped patterns such as `auth-forms` or `marketing-sections`"
        ]
      },
      {
        text:
          "Consumers own the copied source. Renaming files, tightening props, or adjusting classes is part of the intended workflow.",
        title: "Own the installed files"
      }
    ]
  },
  {
    description: "Use the theme as a baseline and then adapt it to your product instead of treating it as a locked skin.",
    slug: "theming",
    summary: "How the paper theme is structured and where to customize it safely.",
    title: "Theming",
    sections: [
      {
        text:
          "The `style` item defines the paper surfaces, scenic accents, typography, border tones, and shadows. Most components only depend on those variables.",
        title: "Theme structure"
      },
      {
        text:
          "Start your changes with color tokens, spacing, and typography. Avoid rewriting component classes before you understand which visual rules are already centralized.",
        title: "Recommended customization order",
        items: [
          "Adjust color variables first",
          "Change typography and radius second",
          "Refine component variants only after the shared tokens feel right"
        ]
      },
      {
        text:
          "Keep the soft paper surfaces and stronger ink contrast in balance. If you flatten the surfaces too far, the Ghibli-inspired tone disappears quickly.",
        title: "Keep the visual contrast readable"
      }
    ]
  },
  {
    description: "Understand how the registry output maps to installable items and local development.",
    slug: "registry",
    summary: "What the registry manifest does and how docs, builds, and smoke tests depend on it.",
    title: "Using the Registry",
    sections: [
      {
        text:
          "The public contract is `registry.json`. The docs app, smoke test, and hosted output all derive from the same registry item definitions.",
        title: "Registry-first workflow"
      },
      {
        text:
          "Run the registry build before expecting local docs or smoke fixtures to reflect source changes. The root scripts already do this for you.",
        title: "Local registry output",
        snippet: snippet(
          "Root commands",
          "bash",
          `pnpm registry:build
pnpm build:web
pnpm smoke:registry`
        )
      },
      {
        text:
          "Keep item names stable. The docs can present grouped blocks as patterns, but registry slugs should remain predictable for consumers already using them.",
        title: "Protect install slugs"
      }
    ]
  },
  {
    description: "Run the docs app, Storybook, and quality gates during development.",
    slug: "development",
    summary: "Useful local commands for docs, Storybook, tests, and smoke validation.",
    title: "Development",
    sections: [
      {
        text:
          "Use the docs app as the primary editing surface. It is where installation steps, examples, and library navigation come together.",
        title: "Run the docs app",
        snippet: snippet("Docs app", "bash", "pnpm dev")
      },
      {
        text:
          "Use Storybook for isolated states and visual QA. The story groups mirror the docs taxonomy: Foundations, Components, Patterns, and Examples.",
        title: "Run Storybook",
        snippet: snippet("Storybook", "bash", "pnpm dev:storybook")
      },
      {
        text:
          "Before you publish or hand off the repo, make sure the shared gates still pass. The smoke test is especially important because it verifies real registry installation.",
        title: "Run the acceptance gates",
        snippet: snippet(
          "Quality gates",
          "bash",
          `pnpm typecheck
pnpm lint
pnpm test
pnpm build:web
pnpm build:storybook
pnpm smoke:registry`
        )
      }
    ]
  }
];

export const componentDocs: DocItem[] = [
  {
    description: "Raised paper actions with clear states, roomy padding, and ink-forward labels.",
    examples: [
      {
        description: "Primary, secondary, and outline actions are designed to sit comfortably in dense UIs.",
        id: "button-overview",
        preview: (
          <div className="flex flex-wrap gap-3">
            <Button>Generate</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Button } from "@/components/ui/button";

<Button>Generate</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>`
        ),
        title: "Core actions"
      }
    ],
    family: "Actions",
    importSnippet: snippet("Import", "tsx", `import { Button } from "@/components/ui/button";`),
    installSnippet: installSnippet("button"),
    kind: "component",
    name: "button",
    notes: [
      "Use primary actions sparingly so the soft paper emphasis remains meaningful.",
      "Secondary and outline variants work well inside cards, sidebars, and forms."
    ],
    preview: (
      <div className="flex flex-wrap gap-3">
        <Button>Generate</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
    ),
    related: ["badge", "dialog", "sheet"],
    storybookTitle: "Components/Actions/Button",
    summary: "Action primitive for primary, secondary, outline, and ghost-like interactions.",
    title: "Button",
    usageSnippet: snippet(
      "Basic usage",
      "tsx",
      `<Button size="lg">Create project</Button>`
    )
  },
  {
    description: "Small scenic labels for metadata, state, and emphasis.",
    examples: [
      {
        description: "Tones help organize status without relying on a harsh default palette.",
        id: "badge-tones",
        preview: (
          <div className="flex flex-wrap gap-2">
            <Badge tone="meadow">active</Badge>
            <Badge tone="river">preview</Badge>
            <Badge tone="lantern">featured</Badge>
          </div>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `<Badge tone="meadow">active</Badge>
<Badge tone="river">preview</Badge>
<Badge tone="lantern">featured</Badge>`
        ),
        title: "Status tones"
      }
    ],
    family: "Display",
    importSnippet: snippet("Import", "tsx", `import { Badge } from "@/components/ui/badge";`),
    installSnippet: installSnippet("badge"),
    kind: "component",
    name: "badge",
    notes: [
      "Keep badges short so the soft rounded shape stays balanced.",
      "Use tone changes for state before adding more visual decoration."
    ],
    preview: (
      <div className="flex flex-wrap gap-2">
        <Badge tone="meadow">active</Badge>
        <Badge tone="river">preview</Badge>
        <Badge tone="lantern">featured</Badge>
      </div>
    ),
    related: ["button", "card", "empty-state"],
    storybookTitle: "Components/Display/Badge",
    summary: "Compact metadata labels with scenic tones and softer edges.",
    title: "Badge",
    usageSnippet: snippet("Basic usage", "tsx", `<Badge tone="river">Beta</Badge>`)
  },
  {
    description: "Layered paper surfaces for previews, content groups, and detail sections.",
    examples: [
      {
        description: "The header and content parts give larger sections a consistent rhythm.",
        id: "card-layout",
        preview: (
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Paper card</CardTitle>
              <CardDescription>Reusable surface with calmer contrast.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
                Use it for docs previews, grouped settings, and heavier content blocks.
              </p>
            </CardContent>
          </Card>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Paper card</CardTitle>
  </CardHeader>
  <CardContent>Content goes here.</CardContent>
</Card>`
        ),
        title: "Surface layout"
      }
    ],
    family: "Display",
    importSnippet: snippet("Import", "tsx", `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`),
    installSnippet: installSnippet("card"),
    kind: "component",
    name: "card",
    notes: [
      "Use the card parts instead of ad hoc wrappers when you want predictable section spacing.",
      "Cards work best when they contain one clear content group rather than many unrelated blocks."
    ],
    preview: (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Paper card</CardTitle>
          <CardDescription>Reusable surface with calmer contrast.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
            Use it for feeds, account sections, and docs previews.
          </p>
        </CardContent>
      </Card>
    ),
    related: ["separator", "skeleton", "empty-state"],
    storybookTitle: "Components/Display/Card",
    summary: "Surface primitive for content sections, previews, and nested layouts.",
    title: "Card",
    usageSnippet: snippet("Basic usage", "tsx", `<Card><CardContent className="p-6">Hello</CardContent></Card>`)
  },
  {
    description: "Single-line paper field for form input, search, and lightweight filtering.",
    examples: [
      {
        description: "The default field is tuned for docs search, auth inputs, and short form values.",
        id: "input-basic",
        preview: <Input placeholder="hello@ghibli-ui.dev" />,
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Input } from "@/components/ui/input";

<Input placeholder="hello@ghibli-ui.dev" />`
        ),
        title: "Basic input"
      }
    ],
    family: "Forms",
    importSnippet: snippet("Import", "tsx", `import { Input } from "@/components/ui/input";`),
    installSnippet: installSnippet("input"),
    kind: "component",
    name: "input",
    notes: [
      "Use labels and helper text outside the field rather than stuffing too much meaning into placeholder copy.",
      "The input width is intentionally flexible so it can work in both dense toolbars and full forms."
    ],
    preview: <Input placeholder="hello@ghibli-ui.dev" />,
    related: ["label", "textarea", "button"],
    storybookTitle: "Components/Forms/Input",
    summary: "Form field for email, search, and other single-line values.",
    title: "Input",
    usageSnippet: snippet("Basic usage", "tsx", `<Input aria-label="Search components" placeholder="Search components" />`)
  },
  {
    description: "Long-form paper field for prompts, notes, and editorial input.",
    examples: [
      {
        description: "Textarea styles match the same surface treatment as the input while keeping more breathing room.",
        id: "textarea-basic",
        preview: <Textarea defaultValue="Describe a lantern ferry drifting through evening fog." />,
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Textarea } from "@/components/ui/textarea";

<Textarea defaultValue="Describe a lantern ferry drifting through evening fog." />`
        ),
        title: "Prompt field"
      }
    ],
    family: "Forms",
    importSnippet: snippet("Import", "tsx", `import { Textarea } from "@/components/ui/textarea";`),
    installSnippet: installSnippet("textarea"),
    kind: "component",
    name: "textarea",
    notes: [
      "Pair with labels and secondary actions instead of making the field do all the visual work.",
      "Useful for prompts, issue notes, editorial descriptions, and support forms."
    ],
    preview: <Textarea defaultValue="Describe a lantern ferry drifting through evening fog." />,
    related: ["input", "label", "generate-editor-bar"],
    storybookTitle: "Components/Forms/Textarea",
    summary: "Long-form input surface for prompts, notes, and descriptions.",
    title: "Textarea",
    usageSnippet: snippet("Basic usage", "tsx", `<Textarea rows={6} placeholder="Write your prompt..." />`)
  },
  {
    description: "Ink-forward labels for fields and small control groups.",
    examples: [
      {
        description: "Pair labels with fields and keep helper text outside the label for better scanning.",
        id: "label-field",
        preview: (
          <div className="grid gap-2">
            <Label htmlFor="preview-label">Prompt</Label>
            <Input id="preview-label" placeholder="Lakeside breakfast" />
          </div>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<Label htmlFor="prompt">Prompt</Label>
<Input id="prompt" placeholder="Lakeside breakfast" />`
        ),
        title: "Label + field"
      }
    ],
    family: "Forms",
    importSnippet: snippet("Import", "tsx", `import { Label } from "@/components/ui/label";`),
    installSnippet: installSnippet("label"),
    kind: "component",
    name: "label",
    notes: [
      "Use labels for meaning and reserve placeholders for examples.",
      "A short label plus a concise helper sentence usually reads better than a long label."
    ],
    preview: (
      <div className="grid gap-2">
        <Label htmlFor="preview-label">Prompt</Label>
        <Input id="preview-label" placeholder="Lakeside breakfast" />
      </div>
    ),
    related: ["input", "textarea", "button"],
    storybookTitle: "Components/Forms/Label",
    summary: "Form label text that keeps fields readable in dense layouts.",
    title: "Label",
    usageSnippet: snippet("Basic usage", "tsx", `<Label htmlFor="email">Email address</Label>`)
  },
  {
    description: "Subtle divider line for sectioning paper surfaces without adding noise.",
    examples: [
      {
        description: "Useful inside cards, menus, and list views where spacing alone is not enough.",
        id: "separator-basic",
        preview: (
          <div className="grid gap-3">
            <span>Section one</span>
            <Separator />
            <span>Section two</span>
          </div>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Separator } from "@/components/ui/separator";

<Separator />`
        ),
        title: "Section divider"
      }
    ],
    family: "Display",
    importSnippet: snippet("Import", "tsx", `import { Separator } from "@/components/ui/separator";`),
    installSnippet: installSnippet("separator"),
    kind: "component",
    name: "separator",
    notes: [
      "Use separators only where the content needs extra structure. Padding should still do most of the layout work.",
      "Works well between tool groups, metadata stacks, and footer rows."
    ],
    preview: (
      <div className="grid gap-3">
        <span>Section one</span>
        <Separator />
        <span>Section two</span>
      </div>
    ),
    related: ["card", "dropdown-menu", "layout-shell"],
    storybookTitle: "Components/Display/Separator",
    summary: "Light divider line for structured sections.",
    title: "Separator",
    usageSnippet: snippet("Basic usage", "tsx", `<Separator className="my-4" />`)
  },
  {
    description: "Paper shimmer placeholder for loading states in cards, forms, and feeds.",
    examples: [
      {
        description: "Mix different skeleton sizes to imply the final layout instead of using identical bars everywhere.",
        id: "skeleton-mix",
        preview: (
          <div className="grid gap-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-8 w-32" />
<Skeleton className="h-24 w-full" />`
        ),
        title: "Mixed loading placeholders"
      }
    ],
    family: "Display",
    importSnippet: snippet("Import", "tsx", `import { Skeleton } from "@/components/ui/skeleton";`),
    installSnippet: installSnippet("skeleton"),
    kind: "component",
    name: "skeleton",
    notes: [
      "Mirror the shape of the final UI so loading states remain understandable.",
      "Prefer a few deliberate skeleton rows over filling the whole page with placeholders."
    ],
    preview: (
      <div className="grid gap-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>
    ),
    related: ["card", "empty-state", "generate-job-card"],
    storybookTitle: "Components/Display/Skeleton",
    summary: "Loading placeholder primitive for content surfaces and forms.",
    title: "Skeleton",
    usageSnippet: snippet("Basic usage", "tsx", `<Skeleton className="h-10 w-full" />`)
  },
  {
    description: "Avatar primitives for user identity, compact account UI, and editorial bylines.",
    examples: [
      {
        description: "The avatar slots fit well in menus, cards, and layout bars.",
        id: "avatar-basic",
        preview: (
          <div className="flex items-center gap-3">
            <Header brand={headerBrand} currentPath="/" navItems={[]} user={headerUser} />
          </div>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage alt="Mina" src="/mina.jpg" />
  <AvatarFallback>MI</AvatarFallback>
</Avatar>`
        ),
        title: "Identity slots"
      }
    ],
    family: "Display",
    importSnippet: snippet("Import", "tsx", `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";`),
    installSnippet: installSnippet("avatar"),
    kind: "component",
    name: "avatar",
    notes: [
      "Always supply a useful fallback so initials or an icon appear when the image is missing.",
      "In tighter UI, avatar size usually matters more than extra decorative treatment."
    ],
    preview: (
      <div className="flex items-center gap-3">
        <Header brand={headerBrand} currentPath="/" navItems={[]} user={headerUser} />
      </div>
    ),
    related: ["dropdown-menu", "layout-shell", "card"],
    storybookTitle: "Components/Display/Avatar",
    summary: "Identity primitive for bylines, profile menus, and compact user UI.",
    title: "Avatar",
    usageSnippet: snippet("Basic usage", "tsx", `<Avatar size="lg"><AvatarFallback>GH</AvatarFallback></Avatar>`)
  },
  {
    description: "Segmented tabs for content switching with a stronger paper-active state.",
    examples: [
      {
        description: "Tabs help organize content without switching to a heavier navigation pattern.",
        id: "tabs-basic",
        preview: (
          <Tabs defaultValue="live">
            <TabsList>
              <TabsTrigger value="live">Live feed</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
            </TabsList>
            <TabsContent value="live">Image feed content</TabsContent>
            <TabsContent value="video">Video feed content</TabsContent>
          </Tabs>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="live">
  <TabsList>
    <TabsTrigger value="live">Live feed</TabsTrigger>
    <TabsTrigger value="video">Video</TabsTrigger>
  </TabsList>
  <TabsContent value="live">Image feed content</TabsContent>
  <TabsContent value="video">Video feed content</TabsContent>
</Tabs>`
        ),
        title: "Segmented navigation"
      }
    ],
    family: "Navigation",
    importSnippet: snippet("Import", "tsx", `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";`),
    installSnippet: installSnippet("tabs"),
    kind: "component",
    name: "tabs",
    notes: [
      "Use tabs for sibling content groups, not for full application navigation.",
      "Keep labels short so the triggers remain balanced at smaller widths."
    ],
    preview: (
      <Tabs defaultValue="live">
        <TabsList>
          <TabsTrigger value="live">Live feed</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>
        <TabsContent value="live">Image feed content</TabsContent>
        <TabsContent value="video">Video feed content</TabsContent>
      </Tabs>
    ),
    related: ["accordion", "dropdown-menu", "community-cards"],
    storybookTitle: "Components/Navigation/Tabs",
    summary: "Segmented content navigation for sibling views and tool panels.",
    title: "Tabs",
    usageSnippet: snippet("Basic usage", "tsx", `<Tabs defaultValue="overview">{/* ... */}</Tabs>`)
  },
  {
    description: "Disclosure navigation for FAQs, settings, and structured long-form content.",
    examples: [
      {
        description: "Accordion keeps long explanations tidy without requiring separate pages for every answer.",
        id: "accordion-basic",
        preview: <DocsFaqAccordion items={faqItems.slice(0, 2)} />,
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

<Accordion collapsible type="single">
  <AccordionItem value="faq">
    <AccordionTrigger>Question</AccordionTrigger>
    <AccordionContent>Answer</AccordionContent>
  </AccordionItem>
</Accordion>`
        ),
        title: "Disclosure list"
      }
    ],
    family: "Navigation",
    importSnippet: snippet("Import", "tsx", `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";`),
    installSnippet: installSnippet("accordion"),
    kind: "component",
    name: "accordion",
    notes: [
      "Use accordions for long answers or grouped settings, not for navigation that should remain visible all the time.",
      "Good copy matters more than elaborate motion here."
    ],
    preview: <DocsFaqAccordion items={faqItems.slice(0, 2)} />,
    related: ["tabs", "separator", "docs-faq-accordion"],
    storybookTitle: "Components/Navigation/Accordion",
    summary: "Disclosure primitive for FAQs, settings sections, and long lists.",
    title: "Accordion",
    usageSnippet: snippet("Basic usage", "tsx", `<Accordion type="single" collapsible>{/* ... */}</Accordion>`)
  },
  {
    description: "Modal dialog primitive for auth, settings, and focused overlay flows.",
    examples: [
      {
        description: "The surface stays soft while still separating itself clearly from the page underneath.",
        id: "dialog-auth",
        preview: (
          <Card>
            <CardHeader>
              <CardTitle>Dialog shell</CardTitle>
              <CardDescription>Use for focused tasks and short confirmation flows.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary">Open dialog</Button>
            </CardContent>
          </Card>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open dialog</Button>
  </DialogTrigger>
  <DialogContent>Dialog content</DialogContent>
</Dialog>`
        ),
        title: "Modal shell"
      }
    ],
    family: "Overlay",
    importSnippet: snippet("Import", "tsx", `import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";`),
    installSnippet: installSnippet("dialog"),
    kind: "component",
    name: "dialog",
    notes: [
      "Dialogs should focus on a single task. If the content keeps growing, move it to a page or sheet.",
      "Use the close button and keyboard support, but make the main task obvious as well."
    ],
    preview: (
      <Card>
        <CardHeader>
          <CardTitle>Dialog shell</CardTitle>
          <CardDescription>Use for focused tasks and short confirmation flows.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary">Open dialog</Button>
        </CardContent>
      </Card>
    ),
    related: ["sheet", "dropdown-menu", "auth-dialog"],
    storybookTitle: "Components/Overlay/Dialog",
    summary: "Focused modal overlay for short tasks and confirmations.",
    title: "Dialog",
    usageSnippet: snippet("Basic usage", "tsx", `<DialogContent aria-describedby={undefined}>Settings panel</DialogContent>`)
  },
  {
    description: "Slide-in sheet for mobile navigation, stacked actions, and side-panel editing.",
    examples: [
      {
        description: "Sheets are useful when a full modal feels too heavy but inline expansion still hurts scanability.",
        id: "sheet-basic",
        preview: (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger asChild>
    <Button>Open sheet</Button>
  </SheetTrigger>
  <SheetContent>Content</SheetContent>
</Sheet>`
        ),
        title: "Slide-in panel"
      }
    ],
    family: "Overlay",
    importSnippet: snippet("Import", "tsx", `import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";`),
    installSnippet: installSnippet("sheet"),
    kind: "component",
    name: "sheet",
    notes: [
      "Sheets work well for navigation and secondary editing flows, especially on smaller screens.",
      "Keep the open-state content structured so the panel still feels intentional when it grows taller."
    ],
    preview: (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Open sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <div className="grid gap-3">
            <h3 className="font-[var(--font-heading)] text-2xl">Sheet content</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">Mobile nav, uploads, or settings panes.</p>
          </div>
        </SheetContent>
      </Sheet>
    ),
    related: ["dialog", "dropdown-menu", "layout-shell"],
    storybookTitle: "Components/Overlay/Sheet",
    summary: "Side-panel overlay for navigation, quick editing, and layered UI.",
    title: "Sheet",
    usageSnippet: snippet("Basic usage", "tsx", `<SheetContent side="right">Filters</SheetContent>`)
  },
  {
    description: "Popover-backed menu surface for account actions, pickers, and compact tool menus.",
    examples: [
      {
        description: "The menu keeps action lists readable without requiring a full dialog or sheet.",
        id: "dropdown-basic",
        preview: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Open</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`
        ),
        title: "Compact action list"
      }
    ],
    family: "Overlay",
    importSnippet: snippet("Import", "tsx", `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";`),
    installSnippet: installSnippet("dropdown-menu"),
    kind: "component",
    name: "dropdown-menu",
    notes: [
      "Use dropdowns for short action lists or single-selection pickers.",
      "If the content needs extensive text or editing, move to a dialog or sheet."
    ],
    preview: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Open</DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    related: ["tooltip", "dialog", "layout-shell"],
    storybookTitle: "Components/Overlay/Dropdown Menu",
    summary: "Popover-style menu for compact actions and quick selections.",
    title: "Dropdown Menu",
    usageSnippet: snippet("Basic usage", "tsx", `<DropdownMenuContent align="end">...</DropdownMenuContent>`)
  },
  {
    description: "Hover and focus hint surface for concise supporting copy.",
    examples: [
      {
        description: "Tooltips should explain a control, not replace the control label.",
        id: "tooltip-basic",
        preview: (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Hint</Button>
              </TooltipTrigger>
              <TooltipContent>Painterly, low-noise guidance fits well here.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hint</Button>
    </TooltipTrigger>
    <TooltipContent>Guidance</TooltipContent>
  </Tooltip>
</TooltipProvider>`
        ),
        title: "Context hint"
      }
    ],
    family: "Overlay",
    importSnippet: snippet("Import", "tsx", `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";`),
    installSnippet: installSnippet("tooltip"),
    kind: "component",
    name: "tooltip",
    notes: [
      "Tooltips should be short. Anything longer usually belongs in helper text, documentation, or a dialog.",
      "Keep the control itself understandable even if the tooltip never appears."
    ],
    preview: (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">Hint</Button>
          </TooltipTrigger>
          <TooltipContent>Painterly, low-noise guidance fits well here.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    related: ["dropdown-menu", "button", "input"],
    storybookTitle: "Components/Overlay/Tooltip",
    summary: "Supporting hint surface for compact UI and icon-only actions.",
    title: "Tooltip",
    usageSnippet: snippet("Basic usage", "tsx", `<TooltipContent side="top">Guidance</TooltipContent>`)
  }
];

export const patternDocs: DocItem[] = [
  {
    description: "Props-first auth forms for login, sign-up, and recovery flows.",
    examples: [
      {
        description: "Use the forms directly in your own page, sheet, or dialog shell.",
        id: "auth-forms-overview",
        preview: (
          <LoginForm
            email=""
            helperText="Keep auth copy short and warm."
            onEmailChange={() => undefined}
            onPasswordChange={() => undefined}
            password=""
          />
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { LoginForm } from "@/components/blocks/auth/forms";

<LoginForm
  email={email}
  password={password}
  onEmailChange={setEmail}
  onPasswordChange={setPassword}
/>`
        ),
        title: "Login form"
      }
    ],
    exports: ["LoginForm", "RegisterForm", "ForgotPasswordForm"],
    family: "Auth",
    importSnippet: snippet(
      "Import",
      "tsx",
      `import { LoginForm, RegisterForm, ForgotPasswordForm } from "@/components/blocks/auth/forms";`
    ),
    installSnippet: installSnippet("auth-forms"),
    inventory: ["Login form", "Register form", "Forgot password form"],
    kind: "pattern",
    name: "auth-forms",
    notes: [
      "These forms are presentational on purpose. Pass values, errors, and callbacks from your own app layer.",
      "Good for auth pages, account recovery flows, and onboarding sheets."
    ],
    preview: (
      <LoginForm
        email=""
        helperText="Keep auth copy short and warm."
        onEmailChange={() => undefined}
        onPasswordChange={() => undefined}
        password=""
      />
    ),
    related: ["auth-dialog", "dialog", "input"],
    storybookTitle: "Patterns/Auth/Auth Forms",
    summary: "Grouped auth forms with reusable, controlled props.",
    title: "Auth Forms",
    usageSnippet: snippet("Basic usage", "tsx", `<RegisterForm email={email} name={name} password={password} confirmPassword={confirmPassword} />`)
  },
  {
    description: "Tabbed auth dialog shell with room for password recovery while the auth forms carry the provider actions.",
    examples: [
      {
        description: "Wraps the form primitives in a controlled dialog for quick auth entry points.",
        id: "auth-dialog-overview",
        preview: (
          <AuthDialog
            loginContent={
              <LoginForm
                email=""
                onEmailChange={() => undefined}
                onPasswordChange={() => undefined}
                password=""
                providerActions={[
                  { icon: <GoogleAuthIcon />, id: "google", label: "Google", onSelect: () => undefined },
                  { icon: <GitHubAuthIcon />, id: "github", label: "GitHub", onSelect: () => undefined },
                  { icon: <DiscordAuthIcon />, id: "discord", label: "Discord", onSelect: () => undefined },
                  { icon: <AppleAuthIcon />, id: "apple", label: "Apple", onSelect: () => undefined }
                ]}
              />
            }
            onOpenChange={() => undefined}
            open={false}
            registerContent={
              <RegisterForm
                confirmPassword=""
                email=""
                name=""
                onConfirmPasswordChange={() => undefined}
                onEmailChange={() => undefined}
                onNameChange={() => undefined}
                onPasswordChange={() => undefined}
                password=""
                providerActions={[
                  { icon: <GoogleAuthIcon />, id: "google", label: "Google", onSelect: () => undefined },
                  { icon: <GitHubAuthIcon />, id: "github", label: "GitHub", onSelect: () => undefined },
                  { icon: <DiscordAuthIcon />, id: "discord", label: "Discord", onSelect: () => undefined },
                  { icon: <AppleAuthIcon />, id: "apple", label: "Apple", onSelect: () => undefined }
                ]}
              />
            }
            showForgotPassword={false}
          />
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { AuthDialog } from "@/components/blocks/auth/dialog";

<AuthDialog
  open={open}
  onOpenChange={setOpen}
  loginContent={<LoginForm {...props} />}
  registerContent={<RegisterForm {...props} />}
/>`
        ),
        title: "Controlled auth modal"
      }
    ],
    exports: ["AuthDialog"],
    family: "Auth",
    importSnippet: snippet("Import", "tsx", `import { AuthDialog } from "@/components/blocks/auth/dialog";`),
    installSnippet: installSnippet("auth-dialog"),
    inventory: ["Dialog shell", "Tabbed auth layout", "Recovery state"],
    kind: "pattern",
    name: "auth-dialog",
    notes: [
      "Keep state control in the host app so the dialog stays easy to integrate with analytics and auth backends.",
      "Use provider actions only when the labels and callbacks are explicit."
    ],
    preview: (
      <Card>
        <CardHeader>
          <CardTitle>Auth dialog shell</CardTitle>
          <CardDescription>Open state is controlled by the host app.</CardDescription>
        </CardHeader>
      </Card>
    ),
    related: ["auth-forms", "dialog", "sheet"],
    storybookTitle: "Patterns/Auth/Auth Dialog",
    summary: "Dialog composition for login and registration without runtime auth coupling.",
    title: "Auth Dialog",
    usageSnippet: snippet("Basic usage", "tsx", `<AuthDialog open={open} onOpenChange={setOpen} loginContent={...} registerContent={...} />`)
  },
  {
    description: "Image, video, and social-style cards for editorial feeds and content directories.",
    examples: [
      {
        description: "Use the cards separately or mix them in gallery-style layouts.",
        id: "community-cards-overview",
        preview: (
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <CommunityImageCard
                imageUrl={communityImageItems[0]?.imageUrl ?? ""}
                meta={communityImageItems[0]?.meta ?? ""}
                title={communityImageItems[0]?.title ?? ""}
              />
              <CommunityVideoCard
                posterUrl={communityVideoItems[0]?.posterUrl ?? ""}
                title={communityVideoItems[0]?.title ?? ""}
              />
            </div>
            <CommunityXPostCard {...xPostDemo} />
          </div>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { CommunityImageCard, CommunityVideoCard, CommunityXPostCard } from "@/components/blocks/community/cards";`
        ),
        title: "Mixed gallery cards"
      }
    ],
    exports: ["CommunityImageCard", "CommunityVideoCard", "CommunityXPostCard"],
    family: "Community",
    importSnippet: snippet(
      "Import",
      "tsx",
      `import { CommunityImageCard, CommunityVideoCard, CommunityXPostCard } from "@/components/blocks/community/cards";`
    ),
    installSnippet: installSnippet("community-cards"),
    inventory: ["Image card", "Video card", "Social post card"],
    kind: "pattern",
    name: "community-cards",
    notes: [
      "These cards work for content galleries, changelogs, editorial homepages, and creator directories.",
      "Keep titles and descriptions short so the visual surface remains the focus."
    ],
    preview: (
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <CommunityImageCard
            imageUrl={communityImageItems[0]?.imageUrl ?? ""}
            meta={communityImageItems[0]?.meta ?? ""}
            title={communityImageItems[0]?.title ?? ""}
          />
          <CommunityVideoCard
            posterUrl={communityVideoItems[0]?.posterUrl ?? ""}
            title={communityVideoItems[0]?.title ?? ""}
          />
        </div>
        <CommunityXPostCard {...xPostDemo} />
      </div>
    ),
    related: ["community-modals", "card", "tabs"],
    storybookTitle: "Patterns/Community/Cards",
    summary: "Gallery-style content cards for mixed media and editorial surfaces.",
    title: "Cards",
    usageSnippet: snippet("Basic usage", "tsx", `<CommunityImageCard title="Forest lantern walk" imageUrl={imageUrl} />`)
  },
  {
    description: "Image and video modal viewers for larger media browsing flows.",
    examples: [
      {
        description: "These patterns pair naturally with the community cards and gallery tabs.",
        id: "community-modals-overview",
        preview: (
          <Card>
            <CardHeader>
              <CardTitle>Media viewers</CardTitle>
              <CardDescription>Pair these modals with gallery cards and keep open state in the host app.</CardDescription>
            </CardHeader>
          </Card>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { CommunityImageModal, CommunityVideoModal } from "@/components/blocks/community/modals";`
        ),
        title: "Media viewers"
      }
    ],
    exports: ["CommunityImageModal", "CommunityVideoModal"],
    family: "Community",
    importSnippet: snippet(
      "Import",
      "tsx",
      `import { CommunityImageModal, CommunityVideoModal } from "@/components/blocks/community/modals";`
    ),
    installSnippet: installSnippet("community-modals"),
    inventory: ["Image modal", "Video modal", "Index-aware navigation"],
    kind: "pattern",
    name: "community-modals",
    notes: [
      "Use modals for focused browsing, not for full feed navigation.",
      "Keep list state and active indexes in the host app."
    ],
    preview: (
      <Card>
        <CardHeader>
          <CardTitle>Media viewers</CardTitle>
          <CardDescription>Pair these modals with gallery cards and keep open state in the host app.</CardDescription>
        </CardHeader>
      </Card>
    ),
    related: ["community-cards", "dialog", "tabs"],
    storybookTitle: "Patterns/Community/Community Modals",
    summary: "Larger media viewers for gallery and content browsing.",
    title: "Community Modals",
    usageSnippet: snippet("Basic usage", "tsx", `<CommunityImageModal open={open} onOpenChange={setOpen} images={items} currentIndex={index} />`)
  },
  {
    description: "Mode, model, ratio, upload, and negative-prompt controls bundled for generator toolbars.",
    examples: [
      {
        description: "Use individual controls together or independently, depending on how dense the toolbar should be.",
        id: "generate-controls-overview",
        preview: (
          <div className="flex flex-wrap gap-3">
            <GenerateModeToggle onValueChange={() => undefined} options={modeOptions} value="image" />
            <GenerateModelSelect onValueChange={() => undefined} options={modelOptions} value="riverlight-v3" />
            <GenerateAspectRatioSelect onValueChange={() => undefined} options={aspectRatioOptions} value="3:4" />
            <GenerateNumImagesControl onValueChange={() => undefined} value={2} />
            <GenerateNegativePromptMenu onValueChange={() => undefined} value="" />
          </div>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import {
  GenerateAspectRatioSelect,
  GenerateModeToggle,
  GenerateModelSelect,
  GenerateNegativePromptMenu,
  GenerateNumImagesControl
} from "@/components/blocks/generate/controls";`
        ),
        title: "Control set"
      }
    ],
    exports: [
      "GenerateModeToggle",
      "GenerateModelSelect",
      "GenerateAspectRatioSelect",
      "GenerateNumImagesControl",
      "GenerateNegativePromptMenu",
      "GenerateUploadDialog",
      "GenerateButton"
    ],
    family: "Generate",
    importSnippet: snippet(
      "Import",
      "tsx",
      `import { GenerateModeToggle, GenerateModelSelect } from "@/components/blocks/generate/controls";`
    ),
    installSnippet: installSnippet("generate-controls"),
    inventory: ["Mode toggle", "Model select", "Aspect ratio select", "Upload dialog", "Generate button"],
    kind: "pattern",
    name: "generate-controls",
    notes: [
      "The controls are props-first so you can wire them to any generation or upload flow.",
      "Use only the controls your tool actually needs. The grouped install does not require full-toolbar adoption."
    ],
    preview: (
      <div className="flex flex-wrap gap-3">
        <GenerateModeToggle onValueChange={() => undefined} options={modeOptions} value="image" />
        <GenerateModelSelect onValueChange={() => undefined} options={modelOptions} value="riverlight-v3" />
        <GenerateAspectRatioSelect onValueChange={() => undefined} options={aspectRatioOptions} value="3:4" />
        <GenerateNumImagesControl onValueChange={() => undefined} value={2} />
        <GenerateNegativePromptMenu onValueChange={() => undefined} value="" />
      </div>
    ),
    related: ["generate-editor-bar", "button", "dropdown-menu"],
    storybookTitle: "Patterns/Generate/Generate Controls",
    summary: "Grouped generator controls for creative tools and editorial UIs.",
    title: "Generate Controls",
    usageSnippet: snippet("Basic usage", "tsx", `<GenerateButton loading={isLoading}>Generate</GenerateButton>`)
  },
  {
    description: "Prompt editor bar that composes the generator controls into a single primary workspace.",
    examples: [
      {
        description: "Suitable for image generation tools, writing prompts, or any multi-control creative toolbar.",
        id: "generate-editor-bar-overview",
        preview: (
          <GenerateEditorBar
            aspectRatio="3:4"
            aspectRatioOptions={aspectRatioOptions}
            attachments={sampleAttachments}
            estimateLabel="~18s / image"
            mode="image"
            modeOptions={modeOptions}
            model="riverlight-v3"
            modelOptions={modelOptions}
            negativePrompt=""
            numImages={2}
            prompt="Lakeside breakfast room, warm steam, watercolor background."
          />
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { GenerateEditorBar } from "@/components/blocks/generate/editor-bar";

<GenerateEditorBar
  prompt={prompt}
  mode={mode}
  model={model}
  aspectRatio={aspectRatio}
  numImages={numImages}
  modeOptions={modeOptions}
  modelOptions={modelOptions}
  aspectRatioOptions={aspectRatioOptions}
/>`
        ),
        title: "Editor toolbar"
      }
    ],
    exports: ["GenerateEditorBar"],
    family: "Generate",
    importSnippet: snippet("Import", "tsx", `import { GenerateEditorBar } from "@/components/blocks/generate/editor-bar";`),
    installSnippet: installSnippet("generate-editor-bar"),
    inventory: ["Prompt field", "Attachment row", "Control toolbar", "Primary generate action"],
    kind: "pattern",
    name: "generate-editor-bar",
    notes: [
      "The editor bar is intentionally presentational so you can keep async orchestration in your app state.",
      "It works best when the prompt field and primary action remain visually dominant."
    ],
    preview: (
      <GenerateEditorBar
        aspectRatio="3:4"
        aspectRatioOptions={aspectRatioOptions}
        attachments={sampleAttachments}
        estimateLabel="~18s / image"
        mode="image"
        modeOptions={modeOptions}
        model="riverlight-v3"
        modelOptions={modelOptions}
        negativePrompt=""
        numImages={2}
        prompt="Lakeside breakfast room, warm steam, watercolor background."
      />
    ),
    related: ["generate-controls", "generate-job-card", "textarea"],
    storybookTitle: "Patterns/Generate/Generate Editor Bar",
    summary: "Prompt-first toolbar for creative generation interfaces.",
    title: "Generate Editor Bar",
    usageSnippet: snippet("Basic usage", "tsx", `<GenerateEditorBar prompt={prompt} onPromptChange={setPrompt} />`)
  },
  {
    description: "Generation history card with progress, status, and output previews.",
    examples: [
      {
        description: "Use it in job history lists, review queues, or project activity pages.",
        id: "generate-job-card-overview",
        preview: (
          <GenerateJobCard
            outputs={sampleJobs[0]?.outputs ?? []}
            progress={sampleJobs[0]?.progress}
            prompt={sampleJobs[0]?.prompt ?? ""}
            status={sampleJobs[0]?.status ?? "queued"}
            subtitle={sampleJobs[0]?.subtitle}
            title={sampleJobs[0]?.title}
          />
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { GenerateJobCard } from "@/components/blocks/generate/job-card";

<GenerateJobCard
  title="Breakfast studies"
  status="done"
  progress={100}
  outputs={outputs}
  prompt={prompt}
/>`
        ),
        title: "Job history card"
      }
    ],
    exports: ["GenerateJobCard"],
    family: "Generate",
    importSnippet: snippet("Import", "tsx", `import { GenerateJobCard } from "@/components/blocks/generate/job-card";`),
    installSnippet: installSnippet("generate-job-card"),
    inventory: ["Status badge", "Prompt summary", "Progress", "Output preview list"],
    kind: "pattern",
    name: "generate-job-card",
    notes: [
      "Keep prompt copy truncated when used in longer job lists.",
      "The output area can stay empty while queued or processing."
    ],
    preview: (
      <GenerateJobCard
        outputs={sampleJobs[0]?.outputs ?? []}
        progress={sampleJobs[0]?.progress}
        prompt={sampleJobs[0]?.prompt ?? ""}
        status={sampleJobs[0]?.status ?? "queued"}
        subtitle={sampleJobs[0]?.subtitle}
        title={sampleJobs[0]?.title}
      />
    ),
    related: ["generate-editor-bar", "card", "skeleton"],
    storybookTitle: "Patterns/Generate/Generate Job Card",
    summary: "Status-focused content card for creative job queues and histories.",
    title: "Generate Job Card",
    usageSnippet: snippet("Basic usage", "tsx", `<GenerateJobCard title={job.title} status={job.status} prompt={job.prompt} />`)
  },
  {
    description: "Reusable header and footer blocks for product shells, docs, and sectioned marketing pages.",
    examples: [
      {
        description: "Useful when you need a full shell pattern instead of assembling every top-level navigation piece manually.",
        id: "layout-shell-overview",
        preview: (
          <div className="grid gap-4">
            <Header brand={headerBrand} currentPath="/guides/getting-started" navItems={libraryNavItems} socialItems={socialItems} user={headerUser} />
            <Footer columns={footerColumns} note="Paper-and-ink layout blocks keep docs and product shells visually aligned." title="Ghibli UI" />
          </div>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { Footer, Header } from "@/components/blocks/layout/shell";

<Header brand={brand} navItems={navItems} />
<Footer title="Ghibli UI" note="..." columns={columns} />`
        ),
        title: "Header + footer"
      }
    ],
    exports: ["Header", "Footer"],
    family: "Layout",
    importSnippet: snippet("Import", "tsx", `import { Footer, Header } from "@/components/blocks/layout/shell";`),
    installSnippet: installSnippet("layout-shell"),
    inventory: ["Header", "User menu", "Mobile sheet", "Footer columns"],
    kind: "pattern",
    name: "layout-shell",
    notes: [
      "Treat this as a product shell pattern, not as a requirement for every page.",
      "The docs app can be custom while still documenting the installable shell pattern."
    ],
    preview: (
      <div className="grid gap-4">
        <Header brand={headerBrand} currentPath="/guides/getting-started" navItems={libraryNavItems} socialItems={socialItems} user={headerUser} />
        <Footer columns={footerColumns} note="Paper-and-ink layout blocks keep docs and app surfaces visually aligned." title="Ghibli UI" />
      </div>
    ),
    related: ["avatar", "dropdown-menu", "sheet"],
    storybookTitle: "Patterns/Layout/Layout Shell",
    summary: "Header and footer shell pattern for larger app surfaces.",
    title: "Layout Shell",
    usageSnippet: snippet("Basic usage", "tsx", `<Header brand={brand} navItems={navItems} user={user} />`)
  },
  {
    description: "Calm empty-state pattern with room for a follow-up action.",
    examples: [
      {
        description: "Use for zero-data screens, empty search results, or newly created spaces.",
        id: "empty-state-overview",
        preview: (
          <EmptyState
            action={<Button>Create first project</Button>}
            description="Use this when a feed or account section has no data yet."
            title="Nothing here yet"
          />
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { EmptyState } from "@/components/blocks/shared/empty-state";

<EmptyState
  title="Nothing here yet"
  description="Use this when a list has no items."
  action={<Button>Create first item</Button>}
/>`
        ),
        title: "Zero-data state"
      }
    ],
    exports: ["EmptyState"],
    family: "Layout",
    importSnippet: snippet("Import", "tsx", `import { EmptyState } from "@/components/blocks/shared/empty-state";`),
    installSnippet: installSnippet("empty-state"),
    inventory: ["Title", "Description", "Optional action area"],
    kind: "pattern",
    name: "empty-state",
    notes: [
      "Use specific copy about the missing content instead of generic apology text.",
      "A good empty state usually points to the next user action."
    ],
    preview: (
      <EmptyState
        action={<Button>Create first project</Button>}
        description="Use this when a feed or account section has no data yet."
        title="Nothing here yet"
      />
    ),
    related: ["card", "skeleton", "button"],
    storybookTitle: "Patterns/Layout/Empty State",
    summary: "Reusable empty-state block for first-run and no-results moments.",
    title: "Empty State",
    usageSnippet: snippet("Basic usage", "tsx", `<EmptyState title="No results" description="Try a different filter." />`)
  },
  {
    description: "Profile, linked accounts, subscription, and API credits bundled for settings and billing pages.",
    examples: [
      {
        description: "Use the sections together or drop them into different account pages as needed.",
        id: "account-sections-overview",
        preview: (
          <div className="grid gap-4">
            <AccountProfileSection email="hello@ghibli-ui.dev" name="Mina Journal" planLabel="Atelier plan" />
            <AccountLinkedAccountsSection accounts={linkedAccounts} />
            <AccountSubscriptionSection
              features={["200 monthly generations", "Priority queue access", "Reviewer links", "Variation tools"]}
              offers={subscriptionOffers}
              planName="Atelier plan"
              renewalText="Renews on April 14, 2026"
            />
            <AccountApiCreditsSection balanceLabel="128 credits" ledger={creditLedger} offers={creditOffers} />
          </div>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { AccountProfileSection, AccountSubscriptionSection } from "@/components/blocks/account/sections";`
        ),
        title: "Account settings stack"
      }
    ],
    exports: [
      "AccountProfileSection",
      "AccountLinkedAccountsSection",
      "AccountSubscriptionSection",
      "AccountApiCreditsSection"
    ],
    family: "Account",
    importSnippet: snippet(
      "Import",
      "tsx",
      `import {
  AccountApiCreditsSection,
  AccountLinkedAccountsSection,
  AccountProfileSection,
  AccountSubscriptionSection
} from "@/components/blocks/account/sections";`
    ),
    installSnippet: installSnippet("account-sections"),
    inventory: ["Profile", "Linked accounts", "Subscription", "API credits"],
    kind: "pattern",
    name: "account-sections",
    notes: [
      "Each section is independent, so account pages can stay modular.",
      "Keep billing and credit actions in the host app so side effects remain explicit."
    ],
    preview: (
      <div className="grid gap-4">
        <AccountProfileSection email="hello@ghibli-ui.dev" name="Mina Journal" planLabel="Atelier plan" />
        <AccountLinkedAccountsSection accounts={linkedAccounts} />
        <AccountSubscriptionSection
          features={["200 monthly generations", "Priority queue access", "Reviewer links", "Variation tools"]}
          offers={subscriptionOffers}
          planName="Atelier plan"
          renewalText="Renews on April 14, 2026"
        />
      </div>
    ),
    related: ["account-dialogs", "card", "badge"],
    storybookTitle: "Patterns/Account/Account Sections",
    summary: "Modular account-management sections for settings and billing UI.",
    title: "Account Sections",
    usageSnippet: snippet("Basic usage", "tsx", `<AccountProfileSection name={name} email={email} />`)
  },
  {
    description: "Small account maintenance dialogs for changing email or password in-place.",
    examples: [
      {
        description: "Use these for focused maintenance tasks within a broader settings surface.",
        id: "account-dialogs-overview",
        preview: (
          <Card>
            <CardHeader>
              <CardTitle>Focused account dialogs</CardTitle>
              <CardDescription>Use these for short email and password maintenance flows.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="secondary">Change email</Button>
              <Button variant="secondary">Change password</Button>
            </CardContent>
          </Card>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import { AccountChangeEmailDialog, AccountChangePasswordDialog } from "@/components/blocks/account/dialogs";`
        ),
        title: "Focused account dialogs"
      }
    ],
    exports: ["AccountChangeEmailDialog", "AccountChangePasswordDialog"],
    family: "Account",
    importSnippet: snippet(
      "Import",
      "tsx",
      `import { AccountChangeEmailDialog, AccountChangePasswordDialog } from "@/components/blocks/account/dialogs";`
    ),
    installSnippet: installSnippet("account-dialogs"),
    inventory: ["Change email dialog", "Change password dialog"],
    kind: "pattern",
    name: "account-dialogs",
    notes: [
      "Use controlled open state and handle submission side effects in the host app.",
      "Keep validation messages close to the fields, not outside the dialog frame."
    ],
    preview: (
      <Card>
        <CardHeader>
          <CardTitle>Account dialogs</CardTitle>
          <CardDescription>Controlled open state keeps these easy to wire into any settings page.</CardDescription>
        </CardHeader>
      </Card>
    ),
    related: ["account-sections", "dialog", "input"],
    storybookTitle: "Patterns/Account/Account Dialogs",
    summary: "Focused settings dialogs for email and password maintenance.",
    title: "Account Dialogs",
    usageSnippet: snippet("Basic usage", "tsx", `<AccountChangeEmailDialog open={open} onOpenChange={setOpen} />`)
  },
  {
    description: "Hero, features, and CTA sections for documentation, product marketing, and landing pages.",
    examples: [
      {
        description: "A small set of sections that can build softer marketing and documentation landing pages.",
        id: "marketing-sections-overview",
        preview: (
          <div className="grid gap-4">
            <MarketingHeroSection
              badge="registry-first"
              description="Soft, installable surfaces derived from the library registry rather than a package-only dependency model."
              primaryAction={<Button>Start with the style item</Button>}
              secondaryAction={<Button variant="secondary">Browse components</Button>}
              title="Paper-and-ink UI for creative products"
              visual={marketingVisual}
            />
            <MarketingFeaturesSection heading="Features" intro="Grouped sections stay generic and composable." items={featureVisualItems} />
            <MarketingCtaSection description="Use this section to close a landing page, docs overview, or example gallery." title="Ship a softer interface" />
          </div>
        ),
        snippet: snippet(
          "Usage",
          "tsx",
          `import {
  MarketingCtaSection,
  MarketingFeaturesSection,
  MarketingHeroSection
} from "@/components/blocks/marketing/sections";`
        ),
        title: "Landing-page sections"
      }
    ],
    exports: ["MarketingHeroSection", "MarketingFeaturesSection", "MarketingCtaSection"],
    family: "Marketing",
    importSnippet: snippet(
      "Import",
      "tsx",
      `import {
  MarketingCtaSection,
  MarketingFeaturesSection,
  MarketingHeroSection
} from "@/components/blocks/marketing/sections";`
    ),
    installSnippet: installSnippet("marketing-sections"),
    inventory: ["Hero section", "Feature grid", "CTA section"],
    kind: "pattern",
    name: "marketing-sections",
    notes: [
      "Treat these as section building blocks, not as a full-page template system.",
      "The sections work especially well for docs homepages, launch pages, and product overviews."
    ],
    preview: (
      <div className="grid gap-4">
        <MarketingHeroSection
          badge="registry-first"
          description="Soft, installable surfaces derived from the library registry rather than a package-only dependency model."
          primaryAction={<Button>Start with the style item</Button>}
          secondaryAction={<Button variant="secondary">Browse components</Button>}
          title="Paper-and-ink UI for creative products"
          visual={marketingVisual}
        />
        <MarketingFeaturesSection heading="Features" intro="Grouped sections stay generic and composable." items={featureVisualItems} />
      </div>
    ),
    related: ["card", "empty-state", "layout-shell"],
    storybookTitle: "Patterns/Marketing/Marketing Sections",
    summary: "Section patterns for landing pages, docs overviews, and softer product marketing.",
    title: "Marketing Sections",
    usageSnippet: snippet("Basic usage", "tsx", `<MarketingHeroSection title="Hello" description="..." visual={visual} />`)
  },
  {
    description: "FAQ accordion block for docs, help centers, and policy pages.",
    examples: [
      {
        description: "Use the block directly on docs pages when the question-and-answer format is already a good fit.",
        id: "docs-faq-overview",
        preview: <DocsFaqAccordion items={faqItems} />,
        snippet: snippet(
          "Usage",
          "tsx",
          `import { DocsFaqAccordion } from "@/components/blocks/docs/faq-accordion";

<DocsFaqAccordion items={faqItems} />`
        ),
        title: "FAQ block"
      }
    ],
    exports: ["DocsFaqAccordion"],
    family: "Marketing",
    importSnippet: snippet("Import", "tsx", `import { DocsFaqAccordion } from "@/components/blocks/docs/faq-accordion";`),
    installSnippet: installSnippet("docs-faq-accordion"),
    inventory: ["Heading row", "Accordion list", "Question and answer slots"],
    kind: "pattern",
    name: "docs-faq-accordion",
    notes: [
      "Best for concise answers. If the answer grows too long, link to a deeper guide instead.",
      "Use consistent question phrasing so scanning remains easy."
    ],
    preview: <DocsFaqAccordion items={faqItems} />,
    related: ["accordion", "marketing-sections", "card"],
    storybookTitle: "Patterns/Marketing/Docs FAQ Accordion",
    summary: "FAQ block for docs, support pages, and product education.",
    title: "Docs FAQ Accordion",
    usageSnippet: snippet("Basic usage", "tsx", `<DocsFaqAccordion items={faqItems} />`)
  }
];

export const libraryExamples: LibraryExample[] = [
  {
    description: "A compact authentication surface using the reusable auth forms and dialog shell.",
    id: "auth",
    preview: (
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <LoginForm
            email=""
            helperText="Keep auth copy short and warm."
            onEmailChange={() => undefined}
            onPasswordChange={() => undefined}
            password=""
          />
          <RegisterForm
            confirmPassword=""
            email=""
            name=""
            onConfirmPasswordChange={() => undefined}
            onEmailChange={() => undefined}
            onNameChange={() => undefined}
            onPasswordChange={() => undefined}
            password=""
          />
        </div>
      </div>
    ),
    related: ["auth-forms", "auth-dialog", "dialog"],
    snippet: snippet(
      "Auth example",
      "tsx",
      `import { LoginForm, RegisterForm } from "@/components/blocks/auth/forms";

export function AuthExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <LoginForm {...loginProps} />
      <RegisterForm {...registerProps} />
    </div>
  );
}`
    ),
    title: "Auth starter"
  },
  {
    description: "A simple editorial form layout with supporting visual context and clean field spacing.",
    id: "forms",
    preview: (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Card>
          <CardHeader>
            <CardTitle>Project brief</CardTitle>
            <CardDescription>Use simple primitives to build calmer forms.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="example-title">Title</Label>
              <Input id="example-title" placeholder="A quiet riverside cafe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="example-notes">Notes</Label>
              <Textarea id="example-notes" defaultValue="Warm fog, paper lanterns, painted reflections." />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>Save brief</Button>
              <Button variant="secondary">Preview</Button>
            </div>
          </CardContent>
        </Card>
        {formVisual}
      </div>
    ),
    related: ["input", "textarea", "button"],
    snippet: snippet(
      "Form example",
      "tsx",
      `import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea } from "@ghibli/ui";`
    ),
    title: "Editorial form"
  },
  {
    description: "A compact navigation pattern mixing a shell header with tabs and menus.",
    id: "navigation",
    preview: (
      <div className="grid gap-4">
        <Header brand={headerBrand} currentPath="/components" navItems={libraryNavItems} socialItems={socialItems} user={headerUser} />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Overview content</TabsContent>
            <TabsContent value="assets">Assets content</TabsContent>
          </Tabs>
          {navigationVisual}
        </div>
      </div>
    ),
    related: ["layout-shell", "tabs", "dropdown-menu"],
    snippet: snippet(
      "Navigation example",
      "tsx",
      `import { Header, Tabs, TabsContent, TabsList, TabsTrigger } from "@ghibli/ui";`
    ),
    title: "Navigation starter"
  },
  {
    description: "A small marketing page composition using the installable section patterns without turning into a full template.",
    id: "marketing",
    preview: (
      <div className="grid gap-4">
        <MarketingHeroSection
          badge="example"
          description="Use this composition for softer marketing pages, launch notes, or internal docs homepages."
          primaryAction={<Button>Start with style</Button>}
          secondaryAction={<Button variant="secondary">Browse patterns</Button>}
          title="A gentle marketing composition"
          visual={marketingVisual}
        />
        <MarketingFeaturesSection heading="Why it works" intro="The same sections can be reused without locking teams into a template system." items={featureItems} />
        <MarketingCtaSection description="Close the page with a simple follow-up action." title="Ready to adapt it?" />
      </div>
    ),
    related: ["marketing-sections", "card", "button"],
    snippet: snippet(
      "Marketing example",
      "tsx",
      `import {
  MarketingCtaSection,
  MarketingFeaturesSection,
  MarketingHeroSection
} from "@ghibli/ui";`
    ),
    title: "Marketing composition"
  }
];

export const guideIndex = new Map(guides.map((guide) => [guide.slug, guide]));
export const componentIndex = new Map(componentDocs.map((item) => [item.name, item]));
export const patternIndex = new Map(patternDocs.map((item) => [item.name, item]));
export const allDocItems = [...componentDocs, ...patternDocs];
export const allDocItemIndex = new Map(allDocItems.map((item) => [item.name, item]));
export const componentFamilies = Array.from(new Set(componentDocs.map((item) => item.family)));
export const patternFamilies = Array.from(new Set(patternDocs.map((item) => item.family)));
export const featuredComponents = componentDocs.slice(0, 6);
export const featuredPatterns = patternDocs.slice(0, 6);
export const featuredGuides = guides.slice(0, 3);
