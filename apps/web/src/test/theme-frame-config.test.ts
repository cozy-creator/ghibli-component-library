import {
  THEME_FRAME_VARIANTS,
  THEME_RULE_VARIANTS,
  getThemeFrameStyleConfig,
  getThemeRuleStyleConfig,
} from "@ghibli/ui";

describe("theme frame config", () => {
  it("matches the Cozy-style shell header defaults", () => {
    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.shellHeader,
      ),
    ).toEqual({
      crookednessIntensity: 0.5,
      strokeWidth: 2.1,
      thicknessIntensity: 4,
    });
  });

  it("preserves the forest shell header override", () => {
    expect(
      getThemeFrameStyleConfig(
        "ghibli-forest",
        THEME_FRAME_VARIANTS.shellHeader,
      ),
    ).toEqual({
      crookednessIntensity: 0,
      strokeWidth: 1.9,
      thicknessIntensity: 0,
    });
  });

  it("flattens shell framing for modern-family themes", () => {
    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.shellBrandMark),
    ).toEqual({
      crookednessIntensity: 0,
      strokeWidth: 1.05,
      thicknessIntensity: 0,
    });
  });

  it("keeps divider rules theme-aware through the shared config", () => {
    expect(
      getThemeRuleStyleConfig("sunset", THEME_RULE_VARIANTS.footerDivider),
    ).toEqual({
      crookednessIntensity: 0,
      strokeWidth: 1.4,
      thicknessIntensity: 0,
    });
  });
});
