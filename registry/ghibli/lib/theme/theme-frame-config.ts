import type {
  HandDrawnFrameProps,
  HandDrawnRuleProps,
} from "@/components/ui/hand-drawn-frame";

import {
  normalizeAvailableThemeId,
  type AvailableThemeId,
} from "./theme-options";
import type { ThemeId } from "./theme-types";

type ThemeFrameStyleConfig = Pick<
  HandDrawnFrameProps,
  "crookedness" | "strokeWidth" | "strokeWidthVariation"
>;

type ThemeRuleStyleConfig = Pick<
  HandDrawnRuleProps,
  "crookedness" | "strokeWidth" | "strokeWidthVariation"
>;

export const THEME_FRAME_VARIANTS = {
  accountPanel: "account-panel",
  accountPlanCard: "account-plan-card",
  accountPlanCardSkeleton: "account-plan-card-skeleton",
  accountProfile: "account-profile",
  authProviderButton: "auth-provider-button",
  communityEmbedCard: "community-embed-card",
  communityImageCard: "community-image-card",
  communityTabsActive: "community-tabs-active",
  communityTabsShell: "community-tabs-shell",
  communityVideoCard: "community-video-card",
  dialogPanel: "dialog-panel",
  docsArticle: "docs-article",
  docsCallout: "docs-callout",
  docsSidebar: "docs-sidebar",
  docsTable: "docs-table",
  field: "field",
  generateAttachmentTrigger: "generate-attachment-trigger",
  generateComposer: "generate-composer",
  generateControl: "generate-control",
  generateDialog: "generate-dialog",
  generateEditorPanel: "generate-editor-panel",
  generateEditorSummary: "generate-editor-summary",
  mediaViewerChrome: "media-viewer-chrome",
  mediaViewerDetails: "media-viewer-details",
  mediaViewerError: "media-viewer-error",
  mediaViewerImagePane: "media-viewer-image-pane",
  mediaViewerStage: "media-viewer-stage",
  mediaViewerStatus: "media-viewer-status",
  mediaViewerVideoPane: "media-viewer-video-pane",
  shellBrandMark: "shell-brand-mark",
  shellHeader: "shell-header",
  shellNavActive: "shell-nav-active",
  shellUserChip: "shell-user-chip",
  shellUserMenu: "shell-user-menu",
} as const;

export type ThemeFrameVariant =
  (typeof THEME_FRAME_VARIANTS)[keyof typeof THEME_FRAME_VARIANTS];

export const THEME_RULE_VARIANTS = {
  docsSectionDivider: "docs-section-divider",
  footerDivider: "footer-divider",
} as const;

export type ThemeRuleVariant =
  (typeof THEME_RULE_VARIANTS)[keyof typeof THEME_RULE_VARIANTS];

