export const THEME_IDS = [
  "hand-drawn-paper",
  "ghibli-forest",
  "modern",
  "sunset",
  "ocean",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export const DEFAULT_THEME_ID: ThemeId = "hand-drawn-paper";

export function isThemeId(value: unknown): value is ThemeId {
  return (
    typeof value === "string" &&
    THEME_IDS.includes(value as ThemeId)
  );
}
