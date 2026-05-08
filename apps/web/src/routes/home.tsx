import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Check,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileText,
  Heart,
  LogIn,
  LogOut,
  Palette,
  Share2,
  Sparkles,
  UserRound,
  Wand2,
} from "lucide-react";

import {
  AVAILABLE_THEME_IDS,
  Badge,
  Button,
  CartoonButton,
  ChangeThemeModal,
  cn,
  contrastIconButtonClass,
  copyTextToClipboard,
  DocsArticle,
  DocsCallout,
  DocsCodeBlock,
  DocsFaqAccordion,
  DocsH2,
  DocsParagraph,
  docsCodeBlockButtonClass,
  docsCodeBlockOverlayClass,
  docsCodeBlockSurfaceClass,
  EmptyState,
  EmptyStateAction,
  FloatingAction,
  FormField,
  HandDrawnFrame,
  HandDrawnRule,
  Input,
  NoticeBanner,
  PageHero,
  PageSection,
  PageShell,
  ShellFooter,
  ShellHeader,
  Tabs,
  Textarea,
  ThemeFrame,
  THEME_FRAME_VARIANTS,
  THEME_OPTIONS,
  toast,
  useTheme,
} from "@ghibli/ui";
import {
  AccountApiCreditsSection,
  AccountProfileSection,
  AccountSubscriptionSection,
  AccountUserDisplayBox,
} from "@/cozy-examples/account/sections";
import {
  AccountChangeEmailDialog,
  AccountChangePasswordDialog,
  AccountChangeUsernameDialog,
} from "@/cozy-examples/account/dialogs";
import { AuthDialog } from "@/cozy-examples/auth/dialog";
import {
  LoginForm,
  RegisterForm,
} from "@/cozy-examples/auth/forms";
import {
  CommunityImageCard,
  CommunityTabsList,
  CommunityVideoCard,
} from "@/cozy-examples/community/cards";
import {
  CommunityImageModal,
  CommunityVideoModal,
} from "@/cozy-examples/community/modals";
import {
  GenerateAspectRatioSelect,
  GenerateButton,
  type GenerateAttachment,
  GenerateModeToggle,
  GenerateModelSelect,
} from "@/cozy-examples/generate/controls";
import { GenerateEditorBar } from "@/cozy-examples/generate/editor-bar";

import { BrandMark } from "@/apps/web/src/components/site-brand";
import {
  DiscordHeaderIcon,
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
  faqItems,
  footerColumns,
  generateModelItems,
  modeOptions,
  subscriptionOffers,
} from "@/apps/web/src/data/demo-fixtures";

const forestReadableTextClass =
  "[html[data-theme='ghibli-forest']_&]:inline-block [html[data-theme='ghibli-forest']_&]:rounded-sm [html[data-theme='ghibli-forest']_&]:bg-black/40 [html[data-theme='ghibli-forest']_&]:px-3 [html[data-theme='ghibli-forest']_&]:py-1 [html[data-theme='ghibli-forest']_&]:text-white";

const registrySnippet = `{
  "registries": {
    "@ghibli": "https://ghibli-component-library.vercel.app/r/{name}.json"
  }
}`;

const shadcnInitSnippet = `pnpm dlx shadcn@latest init`;

const installCommandsSnippet = `pnpm dlx shadcn@latest add @ghibli/button       # one component
pnpm dlx shadcn@latest add @ghibli/form-field   # a reusable block
pnpm dlx shadcn@latest add @ghibli/all          # everything`;

const importSnippet = `import { Button } from "@/components/ui/button";`;

function groupGenerateModelsByBase(items: typeof generateModelItems) {
  return items.reduce<Record<string, typeof generateModelItems>>(
    (accumulator, item) => {
      (accumulator[item.baseModel] ??= []).push(item);
      return accumulator;
    },
    {},
  );
}

function formatAttachmentSize(sizeInBytes: number) {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getGenerateAttachmentKind(file: File): "file" | "image" | "video" {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  return "file";
}

type FrameRulerOption = {
  label: string;
  value: number;
};

const frameCrookednessOptions: FrameRulerOption[] = [
  { label: "0", value: 0 },
  { label: "0.5", value: 0.5 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "4", value: 4 },
  { label: "7", value: 7 },
  { label: "10", value: 10 },
];

const frameStrokeWidthVariationOptions: FrameRulerOption[] = [
  { label: "0", value: 0 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "4", value: 4 },
  { label: "6", value: 6 },
  { label: "8", value: 8 },
  { label: "10", value: 10 },
];

const frameStrokeWidthOptions: FrameRulerOption[] = [
  { label: "0.5", value: 0.5 },
  { label: "1", value: 1 },
  { label: "1.25", value: 1.25 },
  { label: "1.6", value: 1.6 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <DocsCodeBlock className="mb-0 max-w-full" codeText={children}>
      {children}
    </DocsCodeBlock>
  );
}

const repoUrl = "https://github.com/rodrigoluz/ghibli-component-library";

function DemoSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 border border-[color:var(--border-soft)] bg-[color:rgba(255,255,255,0.35)] p-4${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </div>
  );
}

