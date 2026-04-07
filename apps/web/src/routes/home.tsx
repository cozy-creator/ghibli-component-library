import { useState, type ReactNode } from "react";
import {
  BookOpen,
  Flower2,
  Github,
  ImageIcon,
  MessageCircle,
  Sparkles,
  UserRound,
  Wand2
} from "lucide-react";

import {
  AccountApiCreditsSection,
  AccountChangeEmailDialog,
  AccountChangePasswordDialog,
  AccountLinkedAccountsSection,
  AccountProfileSection,
  AccountSubscriptionSection,
  AccountUserDisplayBox,
  AuthDialog,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CartoonButton,
  CommunityEmbedCard,
  CommunityImageCard,
  CommunityImageModal,
  CommunityTabsList,
  CommunityVideoCard,
  CommunityVideoModal,
  CommunityXPostCard,
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
  GenerateJobCard,
  GenerateModeToggle,
  GenerateModelSelect,
  GenerateNegativePromptMenu,
  GenerateNumImagesControl,
  GeneratePromptComposer,
  GenerateQuickPicks,
  GenerateUploadDialog,
  HandDrawnFrame,
  Input,
  Label,
  LoginForm,
  MarketingCtaSection,
  MarketingFeaturesSection,
  MarketingHeroSection,
  NoticeBanner,
  PageHero,
  PageHeroSkeleton,
  PageSection,
  PageShell,
  RegisterForm,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  ShellFooter,
  ShellHeader,
  SidebarNav,
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
  footerColumns,
  linkedAccounts,
  marketingVisual,
  modeOptions,
  modelOptions,
  sampleAttachments,
  sampleJobs,
  subscriptionOffers,
  xPostDemo
} from "@/apps/web/src/data/demo-fixtures";

const installCommand = "pnpm dlx shadcn@latest add @ghibli/all";

const registrySnippet = `{
  "registries": {
    "@ghibli": "https://<your-domain>/r/{name}.json"
  }
}`;

const usageSnippet = `import { Button, GenerateEditorBar } from "@/components";

export function Example() {
  return <Button>Generate</Button>;
}`;

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="max-w-full overflow-x-auto border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.42)] px-4 py-3 text-sm leading-7 text-[color:var(--ink-strong)]">
      <code>{children}</code>
    </pre>
  );
}

function Specimen({
  children,
  id,
  note,
  title
}: {
  children: ReactNode;
  id: string;
  note?: string;
  title: string;
}) {
  return (
    <section
      className="grid scroll-mt-28 gap-4 border-t border-[color:rgba(77,59,46,0.32)] py-8 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8"
      data-showcase-item={title}
      id={id}
    >
      <div className="grid content-start gap-2">
        <h2 className="font-[var(--font-heading)] text-3xl leading-none text-[color:var(--ink-strong)]">
          {title}
        </h2>
        {note ? <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{note}</p> : null}
      </div>
      <div className="min-w-0 overflow-x-clip overflow-y-visible px-1">{children}</div>
    </section>
  );
}

