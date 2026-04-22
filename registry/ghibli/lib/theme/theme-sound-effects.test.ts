import { describe, expect, it } from "vitest";

import {
  SOUND_EFFECT_IDS,
  THEME_SOUND_CATEGORIES,
  getThemeSoundEffectId,
} from "./theme-sound-effects";

describe("getThemeSoundEffectId", () => {
  it("uses the forest override for media navigation", () => {
    expect(
      getThemeSoundEffectId(
        "ghibli-forest",
        THEME_SOUND_CATEGORIES.mediaNavigation,
      ),
    ).toBe(SOUND_EFFECT_IDS.treeRustle);
  });

  it("falls back to the paper flip sound for themes without an override", () => {
    expect(
      getThemeSoundEffectId(
        "hand-drawn-paper",
        THEME_SOUND_CATEGORIES.mediaNavigation,
      ),
    ).toBe(SOUND_EFFECT_IDS.pageFlip);

    expect(
      getThemeSoundEffectId("sunset", THEME_SOUND_CATEGORIES.mediaNavigation),
    ).toBe(SOUND_EFFECT_IDS.pageFlip);

    expect(
      getThemeSoundEffectId(undefined, THEME_SOUND_CATEGORIES.mediaNavigation),
    ).toBe(SOUND_EFFECT_IDS.pageFlip);
  });
});
