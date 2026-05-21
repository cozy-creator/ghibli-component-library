import * as React from "react";
import {
  ImageIcon,
  Leaf,
  MessageSquareText,
  Paintbrush2,
  ShieldCheck,
  Wand2,
} from "lucide-react";

import { type FaqItem } from "@ghibli/ui";
import type {
  GenerateAspectRatioOption,
  GenerateModelItem,
  GenerateModelsByBase,
} from "@/examples/generate/controls";

import { BrandMark } from "@/apps/web/src/components/site-brand";
import {
  DocsHeaderIcon,
  GitHubHeaderIcon,
  mockHeaderAvatarUrl,
} from "@/apps/web/src/components/site-header-icons";
import { SceneArt } from "@/apps/web/src/components/docs/scene-art";

function scenicDataUri({
  accent,
  label,
  skyBottom,
  skyTop,
}: {
  accent: string;
  label: string;
  skyBottom: string;
  skyTop: string;
}) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${skyTop}" />
          <stop offset="100%" stop-color="${skyBottom}" />
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#sky)" />
      <circle cx="140" cy="140" r="80" fill="${accent}" fill-opacity="0.45" />
      <ellipse cx="400" cy="700" rx="460" ry="220" fill="#7c9d6b" />
      <ellipse cx="430" cy="770" rx="500" ry="220" fill="#5d7b57" />
      <rect x="120" y="150" width="560" height="560" rx="24" fill="rgba(255,255,255,0.2)" stroke="#624734" stroke-width="10" />
      <text x="400" y="800" text-anchor="middle" font-family="Georgia, serif" font-size="54" fill="#4a3627">${label}</text>
    </svg>
  `)}`;
}

export const libraryNavItems = [
  { href: "#install", label: "Install" },
  { href: "#component-button", label: "Components" },
  { href: "#pattern-generate-editor-bar", label: "Generate" },
  { href: "#component-footer", label: "Footer" },
  { href: "#storybook", label: "Storybook" },
];

export const footerColumns = [
  {
    id: "guides",
    links: [
      { href: "#install", label: "Getting started" },
      { href: "#component-button", label: "Components" },
      { href: "#storybook", label: "Storybook" },
    ],
    title: "Guides",
  },
  {
    id: "library",
    links: [
      { href: "#component-button", label: "Buttons" },
      { href: "#pattern-generate-editor-bar", label: "Generate bar" },
      { href: "#pattern-community-cards", label: "Cards" },
    ],
    title: "Library",
  },
  {
    id: "tools",
    links: [
      { href: "https://ui.shadcn.com/docs/registry", label: "shadcn registry" },
      { href: "https://storybook.js.org", label: "Storybook" },
      { href: "https://vite.dev", label: "Vite" },
    ],
    title: "Tools",
  },
];

export const utilityItems = [
  {
    external: true,
    href: "https://github.com/rodrigoluz/ghibli-component-library",
    icon: <GitHubHeaderIcon />,
    iconOnly: true,
    label: "GitHub",
  },
  {
    href: "/guides/getting-started",
    icon: <DocsHeaderIcon />,
    iconOnly: true,
    label: "Docs",
  },
];

export const socialItems = utilityItems;

export const headerBrand = (
  <a className="inline-flex items-center gap-3" href="/">
    <BrandMark />
    <div className="grid gap-0.5">
      <span className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
        Ghibli UI
      </span>
      <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
        Installable component library
      </span>
    </div>
  </a>
);

export const headerUser = {
  avatarUrl: mockHeaderAvatarUrl,
  initials: "MS",
  menuItems: [
    { id: "docs", label: "Open docs" },
    { destructive: true, id: "exit", label: "Close panel" },
  ],
  name: "User",
  subtitle: "Preview mode",
};

export const featureItems = [
  {
    description:
      "One paper-and-ink baseline theme with registry-ready primitives and calm defaults.",
    icon: <Leaf className="size-5" />,
    id: "theme",
    title: "Single scenic theme",
  },
  {
    description:
      "Components, patterns, examples, and guides organized for actual library adoption.",
    icon: <ShieldCheck className="size-5" />,
    id: "docs",
    title: "Docs-first structure",
  },
  {
    description:
      "Install only the parts you need with `shadcn add`, then customize the copied source.",
    icon: <Paintbrush2 className="size-5" />,
    id: "registry",
    title: "Registry-friendly delivery",
  },
];

export const featureVisualItems = [
  {
    description:
      "Input, button, overlay, and navigation surfaces share the same soft spacing rhythm.",
    icon: <Wand2 className="size-5" />,
    id: "components",
    title: "Component primitives",
  },
  {
    description:
      "Grouped patterns give teams larger building blocks without turning the library into a template pack.",
    icon: <ImageIcon className="size-5" />,
    id: "patterns",
    title: "Composable patterns",
  },
  {
    description:
      "Guides, examples, and Storybook work together so consumers can install with confidence.",
    icon: <MessageSquareText className="size-5" />,
    id: "guidance",
    title: "Practical guidance",
  },
];