function DemoGrid({ children }: { children: ReactNode }) {
  return <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

function DemoSurface({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0 border border-[color:var(--border-soft)] bg-[color:rgba(255,255,255,0.35)] p-4">
      {children}
    </div>
  );
}

function CozyLogo() {
  return (
    <span className="inline-flex size-11 items-center justify-center border border-[color:var(--border-strong)] bg-[color:rgba(255,255,255,0.42)] p-1.5 transition hover:bg-[color:rgba(255,255,255,0.68)]">
      <Flower2 className="size-6 text-[color:var(--ink-strong)]" />
    </span>
  );
}

export function HomePage() {
  const [activeTab, setActiveTab] = useState("live-feed");
  const [mode, setMode] = useState("image");
  const [model, setModel] = useState("riverlight-v3");
  const [aspectRatio, setAspectRatio] = useState("3:4");
  const [numImages, setNumImages] = useState(2);
  const [prompt, setPrompt] = useState(
    "A quiet ferry deck at dusk, paper lantern reflections across the water, cozy watercolor lighting."
  );
  const [negativePrompt, setNegativePrompt] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [communityImageOpen, setCommunityImageOpen] = useState(false);
  const [communityVideoOpen, setCommunityVideoOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("new-address@cozy.art");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 overflow-x-clip py-8 md:py-10" data-testid="component-showcase">
      <section className="grid gap-6 pb-6" id="install">
        <div className="grid gap-3">
          <Badge className="w-fit" variant="stamp">
            Cozy.art source of truth
          </Badge>
          <h1 className="max-w-4xl font-[var(--font-heading)] text-5xl leading-[0.92] text-[color:var(--ink-strong)] md:text-7xl">
            Ghibli components, displayed one by one.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[color:var(--foreground)]">
            A simple single page showing the reusable pieces from the cozy.art interface with the same warm paper background and hand-drawn surfaces.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          <DemoSurface>
            <div className="grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Install every component
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
        <DemoSurface>
          <div className="grid gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              Use after install
            </p>
            <CodeBlock>{usageSnippet}</CodeBlock>
          </div>
        </DemoSurface>
      </section>

      <Specimen id="component-button" note="The base shadcn-style action primitive." title="Button">
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button size="icon" aria-label="Magic">
            <Wand2 className="size-4" />
          </Button>
        </div>
      </Specimen>

      <Specimen id="component-cartoon-button" note="The chunky CTA used across cozy.art generate flows." title="Cartoon Button">
        <div className="flex flex-wrap gap-3">
          <CartoonButton color="#7b9d68" icon={<Sparkles className="size-4" />} onClick={() => undefined} text="Generate" />
          <CartoonButton color="#b87347" onClick={() => undefined} size="sm" text="Try again" />
          <CartoonButton color="#7fa8bb" loading text="Uploading" />
        </div>
      </Specimen>

      <Specimen id="component-hand-drawn-frame" note="Reusable hand-drawn lines for cards, banners, pills, and panels." title="Hand Drawn Frame">
        <DemoGrid>
          <HandDrawnFrame className="bg-[color:var(--card)] px-5 py-5" variant="card">
            <p className="font-[var(--font-heading)] text-2xl text-[color:var(--ink-strong)]">Card frame</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">Irregular border, real content inside.</p>
          </HandDrawnFrame>
          <HandDrawnFrame className="bg-[color:var(--paper)] px-5 py-4" variant="banner">
            <p className="font-medium text-[color:var(--ink-strong)]">Banner frame</p>
          </HandDrawnFrame>
          <HandDrawnFrame className="w-fit bg-[color:color-mix(in_oklab,var(--ring)_22%,white)] px-5 py-2 text-[color:var(--primary)]" variant="pill">
            Pill frame
          </HandDrawnFrame>
        </DemoGrid>
      </Specimen>

      <Specimen id="component-display" note="Small display primitives used by the larger blocks." title="Badges, Card, Avatar, Skeleton, Separator">
        <DemoGrid>
          <Card>
            <CardHeader>
              <Badge className="w-fit" tone="lantern" variant="stamp">Card</Badge>
              <CardTitle>Forest lantern walk</CardTitle>
              <CardDescription>Paper card surface with warm borders.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge tone="meadow" variant="soft">Meadow</Badge>
                <Badge tone="river" variant="outline">River</Badge>
              </div>
            </CardFooter>
          </Card>
          <DemoSurface>
            <div className="grid gap-4">
              <p className="font-medium text-[color:var(--ink-strong)]">Separator</p>
              <Separator />
              <p className="text-sm leading-7 text-muted-foreground">Used between compact menu and form sections.</p>
            </div>
          </DemoSurface>
        </DemoGrid>
      </Specimen>

      <Specimen id="component-forms" note="The field primitives and form wrapper used by auth and generate surfaces." title="Input, Textarea, Form Field">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField description="A reusable label/action/error wrapper." error="Example validation message." label="Prompt title">
            <Input placeholder="Tea shop by the river" />
          </FormField>
          <FormField action={<button className="text-xs text-muted-foreground">Optional</button>} label="Long prompt">
            <Textarea placeholder="Describe the scene, mood, light, and style..." />
          </FormField>
          <Label htmlFor="standalone-label">Standalone label</Label>
          <Input id="standalone-label" placeholder="Single line input" />
        </div>
      </Specimen>

      <Specimen id="component-tabs" note="Tabs and the cozy.art community tab switch." title="Tabs Switch">
        <div className="grid gap-5">
          <Tabs defaultValue="first">
            <TabsList>
              <TabsTrigger value="first">First</TabsTrigger>
              <TabsTrigger value="second">Second</TabsTrigger>
              <TabsTrigger value="third">Third</TabsTrigger>
            </TabsList>
            <TabsContent value="first">First tab content.</TabsContent>
            <TabsContent value="second">Second tab content.</TabsContent>
            <TabsContent value="third">Third tab content.</TabsContent>
          </Tabs>
          <Tabs onValueChange={setActiveTab} value={activeTab}>
            <CommunityTabsList activeTab={activeTab} />
          </Tabs>
        </div>
      </Specimen>

      <Specimen id="component-generate-mode-toggle" note="The image/video toggle from the cozy.art generate controls." title="Generate Mode Toggle">
        <GenerateModeToggle onValueChange={setMode} options={modeOptions} value={mode} />
      </Specimen>

      <Specimen id="component-generate-selects" note="Dropdown and ruler-style selectors from the generate page." title="Dropdown, Model, Aspect Controls">
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
          <GenerateModelSelect onValueChange={setModel} options={modelOptions} value={model} />
          <GenerateAspectRatioSelect onValueChange={setAspectRatio} options={aspectRatioOptions} value={aspectRatio} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>Small hover/focus helper.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Specimen>

      <Specimen id="component-generate-prompt-composer" note="The reusable prompt input surface extracted from the cozy.art generate page." title="Generate Prompt Composer">
        <GeneratePromptComposer
          attachments={sampleAttachments}
          onPromptChange={setPrompt}
          onRemoveAttachment={() => undefined}
          prompt={prompt}
        />
      </Specimen>

      <Specimen id="pattern-generate-editor-bar" note="The full presentational editor bar composed from the generate controls." title="Generate Editor Bar">
        <GenerateEditorBar
          aspectRatio={aspectRatio}
          aspectRatioOptions={aspectRatioOptions}
          attachments={sampleAttachments}
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
      </Specimen>

      <Specimen id="pattern-generate-controls" note="Individual controls used below the prompt composer." title="Generate Controls">
        <div className="flex flex-wrap items-center gap-3">
          <GenerateNumImagesControl onValueChange={setNumImages} value={numImages} />
          <GenerateNegativePromptMenu onValueChange={setNegativePrompt} value={negativePrompt} />
          <GenerateUploadDialog attachments={sampleAttachments} onRemoveAttachment={() => undefined} />
          <GenerateQuickPicks
            items={[
              { label: "Rainy tea house", value: "rainy-tea-house" },
              { label: "Lantern ferry", value: "lantern-ferry" }
            ]}
          />
          <GenerateButton isAuthenticated onClick={() => undefined} />
        </div>
      </Specimen>

      <Specimen id="component-user-display-box" note="The profile display box extracted from the cozy.art account page." title="User Display Box">
        <AccountUserDisplayBox
          email="melina@cozy.art"
          generatedCount={128}
          hasCustomAvatar
          name="Melina Sketch"
          onEditName={() => setEmailDialogOpen(true)}
          onPasswordAction={() => setPasswordDialogOpen(true)}
          onRemoveAvatar={() => undefined}
          onUploadAvatar={() => undefined}
        />
      </Specimen>

      <Specimen id="component-user-popup" note="The header user menu and mobile sheet behavior from the layout shell." title="User Popup / Header">
        <div className="[&>header]:static">
          <ShellHeader
            brand={
              <a className="inline-flex items-center gap-3" href="#install">
                <CozyLogo />
                <span className="font-[var(--font-heading)] text-2xl text-[color:var(--ink-strong)]">cozy.art</span>
              </a>
            }
            navItems={[
              { active: true, href: "#component-user-popup", label: "Generate" },
              { href: "#component-community-cards", label: "Community" }
            ]}
            socialItems={[
              { href: "https://github.com", icon: <Github className="size-4" />, iconOnly: true, label: "GitHub" },
              { href: "https://storybook.js.org", icon: <BookOpen className="size-4" />, iconOnly: true, label: "Docs" }
            ]}
            user={{
              initials: "MS",
              menuItems: [
                { icon: <UserRound className="size-4" />, id: "account", label: "Account" },
                { destructive: true, id: "logout", label: "Sign out" }
              ],
              name: "Melina Sketch",
              subtitle: "melina@cozy.art"
            }}
          />
        </div>
      </Specimen>

      <Specimen id="pattern-auth-forms" note="Presentational auth forms with no store or service dependencies." title="Auth Forms">
        <div className="grid gap-5 lg:grid-cols-2">
          <DemoSurface>
            <LoginForm
              email="melina@cozy.art"
              onEmailChange={() => undefined}
              onForgotPassword={() => undefined}
              onPasswordChange={() => undefined}
              password="cozy-secret"
            />
          </DemoSurface>
          <DemoSurface>
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
          </DemoSurface>
        </div>
      </Specimen>

      <Specimen id="pattern-auth-dialog" note="Modal examples stay interactive so the page does not stack open overlays." title="Auth Modal">
        <Button onClick={() => setAuthOpen(true)}>Open auth modal</Button>
        <AuthDialog
          loginContent={
            <LoginForm
              email=""
              onEmailChange={() => undefined}
              onForgotPassword={() => undefined}
              onPasswordChange={() => undefined}
              password=""
            />
          }
          onOpenChange={setAuthOpen}
          onTabChange={setAuthTab}
          open={authOpen}
          providerActions={[
            { icon: <Github className="size-4" />, id: "github", label: "GitHub" },
            { icon: <MessageCircle className="size-4" />, id: "discord", label: "Discord" }
          ]}
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
            />
          }
          tab={authTab}
        />
      </Specimen>

      <Specimen id="pattern-account-dialogs" note="Account dialogs are controlled and presentational." title="Account Dialogs">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setEmailDialogOpen(true)}>Open email dialog</Button>
          <Button onClick={() => setPasswordDialogOpen(true)} variant="secondary">Open password dialog</Button>
        </div>
        <AccountChangeEmailDialog
          currentEmail="melina@cozy.art"
          newEmail={newEmail}
          onNewEmailChange={setNewEmail}
          onOpenChange={setEmailDialogOpen}
          open={emailDialogOpen}
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

      <Specimen id="pattern-account-sections" note="The broader account sections remain available for settings pages." title="Account Sections">
        <div className="grid gap-4">
          <AccountProfileSection email="melina@cozy.art" name="Melina Sketch" planLabel="Painterly plan" />
          <AccountLinkedAccountsSection accounts={linkedAccounts} />
          <AccountSubscriptionSection
            features={["200 monthly generations", "Priority queue", "Storyboard mode"]}
            offers={subscriptionOffers}
            planName="Painterly plan"
          />
          <AccountApiCreditsSection balanceLabel="128 credits" ledger={creditLedger} offers={creditOffers} />
        </div>
      </Specimen>

      <Specimen id="pattern-community-cards" note="Image, video, embed, and x-post cards from the community feed." title="Community Cards">
        <div className="grid gap-5">
          <DemoGrid>
            {communityImageItems.map((item) => (
              <CommunityImageCard
                imageUrl={item.imageUrl}
                key={item.id}
                meta={item.meta}
                onClick={() => setCommunityImageOpen(true)}
                summary={item.description}
                title={item.title}
              />
            ))}
          </DemoGrid>
          <div className="grid gap-4 lg:grid-cols-2">
            <CommunityVideoCard
              {...(communityVideoItems[0]?.meta ? { duration: communityVideoItems[0].meta } : {})}
              onPlay={() => setCommunityVideoOpen(true)}
              posterUrl={communityVideoItems[0]?.posterUrl ?? ""}
              title={communityVideoItems[0]?.title ?? "Video preview"}
            />
            <CommunityXPostCard {...xPostDemo} />
          </div>
          <CommunityEmbedCard
            author="Cozy Release"
            embed={<NoticeBanner description="A compact embed wrapper for custom community content." title="Embed content lives here." tone="river" />}
            footer={<span>Reusable feed shell</span>}
            handle="@cozyart"
          />
        </div>
      </Specimen>

      <Specimen id="pattern-community-modals" note="Large image and video feed modals are trigger-based on this page." title="Community Modals">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setCommunityImageOpen(true)}>Open image modal</Button>
          <Button onClick={() => setCommunityVideoOpen(true)} variant="secondary">Open video modal</Button>
        </div>
        <CommunityImageModal
          currentIndex={0}
          images={communityImageItems}
          onOpenChange={setCommunityImageOpen}
          open={communityImageOpen}
        />
        <CommunityVideoModal
          currentIndex={0}
          onOpenChange={setCommunityVideoOpen}
          open={communityVideoOpen}
          videos={communityVideoItems}
        />
      </Specimen>

      <Specimen id="pattern-generate-job-card" note="Generation history state with progress and finished outputs." title="Generate Job Card">
        <DemoGrid>
          {sampleJobs.map((job) => (
            <GenerateJobCard key={job.title} {...job} />
          ))}
        </DemoGrid>
      </Specimen>

      <Specimen id="pattern-feedback" note="Inline feedback and sticky action surfaces." title="Notice Banner, Empty State, Floating Action">
        <div className="grid gap-5">
          <NoticeBanner description="This mirrors the compact guidance banners used in cozy.art." title="Keep prompts short and visual." tone="meadow" />
          <EmptyState
            action={<EmptyStateAction>Start generating</EmptyStateAction>}
            description="No generations yet. The first result will appear here after the job completes."
            title="Nothing here yet"
          />
          <div className="relative min-h-32 overflow-hidden border border-[color:var(--border-soft)] bg-white/25">
            <FloatingAction position="sticky">
              <CartoonButton color="#7b9d68" onClick={() => undefined} text="Floating generate" />
            </FloatingAction>
          </div>
        </div>
      </Specimen>

      <Specimen id="pattern-navigation" note="Sidebar navigation and sheet overlay components." title="Sidebar and Sheet">
        <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <DemoSurface>
            <Sheet>
              <SheetTrigger asChild>
                <Button>Open sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Mobile navigation</SheetTitle>
                  <SheetDescription>Sheet content follows the same paper surface style.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </DemoSurface>
          <DemoSurface>
            <div className="max-w-sm">
              <SidebarNav
                groups={[
                  {
                    id: "demo",
                    items: [
                      { active: true, href: "#component-button", icon: <Sparkles className="size-4" />, id: "button", label: "Buttons" },
                      { href: "#pattern-community-cards", icon: <ImageIcon className="size-4" />, id: "community", label: "Community" },
                      { href: "#pattern-generate-editor-bar", icon: <Wand2 className="size-4" />, id: "generate", label: "Generate" }
                    ],
                    label: "Showcase"
                  }
                ]}
              />
            </div>
          </DemoSurface>
        </div>
      </Specimen>

      <Specimen id="pattern-page-shell" note="Page shell primitives for app pages, heroes, sections, and loading states." title="Page Shell">
        <DemoSurface>
          <PageShell className="px-0 pt-0 pb-0" width="md">
            <PageHero
              actions={<Button size="sm">Hero action</Button>}
              badge={<Badge variant="stamp">Page hero</Badge>}
              description="A compact page hero preview inside the showcase."
              title="Warm page shell"
            />
            <PageSection description="Section wrappers keep spacing consistent." title="Section title">
              <PageHeroSkeleton />
            </PageSection>
          </PageShell>
        </DemoSurface>
      </Specimen>

      <Specimen id="pattern-docs" note="Docs article and FAQ blocks are still public." title="Docs Article and FAQ">
        <div className="grid gap-5 lg:grid-cols-2">
          <DocsArticle>
            <DocsH2>Docs article</DocsH2>
            <DocsParagraph>Use this block for prose pages that still need the cozy paper rhythm.</DocsParagraph>
            <DocsCallout>Callouts keep important notes visible without introducing app logic.</DocsCallout>
            <DocsCodeBlock>{`<DocsArticle>...</DocsArticle>`}</DocsCodeBlock>
          </DocsArticle>
          <DocsFaqAccordion items={faqItems} />
        </div>
      </Specimen>

      <Specimen id="pattern-marketing-sections" note="Marketing blocks remain available, but they are shown without turning this page into a marketing site." title="Marketing Sections">
        <div className="grid gap-5">
          <MarketingHeroSection
            badge="Landing hero"
            description="A warm page opener for projects using the component library."
            primaryAction={<Button>Get started</Button>}
            secondaryAction={<Button variant="secondary">See components</Button>}
            title="Build soft paper interfaces."
            visual={marketingVisual}
          />
          <MarketingFeaturesSection
            heading="Small feature grid"
            intro="Feature cards keep the same surface and type language."
            items={featureItems}
          />
          <MarketingCtaSection
            action={<CartoonButton color="#7b9d68" onClick={() => undefined} text="Install all" />}
            description="One aggregate registry command installs the whole public set."
            eyebrow="Registry"
            title="Copy the components into your app."
          />
        </div>
      </Specimen>

      <Specimen id="storybook" note="Storybook stays available for isolated inspection." title="Storybook">
        <DemoSurface>
          <div className="grid gap-3">
            <p className="text-sm leading-7 text-[color:var(--foreground)]">
              Use the single page for browsing. Use Storybook for isolated states and visual QA.
            </p>
            <CodeBlock>{`pnpm dev:storybook`}</CodeBlock>
          </div>
        </DemoSurface>
      </Specimen>

      <Specimen id="component-footer" note="The cozy.art footer treatment through the shared layout shell." title="Footer">
        <ShellFooter
          brand={<CozyLogo />}
          columns={footerColumns[0]?.links.map((link) => ({ href: link.href, text: link.label })) ?? []}
          text="© 2026 cozy.art"
        />
      </Specimen>
    </div>
  );
}
