import {
  getThemeSoundEffectSrc,
  type ThemeSoundCategory,
} from "./theme-sound-effects";
import { useTheme } from "./use-theme";
import { useUiSound, type UseUiSoundOptions } from "./use-ui-sound";

export function useThemeSoundEffect(
  category: ThemeSoundCategory,
  options?: UseUiSoundOptions,
) {
  const { theme } = useTheme();
  const soundEffectSrc = getThemeSoundEffectSrc(theme, category);

  return useUiSound(soundEffectSrc, options);
}
