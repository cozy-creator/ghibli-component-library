import * as React from "react";

import type { AvailableThemeId } from "./theme-options";
import type { ThemeId } from "./theme-types";

export interface ThemeContextValue {
  setTheme: (theme: ThemeId) => void;
  theme: AvailableThemeId;
}

export const ThemeContext = React.createContext<ThemeContextValue | null>(null);
