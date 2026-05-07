import * as React from "react";

import {
  HandDrawnFrame,
  HandDrawnRule,
  type HandDrawnFrameProps,
  type HandDrawnRuleProps,
} from "@/components/ui/hand-drawn-frame";
import {
  getThemeFrameStyleConfig,
  getThemeRuleStyleConfig,
  type ThemeFrameVariant,
  type ThemeRuleVariant,
} from "@/lib/theme/theme-frame-config";
import { DEFAULT_AVAILABLE_THEME_ID } from "@/lib/theme/theme-options";
import { ThemeContext } from "@/lib/theme/theme-provider";

interface ThemeFrameProps extends HandDrawnFrameProps {
  variant: ThemeFrameVariant;
}

interface ThemeRuleProps extends HandDrawnRuleProps {
  variant: ThemeRuleVariant;
}

export function ThemeFrame({
  variant,
  strokeColor = "var(--border)",
  style,
  ...props
}: ThemeFrameProps) {
  const themeContext = React.useContext(ThemeContext);
  const theme = themeContext?.theme ?? DEFAULT_AVAILABLE_THEME_ID;
  const frameConfig = getThemeFrameStyleConfig(theme, variant);
  const frameStyle = {
    "--theme-frame-stroke-color": strokeColor,
    ...style,
  } as React.CSSProperties;

  return (
    <HandDrawnFrame
      {...frameConfig}
      {...props}
      data-theme-frame-variant={variant}
      strokeColor={strokeColor}
      style={frameStyle}
    />
  );
}

export function ThemeRule({ variant, ...props }: ThemeRuleProps) {
  const themeContext = React.useContext(ThemeContext);
  const theme = themeContext?.theme ?? DEFAULT_AVAILABLE_THEME_ID;
  const ruleConfig = getThemeRuleStyleConfig(theme, variant);

  return <HandDrawnRule {...ruleConfig} {...props} />;
}
