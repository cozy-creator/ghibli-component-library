// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  THEME_FRAME_VARIANTS,
  THEME_RULE_VARIANTS,
  getThemeFrameStyleConfig,
  getThemeRuleStyleConfig,
} from "@/lib/theme/theme-frame-config";

describe("getThemeFrameStyleConfig", () => {
  it("preserves the existing Paper field frame settings", () => {
    expect(
      getThemeFrameStyleConfig("hand-drawn-paper", THEME_FRAME_VARIANTS.field),
    ).toEqual({
      crookedness: 0.3,
      strokeWidthRange: [0.75, 1.95],
      strokeWidthVariation: 0.54,
    });
  });

  it("preserves the existing Paper brand-mark frame settings", () => {
    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.shellBrandMark,
      ),
    ).toEqual({
      crookedness: 0.7,
      strokeWidthRange: [1.35, 2.55],
      strokeWidthVariation: 0.54,
    });
  });

  it("preserves the existing Paper docs sidebar frame settings", () => {
    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.docsSidebar,
      ),
    ).toEqual({
      crookedness: 0.6,
      strokeWidthRange: [0.95, 2.15],
      strokeWidthVariation: 0.54,
    });
  });

  it("preserves the existing Paper community frame settings", () => {
    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.communityImageCard,
      ),
    ).toEqual({
      crookedness: 1.5,
      strokeWidthRange: [1.05, 2.25],
      strokeWidthVariation: 0.54,
    });

    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.communityTabsShell,
      ),
    ).toEqual({
      crookedness: 0.45,
      strokeWidthRange: [1, 2.2],
      strokeWidthVariation: 0.54,
    });
  });

  it("preserves the existing Paper media viewer frame settings", () => {
    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.mediaViewerStage,
      ),
    ).toEqual({
      crookedness: 0.32,
      strokeWidthRange: [0.7, 1.9],
      strokeWidthVariation: 0.54,
    });

    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.mediaViewerImagePane,
      ),
    ).toEqual({
      crookedness: 0.9,
      strokeWidthRange: [0.65, 1.85],
      strokeWidthVariation: 0.54,
    });

    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.mediaViewerDetails,
      ),
    ).toEqual({
      crookedness: 0.3,
      strokeWidthRange: [0.65, 1.85],
      strokeWidthVariation: 0.54,
    });
  });

  it("preserves the existing Paper generate frame settings", () => {
    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.generateControl,
      ),
    ).toEqual({
      crookedness: 0.3,
      strokeWidthRange: [0.75, 1.95],
      strokeWidthVariation: 0.54,
    });

    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.generateEditorPanel,
      ),
    ).toEqual({
      crookedness: 0.9,
      strokeWidthRange: [1.6, 2.8],
      strokeWidthVariation: 0.54,
    });

    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.generateAttachmentTrigger,
      ),
    ).toEqual({
      crookedness: 0.7,
      strokeWidthRange: [1.35, 2.55],
      strokeWidthVariation: 0.54,
    });
  });

  it("preserves the existing Paper account frame settings", () => {
    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.accountProfile,
      ),
    ).toEqual({
      crookedness: 0.35,
      strokeWidthRange: [1.15, 2.35],
      strokeWidthVariation: 0.54,
    });

    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.accountPanel,
      ),
    ).toEqual({
      crookedness: 0.35,
      strokeWidthRange: [1.15, 2.35],
      strokeWidthVariation: 0.54,
    });

    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.accountPlanCard,
      ),
    ).toEqual({
      crookedness: 3,
      strokeWidthRange: [0.6, 1.8],
      strokeWidthVariation: 0.54,
    });
  });

  it("preserves the existing Paper dialog and auth frame settings", () => {
    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.dialogPanel,
      ),
    ).toEqual({
      crookedness: 0.6,
      strokeWidthRange: [0.95, 2.15],
      strokeWidthVariation: 0.54,
    });

    expect(
      getThemeFrameStyleConfig(
        "hand-drawn-paper",
        THEME_FRAME_VARIANTS.authProviderButton,
      ),
    ).toEqual({
      crookedness: 0.3,
      strokeWidthRange: [0.55, 1.75],
      strokeWidthVariation: 0.54,
    });
  });

  it("preserves the Forest shell header override", () => {
    expect(
      getThemeFrameStyleConfig(
        "ghibli-forest",
        THEME_FRAME_VARIANTS.shellHeader,
      ),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1.9, 1.9],
      strokeWidthVariation: 0,
    });
  });

  it("zeros frame sketchiness for Modern variants", () => {
    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.docsArticle),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0.95, 2.15],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig(
        "modern",
        THEME_FRAME_VARIANTS.communityImageCard,
      ),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0, 0],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig(
        "modern",
        THEME_FRAME_VARIANTS.communityVideoCard,
      ),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0, 0],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig(
        "modern",
        THEME_FRAME_VARIANTS.communityTabsActive,
      ),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0, 0],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.field),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0, 0],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.docsSidebar),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1, 1],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.shellBrandMark),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1.05, 1.05],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.shellUserMenu),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1, 1],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.shellNavActive),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0, 0],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.mediaViewerStage),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1, 1],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig(
        "modern",
        THEME_FRAME_VARIANTS.mediaViewerImagePane,
      ),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0, 0],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig(
        "modern",
        THEME_FRAME_VARIANTS.mediaViewerDetails,
      ),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1, 1],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.generateControl),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1, 1],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.accountProfile),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0, 0],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.accountPanel),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0, 0],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.accountPlanCard),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1, 1],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("modern", THEME_FRAME_VARIANTS.dialogPanel),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1, 1],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig(
        "modern",
        THEME_FRAME_VARIANTS.authProviderButton,
      ),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1, 1],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig(
        "modern",
        THEME_FRAME_VARIANTS.generateEditorPanel,
      ),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1, 1],
      strokeWidthVariation: 0,
    });
  });

  it("uses Modern-like straight frame settings for Sunset variants", () => {
    expect(
      getThemeFrameStyleConfig("sunset", THEME_FRAME_VARIANTS.docsArticle),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0.95, 2.15],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig(
        "sunset",
        THEME_FRAME_VARIANTS.communityImageCard,
      ),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0, 0],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("sunset", THEME_FRAME_VARIANTS.field),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0, 0],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("sunset", THEME_FRAME_VARIANTS.shellHeader),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1.1, 1.1],
      strokeWidthVariation: 0,
    });

    expect(
      getThemeFrameStyleConfig("sunset", THEME_FRAME_VARIANTS.dialogPanel),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [1, 1],
      strokeWidthVariation: 0,
    });
  });

  it("uses Modern/Sunset straight frame settings for Ocean variants", () => {
    const oceanFrameVariants = [
      THEME_FRAME_VARIANTS.field,
      THEME_FRAME_VARIANTS.shellBrandMark,
      THEME_FRAME_VARIANTS.shellHeader,
      THEME_FRAME_VARIANTS.shellUserMenu,
      THEME_FRAME_VARIANTS.dialogPanel,
      THEME_FRAME_VARIANTS.docsArticle,
      THEME_FRAME_VARIANTS.docsSidebar,
      THEME_FRAME_VARIANTS.communityImageCard,
      THEME_FRAME_VARIANTS.communityVideoCard,
      THEME_FRAME_VARIANTS.generateComposer,
      THEME_FRAME_VARIANTS.generateControl,
      THEME_FRAME_VARIANTS.generateEditorPanel,
      THEME_FRAME_VARIANTS.generateEditorSummary,
      THEME_FRAME_VARIANTS.accountProfile,
      THEME_FRAME_VARIANTS.accountPanel,
      THEME_FRAME_VARIANTS.accountPlanCard,
      THEME_FRAME_VARIANTS.accountPlanCardSkeleton,
      THEME_FRAME_VARIANTS.mediaViewerChrome,
      THEME_FRAME_VARIANTS.mediaViewerStage,
      THEME_FRAME_VARIANTS.mediaViewerImagePane,
      THEME_FRAME_VARIANTS.mediaViewerVideoPane,
      THEME_FRAME_VARIANTS.mediaViewerDetails,
      THEME_FRAME_VARIANTS.mediaViewerStatus,
      THEME_FRAME_VARIANTS.mediaViewerError,
    ] as const;

    for (const variant of oceanFrameVariants) {
      const oceanConfig = getThemeFrameStyleConfig("ocean", variant);

      expect(oceanConfig).toEqual(getThemeFrameStyleConfig("modern", variant));
      expect(oceanConfig).toEqual(getThemeFrameStyleConfig("sunset", variant));
      expect(oceanConfig.crookedness).toBe(0);
      expect(oceanConfig.strokeWidthVariation).toBe(0);
    }
  });
});

