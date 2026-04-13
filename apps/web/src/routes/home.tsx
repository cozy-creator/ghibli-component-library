import { useState, type ReactNode } from "react";
import {
  BookOpen,
  ChevronDown,
  FileText,
  Flower2,
  LogIn,
  LogOut,
  MessageCircle,
  Sparkles,
  UserRound,
  Wand2,
} from "lucide-react";

import {
  AccountApiCreditsSection,
  AccountChangeEmailDialog,
  AccountChangePasswordDialog,
  AccountLinkedAccountsSection,
  AccountProfileSection,
  AccountSubscriptionSection,
  AuthDialog,
  Badge,
  Button,
  CartoonButton,
  CommunityImageCard,
  CommunityImageModal,
  CommunityTabsList,
  CommunityVideoCard,
  CommunityVideoModal,
  DocsArticle,
  DocsCallout,
  DocsCodeBlock,
  DocsFaqAccordion,
  DocsH2,
  DocsParagraph,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  EmptyStateAction,
  FloatingAction,
  FormField,
  GenerateAspectRatioSelect,
  GenerateButton,
  GenerateEditorBar,
  GenerateModelSelect,
  GenerateNegativePromptMenu,
  GenerateNumImagesControl,
  GenerateQuickPicks,
  GenerateUploadDialog,
  HandDrawnFrame,
  HandDrawnRule,
  Input,
  LoginForm,
  NoticeBanner,
  PageHero,
  PageSection,
  PageShell,
  RegisterForm,
  ShellFooter,
  ShellHeader,
  Tabs,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ghibli/ui";

import {
  DocsHeaderIcon,
  GitHubHeaderIcon,
  mockHeaderAvatarUrl,
} from "@/apps/web/src/components/site-header-icons";
import {
  AppleAuthIcon,
  DiscordAuthIcon,
  GitHubAuthIcon,
  GoogleAuthIcon,
} from "@/apps/web/src/components/auth-provider-icons";

import {
  aspectRatioOptions,
  communityImageItems,
  communityVideoItems,
  creditLedger,
  creditOffers,
  faqItems,
  footerColumns,
  linkedAccounts,
  modeOptions,
  modelOptions,
  sampleAttachments,
  subscriptionOffers,
} from "@/apps/web/src/data/demo-fixtures";

const installCommand = "pnpm dlx shadcn@latest add @ghibli/components";

const registrySnippet = `{
  "registries": {
    "@ghibli": "https://<your-domain>/r/{name}.json"
  }
}`;

const handDrawnFrameShapes = [
  "organic",
  "steady",
  "pill",
  "panel",
  "surface",
  "card",
  "banner",
  "divider",
] as const;

type ShowcaseHandDrawnFrameShape = (typeof handDrawnFrameShapes)[number];

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function resolveFrameNumberInput(
  value: string,
  fallback: number,
  {
    max,
    min,
    precision = 2,
  }: {
    max: number;
    min: number;
    precision?: number;
  },
) {
  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Number.parseFloat(clampNumber(parsed, min, max).toFixed(precision));
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="max-w-full overflow-x-auto border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.42)] px-4 py-3 text-sm leading-7 text-[color:var(--ink-strong)]">
      <code>{children}</code>
    </pre>
  );
}

const repoUrl = "https://github.com/rodrigoluz/ghibli-component-library";

function LibraryMark({ className }: { className?: string }) {
  return (
    <HandDrawnFrame
      className={className ?? "size-12 shrink-0 bg-white/45 p-2.5"}
      deformationIntensity={0.7}
      shape="organic"
      strokeColor="var(--border-strong)"
      strokeWidth={1.85}
    >
      <Flower2
        aria-hidden="true"
        className="size-full text-[color:var(--ink-strong)]"
      />
    </HandDrawnFrame>
  );
}

function DemoGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}

function DemoSurface({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0 border border-[color:var(--border-soft)] bg-[color:rgba(255,255,255,0.35)] p-4">
      {children}
    </div>
  );
}

