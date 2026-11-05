import { THEME_IDS, type ThemeId } from "./theme-types";

export type ThemeOptionId = ThemeId;

export interface ThemeOption {
  available: boolean;
  availabilityLabel?: string;
  id: ThemeId;
  name: string;
  previewAlt: string;
  previewSrc: string;
}

export const THEME_OPTIONS = [
  {
    available: true,
    id: "hand-drawn-paper",
    name: "Hand-drawn Paper",
    previewAlt: "Soft hand-drawn paper effect.",
    previewSrc: "/theme-previews/hand-drawn-paper.png",
  },
  {
    available: true,
    id: "ghibli-forest",
    name: "Ghibli Forest",
    previewAlt: "A lush storybook forest with a sunlit path and rounded trees.",
    previewSrc: "/theme-previews/ghibli-forest.png",
  },
  {
    available: true,
    id: "modern",
    name: "Modern",
    previewAlt:
      "A dark product interface with charcoal surfaces and bright lime accents.",
    previewSrc: "/theme-previews/modern.png",
  },
  {
    available: true,
    id: "sunset",
    name: "Sunset",
    previewAlt: "A warm sunset over layered hills and glowing clouds.",
    previewSrc: "/theme-previews/sunset.png",
  },
  {
    available: true,
    id: "ocean",
    name: "Ocean Breeze",
    previewAlt: "A bright blue shoreline with calm water and drifting clouds.",
    // TODO: Replace with /theme-previews/ocean.png once a dedicated picker preview is added.
    previewSrc: "/themes/ocean/ocean-breeze.png",
  },
] as const satisfies readonly ThemeOption[];

export const AVAILABLE_THEME_IDS = THEME_IDS;

export type AvailableThemeId = (typeof AVAILABLE_THEME_IDS)[number];

export const DEFAULT_AVAILABLE_THEME_ID: AvailableThemeId = "hand-drawn-paper";

export function isAvailableThemeId(value: unknown): value is AvailableThemeId {
  return (
    typeof value === "string" &&
    AVAILABLE_THEME_IDS.includes(value as AvailableThemeId)
  );
}

export function normalizeAvailableThemeId(value: unknown): AvailableThemeId {
  return isAvailableThemeId(value) ? value : DEFAULT_AVAILABLE_THEME_ID;
}

export const DEFAULT_THEME_OPTION_ID = DEFAULT_AVAILABLE_THEME_ID;
