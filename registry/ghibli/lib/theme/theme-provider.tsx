import * as React from "react";

import { ThemeContext } from "./theme-context";
import { applyThemeToDocument } from "./theme-dom";
import {
  DEFAULT_AVAILABLE_THEME_ID,
  normalizeAvailableThemeId,
  type AvailableThemeId,
} from "./theme-options";
import { readStoredTheme, writeStoredTheme } from "./theme-storage";
import type { ThemeId } from "./theme-types";

function resolveInitialTheme(): AvailableThemeId {
  if (typeof document !== "undefined") {
    const themeFromDocument = document.documentElement.dataset.theme;

    if (themeFromDocument) {
      return normalizeAvailableThemeId(themeFromDocument);
    }
  }

  return readStoredTheme() ?? DEFAULT_AVAILABLE_THEME_ID;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<AvailableThemeId>(
    resolveInitialTheme,
  );

  const setTheme = React.useCallback((nextTheme: ThemeId) => {
    setThemeState(normalizeAvailableThemeId(nextTheme));
  }, []);

  React.useEffect(() => {
    applyThemeToDocument(theme);
    writeStoredTheme(theme);
  }, [theme]);

  const value = React.useMemo(
    () => ({ setTheme, theme }),
    [setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