function ShowcaseGroup({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  return <section className="grid gap-8" id={id}>{children}</section>;
}

function Specimen({
  children,
  id,
  note,
  title,
}: {
  children: ReactNode;
  id: string;
  note?: string;
  title: string;
}) {
  return (
    <section
      className="grid scroll-mt-28 gap-4 border-t border-[color:rgba(77,59,46,0.32)] py-8 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-8"
      data-showcase-item={title}
      id={id}
    >
      <div className="grid content-start gap-2">
        <h2 className="font-[var(--font-heading)] text-3xl leading-none text-[color:var(--ink-strong)]">
          {title}
        </h2>
        {note ? (
          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
            {note}
          </p>
        ) : null}
      </div>
      <div className="min-w-0 overflow-x-clip overflow-y-visible px-1">
        {children}
      </div>
    </section>
  );
}

function FrameBooleanField({
  description,
  label,
  onChange,
  value,
}: {
  description: string;
  label: string;
  onChange: (nextValue: boolean) => void;
  value: boolean;
}) {
  return (
    <FormField description={description} label={label}>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => onChange(true)}
          size="sm"
          type="button"
          variant={value ? "secondary" : "ghost"}
        >
          On
        </Button>
        <Button
          onClick={() => onChange(false)}
          size="sm"
          type="button"
          variant={value ? "ghost" : "secondary"}
        >
          Off
        </Button>
      </div>
    </FormField>
  );
}