const DEFAULT_THEME_FRAME_CONFIG = {
  [THEME_FRAME_VARIANTS.accountPanel]: {
    crookedness: 0.35,
    strokeWidth: 1.65,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.accountPlanCard]: {
    crookedness: 3,
    strokeWidth: 1.1,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.accountPlanCardSkeleton]: {
    crookedness: 0.35,
    strokeWidth: 1.1,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.accountProfile]: {
    crookedness: 0.35,
    strokeWidth: 1.65,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.authProviderButton]: {
    crookedness: 0.3,
    strokeWidth: 1.05,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.communityEmbedCard]: {
    crookedness: 0.6,
    strokeWidth: 1.55,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.communityImageCard]: {
    crookedness: 1.5,
    strokeWidth: 1.55,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.communityTabsActive]: {
    crookedness: 0.9,
    strokeWidth: 1.35,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.communityTabsShell]: {
    crookedness: 0.45,
    strokeWidth: 1.5,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.communityVideoCard]: {
    crookedness: 0.8,
    strokeWidth: 1.55,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.dialogPanel]: {
    crookedness: 0.6,
    strokeWidth: 1.45,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.docsArticle]: {
    crookedness: 0.1,
    strokeWidth: 1.45,
    strokeWidthVariation: 2.5,
  },
  [THEME_FRAME_VARIANTS.docsCallout]: {
    crookedness: 0.6,
    strokeWidth: 1.2,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.docsSidebar]: {
    crookedness: 0.6,
    strokeWidth: 1.45,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.docsTable]: {
    crookedness: 0.6,
    strokeWidth: 1.2,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.field]: {
    crookedness: 0.3,
    strokeWidth: 1.25,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.generateAttachmentTrigger]: {
    crookedness: 0.7,
    strokeWidth: 1.85,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.generateComposer]: {
    crookedness: 0.3,
    strokeWidth: 1.25,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.generateControl]: {
    crookedness: 0.3,
    strokeWidth: 1.25,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.generateDialog]: {
    crookedness: 0.6,
    strokeWidth: 1.45,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.generateEditorPanel]: {
    crookedness: 0.9,
    strokeWidth: 2.1,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.generateEditorSummary]: {
    crookedness: 0.3,
    strokeWidth: 1.25,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.mediaViewerChrome]: {
    crookedness: 0.55,
    strokeWidth: 1.05,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.mediaViewerDetails]: {
    crookedness: 0.3,
    strokeWidth: 1.15,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.mediaViewerError]: {
    crookedness: 0.5,
    strokeWidth: 1.1,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.mediaViewerImagePane]: {
    crookedness: 0.9,
    strokeWidth: 1.15,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.mediaViewerStage]: {
    crookedness: 0.32,
    strokeWidth: 1.2,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.mediaViewerStatus]: {
    crookedness: 0.45,
    strokeWidth: 1,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.mediaViewerVideoPane]: {
    crookedness: 0.42,
    strokeWidth: 1.15,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.shellBrandMark]: {
    crookedness: 0.7,
    strokeWidth: 1.85,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.shellHeader]: {
    crookedness: 0.5,
    strokeWidth: 2.1,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.shellNavActive]: {
    crookedness: 0.69,
    strokeWidth: 1.1,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.shellUserChip]: {
    crookedness: 0.45,
    strokeWidth: 1.9,
    strokeWidthVariation: 4,
  },
  [THEME_FRAME_VARIANTS.shellUserMenu]: {
    crookedness: 0.8,
    strokeWidth: 1.6,
    strokeWidthVariation: 4,
  },
} as const satisfies Record<ThemeFrameVariant, ThemeFrameStyleConfig>;

const DEFAULT_THEME_RULE_CONFIG = {
  [THEME_RULE_VARIANTS.docsSectionDivider]: {
    crookedness: 8,
    strokeWidth: 1.3,
    strokeWidthVariation: 5,
  },
  [THEME_RULE_VARIANTS.footerDivider]: {
    crookedness: 9,
    strokeWidth: 1.4,
    strokeWidthVariation: 5,
  },
} as const satisfies Record<ThemeRuleVariant, ThemeRuleStyleConfig>;

const MODERN_FRAME_CONFIG: Pick<
  ThemeFrameStyleConfig,
  "crookedness" | "strokeWidthVariation"
> = {
  crookedness: 0,
  strokeWidthVariation: 0,
};

const MODERN_RULE_CONFIG: Pick<
  ThemeRuleStyleConfig,
  "crookedness" | "strokeWidthVariation"
> = {
  crookedness: 0,
  strokeWidthVariation: 0,
};

