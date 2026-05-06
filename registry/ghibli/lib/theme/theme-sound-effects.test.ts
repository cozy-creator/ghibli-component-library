// @vitest-environment node

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

  it("uses the modern override for media navigation", () => {
    expect(
      getThemeSoundEffectId("modern", THEME_SOUND_CATEGORIES.mediaNavigation),
    ).toBe(SOUND_EFFECT_IDS.modern);
  });

  it("uses the ocean override for media navigation", () => {
    expect(
      getThemeSoundEffectId("ocean", THEME_SOUND_CATEGORIES.mediaNavigation),
    ).toBe(SOUND_EFFECT_IDS.oceanBubble);
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

  it("does not affect other themes when ocean override is set", () => {
    expect(
      getThemeSoundEffectId(
        "ghibli-forest",
        THEME_SOUND_CATEGORIES.mediaNavigation,
      ),
    ).toBe(SOUND_EFFECT_IDS.treeRustle);

    expect(
      getThemeSoundEffectId("modern", THEME_SOUND_CATEGORIES.mediaNavigation),
    ).toBe(SOUND_EFFECT_IDS.modern);

    expect(
      getThemeSoundEffectId("sunset", THEME_SOUND_CATEGORIES.mediaNavigation),
    ).toBe(SOUND_EFFECT_IDS.pageFlip);
  });
});