export function HomePage() {
  const [activeTab, setActiveTab] = useState("live-feed");
  const [mode, setMode] = useState("image");
  const [model, setModel] = useState("riverlight-v3");
  const [aspectRatio, setAspectRatio] = useState("3:4");
  const [numImages, setNumImages] = useState(2);
  const [prompt, setPrompt] = useState(
    "A quiet ferry deck at dusk, paper lantern reflections across the water, soft watercolor lighting.",
  );
  const [negativePrompt, setNegativePrompt] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [communityImageIndex, setCommunityImageIndex] = useState<number | null>(null);
  const [communityVideoIndex, setCommunityVideoIndex] = useState<number | null>(null);
  const [newEmail, setNewEmail] = useState("new-address@ghibli-ui.test");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [frameShape, setFrameShape] =
    useState<ShowcaseHandDrawnFrameShape>("organic");
  const [frameDeformationIntensityInput, setFrameDeformationIntensityInput] =
    useState("0.7");
  const [frameStrokeWidthInput, setFrameStrokeWidthInput] = useState("2.4");
  const [frameSeedInput, setFrameSeedInput] = useState("frame-playground");
  const [frameUseDeformationVariation, setFrameUseDeformationVariation] =
    useState(true);
  const [frameUseThicknessVariation, setFrameUseThicknessVariation] =
    useState(true);
  const authProviderActions = [
    {
      icon: <GoogleAuthIcon />,
      id: "google",
      label: "Google",
      onSelect: () => undefined,
    },
    {
      icon: <GitHubAuthIcon />,
      id: "github",
      label: "GitHub",
      onSelect: () => undefined,
    },
    {
      icon: <DiscordAuthIcon />,
      id: "discord",
      label: "Discord",
      onSelect: () => undefined,
    },
    {
      icon: <AppleAuthIcon />,
      id: "apple",
      label: "Apple",
      onSelect: () => undefined,
    },
  ];
  const resolvedFrameDeformationIntensity = resolveFrameNumberInput(
    frameDeformationIntensityInput,
    0.7,
    { max: 10, min: 0 },
  );
  const resolvedFrameStrokeWidth = resolveFrameNumberInput(
    frameStrokeWidthInput,
    2.4,
    { max: 4, min: 0.5 },
  );
  const resolvedFrameSeed = frameSeedInput.trim() || undefined;
  const framePreviewSeedProps = resolvedFrameSeed
    ? { seed: resolvedFrameSeed }
    : {};
  const frameShapeLabel = frameShape === "divider"
    ? "Divider"
    : frameShape.charAt(0).toUpperCase() + frameShape.slice(1);
  const framePreviewSnippet = frameShape === "divider"
    ? `<HandDrawnRule
  deformationIntensity={${resolvedFrameDeformationIntensity}}
  strokeWidth={${resolvedFrameStrokeWidth}}
${resolvedFrameSeed ? `  seed="${resolvedFrameSeed}"\n` : ""}  useDeformationVariation={${frameUseDeformationVariation}}
  useThicknessVariation={${frameUseThicknessVariation}}
/>`
    : `<HandDrawnFrame
  shape="${frameShape}"
  deformationIntensity={${resolvedFrameDeformationIntensity}}
  strokeWidth={${resolvedFrameStrokeWidth}}
${resolvedFrameSeed ? `  seed="${resolvedFrameSeed}"\n` : ""}  useDeformationVariation={${frameUseDeformationVariation}}
  useThicknessVariation={${frameUseThicknessVariation}}
>
  ...
</HandDrawnFrame>`;
  const featuredCommunityImages = communityImageItems.slice(0, 2);
  const featuredCommunityVideos = communityVideoItems.slice(0, 2);

  return (
    <div
      className="mx-auto grid w-full max-w-6xl gap-10 overflow-x-clip py-4 md:py-10"
      data-testid="component-showcase"
    >
      <section className="grid gap-6" id="install">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          <DemoSurface>
            <div className="grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Install all components
              </p>
              <CodeBlock>{installCommand}</CodeBlock>
            </div>
          </DemoSurface>
          <DemoSurface>
            <div className="grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Registry setup
              </p>
              <CodeBlock>{registrySnippet}</CodeBlock>
            </div>
          </DemoSurface>
        </div>
      </section>

      <ShowcaseGroup id="shell-navigation">
        <Specimen
          id="component-user-popup"
          note="The layout shell header, utility links, and user menu are shown directly instead of abstract placeholders."
          title="Header / User Popup"
        >
          <div className="[&>header]:static">
            <ShellHeader
              brand={
                <a className="inline-flex items-center gap-3" href="#install">
                  <LibraryMark />
                  <span className="font-[var(--font-heading)] text-2xl text-[color:var(--ink-strong)]">
                    Ghibli UI
                  </span>
                </a>
              }
              navItems={[
                { active: true, href: "#generate-flows", label: "Generate" },
                { href: "#community-flows", label: "Community" },
                { href: "#docs-screens", label: "Docs" },
              ]}
              socialItems={[
                {
                  external: true,
                  href: repoUrl,
                  icon: <GitHubHeaderIcon />,
                  iconOnly: true,
                  label: "GitHub",
                },
                {
                  href: "#docs-screens",
                  icon: <DocsHeaderIcon />,
                  iconOnly: true,
                  label: "Docs",
                },
              ]}
              user={{
                avatarUrl: mockHeaderAvatarUrl,
                initials: "MS",
                menuItems: [
                  {
                    icon: <UserRound className="size-4" />,
                    id: "account",
                    label: "Account",
                  },
                  {
                    destructive: true,
                    icon: <LogOut className="size-4" />,
                    id: "logout",
                    label: "Sign out",
                  },
                ],
                name: "User",
                subtitle: "mei@ghibli-ui.test",
              }}
            />
          </div>
        </Specimen>

        <Specimen
          id="component-tabs"
          note="The community tab switch used for live feed, video, and X posts."
          title="Tabs Switch"
        >
          <Tabs className="min-w-0 gap-6" onValueChange={setActiveTab} value={activeTab}>
            <CommunityTabsList activeTab={activeTab} />
          </Tabs>
        </Specimen>

        <Specimen
          id="component-hand-drawn-frame"
          note="The frame primitive now uses the Cozy deformation API directly, including divider rules, seeded wobble, and layered stroke variation."
          title="Hand Drawn Frame"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="grid gap-4 md:col-span-2 xl:col-span-3 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
              <DemoSurface>
                <div className="grid gap-3">
                  <FormField
                    description="Select from the current Cozy frame shapes."
                    label="Shape"
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          aria-label="Shape"
                          className="w-full rounded-[inherit] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--paper)]"
                          type="button"
                        >
                          <HandDrawnFrame
                            className="bg-[color:var(--card)] px-3 py-2.5"
                            contentClassName="flex items-center justify-between gap-3"
                            deformationIntensity={0.3}
                            shape="banner"
                            strokeWidth={1.25}
                          >
                            <span className="text-sm font-medium text-[color:var(--ink-strong)]">
                              {frameShapeLabel}
                            </span>
                            <ChevronDown
                              aria-hidden="true"
                              className="size-4 shrink-0 text-[color:var(--muted-foreground)]"
                            />
                          </HandDrawnFrame>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="shell-header-user-menu overflow-visible border-0 bg-transparent p-0 ring-0"
                        sideOffset={10}
                      >
                        <HandDrawnFrame
                          className="w-56 bg-[color:var(--paper)] px-3 py-2"
                          contentClassName="grid gap-1"
                          deformationIntensity={0.8}
                          shape="panel"
                          strokeWidth={1.6}
                        >
                          {handDrawnFrameShapes.map((shapeOption) => (
                            <DropdownMenuItem
                              className="gap-1.5 px-0 py-1.5 whitespace-nowrap focus:bg-[color:var(--ring)] focus:text-[color:var(--ink-strong)] data-[highlighted]:bg-[color:var(--ring)] data-[highlighted]:text-[color:var(--ink-strong)]"
                              key={shapeOption}
                              onClick={() => setFrameShape(shapeOption)}
                            >
                              {shapeOption === "divider"
                                ? "Divider"
                                : shapeOption.charAt(0).toUpperCase() +
                                  shapeOption.slice(1)}
                            </DropdownMenuItem>
                          ))}
                        </HandDrawnFrame>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormField>
                  <FormField
                    action={<span className="text-xs text-muted-foreground">0-10</span>}
                    label="Deformation Intensity"
                  >
                    <Input
                      max="10"
                      min="0"
                      onChange={(event) =>
                        setFrameDeformationIntensityInput(event.target.value)
                      }
                      step="0.05"
                      type="number"
                      value={frameDeformationIntensityInput}
                    />
                  </FormField>
                  <FormField label="Seed">
                    <Input
                      onChange={(event) => setFrameSeedInput(event.target.value)}
                      placeholder="frame-playground"
                      value={frameSeedInput}
                    />
                  </FormField>
                  <FormField
                    action={
                      <span className="text-xs text-muted-foreground">0.5-4</span>
                    }
                    label="Stroke Width"
                  >
                    <Input
                      max="4"
                      min="0.5"
                      onChange={(event) => setFrameStrokeWidthInput(event.target.value)}
                      step="0.05"
                      type="number"
                      value={frameStrokeWidthInput}
                    />
                  </FormField>
                  <FrameBooleanField
                    description="Toggles the seeded deformation key used by the Cozy frame generator."
                    label="Use Deformation Variation"
                    onChange={setFrameUseDeformationVariation}
                    value={frameUseDeformationVariation}
                  />
                  <FrameBooleanField
                    description="Layers several dash-masked strokes to vary thickness like the Cozy source."
                    label="Use Thickness Variation"
                    onChange={setFrameUseThicknessVariation}
                    value={frameUseThicknessVariation}
                  />
                </div>
              </DemoSurface>
              <DemoSurface>
                <div className="grid gap-4">
                  <div className="grid gap-1">
                    <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                      Interactive playground
                    </p>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Change the current Cozy frame props and preview the result live.
                    </p>
                  </div>
                  {frameShape === "divider" ? (
                    <div className="grid gap-3">
                      <span className="text-sm text-[color:var(--ink-strong)]">
                        Section one
                      </span>
                      <HandDrawnRule
                        deformationIntensity={resolvedFrameDeformationIntensity}
                        strokeWidth={resolvedFrameStrokeWidth}
                        useDeformationVariation={frameUseDeformationVariation}
                        useThicknessVariation={frameUseThicknessVariation}
                        {...framePreviewSeedProps}
                      />
                      <span className="text-sm text-[color:var(--ink-strong)]">
                        Section two
                      </span>
                    </div>
                  ) : (
                    <HandDrawnFrame
                      className="bg-[color:var(--card)] px-5 py-5"
                      deformationIntensity={resolvedFrameDeformationIntensity}
                      shape={frameShape}
                      strokeWidth={resolvedFrameStrokeWidth}
                      useDeformationVariation={frameUseDeformationVariation}
                      useThicknessVariation={frameUseThicknessVariation}
                      {...framePreviewSeedProps}
                    >
                      <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                        Frame preview
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Shapes, seeds, and layered thickness drift all come from the shared primitive.
                      </p>
                    </HandDrawnFrame>
                  )}
                  <CodeBlock>{framePreviewSnippet}</CodeBlock>
                </div>
              </DemoSurface>
            </div>
            <HandDrawnFrame
              className="bg-[color:var(--card)] px-5 py-5"
              deformationIntensity={0.7}
              seed="frame-example-organic"
              shape="organic"
              strokeWidth={2.4}
            >
              <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                Organic callout
              </p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                <code>shape="organic" deformationIntensity=&#123;0.7&#125; strokeWidth=&#123;2.4&#125;</code>
              </p>
            </HandDrawnFrame>
            <HandDrawnFrame
              className="bg-[color:rgba(255,255,255,0.55)] px-5 py-4"
              deformationIntensity={0.45}
              seed="frame-example-steady"
              shape="steady"
              strokeWidth={1.4}
            >
              <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                Steady shell chip
              </p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                <code>shape="steady" deformationIntensity=&#123;0.45&#125; seed="frame-example-steady"</code>
              </p>
            </HandDrawnFrame>
            <HandDrawnFrame
              className="w-fit bg-[color:color-mix(in_oklab,var(--ring)_22%,white)] px-5 py-2 text-[color:var(--primary)]"
              deformationIntensity={0.9}
              seed="frame-example-pill"
              shape="pill"
              strokeWidth={1.35}
            >
              <div className="grid gap-1">
                <span className="font-medium">Pill navigation</span>
                <span className="text-[11px] text-[color:var(--ink-soft)]">
                  <code>shape="pill" deformationIntensity=&#123;0.9&#125;</code>
                </span>
              </div>
            </HandDrawnFrame>
            <HandDrawnFrame
              className="bg-[color:rgba(255,255,255,0.52)] px-5 py-5"
              deformationIntensity={0.5}
              seed="frame-example-panel"
              shape="panel"
              strokeWidth={1.6}
            >
              <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                Panel grouping
              </p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                <code>shape="panel" deformationIntensity=&#123;0.5&#125;</code>
              </p>
            </HandDrawnFrame>
            <HandDrawnFrame
              className="bg-[color:rgba(255,255,255,0.58)] px-5 py-5"
              deformationIntensity={0.35}
              seed="frame-example-surface"
              shape="surface"
              strokeWidth={1.4}
              useThicknessVariation={false}
            >
              <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                Quiet surface
              </p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                <code>useThicknessVariation=&#123;false&#125;</code>
              </p>
            </HandDrawnFrame>
            <HandDrawnFrame
              className="overflow-hidden bg-[linear-gradient(180deg,rgba(249,243,226,0.98),rgba(239,227,193,0.98))]"
              clipContent
              deformationIntensity={0.6}
              seed="frame-example-card"
              shape="card"
              strokeWidth={1.55}
            >
              <div className="aspect-[4/5] bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(63,43,19,0.18))]" />
              <div className="px-4 py-3 text-center font-[var(--font-heading)] text-[1.05rem] text-[color:var(--ink-strong)]">
                Card clip content
              </div>
            </HandDrawnFrame>
            <HandDrawnFrame
              className="bg-[color:var(--paper)] px-5 py-4"
              deformationIntensity={0.3}
              seed="frame-example-banner"
              shape="banner"
              strokeWidth={1.25}
            >
              <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                Calm banner
              </p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                <code>shape="banner" deformationIntensity=&#123;0.3&#125;</code>
              </p>
            </HandDrawnFrame>
            <DemoSurface>
              <div className="grid gap-3">
                <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                  Divider rule
                </p>
                <HandDrawnRule
                  deformationIntensity={0.5}
                  seed="frame-example-divider"
                  strokeWidth={1.1}
                />
                <p className="text-xs leading-6 text-muted-foreground">
                  <code>HandDrawnRule deformationIntensity=&#123;0.5&#125; strokeWidth=&#123;1.1&#125;</code>
                </p>
              </div>
            </DemoSurface>
          </div>
        </Specimen>
      </ShowcaseGroup>

      <ShowcaseGroup id="core-primitives">
        <Specimen
          id="component-button"
          note="The base shadcn-style action primitive."
          title="Button"
        >
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button aria-label="Magic" size="icon">
              <Wand2 className="size-4" />
            </Button>
          </div>
        </Specimen>

        <Specimen
          id="component-cartoon-button"
          note="The chunky CTA used across the generate flow."
          title="Cartoon Button"
        >
          <div className="flex flex-wrap gap-3">
            <CartoonButton
              color="#7b9d68"
              icon={<Sparkles className="size-4" />}
              onClick={() => undefined}
              text="Generate"
            />
            <CartoonButton
              color="#b87347"
              onClick={() => undefined}
              size="sm"
              text="Try again"
            />
            <CartoonButton color="#7fa8bb" loading text="Uploading" />
          </div>
        </Specimen>

        <Specimen
          id="component-forms"
          note="The field primitives and form wrapper used by auth and generate surfaces."
          title="Input, Textarea, Form Field"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              description="A reusable label/action/error wrapper."
              error="Example validation message."
              label="Prompt title"
            >
              <Input placeholder="Tea shop by the river" />
            </FormField>
            <FormField
              action={
                <button className="text-xs text-muted-foreground">
                  Optional
                </button>
              }
              label="Long prompt"
            >
              <Textarea placeholder="Describe the scene, mood, light, and style..." />
            </FormField>
          </div>
        </Specimen>

      </ShowcaseGroup>

      <ShowcaseGroup id="auth-flows">
        <Specimen
          id="pattern-auth-forms"
          note="Cozy-style auth entry points stay button-driven and open the matching modal instead of rendering full forms inline."
          title="Auth Forms"
        >
          <div className="flex flex-wrap gap-3">
            <CartoonButton
              color="var(--success)"
              icon={<LogIn className="size-4" />}
              onClick={() => {
                setAuthTab("login");
                setAuthOpen(true);
              }}
              text="Sign in"
            />
            <Button
              onClick={() => {
                setAuthTab("register");
                setAuthOpen(true);
              }}
              variant="secondary"
            >
              Create account
            </Button>
            <CartoonButton
              color="var(--success)"
              onClick={() => setPasswordDialogOpen(true)}
              size="sm"
              text="Change password"
            />
          </div>
          <AuthDialog
            loginContent={
              <LoginForm
                email=""
                onEmailChange={() => undefined}
                onForgotPassword={() => undefined}
                onPasswordChange={() => undefined}
                password=""
                providerActions={authProviderActions}
              />
            }
            onOpenChange={setAuthOpen}
            onTabChange={setAuthTab}
            open={authOpen}
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
                providerActions={authProviderActions}
              />
            }
            tab={authTab}
          />
          <AccountChangePasswordDialog
            confirmPassword={confirmPassword}
            currentPassword={currentPassword}
            newPassword={newPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onCurrentPasswordChange={setCurrentPassword}
            onNewPasswordChange={setNewPassword}
            onOpenChange={setPasswordDialogOpen}
            open={passwordDialogOpen}
          />
        </Specimen>
      </ShowcaseGroup>

      <ShowcaseGroup id="community-flows">
        <Specimen
          id="pattern-community-cards"
          note="Two Cozy-style image cards with the same click-through gallery viewer."
          title="Image Card"
        >
          <div className="ghibli-showcase-image-card-grid">
            {featuredCommunityImages.map((item, index) => (
              <CommunityImageCard
                imageUrl={item.imageUrl}
                key={item.id}
                meta={item.meta}
                onClick={() => setCommunityImageIndex(index)}
                summary={item.description}
                title={item.title}
              />
            ))}
          </div>
          <CommunityImageModal
            currentIndex={communityImageIndex ?? 0}
            images={featuredCommunityImages}
            onNext={() =>
              setCommunityImageIndex((current) =>
                current === null
                  ? current
                  : Math.min(featuredCommunityImages.length - 1, current + 1),
              )
            }
            onOpenChange={(open) => {
              if (!open) {
                setCommunityImageIndex(null);
              }
            }}
            onPrev={() =>
              setCommunityImageIndex((current) =>
                current === null ? current : Math.max(0, current - 1),
              )
            }
            open={communityImageIndex !== null}
          />
        </Specimen>

        <Specimen
          id="pattern-community-video-card"
          note="Two Cozy-style video cards using the same full-screen viewer and chrome."
          title="Video Card"
        >
          <div className="ghibli-showcase-video-card-grid">
            {featuredCommunityVideos.map((item, index) => (
              <CommunityVideoCard
                isActive={index === 0}
                key={item.id}
                onClick={() => setCommunityVideoIndex(index)}
                posterUrl={item.posterUrl}
                title={item.title}
                videoUrl={item.videoUrl}
              />
            ))}
          </div>
          <CommunityVideoModal
            currentIndex={communityVideoIndex ?? 0}
            onNext={() =>
              setCommunityVideoIndex((current) =>
                current === null
                  ? current
                  : Math.min(featuredCommunityVideos.length - 1, current + 1),
              )
            }
            onOpenChange={(open) => {
              if (!open) {
                setCommunityVideoIndex(null);
              }
            }}
            onPrev={() =>
              setCommunityVideoIndex((current) =>
                current === null ? current : Math.max(0, current - 1),
              )
            }
            open={communityVideoIndex !== null}
            videos={featuredCommunityVideos}
          />
        </Specimen>
      </ShowcaseGroup>

      <ShowcaseGroup id="generate-flows">
        <Specimen
          id="component-generate-selects"
          note="Dropdown and ruler-style selectors from the generate page."
          title="Dropdown, Model, Aspect Controls"
        >
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">Open menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Library menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Copy install command</DropdownMenuItem>
                <DropdownMenuItem>Open Storybook</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <GenerateModelSelect
              onValueChange={setModel}
              options={modelOptions}
              value={model}
            />
            <GenerateAspectRatioSelect
              onValueChange={setAspectRatio}
              options={aspectRatioOptions}
              value={aspectRatio}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost">Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>Small hover and focus helper.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Specimen>

        <Specimen
          id="pattern-generate-editor-bar"
          note="The docked bottom composer from the Cozy generate page, shown in a page-like stage instead of as a detached toolbar."
          title="Generate Editor Bar"
        >
          <div className="ghibli-generate-editor-stage">
            <div className="ghibli-generate-editor-stage-canvas">
              <div className="ghibli-generate-editor-stage-grid">
                {communityImageItems.slice(0, 3).map((item) => (
                  <HandDrawnFrame
                    className="overflow-hidden bg-[linear-gradient(180deg,rgba(249,243,226,0.92),rgba(239,227,193,0.92))]"
                    clipContent
                    deformationIntensity={0.6}
                    key={item.id}
                    seed={`generate-stage-${item.id}`}
                    shape="card"
                    strokeColor="var(--border)"
                    strokeWidth={1.55}
                  >
                    <img
                      alt=""
                      aria-hidden="true"
                      className="aspect-[4/5] w-full object-cover"
                      src={item.imageUrl}
                    />
                  </HandDrawnFrame>
                ))}
              </div>
            </div>
            <div className="ghibli-generate-editor-stage-dock">
              <div className="ghibli-generate-editor-stage-inner">
                <GenerateEditorBar
                  aspectRatio={aspectRatio}
                  aspectRatioOptions={aspectRatioOptions}
                  attachments={sampleAttachments}
                  defaultExpanded
                  estimateLabel="~18s / image"
                  mode={mode}
                  modeOptions={modeOptions}
                  model={model}
                  modelOptions={modelOptions}
                  negativePrompt={negativePrompt}
                  numImages={numImages}
                  onAspectRatioChange={setAspectRatio}
                  onModeChange={setMode}
                  onModelChange={setModel}
                  onNegativePromptChange={setNegativePrompt}
                  onNumImagesChange={setNumImages}
                  onPromptChange={setPrompt}
                  onRemoveAttachment={() => undefined}
                  prompt={prompt}
                />
              </div>
            </div>
          </div>
        </Specimen>

        <Specimen
          id="pattern-generate-controls"
          note="Individual controls used below the prompt composer."
          title="Generate Controls"
        >
          <div className="flex flex-wrap items-center gap-3">
            <GenerateNumImagesControl
              onValueChange={setNumImages}
              value={numImages}
            />
            <GenerateNegativePromptMenu
              onValueChange={setNegativePrompt}
              value={negativePrompt}
            />
            <GenerateUploadDialog
              attachments={sampleAttachments}
              onRemoveAttachment={() => undefined}
            />
            <GenerateQuickPicks
              items={[
                { label: "Rainy tea house", value: "rainy-tea-house" },
                { label: "Lantern ferry", value: "lantern-ferry" },
              ]}
            />
            <GenerateButton isAuthenticated onClick={() => undefined} />
          </div>
        </Specimen>

      </ShowcaseGroup>

      <ShowcaseGroup id="docs-screens">
        <Specimen
          id="pattern-docs"
          note="Docs article and FAQ blocks remain public, but now they sit beside the larger route-level page examples."
          title="Docs Article and FAQ"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <DocsArticle>
              <DocsH2>Docs article</DocsH2>
              <DocsParagraph>
                Use this block for prose pages that still need the paper
                rhythm.
              </DocsParagraph>
              <DocsCallout>
                Callouts keep important notes visible without introducing app
                logic.
              </DocsCallout>
              <DocsCodeBlock>{`<DocsArticle>...</DocsArticle>`}</DocsCodeBlock>
            </DocsArticle>
            <DocsFaqAccordion items={faqItems} />
          </div>
        </Specimen>

        <Specimen
          id="reference-screens"
          note="These route-level specimens stay on the one-page showcase so teams can inspect the larger page shapes without leaving the install surface."
          title="Info, Legal, Reset, Not Found"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <DemoSurface>
              <PageShell className="px-0 pt-0 pb-0" width="md">
                <PageHero
                  badge={<Badge variant="stamp">Info</Badge>}
                  description="Quiet informational pages share the same shell, hero rhythm, and paper cards."
                  title="Gentle information page"
                />
                <PageSection
                  description="Use page sections to keep secondary content compact."
                  title="Feature note"
                >
                  <NoticeBanner
                    description="This mirrors the calm tone of the information screens."
                    title="Feature availability"
                    tone="cloud"
                  />
                </PageSection>
              </PageShell>
            </DemoSurface>

            <DocsArticle>
              <DocsH2>Legal page</DocsH2>
              <DocsParagraph>
                Legal and policy screens use the same prose block, stronger ink
                headings, and calm spacing.
              </DocsParagraph>
              <DocsCodeBlock>{`Questions about privacy can be directed to privacy@ghibli-ui.test.`}</DocsCodeBlock>
            </DocsArticle>

            <DemoSurface>
              <form className="grid max-w-md gap-4">
                <div className="grid gap-1">
                  <p className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
                    Reset password
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    A compact recovery form with the same paper field treatment.
                  </p>
                </div>
                <FormField label="New password">
                  <Input placeholder="Min. 8 characters" type="password" />
                </FormField>
                <FormField label="Confirm password">
                  <Input placeholder="••••••••" type="password" />
                </FormField>
                <CartoonButton
                  color="#7b9d68"
                  text="Update password"
                  type="button"
                />
              </form>
            </DemoSurface>

            <EmptyState
              action={<EmptyStateAction>Return home</EmptyStateAction>}
              description="The same empty-state treatment carries the 404 and fallback screens."
              icon={FileText}
              title="Page not found"
            />
          </div>
        </Specimen>
      </ShowcaseGroup>

      <ShowcaseGroup id="account-flows">
        <Specimen
          id="pattern-account-dialogs"
          note="Account dialogs are controlled and presentational."
          title="Account Dialogs"
        >
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setEmailDialogOpen(true)}>
              Open email dialog
            </Button>
            <Button
              onClick={() => setPasswordDialogOpen(true)}
              variant="secondary"
            >
              Open password dialog
            </Button>
          </div>
          <AccountChangeEmailDialog
            currentEmail="mei@ghibli-ui.test"
            newEmail={newEmail}
            onNewEmailChange={setNewEmail}
            onOpenChange={setEmailDialogOpen}
            open={emailDialogOpen}
          />
        </Specimen>

        <Specimen
          id="pattern-account-sections"
          note="The broader account sections remain available for settings, subscription, and credit pages."
          title="Account Sections"
        >
          <div className="grid gap-4">
            <AccountProfileSection
              email="mei@ghibli-ui.test"
              name="User"
              planLabel="Painterly plan"
            />
            <AccountLinkedAccountsSection accounts={linkedAccounts} />
            <AccountSubscriptionSection
              features={[
                "200 monthly generations",
                "Priority queue",
                "Storyboard mode",
              ]}
              offers={subscriptionOffers}
              planName="Painterly plan"
            />
            <AccountApiCreditsSection
              balanceLabel="128 credits"
              ledger={creditLedger}
              offers={creditOffers}
            />
          </div>
        </Specimen>
      </ShowcaseGroup>

      <ShowcaseGroup id="footer-endmatter">
        <Specimen
          id="pattern-feedback"
          note="Inline feedback and sticky action surfaces."
          title="Notice Banner, Empty State, Floating Action"
        >
          <div className="grid gap-5">
            <NoticeBanner
              description="This mirrors the compact guidance banners used across the library."
              title="Keep prompts short and visual."
              tone="meadow"
            />
            <EmptyState
              action={<EmptyStateAction>Start generating</EmptyStateAction>}
              description="No generations yet. The first result will appear here after the job completes."
              title="Nothing here yet"
            />
            <div className="relative min-h-32 overflow-hidden border border-[color:var(--border-soft)] bg-white/25">
              <FloatingAction position="sticky">
                <CartoonButton
                  color="#7b9d68"
                  onClick={() => undefined}
                  text="Floating generate"
                />
              </FloatingAction>
            </div>
          </div>
        </Specimen>

        <Specimen
          id="storybook"
          note="Storybook stays available for isolated inspection."
          title="Storybook"
        >
          <DemoSurface>
            <div className="grid gap-3">
              <p className="text-sm leading-7 text-[color:var(--foreground)]">
                Use the single page for browsing. Use Storybook for isolated
                states and visual QA.
              </p>
              <CodeBlock>{`pnpm dev:storybook`}</CodeBlock>
            </div>
          </DemoSurface>
        </Specimen>

        <Specimen
          id="component-footer"
          note="The shared footer treatment through the layout shell."
          title="Footer"
        >
          <ShellFooter
            brand={
              <a
                aria-label="Go to the install section"
                className="inline-flex items-center justify-center"
                href="#install"
              >
                <LibraryMark className="size-10 shrink-0 bg-white/45 p-2" />
              </a>
            }
            columns={
              footerColumns[0]?.links.map((link) => ({
                href: link.href,
                text: link.label,
              })) ?? []
            }
            text="© 2026 Ghibli UI"
          />
        </Specimen>
      </ShowcaseGroup>
    </div>
  );
}
