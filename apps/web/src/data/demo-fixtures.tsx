import * as React from "react";
import {
  BookOpen,
  Compass,
  Flower2,
  ImageIcon,
  Leaf,
  MessageSquareText,
  Paintbrush2,
  ShieldCheck,
  Wand2
} from "lucide-react";

import { type FaqItem } from "@ghibli/ui";

import { SceneArt } from "@/apps/web/src/components/docs/scene-art";

function scenicDataUri({
  accent,
  label,
  skyBottom,
  skyTop
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
  { href: "#storybook", label: "Storybook" }
];

export const footerColumns = [
  {
    id: "guides",
    links: [
      { href: "#install", label: "Getting started" },
      { href: "#component-button", label: "Components" },
      { href: "#storybook", label: "Storybook" }
    ],
    title: "Guides"
  },
  {
    id: "library",
    links: [
      { href: "#component-button", label: "Buttons" },
      { href: "#component-generate-prompt-composer", label: "Prompt composer" },
      { href: "#pattern-community-cards", label: "Community cards" }
    ],
    title: "Library"
  },
  {
    id: "tools",
    links: [
      { href: "https://ui.shadcn.com/docs/registry", label: "shadcn registry" },
      { href: "https://storybook.js.org", label: "Storybook" },
      { href: "https://vite.dev", label: "Vite" }
    ],
    title: "Tools"
  }
];

export const socialItems = [
  { href: "https://github.com", icon: <BookOpen className="size-4" />, label: "Docs" },
  { href: "https://storybook.js.org", icon: <Compass className="size-4" />, label: "Storybook" }
];

export const headerBrand = (
  <a className="inline-flex items-center gap-3" href="/">
    <div className="inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--border-strong)] bg-[color:var(--paper)] shadow-[var(--shadow-soft)]">
      <Flower2 className="size-5 text-[color:var(--ink-strong)]" />
    </div>
    <div className="grid gap-0.5">
      <span className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
        Ghibli UI
      </span>
      <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
        Cozy component library
      </span>
    </div>
  </a>
);

export const headerUser = {
  initials: "GUI",
  menuItems: [
    { id: "docs", label: "Open docs" },
    { destructive: true, id: "exit", label: "Close panel" }
  ],
  name: "Library Demo",
  subtitle: "Preview mode"
};

export const featureItems = [
  {
    description: "One paper-and-ink baseline theme with registry-ready primitives and calm defaults.",
    icon: <Leaf className="size-5" />,
    id: "theme",
    title: "Single scenic theme"
  },
  {
    description: "Components, patterns, examples, and guides organized for actual library adoption.",
    icon: <ShieldCheck className="size-5" />,
    id: "docs",
    title: "Docs-first structure"
  },
  {
    description: "Install only the parts you need with `shadcn add`, then customize the copied source.",
    icon: <Paintbrush2 className="size-5" />,
    id: "registry",
    title: "Registry-friendly delivery"
  }
];

export const featureVisualItems = [
  {
    description: "Input, button, overlay, and navigation surfaces share the same soft spacing rhythm.",
    icon: <Wand2 className="size-5" />,
    id: "components",
    title: "Component primitives"
  },
  {
    description: "Grouped patterns give teams larger building blocks without turning the library into a template pack.",
    icon: <ImageIcon className="size-5" />,
    id: "patterns",
    title: "Composable patterns"
  },
  {
    description: "Guides, examples, and Storybook work together so consumers can install with confidence.",
    icon: <MessageSquareText className="size-5" />,
    id: "guidance",
    title: "Practical guidance"
  }
];

export const faqItems: FaqItem[] = [
  {
    answer:
      "Add the `style` item first so the theme variables, base typography, and paper surfaces are available before installing any other item.",
    id: "install-style",
    question: "What should I install first?"
  },
  {
    answer:
      "Use the component pages for quick preview, install, usage, and notes. Use Storybook when you want to inspect multiple states interactively.",
    id: "docs-vs-storybook",
    question: "How should I use the docs app and Storybook together?"
  },
  {
    answer:
      "The registry copies source into your app. You can rename, restyle, or refactor installed files after they land in your project.",
    id: "ownership",
    question: "Do I own the installed source?"
  }
];

export const communityImageItems = [
  {
    description: "Painterly landscape card with room for title, meta, and short supporting copy.",
    id: "forest",
    imageUrl: scenicDataUri({
      accent: "#f3c177",
      label: "Forest Lantern Walk",
      skyBottom: "#d8e4c2",
      skyTop: "#b7d8d8"
    }),
    meta: "Updated 2h ago",
    title: "Forest lantern walk"
  },
  {
    description: "Warm editorial postcard treatment that still reads like a reusable UI card.",
    id: "coast",
    imageUrl: scenicDataUri({
      accent: "#efb57c",
      label: "Harbor Tea Break",
      skyBottom: "#f0dfb7",
      skyTop: "#9ec7db"
    }),
    meta: "Updated yesterday",
    title: "Harbor tea break"
  },
  {
    description: "Nature-heavy visual that works for galleries, changelogs, or editorial lists.",
    id: "mountain",
    imageUrl: scenicDataUri({
      accent: "#d8d299",
      label: "Cloud Pass Lookout",
      skyBottom: "#dfe5c8",
      skyTop: "#aac4dc"
    }),
    meta: "Updated 3 days ago",
    title: "Cloud pass lookout"
  }
];

export const communityVideoItems = [
  {
    description: "Looping motion card with clear runtime labeling.",
    id: "video-1",
    meta: "Preview loop • 12s",
    posterUrl: scenicDataUri({
      accent: "#f0b970",
      label: "Lantern Ferry",
      skyBottom: "#d6c38f",
      skyTop: "#9db6cd"
    }),
    title: "Lantern ferry glide",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  },
  {
    description: "Reference video modal with enough metadata for richer gallery flows.",
    id: "video-2",
    meta: "Preview loop • 8s",
    posterUrl: scenicDataUri({
      accent: "#cf8b74",
      label: "Window Rain Study",
      skyBottom: "#c8bea6",
      skyTop: "#96acc5"
    }),
    title: "Window rain study",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  }
];

export const xPostDemo = {
  author: "Mina Journal",
  body:
    "Reorganized the library around installable primitives, grouped patterns, and a cleaner documentation flow so teams can adopt it without reverse-engineering the repo.",
  handle: "minajournal",
  mediaUrl: scenicDataUri({
    accent: "#e6a772",
    label: "Release Notes",
    skyBottom: "#e8ddc2",
    skyTop: "#b7d2db"
  }),
  metrics: { likes: "1.6k", replies: "84", reposts: "220" },
  note: "Useful for release notes, changelog cards, or editorial-style updates."
};

export const modeOptions = [
  { label: "Image", value: "image" },
  { label: "Variation", value: "variation" },
  { label: "Storyboard", value: "storyboard" }
];

export const modelOptions = [
  { description: "Painterly everyday scenes", label: "Riverlight v3", value: "riverlight-v3" },
  { description: "Sharper linework and posters", label: "Lantern Mix", value: "lantern-mix" },
  { description: "Background-rich travel frames", label: "Cloud Journal", value: "cloud-journal" }
];

export const aspectRatioOptions = [
  { label: "Square", value: "1:1" },
  { label: "Portrait", value: "3:4" },
  { label: "Landscape", value: "16:9" }
];

export const sampleAttachments = [
  { id: "att-1", kind: "image" as const, name: "moodboard-lantern.jpg", sizeLabel: "1.4 MB" },
  { id: "att-2", kind: "image" as const, name: "palette-clouds.png", sizeLabel: "820 KB" }
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
          skyTop: "#c3d9df"
        })
      },
      {
        id: "job-1b",
        imageUrl: scenicDataUri({
          accent: "#d6a37b",
          label: "Breakfast Study B",
          skyBottom: "#e8d3b7",
          skyTop: "#9fc2d5"
        })
      }
    ],
    progress: 100,
    prompt:
      "A mountain inn breakfast scene, soft window light, watercolor backgrounds, hand-inked details, gentle steam from tea cups.",
    status: "done" as const,
    subtitle: "Completed 14 minutes ago",
    title: "Breakfast studies"
  },
  {
    progress: 62,
    prompt:
      "A quiet ferry deck at dusk, paper lantern reflections across the water, quiet travelers wrapped in blankets.",
    status: "processing" as const,
    subtitle: "Estimated 18 seconds left",
    title: "Ferry dusk set"
  }
];

export const linkedAccounts = [
  {
    actionLabel: "Manage",
    id: "github",
    meta: "Connected as paper-demos",
    name: "GitHub",
    state: "connected" as const
  },
  {
    actionLabel: "Connect",
    id: "discord",
    meta: "Use for release notifications",
    name: "Discord",
    state: "disconnected" as const
  }
];

export const subscriptionOffers = [
  {
    description: "For smaller teams building editorial or creative tools.",
    id: "monthly",
    label: "Monthly Studio",
    priceLabel: "$24 / month"
  },
  {
    description: "For product teams that want higher volume examples and reviews.",
    id: "yearly",
    label: "Yearly Atelier",
    priceLabel: "$240 / year"
  }
];

export const creditOffers = [
  { id: "small", label: "Starter credits", priceLabel: "$8" },
  { id: "large", label: "Production credits", priceLabel: "$28" }
];

export const creditLedger = [
  { deltaLabel: "-12", id: "ledger-1", meta: "Today", title: "Generation batch" },
  { deltaLabel: "+100", id: "ledger-2", meta: "2 days ago", title: "Credit top-up" },
  { deltaLabel: "-8", id: "ledger-3", meta: "3 days ago", title: "Variation run" }
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