const forestWoodSurfaceClass =
  "[html[data-theme='ghibli-forest']_&]:bg-[color:var(--surface-shell)] [html[data-theme='ghibli-forest']_&]:bg-[image:var(--surface-shell-background)] [html[data-theme='ghibli-forest']_&]:border-[color:var(--border)] [html[data-theme='ghibli-forest']_&]:shadow-[0_10px_30px_color-mix(in_oklab,var(--ink-strong)_18%,transparent)]";

function formatFrameSliderValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function FrameRulerField({
  description,
  label,
  onValueChange,
  options,
  value,
}: {
  description?: string;
  label: string;
  onValueChange: (value: number) => void;
  options: FrameRulerOption[];
  value: number;
}) {
  const min = options[0]!.value;
  const max = options[options.length - 1]!.value;
  const range = max - min;
  const clampedValue = Math.min(max, Math.max(min, value));
  const percent = range === 0 ? 0 : ((clampedValue - min) / range) * 100;
  const fieldId = `frame-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const displayValue = formatFrameSliderValue(clampedValue);

  return (
    <FormField
      action={
        <span className="text-xs text-muted-foreground">
          {displayValue}
        </span>
      }
      description={description}
      htmlFor={fieldId}
      label={label}
    >
      <div className="relative mx-auto w-[97.5%] pt-1 pb-1">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[2.35rem] right-2 left-2 h-px bg-[color:var(--border-strong)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[1.05rem] z-10 inline-grid min-w-[3.2rem] -translate-x-1/2 items-center justify-center border border-[color:var(--border)] bg-[color:var(--paper-soft)] px-2 py-1 text-center text-[11px] font-medium leading-none text-[color:var(--ink-strong)] shadow-[0_8px_18px_rgba(0,0,0,0.14)]"
          style={{ left: `${percent}%` }}
        >
          {displayValue}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[2rem] right-0 left-0 grid items-start"
          style={{
            gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
          }}
        >
          {options.map((option) => (
            <span
              className="relative flex h-6 justify-center"
              key={`${label}-${option.label}`}
            >
              <span className="h-4 w-px bg-[color:var(--border-strong)] opacity-80" />
              <span className="absolute top-[1.05rem] size-2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--ink-strong)]/75" />
            </span>
          ))}
        </div>

        <input
          aria-label={label}
          className="relative z-20 h-[4.8rem] w-full cursor-grab appearance-none bg-transparent active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--paper)] [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-[color:var(--ink-strong)] [&::-moz-range-thumb]:bg-[color:var(--paper-soft)] [&::-moz-range-thumb]:shadow-[0_0_0_2px_color-mix(in_oklab,var(--paper)_80%,transparent)] [&::-moz-range-track]:h-px [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:mt-[-0.6rem] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[color:var(--ink-strong)] [&::-webkit-slider-thumb]:bg-[color:var(--paper-soft)] [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_color-mix(in_oklab,var(--paper)_80%,transparent)]"
          id={fieldId}
          max={max}
          min={min}
          onChange={(event) => onValueChange(Number(event.currentTarget.value))}
          step={0.1}
          type="range"
          value={clampedValue}
        />

        <div className="mt-1 flex items-center justify-between text-[11px] text-[color:var(--muted-foreground)]">
          <span>{options[0]!.label}</span>
          <span>{options[options.length - 1]!.label}</span>
        </div>
      </div>
    </FormField>
  );
}

function ShowcaseGroup({ children, id }: { children: ReactNode; id: string }) {
  return (
    <section className="grid gap-8" id={id}>
      {children}
    </section>
  );
}

function Specimen({
  children,
  id,
  installName,
  note,
  title,
}: {
  children: ReactNode;
  id: string;
  installName?: string;
  note?: string;
  title: string;
}) {
  return (
    <section
      className="grid scroll-mt-28 gap-4 py-8 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-8"
      data-showcase-item={title}
      id={id}
    >
      <div className="md:col-span-2">
        <HandDrawnRule
          className="h-4"
          crookedness={0.65}
          strokeWidth={1.35}
          svgClassName="opacity-100"
          strokeWidthVariation={7}
        />
      </div>
      <div className="grid content-start gap-2">
        <h2
          className={`font-[var(--font-heading)] text-3xl leading-none text-[color:var(--ink-strong)] ${forestReadableTextClass}`}
        >
          {title}
        </h2>
        {note ? (
          <p
            className={`text-sm leading-7 text-[color:var(--muted-foreground)] ${forestReadableTextClass}`}
          >
            {note}
          </p>
        ) : null}
      </div>
      <div className="min-w-0 overflow-x-clip overflow-y-visible px-1">
        {installName ? <CopyableInstallLine name={installName} /> : null}
        {children}
      </div>
    </section>
  );
}

function CopyableInstallLine({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);
  const command = `pnpm dlx shadcn@latest add @ghibli/${name}`;

  const handleCopy = async () => {
    const didCopy = await copyTextToClipboard(command);

    if (!didCopy) {
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("mb-4 w-fit max-w-full", docsCodeBlockSurfaceClass)}>
      <div aria-hidden="true" className={docsCodeBlockOverlayClass} />
      <div className="relative flex items-center gap-2 px-3 py-2">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap pr-1 font-mono text-[0.8rem] text-[color:var(--theme-docs-code-foreground)] [text-shadow:var(--theme-docs-code-text-shadow)]">
          {command}
        </code>
        <button
          aria-label={
            copied ? "Copied install command" : "Copy install command"
          }
          className={cn(docsCodeBlockButtonClass, "h-7 px-2")}
          onClick={() => void handleCopy()}
          type="button"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

function ShowcasePasswordInput({
  defaultValue = "lantern-light",
  label = "Password",
}: {
  defaultValue?: string;
  label?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      description="Uses the same reveal affordance as the auth flows."
      label={label}
    >
      <div className="relative">
        <Input
          className="pr-10"
          defaultValue={defaultValue}
          placeholder="••••••••"
          type={showPassword ? "text" : "password"}
        />
        <button
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 z-30 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword((previous) => !previous)}
          type="button"
        >
          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </FormField>
  );
}

function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();
  const selectable = THEME_OPTIONS.filter((option) =>
    AVAILABLE_THEME_IDS.includes(option.id),
  );

  return (
    <div className="flex flex-wrap gap-3">
      {selectable.map((option) => {
        const isActive = option.id === theme;
        return (
          <button
            aria-pressed={isActive}
            className={cn(
              "grid min-w-[12rem] gap-1 border-2 px-4 py-3 text-left transition-colors",
              isActive
                ? "border-[color:var(--border)] bg-[color:var(--paper)] text-[color:var(--ink-strong)]"
                : "border-[color:var(--border-soft)] bg-[color:var(--paper-soft)] text-[color:var(--muted-foreground)] hover:text-[color:var(--ink-strong)]",
            )}
            key={option.id}
            onClick={() => setTheme(option.id)}
            type="button"
          >
            <span className="font-[var(--font-heading)] text-base leading-none">
              {option.name}
            </span>
            <span className="text-xs">data-theme="{option.id}"</span>
          </button>
        );
      })}
    </div>
  );
}

function TokenSwatch({
  description,
  name,
  value,
}: {
  description?: string;
  name: string;
  value: string;
}) {
  return (
    <div className="grid gap-2 border border-[color:var(--border-soft)] bg-[color:var(--paper-soft)] p-3">
      <div
        aria-hidden="true"
        className="h-14 w-full border border-[color:var(--border-soft)]"
        style={{ background: value }}
      />
      <div className="grid gap-1">
        <code className="text-xs text-[color:var(--ink-strong)]">{name}</code>
        {description ? (
          <p className="text-xs leading-5 text-[color:var(--muted-foreground)]">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function HomePage() {
  const [activeTab, setActiveTab] = useState("live-feed");
  const [isChangeThemeOpen, setIsChangeThemeOpen] = useState(false);
  const [isAccountEmailOpen, setIsAccountEmailOpen] = useState(false);
  const [isAccountPasswordOpen, setIsAccountPasswordOpen] = useState(false);
  const [isAccountUsernameOpen, setIsAccountUsernameOpen] = useState(false);
  const [accountUsername, setAccountUsername] = useState("Mei Studio");
  const [accountNewEmail, setAccountNewEmail] = useState("mei@ghibli-ui.test");
  const [accountCurrentPassword, setAccountCurrentPassword] = useState("");
  const [accountNewPassword, setAccountNewPassword] = useState("");
  const [accountConfirmPassword, setAccountConfirmPassword] = useState("");
  const [mode, setMode] = useState("image");
  const [model, setModel] = useState("flux-dev");
  const [aspectRatio, setAspectRatio] = useState("9/16");
  const [prompt, setPrompt] = useState("");
  const [editorAttachments, setEditorAttachments] = useState<
    GenerateAttachment[]
  >([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [communityImageIndex, setCommunityImageIndex] = useState<number | null>(
    null,
  );
  const [communityVideoIndex, setCommunityVideoIndex] = useState<number | null>(
    null,
  );
  const [frameCrookedness, setFrameCrookedness] = useState(0.5);
  const [frameStrokeWidthVariation, setFrameStrokeWidthVariation] = useState(4);
  const [frameStrokeWidth, setFrameStrokeWidth] = useState(1.6);
  const editorAttachmentsRef = useRef<GenerateAttachment[]>([]);
  const editorAttachmentIdRef = useRef(0);
  const availableGenerateModelItems =
    mode === "video"
      ? generateModelItems.filter((item) => item.supportsVideo)
      : generateModelItems;
  const availableGenerateModelsByBase = groupGenerateModelsByBase(
    availableGenerateModelItems,
  );
  const selectedGenerateModel =
    availableGenerateModelItems.find((item) => item.name === model) ??
    availableGenerateModelItems[0];
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
  const handleGenerateModeChange = (nextMode: string) => {
    setMode(nextMode);

    if (
      nextMode === "video" &&
      !generateModelItems.find((item) => item.name === model)?.supportsVideo
    ) {
      setModel("flux-dev");
    }
  };

  useEffect(() => {
    editorAttachmentsRef.current = editorAttachments;
  }, [editorAttachments]);

  useEffect(() => {
    return () => {
      for (const attachment of editorAttachmentsRef.current) {
        if (attachment.previewUrl) {
          URL.revokeObjectURL(attachment.previewUrl);
        }
      }
    };
  }, []);

  const handleEditorAttachmentsSelected = (files: FileList) => {
    const nextAttachments = Array.from(files).map((file) => {
      editorAttachmentIdRef.current += 1;

      const kind = getGenerateAttachmentKind(file);
      const previewUrl =
        kind === "image" ? URL.createObjectURL(file) : undefined;
      const attachment: GenerateAttachment = {
        id: `home-generate-attachment-${editorAttachmentIdRef.current}`,
        kind,
        name: file.name,
        sizeLabel: formatAttachmentSize(file.size),
      };

      if (previewUrl) {
        attachment.previewUrl = previewUrl;
      }

      return attachment;
    });

    setEditorAttachments((current) => [...current, ...nextAttachments]);
  };

  const handleEditorAttachmentRemove = (attachmentId: string) => {
    setEditorAttachments((current) => {
      const attachmentToRemove = current.find(
        (attachment) => attachment.id === attachmentId,
      );

      if (attachmentToRemove?.previewUrl) {
        URL.revokeObjectURL(attachmentToRemove.previewUrl);
      }

      return current.filter((attachment) => attachment.id !== attachmentId);
    });
  };

  const framePreviewSnippet = `<HandDrawnFrame
  crookedness={${frameCrookedness}}
  strokeWidthVariation={${frameStrokeWidthVariation}}
  strokeWidth={${frameStrokeWidth}}
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
        <div className="grid gap-3">
          <h2
            className={`font-[var(--font-heading)] text-3xl leading-none text-[color:var(--ink-strong)] ${forestReadableTextClass}`}
          >
            Quick Start
          </h2>
          <p
            className={`max-w-3xl text-sm leading-7 text-[color:var(--muted-foreground)] ${forestReadableTextClass}`}
          >
            Ghibli UI ships as a shadcn registry, components are installed by
            copying source into your app, not via npm. Add the namespace below
            to your app&apos;s <code>components.json</code> once, then install
            either the whole set with <code>@ghibli/all</code> or any single
            item by its name (e.g. <code>@ghibli/button</code>,{" "}
            <code>@ghibli/form-field</code>). Installable sections show
            its own install command with a copy button.
          </p>
        </div>
        <DemoSurface>
          <ol className="grid list-none gap-6">
            <li className="grid gap-2">
              <p
                className={`text-sm leading-7 text-[color:var(--ink-strong)] ${forestReadableTextClass}`}
              >
                <span className="font-[var(--font-heading)] text-base">1.</span>{" "}
                Make sure your app already has shadcn wired up. If not, run the
                command below and follow its prompts.
              </p>
              <CodeBlock>{shadcnInitSnippet}</CodeBlock>
            </li>
            <li className="grid gap-2">
              <p
                className={`text-sm leading-7 text-[color:var(--ink-strong)] ${forestReadableTextClass}`}
              >
                <span className="font-[var(--font-heading)] text-base">2.</span>{" "}
                Add the <code>@ghibli</code> namespace to your app&apos;s{" "}
                <code>components.json</code>:
              </p>
              <CodeBlock>{registrySnippet}</CodeBlock>
            </li>
            <li className="grid gap-2">
              <p
                className={`text-sm leading-7 text-[color:var(--ink-strong)] ${forestReadableTextClass}`}
              >
                <span className="font-[var(--font-heading)] text-base">3.</span>{" "}
                Install components — pick one or more (install either the whole
                set with <code>@ghibli/all</code> or any single item by its
                name):
              </p>
              <CodeBlock>{installCommandsSnippet}</CodeBlock>
              <p
                className={`text-xs leading-6 text-[color:var(--muted-foreground)] ${forestReadableTextClass}`}
              >
                Each command writes the TypeScript source into your project
                (e.g. <code>src/components/ui/button.tsx</code>) and installs
                any npm peer deps (<code>clsx</code>,{" "}
                <code>tailwind-merge</code>, Radix primitives…).
              </p>
            </li>
            <li className="grid gap-2">
              <p
                className={`text-sm leading-7 text-[color:var(--ink-strong)] ${forestReadableTextClass}`}
              >
                <span className="font-[var(--font-heading)] text-base">4.</span>{" "}
                Import and use:
              </p>
              <CodeBlock>{importSnippet}</CodeBlock>
              <p
                className={`text-xs leading-6 text-[color:var(--muted-foreground)] ${forestReadableTextClass}`}
              >
                From here on, that file is yours — edit it freely.
              </p>
            </li>
          </ol>
        </DemoSurface>
        <p
          className={`max-w-3xl text-sm leading-7 text-[color:var(--muted-foreground)] ${forestReadableTextClass}`}
        >
          Installable sections below display their own install command with a
          copy button. Cozy examples are showcase-only compositions.
        </p>
      </section>

      <ShowcaseGroup id="shell-navigation">
        <Specimen
          id="component-user-popup"
          installName="layout-shell"
          note="The layout shell header, utility links, and user menu are shown directly instead of abstract placeholders."
          title="Header / User Popup"
        >
          <div className="[&>header]:static">
            <ShellHeader
              brand={
                <a className="inline-flex items-center gap-3" href="#install">
                  <BrandMark />
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
                  href: "#",
                  icon: <Palette className="size-4" />,
                  iconOnly: true,
                  label: "Change theme",
                  onClick: (event) => {
                    event.preventDefault();
                    setIsChangeThemeOpen(true);
                  },
                },
                {
                  external: true,
                  href: repoUrl,
                  icon: <GitHubHeaderIcon />,
                  iconOnly: true,
                  label: "GitHub",
                },
                {
                  external: true,
                  href: "https://discord.gg/cozyart",
                  icon: <DiscordHeaderIcon />,
                  iconOnly: true,
                  label: "Discord",
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
                    icon: <Palette className="size-4" />,
                    id: "theme",
                    label: "Theme",
                    onSelect: () => setIsChangeThemeOpen(true),
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
          installName="tabs"
          note="The community tab switch used for live feed, video, and X posts."
          title="Tabs Switch"
        >
          <Tabs
            className="min-w-0 gap-6"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <CommunityTabsList activeTab={activeTab} />
          </Tabs>
        </Specimen>

        <Specimen
          id="component-hand-drawn-frame"
          installName="hand-drawn-frame"
          note="The frame primitive now mirrors Cozy.art's surface and divider API with crookedness compensation and stroke-width variation controls."
          title="Hand Drawn Frame"
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
            <DemoSurface className={forestWoodSurfaceClass}>
              <div className="grid gap-3">
                <FrameRulerField
                  description="Lower values keep the frame closer to a steady surface."
                  label="Crookedness"
                  onValueChange={setFrameCrookedness}
                  options={frameCrookednessOptions}
                  value={frameCrookedness}
                />
                <FrameRulerField
                  description="Higher values add more layered stroke drift."
                  label="Stroke Width Variation"
                  onValueChange={setFrameStrokeWidthVariation}
                  options={frameStrokeWidthVariationOptions}
                  value={frameStrokeWidthVariation}
                />
                <FrameRulerField
                  description="Use the ruler to push the base line from fine to bold."
                  label="Stroke Width"
                  onValueChange={setFrameStrokeWidth}
                  options={frameStrokeWidthOptions}
                  value={frameStrokeWidth}
                />
              </div>
            </DemoSurface>
            <DemoSurface className={forestWoodSurfaceClass}>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                    Interactive playground
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Adjust the Cozy-style surface controls and preview the
                    result live.
                  </p>
                </div>
                <HandDrawnFrame
                  contentClassName="px-5 py-5"
                  surfaceClassName="bg-[color:var(--card)]"
                  strokeWidth={frameStrokeWidth}
                  strokeWidthVariation={frameStrokeWidthVariation}
                  crookedness={frameCrookedness}
                >
                  <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                    Frame preview
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    The showcase focuses on the primary Cozy surface treatment
                    instead of exposing every frame mode here.
                  </p>
                </HandDrawnFrame>
                <CodeBlock>{framePreviewSnippet}</CodeBlock>
              </div>
            </DemoSurface>
          </div>
        </Specimen>

        <Specimen
          id="component-theme-frame"
          installName="theme-frame"
          note="Theme-aware presets wrap the lower-level hand-drawn frame so app surfaces can share consistent line weight across themes."
          title="Theme Frame"
        >
          <DemoSurface className={forestWoodSurfaceClass}>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <ThemeFrame
                contentClassName="px-5 py-4"
                surfaceClassName="bg-[color:var(--card)]"
                variant={THEME_FRAME_VARIANTS.dialogPanel}
              >
                <p className="font-[var(--font-heading)] text-lg text-[color:var(--ink-strong)]">
                  Dialog panel preset
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  The component reads the active theme and applies the matching
                  frame config.
                </p>
              </ThemeFrame>
              <ThemeFrame
                contentClassName="px-5 py-4"
                surfaceClassName="bg-[color:var(--paper-soft)]"
                variant={THEME_FRAME_VARIANTS.generateControl}
              >
                <p className="font-[var(--font-heading)] text-lg text-[color:var(--ink-strong)]">
                  Control preset
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Consumers can reuse the presets or tune the copied config in
                  their own app.
                </p>
              </ThemeFrame>
            </div>
          </DemoSurface>
        </Specimen>
      </ShowcaseGroup>

      <ShowcaseGroup id="core-primitives">
        <Specimen
          id="component-button"
          installName="button"
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
          installName="cartoon-button"
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
          id="component-toast"
          installName="toast"
          note="Portal-backed feedback primitive for app events. Product copy and event policy stay in the host app."
          title="Toast"
        >
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() =>
                toast.success("Saved changes.", {
                  title: "Success",
                })
              }
              type="button"
            >
              Success
            </Button>
            <Button
              onClick={() =>
                toast.error("Unable to save right now.", {
                  title: "Error",
                })
              }
              type="button"
              variant="secondary"
            >
              Error
            </Button>
            <Button
              onClick={() => toast.info("Draft is still private.")}
              type="button"
              variant="outline"
            >
              Info
            </Button>
          </div>
        </Specimen>

        <Specimen
          id="component-forms"
          installName="form-field"
          note="Presented as real form rows so users can see the primitive inputs and the full field wrapper in the same place."
          title="Input, Textarea, Form Field"
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <DemoSurface className={forestWoodSurfaceClass}>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                    Input Types
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Text, email, search, and password are shown as editable rows
                    instead of isolated screenshots.
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField label="Text input">
                    <Input defaultValue="Tea shop by the river" type="text" />
                  </FormField>
                  <FormField label="Email input">
                    <Input defaultValue="user@ghibli-ui.test" type="email" />
                  </FormField>
                  <FormField label="Search input">
                    <Input defaultValue="Lantern ferry" type="search" />
                  </FormField>
                  <ShowcasePasswordInput />
                </div>
              </div>
            </DemoSurface>
            <div className="grid gap-4">
              <DemoSurface className={forestWoodSurfaceClass}>
                <div className="grid gap-4">
                  <div className="grid gap-1">
                    <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                      Form Field States
                    </p>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Description, action, and error states are part of the
                      wrapper, not the input primitive.
                    </p>
                  </div>
                  <FormField
                    description="A reusable label and helper wrapper."
                    label="Prompt title"
                  >
                    <Input defaultValue="Tea shop by the river" />
                  </FormField>
                  <FormField
                    action={
                      <Button size="xs" type="button" variant="ghost">
                        Check
                      </Button>
                    }
                    error="Example validation message."
                    label="Slug"
                  >
                    <Input defaultValue="tea-shop-by-the-river" />
                  </FormField>
                </div>
              </DemoSurface>
              <DemoSurface className={forestWoodSurfaceClass}>
                <div className="grid gap-4">
                  <div className="grid gap-1">
                    <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                      Textarea
                    </p>
                    <p className="text-sm leading-7 text-muted-foreground">
                      The longer prompt surface keeps the same hand-drawn shell
                      and fits naturally inside `FormField`.
                    </p>
                  </div>
                  <FormField
                    action={
                      <Button size="xs" type="button" variant="ghost">
                        Optional
                      </Button>
                    }
                    description="Good for prompt writing, notes, and larger text entry."
                    label="Long prompt"
                  >
                    <Textarea defaultValue="Describe the scene, mood, light, and style with enough detail for a painterly result." />
                  </FormField>
                </div>
              </DemoSurface>
            </div>
          </div>
        </Specimen>
      </ShowcaseGroup>

      <ShowcaseGroup id="auth-flows">
        <Specimen
          id="pattern-auth-forms"
          note="Cozy example only: auth fields, tab labels, and register policy belong to the host app, not the public registry."
          title="Cozy Auth Example"
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
        </Specimen>
      </ShowcaseGroup>

      <ShowcaseGroup id="account-screens">
        <Specimen
          id="pattern-account-user-display"
          note="Cozy example only: account metadata, avatar actions, generation counts, and password policy are app-owned."
          title="Cozy Account User Display"
        >
          <DemoSurface>
            <AccountUserDisplayBox
              avatarUrl={mockHeaderAvatarUrl}
              email="mei@ghibli-ui.test"
              generatedCount={127}
              hasCustomAvatar
              hasPassword
              name={accountUsername}
              onEditName={() => setIsAccountUsernameOpen(true)}
              onPasswordAction={() => setIsAccountPasswordOpen(true)}
              onRemoveAvatar={() => undefined}
              onUploadAvatar={() => undefined}
            />
          </DemoSurface>
        </Specimen>

        <Specimen
          id="pattern-account-profile-summary"
          note="Cozy example only: this shows how primitives compose around account data without making account policy installable."
          title="Cozy Account Profile Section"
        >
          <DemoSurface>
            <AccountProfileSection
              actions={
                <>
                  <Button
                    onClick={() => setIsAccountEmailOpen(true)}
                    variant="outline"
                  >
                    Change email
                  </Button>
                  <Button
                    onClick={() => setIsAccountPasswordOpen(true)}
                    variant="secondary"
                  >
                    Change password
                  </Button>
                </>
              }
              avatarUrl={mockHeaderAvatarUrl}
              email="mei@ghibli-ui.test"
              name={accountUsername}
              planLabel="Monthly Studio"
            />
          </DemoSurface>
        </Specimen>

        <Specimen
          id="pattern-account-subscription"
          note="Cozy example only: plan names, billing actions, and credit balances are product-specific."
          title="Cozy Subscription Section"
        >
          <DemoSurface>
            <AccountSubscriptionSection
              actions={
                <>
                  <Button variant="outline">Manage subscription</Button>
                  <Button
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    variant="ghost"
                  >
                    Cancel subscription
                  </Button>
                </>
              }
              activeOfferId="monthly"
              balanceLabel="$24.00"
              offers={subscriptionOffers}
              planName="Monthly Studio"
              priceName="$24 / month"
              renewalText="May 20, 2026"
            />
          </DemoSurface>
        </Specimen>

        <Specimen
          id="pattern-account-credits"
          note="Cozy example only: ledger semantics and payment copy stay in the host app."
          title="Cozy Payments Section"
        >
          <DemoSurface>
            <AccountApiCreditsSection ledger={creditLedger} />
          </DemoSurface>
        </Specimen>

        <Specimen
          id="pattern-account-dialogs"
          note="Cozy example only: username, email, and password change flows are app/auth-provider policy."
          title="Cozy Account Dialogs"
        >
          <DemoSurface>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setIsAccountUsernameOpen(true)}
                variant="secondary"
              >
                Open change username
              </Button>
              <Button
                onClick={() => setIsAccountEmailOpen(true)}
                variant="secondary"
              >
                Open change email
              </Button>
              <Button
                onClick={() => setIsAccountPasswordOpen(true)}
                variant="secondary"
              >
                Open change password
              </Button>
            </div>
          </DemoSurface>
        </Specimen>
      </ShowcaseGroup>

      <ShowcaseGroup id="community-flows">
        <Specimen
          id="pattern-community-cards"
          note="Cozy example only: live-feed media, prompts, model metadata, and X-post semantics are product-owned."
          title="Cozy Image Card"
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
          note="Cozy example only: video feed behavior and viewer semantics stay outside the installable registry."
          title="Cozy Video Card"
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
          id="pattern-generate-editor-bar"
          note="Cozy example only: prompt submission, attachments, model selection, and generation policy belong to Cozy Art."
          title="Cozy Generate Editor Bar"
        >
          <div className="ghibli-generate-editor-stage">
            <div className="ghibli-generate-editor-stage-dock">
              <div className="ghibli-generate-editor-stage-inner">
                <GenerateEditorBar
                  aspectRatio={aspectRatio}
                  aspectRatioOptions={aspectRatioOptions}
                  attachments={editorAttachments}
                  mode={mode}
                  modeOptions={modeOptions}
                  model={selectedGenerateModel?.name ?? model}
                  modelsByBase={availableGenerateModelsByBase}
                  onAspectRatioChange={setAspectRatio}
                  onAttachmentsSelected={handleEditorAttachmentsSelected}
                  onModeChange={handleGenerateModeChange}
                  onModelChange={setModel}
                  onPromptChange={setPrompt}
                  onRemoveAttachment={handleEditorAttachmentRemove}
                  prompt={prompt}
                  selectedModel={selectedGenerateModel}
                />
              </div>
            </div>
          </div>
        </Specimen>

        {/* Preserve removed showcase hashes near the surviving generate controls specimen. */}
        <div
          aria-hidden="true"
          className="h-0 scroll-mt-28 overflow-hidden"
          id="component-generate-selects"
        />

        <Specimen
          id="pattern-generate-controls"
          note="Cozy example only: these controls show product-specific generation composition, not a public registry item."
          title="Cozy Generate Controls"
        >
          <div className="flex flex-wrap items-center gap-3">
            <GenerateModeToggle
              onValueChange={handleGenerateModeChange}
              options={modeOptions}
              value={mode}
            />
            <GenerateModelSelect
              model={selectedGenerateModel?.name ?? model}
              modelsByBase={availableGenerateModelsByBase}
              onChange={setModel}
              selectedModel={selectedGenerateModel}
            />
            <GenerateAspectRatioSelect
              onValueChange={setAspectRatio}
              options={aspectRatioOptions}
              value={aspectRatio}
            />
            <GenerateButton isAuthenticated onClick={() => undefined} />
          </div>
        </Specimen>
      </ShowcaseGroup>

      <ShowcaseGroup id="docs-screens">
        <Specimen
          id="pattern-docs"
          installName="docs-article"
          note="Docs article and FAQ blocks remain public, but now they sit beside the larger route-level page examples."
          title="Docs Article and FAQ"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <DocsArticle>
              <DocsH2>Docs article</DocsH2>
              <DocsParagraph>
                Use this block for prose pages that still need the paper rhythm.
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
          installName="page-shell"
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

      <ShowcaseGroup id="new-in-sync">
        <Specimen
          id="pattern-theme-switcher"
          installName="theme"
          note="Runtime theme switching via data-theme on the document root. State persists to localStorage. Also reachable from the header user menu → Theme."
          title="Theme Switcher"
        >
          <DemoSurface>
            <div className="grid gap-4">
              <ThemeSwitcher />
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => setIsChangeThemeOpen(true)}
                  variant="outline"
                >
                  <Palette className="size-4" />
                  Open Change Theme modal
                </Button>
                <span className="text-xs text-[color:var(--muted-foreground)]">
                  Same modal the header user menu opens.
                </span>
              </div>
              <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
                Selecting a theme rewrites every scoped CSS variable (surfaces,
                scenic tones, overlays, scrollbar). Components reading{" "}
                <code>var(--*)</code> update instantly.
              </p>
            </div>
          </DemoSurface>
        </Specimen>

        <Specimen
          id="component-contrast-icon-button"
          note="High-contrast icon action — dark ink fill with accented icon color. Use for persistent toolbar controls."
          title="Contrast Icon Button"
        >
          <DemoSurface>
            <div className="flex flex-wrap gap-3">
              <button
                aria-label="Save"
                className={cn(
                  contrastIconButtonClass,
                  "flex size-11 items-center justify-center",
                )}
                type="button"
              >
                <Heart className="size-5" />
              </button>
              <button
                aria-label="Download"
                className={cn(
                  contrastIconButtonClass,
                  "flex size-11 items-center justify-center",
                )}
                type="button"
              >
                <Download className="size-5" />
              </button>
              <button
                aria-label="Share"
                className={cn(
                  contrastIconButtonClass,
                  "flex size-11 items-center justify-center",
                )}
                type="button"
              >
                <Share2 className="size-5" />
              </button>
              <button
                aria-label="Disabled"
                className={cn(
                  contrastIconButtonClass,
                  "flex size-11 items-center justify-center",
                )}
                disabled
                type="button"
              >
                <Share2 className="size-5" />
              </button>
            </div>
          </DemoSurface>
        </Specimen>

        <Specimen
          id="pattern-new-tokens"
          note="CSS custom properties synced from Cozy Art. Each swatch is the resolved value under the active theme."
          title="New Tokens"
        >
          <DemoSurface>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <TokenSwatch
                description="Header / navigation surface."
                name="--surface-shell"
                value="var(--surface-shell)"
              />
              <TokenSwatch
                description="Faint border for dividers and chrome."
                name="--border-faint"
                value="var(--border-faint)"
              />
              <TokenSwatch
                description="Low-opacity primary, for hover/active tints."
                name="--primary-soft"
                value="var(--primary-soft)"
              />
              <TokenSwatch
                description="Low-opacity destructive for inline alerts."
                name="--destructive-soft"
                value="var(--destructive-soft)"
              />
              <TokenSwatch
                description="Text selection background."
                name="--selection-background"
                value="var(--selection-background)"
              />
              <TokenSwatch
                description="Scrollbar thumb."
                name="--scrollbar-thumb"
                value="var(--scrollbar-thumb)"
              />
              <TokenSwatch
                description="Dialog backdrop."
                name="--overlay-backdrop"
                value="var(--overlay-backdrop)"
              />
              <TokenSwatch
                description="Media viewer backdrop (community modals)."
                name="--media-overlay-backdrop"
                value="var(--media-overlay-backdrop)"
              />
              <TokenSwatch
                description="Floating panel surface."
                name="--surface-panel-floating"
                value="var(--surface-panel-floating)"
              />
              <TokenSwatch
                description="Card gradient for raised surfaces."
                name="--surface-card-gradient"
                value="var(--surface-card-gradient)"
              />
              <TokenSwatch
                description="Panel gradient for popovers and sheets."
                name="--surface-panel-gradient"
                value="var(--surface-panel-gradient)"
              />
              <TokenSwatch
                description="App-level background stack."
                name="--app-background-image"
                value="var(--app-background-image)"
              />
            </div>
          </DemoSurface>
        </Specimen>
      </ShowcaseGroup>

      <ShowcaseGroup id="footer-endmatter">
        <Specimen
          id="pattern-feedback"
          installName="notice-banner"
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
          installName="layout-shell"
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
                <BrandMark className="size-10 shrink-0" />
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

      <ChangeThemeModal
        onOpenChange={setIsChangeThemeOpen}
        open={isChangeThemeOpen}
      />

      <AccountChangeUsernameDialog
        onOpenChange={setIsAccountUsernameOpen}
        onSubmit={(event) => {
          event.preventDefault();
          setIsAccountUsernameOpen(false);
        }}
        onUsernameChange={setAccountUsername}
        open={isAccountUsernameOpen}
        username={accountUsername}
      />

      <AccountChangeEmailDialog
        currentEmail="mei@ghibli-ui.test"
        newEmail={accountNewEmail}
        onNewEmailChange={setAccountNewEmail}
        onOpenChange={setIsAccountEmailOpen}
        onSubmit={(event) => {
          event.preventDefault();
          setIsAccountEmailOpen(false);
        }}
        open={isAccountEmailOpen}
      />

      <AccountChangePasswordDialog
        confirmPassword={accountConfirmPassword}
        currentPassword={accountCurrentPassword}
        newPassword={accountNewPassword}
        onConfirmPasswordChange={setAccountConfirmPassword}
        onCurrentPasswordChange={setAccountCurrentPassword}
        onNewPasswordChange={setAccountNewPassword}
        onOpenChange={setIsAccountPasswordOpen}
        onSubmit={(event) => {
          event.preventDefault();
          setIsAccountPasswordOpen(false);
          setAccountCurrentPassword("");
          setAccountNewPassword("");
          setAccountConfirmPassword("");
        }}
        open={isAccountPasswordOpen}
      />
    </div>
  );
}
