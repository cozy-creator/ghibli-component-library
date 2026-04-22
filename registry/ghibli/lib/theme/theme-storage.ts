import {
  isAvailableThemeId,
  type AvailableThemeId,
} from "./theme-options";

export const THEME_STORAGE_KEY = "ui.theme";

export function readStoredTheme(): AvailableThemeId | null {
  try {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    ) {
      return null;
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return isAvailableThemeId(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

export function writeStoredTheme(theme: AvailableThemeId): void {
  try {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined" ||
      !isAvailableThemeId(theme)
    ) {
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures so theme changes can still apply in memory.
  }
}