export const faqItems: FaqItem[] = [
  {
    answer:
      "Add the `style` item first so the theme variables, base typography, and paper surfaces are available before installing any other item.",
    id: "install-style",
    question: "What should I install first?",
  },
  {
    answer:
      "Use the component pages for quick preview, install, usage, and notes. Use Storybook when you want to inspect multiple states interactively.",
    id: "docs-vs-storybook",
    question: "How should I use the docs app and Storybook together?",
  },
  {
    answer:
      "The registry copies source into your app. You can rename, restyle, or refactor installed files after they land in your project.",
    id: "ownership",
    question: "Do I own the installed source?",
  },
];

export const communityImageItems = [
  {
    authorName: "Mina Journal",
    createdAtLabel: "2 hours ago",
    description:
      "Painterly landscape card with room for title, meta, and short supporting copy.",
    id: "forest",
    imageUrl: "https://picsum.photos/seed/ghibli-forest-lantern/1200/800",
    meta: "Updated 2h ago",
    negativePromptText: "harsh contrast, oversharpening, cluttered skyline",
    promptText:
      "Painterly forest path lit by paper lanterns, soft evening haze, mossy stones, gentle watercolor blending.",
    title: "Forest lantern walk",
  },
  {
    authorName: "Jun Atelier",
    createdAtLabel: "Yesterday",
    description:
      "Warm editorial postcard treatment that still reads like a reusable UI card.",
    id: "coast",
    imageUrl: "https://picsum.photos/seed/ghibli-harbor-tea/1200/800",
    meta: "Updated yesterday",
    negativePromptText: "busy crowds, modern signage, noisy reflections",
    promptText:
      "Quiet harbor cafe terrace at golden hour, warm tea steam, seaside breeze, hand-painted postcard mood.",
    title: "Harbor tea break",
  },
  {
    authorName: "Aki Field Notes",
    createdAtLabel: "3 days ago",
    description:
      "Nature-heavy visual that works for galleries, changelogs, or editorial lists.",
    id: "mountain",
    imageUrl: scenicDataUri({
      accent: "#d8d299",
      label: "Cloud Pass Lookout",
      skyBottom: "#dfe5c8",
      skyTop: "#aac4dc",
    }),
    meta: "Updated 3 days ago",
    title: "Cloud pass lookout",
  },
];

export const communityVideoItems = [
  {
    authorName: "Mina Journal",
    createdAtLabel: "4 hours ago",
    description: "Looping motion card with clear runtime labeling.",
    id: "video-1",
    meta: "Preview loop • 12s",
    negativePromptText: "camera shake, modern neon, harsh shadows",
    posterUrl: "https://picsum.photos/seed/ghibli-lantern-ferry/1200/800",
    promptText:
      "Slow ferry drifting through lantern reflections at dusk, watercolor ripples, quiet cinematic motion.",
    title: "Lantern ferry glide",
    videoUrl:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  },
  {
    authorName: "Jun Atelier",
    createdAtLabel: "Yesterday",
    description:
      "Reference video modal with enough metadata for richer gallery flows.",
    id: "video-2",
    meta: "Preview loop • 8s",
    negativePromptText: "compression artifacts, flicker, oversaturated lights",
    posterUrl: "https://picsum.photos/seed/ghibli-window-rain/1200/800",
    promptText:
      "Rain tracing a train window at night, dim interior reflections, soft hand-painted movement and muted city glow.",
    title: "Window rain study",
    videoUrl:
      "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4",
  },
];

export const xPostDemo = {
  author: "Mina Journal",
  body: "Reorganized the library around installable primitives, grouped patterns, and a cleaner documentation flow so teams can adopt it without reverse-engineering the repo.",
  handle: "minajournal",
  mediaUrl: scenicDataUri({
    accent: "#e6a772",
    label: "Release Notes",
    skyBottom: "#e8ddc2",
    skyTop: "#b7d2db",
  }),
  metrics: { likes: "1.6k", replies: "84", reposts: "220" },
  note: "Useful for release notes, changelog cards, or editorial-style updates.",
};

export const modeOptions = [
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
];

export const generateModelItems: GenerateModelItem[] = [
  {
    baseModel: "Flux",
    description: "Highest quality. Best for detailed, photorealistic images.",
    displayName: "Flux Dev",
    expectedTimeSec: 30,
    expertise: ["photo", "hyper-real", "classical-art"],
    name: "flux-dev",
    supportsVideo: true,
  },
  {
    baseModel: "Flux",
    description: "Ultra fast. Great for quick iterations and exploration.",
    displayName: "Flux Schnell",
    expectedTimeSec: 10,
    expertise: ["photo", "cartoon"],
    name: "flux-schnell",
    supportsVideo: false,
  },
  {
    baseModel: "SDXL",
    description: "Artistic and creative styles with vibrant colors.",
    displayName: "Playground V2",
    expectedTimeSec: 20,
    expertise: ["pixar", "3d-game", "cartoon"],
    name: "playground-v2",
    supportsVideo: false,
  },
  {
    baseModel: "SDXL",
    description: "Specialized for anime and illustration styles.",
    displayName: "Pony V6",
    expectedTimeSec: 25,
    expertise: ["anime", "videogame", "physical-art"],
    name: "pony-v6",
    supportsVideo: false,
  },
];

