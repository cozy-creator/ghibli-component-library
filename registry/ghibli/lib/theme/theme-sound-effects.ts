import { DEFAULT_THEME_ID, type ThemeId } from "./theme-types";

export const THEME_SOUND_CATEGORIES = {
  mediaNavigation: "mediaNavigation",
} as const;

export type ThemeSoundCategory =
  (typeof THEME_SOUND_CATEGORIES)[keyof typeof THEME_SOUND_CATEGORIES];

export const SOUND_EFFECT_IDS = {
  pageFlip: "page-flip",
  treeRustle: "tree-rustle",
} as const;

export type SoundEffectId =
  (typeof SOUND_EFFECT_IDS)[keyof typeof SOUND_EFFECT_IDS];

const SOUND_EFFECT_SOURCES = {
  [SOUND_EFFECT_IDS.pageFlip]: "/audio/page-flip.mp3",
  [SOUND_EFFECT_IDS.treeRustle]: "/audio/tree-rustle.mp3",
} as const satisfies Record<SoundEffectId, string>;

type ThemeSoundAssignments = Partial<Record<ThemeSoundCategory, SoundEffectId>>;

const DEFAULT_THEME_SOUND_EFFECTS = {
  [THEME_SOUND_CATEGORIES.mediaNavigation]: SOUND_EFFECT_IDS.pageFlip,
} as const satisfies Record<ThemeSoundCategory, SoundEffectId>;

const THEME_SOUND_EFFECT_OVERRIDES: Partial<
  Record<ThemeId, ThemeSoundAssignments>
> = {
  "ghibli-forest": {
    [THEME_SOUND_CATEGORIES.mediaNavigation]: SOUND_EFFECT_IDS.treeRustle,
  },
};

function resolveThemeSoundAssignments(theme?: ThemeId | null) {
  return THEME_SOUND_EFFECT_OVERRIDES[theme ?? DEFAULT_THEME_ID];
}

export function getThemeSoundEffectId(
  theme: ThemeId | null | undefined,
  category: ThemeSoundCategory,
): SoundEffectId {
  return (
    resolveThemeSoundAssignments(theme)?.[category] ??
    DEFAULT_THEME_SOUND_EFFECTS[category]
  );
}

export function getThemeSoundEffectSrc(
  theme: ThemeId | null | undefined,
  category: ThemeSoundCategory,
): string {
  return SOUND_EFFECT_SOURCES[getThemeSoundEffectId(theme, category)];
}