describe("getThemeRuleStyleConfig", () => {
  it("preserves the existing Paper footer divider settings", () => {
    expect(
      getThemeRuleStyleConfig(
        "hand-drawn-paper",
        THEME_RULE_VARIANTS.footerDivider,
      ),
    ).toEqual({
      crookedness: 4,
      strokeWidthRange: [0.9, 2.1],
      strokeWidthVariation: 0.6,
    });
  });

  it("zeros rule sketchiness for Modern variants", () => {
    expect(
      getThemeRuleStyleConfig("modern", THEME_RULE_VARIANTS.docsSectionDivider),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0.8, 2],
      strokeWidthVariation: 0,
    });
  });

  it("uses Modern-like straight rule settings for Sunset variants", () => {
    expect(
      getThemeRuleStyleConfig("sunset", THEME_RULE_VARIANTS.docsSectionDivider),
    ).toEqual({
      crookedness: 0,
      strokeWidthRange: [0.8, 2],
      strokeWidthVariation: 0,
    });
  });

  it("uses Modern/Sunset straight rule settings for Ocean variants", () => {
    const oceanRuleVariants = [
      THEME_RULE_VARIANTS.docsSectionDivider,
      THEME_RULE_VARIANTS.footerDivider,
    ] as const;

    for (const variant of oceanRuleVariants) {
      const oceanConfig = getThemeRuleStyleConfig("ocean", variant);

      expect(oceanConfig).toEqual(getThemeRuleStyleConfig("modern", variant));
      expect(oceanConfig).toEqual(getThemeRuleStyleConfig("sunset", variant));
      expect(oceanConfig.crookedness).toBe(0);
      expect(oceanConfig.strokeWidthVariation).toBe(0);
    }
  });
});
