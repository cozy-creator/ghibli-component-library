import * as React from "react";

export interface UseUiSoundOptions {
  playbackRate?: number;
  volume?: number;
}

/** Fetches nothing until the first play: most pages never make the sound. */
export function useUiSound(
  src: string,
  { playbackRate = 1, volume = 1 }: UseUiSoundOptions = {},
) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [src],
  );

  return React.useCallback(() => {
    if (typeof Audio === "undefined") return;

    audioRef.current ??= new Audio(src);
    const audio = audioRef.current;

    audio.volume = volume;
    audio.playbackRate = playbackRate;
    audio.currentTime = 0;

    void audio.play().catch(() => {
      // Playback can fail when the browser blocks media for the current gesture.
    });
  }, [playbackRate, src, volume]);
}
