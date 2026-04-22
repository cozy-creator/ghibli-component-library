import type { ThemeId } from "./theme-types";

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
    availabilityLabel: "Coming soon",
    available: false,
    id: "sunset",
    name: "Sunset",
    previewAlt: "A warm sunset over layered hills and glowing clouds.",
    previewSrc: "/theme-previews/sunset.png",
  },
  {
    availabilityLabel: "Coming soon",
    available: false,
    id: "ocean-breeze",
    name: "Ocean Breeze",
    previewAlt: "A bright blue shoreline with calm water and drifting clouds.",
    previewSrc: "/theme-previews/ocean-breeze.png",
  },
] as const satisfies readonly ThemeOption[];

export const AVAILABLE_THEME_IDS = [
  "hand-drawn-paper",
  "ghibli-forest",
] as const satisfies readonly ThemeId[];

export type AvailableThemeId = (typeof AVAILABLE_THEME_IDS)[number];

export const DEFAULT_AVAILABLE_THEME_ID: AvailableThemeId =
  "hand-drawn-paper";

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
