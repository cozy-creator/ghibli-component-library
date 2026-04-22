import * as React from "react";

export interface UseUiSoundOptions {
  playbackRate?: number;
  preload?: "auto" | "metadata" | "none";
  volume?: number;
}

export function useUiSound(
  src: string,
  { playbackRate = 1, preload = "auto", volume = 1 }: UseUiSoundOptions = {},
) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (typeof Audio === "undefined") {
      return;
    }

    const audio = new Audio(src);
    audio.preload = preload;
    audio.volume = volume;
    audio.playbackRate = playbackRate;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [playbackRate, preload, src, volume]);

  return React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    void audio.play().catch(() => {
      // Playback can fail when the browser blocks media for the current gesture.
    });
  }, []);
}
