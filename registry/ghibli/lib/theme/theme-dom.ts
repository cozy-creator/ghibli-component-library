import {
  normalizeAvailableThemeId,
  type AvailableThemeId,
} from "./theme-options";

export function applyThemeToDocument(theme: AvailableThemeId): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = normalizeAvailableThemeId(theme);
}