export const generateModelsByBase: GenerateModelsByBase =
  generateModelItems.reduce<GenerateModelsByBase>((accumulator, item) => {
    (accumulator[item.baseModel] ??= []).push(item);
    return accumulator;
  }, {});

export const aspectRatioOptions: GenerateAspectRatioOption[] = [
  {
    description: "Ultra-wide",
    height: 9,
    label: "21:9",
    value: "21/9",
    width: 21,
  },
  {
    description: "Landscape",
    height: 9,
    label: "16:9",
    value: "16/9",
    width: 16,
  },
  { description: "Wide", height: 3, label: "4:3", value: "4/3", width: 4 },
  { description: "Square", height: 1, label: "1:1", value: "1/1", width: 1 },
  { description: "Tall", height: 4, label: "3:4", value: "3/4", width: 3 },
  {
    description: "Portrait",
    height: 16,
    label: "9:16",
    value: "9/16",
    width: 9,
  },
  {
    description: "Ultra-tall",
    height: 21,
    label: "9:21",
    value: "9/21",
    width: 9,
  },
];

export const sampleAttachments = [
  {
    id: "att-1",
    kind: "image" as const,
    name: "moodboard-lantern.jpg",
    previewUrl: scenicDataUri({
      accent: "#f0b970",
      label: "Lantern Moodboard",
      skyBottom: "#e6d5ad",
      skyTop: "#aac9d9",
    }),
    sizeLabel: "1.4 MB",
  },
  {
    id: "att-2",
    kind: "image" as const,
    name: "palette-clouds.png",
    previewUrl: scenicDataUri({
      accent: "#d6d18f",
      label: "Cloud Palette",
      skyBottom: "#dce4c4",
      skyTop: "#9fbed8",
    }),
    sizeLabel: "820 KB",
  },
];

export const sampleJobs = [
  {
    outputs: [
      {
        id: "job-1a",
        imageUrl: scenicDataUri({
          accent: "#f0bb70",
          label: "Breakfast Study A",
          skyBottom: "#ded8c2",
          skyTop: "#c3d9df",
        }),
      },
      {
        id: "job-1b",
        imageUrl: scenicDataUri({
          accent: "#d6a37b",
          label: "Breakfast Study B",
          skyBottom: "#e8d3b7",
          skyTop: "#9fc2d5",
        }),
      },
    ],
    progress: 100,
    prompt:
      "A mountain inn breakfast scene, soft window light, watercolor backgrounds, hand-inked details, gentle steam from tea cups.",
    status: "done" as const,
    subtitle: "Completed 14 minutes ago",
    title: "Breakfast studies",
  },
  {
    progress: 62,
    prompt:
      "A quiet ferry deck at dusk, paper lantern reflections across the water, quiet travelers wrapped in blankets.",
    status: "processing" as const,
    subtitle: "Estimated 18 seconds left",
    title: "Ferry dusk set",
  },
];

export const linkedAccounts = [
  {
    actionLabel: "Manage",
    id: "github",
    meta: "Connected as paper-demos",
    name: "GitHub",
    state: "connected" as const,
  },
  {
    actionLabel: "Connect",
    id: "discord",
    meta: "Use for release notifications",
    name: "Discord",
    state: "disconnected" as const,
  },
];

export const subscriptionOffers = [
  {
    id: "free",
    name: "Free",
    priceLabel: "$0",
    subtitle: "Limited to 100 generations",
  },
  {
    id: "monthly",
    name: "Monthly Studio",
    priceLabel: "$24",
    subtitle: "Billed monthly",
  },
  {
    id: "yearly",
    name: "Yearly Atelier",
    priceLabel: "$240",
    subtitle: "Billed yearly",
  },
];

export const creditLedger = [
  {
    activity: "Subscription · Stripe",
    amountLabel: "+$24.00",
    date: "Apr 20, 2026",
    direction: "credit" as const,
    id: "ledger-1",
  },
  {
    activity: "Generation batch · API",
    amountLabel: "-$1.20",
    date: "Apr 18, 2026",
    direction: "debit" as const,
    id: "ledger-2",
  },
  {
    activity: "Credit top-up · Stripe",
    amountLabel: "+$50.00",
    date: "Apr 12, 2026",
    direction: "credit" as const,
    id: "ledger-3",
  },
  {
    activity: "Variation run · API",
    amountLabel: "-$0.80",
    date: "Apr 10, 2026",
    direction: "debit" as const,
    id: "ledger-4",
  },
];

export const marketingVisual = (
  <div className="aspect-[5/4]">
    <SceneArt label="paper frame" variant="gallery" />
  </div>
);

export const formVisual = (
  <div className="aspect-[4/3]">
    <SceneArt label="form preview" variant="studio" />
  </div>
);

export const navigationVisual = (
  <div className="aspect-[4/3]">
    <SceneArt label="navigation" variant="coast" />
  </div>
);