const MODERN_THEME_FRAME_CONFIG = {
  [THEME_FRAME_VARIANTS.accountPanel]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 0,
  },
  [THEME_FRAME_VARIANTS.accountPlanCard]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.accountPlanCardSkeleton]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.accountProfile]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 0,
  },
  [THEME_FRAME_VARIANTS.authProviderButton]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.communityEmbedCard]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.communityImageCard]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 0,
  },
  [THEME_FRAME_VARIANTS.communityTabsActive]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 0,
  },
  [THEME_FRAME_VARIANTS.communityTabsShell]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.communityVideoCard]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 0,
  },
  [THEME_FRAME_VARIANTS.dialogPanel]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.docsArticle]: MODERN_FRAME_CONFIG,
  [THEME_FRAME_VARIANTS.docsCallout]: MODERN_FRAME_CONFIG,
  [THEME_FRAME_VARIANTS.docsSidebar]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.docsTable]: MODERN_FRAME_CONFIG,
  [THEME_FRAME_VARIANTS.field]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 0,
  },
  [THEME_FRAME_VARIANTS.generateAttachmentTrigger]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.generateComposer]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.generateControl]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.generateDialog]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.generateEditorPanel]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.generateEditorSummary]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.mediaViewerChrome]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.mediaViewerDetails]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.mediaViewerError]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.mediaViewerImagePane]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 0,
  },
  [THEME_FRAME_VARIANTS.mediaViewerStage]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.mediaViewerStatus]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.mediaViewerVideoPane]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.shellBrandMark]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1.05,
  },
  [THEME_FRAME_VARIANTS.shellHeader]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1.1,
  },
  [THEME_FRAME_VARIANTS.shellNavActive]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 0,
  },
  [THEME_FRAME_VARIANTS.shellUserChip]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
  [THEME_FRAME_VARIANTS.shellUserMenu]: {
    ...MODERN_FRAME_CONFIG,
    strokeWidth: 1,
  },
} as const satisfies Partial<
  Record<ThemeFrameVariant, Partial<ThemeFrameStyleConfig>>
>;

const MODERN_THEME_RULE_CONFIG = {
  [THEME_RULE_VARIANTS.docsSectionDivider]: MODERN_RULE_CONFIG,
  [THEME_RULE_VARIANTS.footerDivider]: MODERN_RULE_CONFIG,
} as const satisfies Partial<
  Record<ThemeRuleVariant, Partial<ThemeRuleStyleConfig>>
>;

const THEME_FRAME_CONFIG_OVERRIDES: Partial<
  Record<
    AvailableThemeId,
    Partial<Record<ThemeFrameVariant, Partial<ThemeFrameStyleConfig>>>
  >
> = {
  "ghibli-forest": {
    [THEME_FRAME_VARIANTS.shellHeader]: {
      crookedness: 0,
      strokeWidth: 1.9,
      strokeWidthVariation: 0,
    },
  },
  modern: MODERN_THEME_FRAME_CONFIG,
  sunset: MODERN_THEME_FRAME_CONFIG,
  ocean: MODERN_THEME_FRAME_CONFIG,
};

const THEME_RULE_CONFIG_OVERRIDES: Partial<
  Record<
    AvailableThemeId,
    Partial<Record<ThemeRuleVariant, Partial<ThemeRuleStyleConfig>>>
  >
> = {
  modern: MODERN_THEME_RULE_CONFIG,
  sunset: MODERN_THEME_RULE_CONFIG,
  ocean: MODERN_THEME_RULE_CONFIG,
};

function resolveAvailableTheme(theme?: ThemeId | null): AvailableThemeId {
  return normalizeAvailableThemeId(theme);
}

export function getThemeFrameStyleConfig(
  theme: ThemeId | null | undefined,
  variant: ThemeFrameVariant,
): ThemeFrameStyleConfig {
  const availableTheme = resolveAvailableTheme(theme);

  return {
    ...DEFAULT_THEME_FRAME_CONFIG[variant],
    ...THEME_FRAME_CONFIG_OVERRIDES[availableTheme]?.[variant],
  };
}

export function getThemeRuleStyleConfig(
  theme: ThemeId | null | undefined,
  variant: ThemeRuleVariant,
): ThemeRuleStyleConfig {
  const availableTheme = resolveAvailableTheme(theme);

  return {
    ...DEFAULT_THEME_RULE_CONFIG[variant],
    ...THEME_RULE_CONFIG_OVERRIDES[availableTheme]?.[variant],
  };
}
