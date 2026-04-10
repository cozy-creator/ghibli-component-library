import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {
  AlertCircle,
  Loader2,
  Maximize2,
  Pause,
  Play,
  RefreshCcw,
  Volume2,
  VolumeX
} from "lucide-react";

import { CartoonButton } from "@/components/ui/cartoon-button";
import { cn, focusRingClass } from "@/lib/utils";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

interface CommunityVideoPlayerProps {
  autoPlay?: boolean;
  chrome?: "default" | "minimal";
  className?: string;
  isActive?: boolean;
  loop?: boolean;
  mode?: "card" | "modal";
  onOpen?: () => void;
  poster?: string;
  preload?: "none" | "metadata" | "auto";
  src?: string;
  title: string;
}

const controlButtonClass = cn(
  "inline-flex items-center justify-center border border-white/18 bg-black/42 text-white backdrop-blur-md transition",
  "hover:border-white/35 hover:bg-black/65",
  focusRingClass,
  "focus-visible:ring-offset-black"
);

export function CommunityVideoPlayer({
  autoPlay = false,
  chrome = "default",
  className,
  isActive = true,
  loop = false,
  mode = "card",
  onOpen,
  poster,
  preload = "metadata",
  src,
  title
}: CommunityVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [hasError, setHasError] = useState(!src);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const canSeek = mode === "modal" && duration > 0 && Number.isFinite(duration);
  const canPlayInline = mode !== "card" || isActive;
  const opensViewerFromSurface = mode === "card" && Boolean(onOpen);
  const useMinimalChrome = mode === "card" && chrome === "minimal";
  const showPrimaryOverlayButton =
    !hasError &&
    !isLoading &&
    !isPlaying &&
    !(opensViewerFromSurface && useMinimalChrome);

  const attemptPlay = useCallback(async () => {
    const video = videoRef.current;

    if (!video || !src || !canPlayInline) {
      return false;
    }

    try {
      await video.play();
      setPlaybackBlocked(false);
      return true;
    } catch {
      setPlaybackBlocked(true);
      return false;
    }
  }, [canPlayInline, src]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (!src || hasError || !isActive) {
      video.pause();
      return;
    }

    if (autoPlay) {
      void video.play().catch(() => {
        window.setTimeout(() => {
          setPlaybackBlocked(true);
        }, 0);
      });
    }
  }, [autoPlay, hasError, isActive, src]);

  useEffect(() => {
    const video = videoRef.current;

    return () => {
      video?.pause();
    };
  }, []);

  const togglePlay = async () => {
    const video = videoRef.current;

    if (!video || !src || hasError) {
      return;
    }

    if (!canPlayInline) {
      onOpen?.();
      return;
    }

    if (video.paused) {
      setIsLoading(true);
      await attemptPlay();
      return;
    }

    video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video || hasError) {
      return;
    }

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleRetry = () => {
    const video = videoRef.current;

    if (!video || !src) {
      return;
    }

    setHasError(false);
    setPlaybackBlocked(false);
    setIsLoading(true);
    video.load();

    if (autoPlay && isActive) {
      window.requestAnimationFrame(() => {
        void attemptPlay();
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();

      if (opensViewerFromSurface) {
        onOpen?.();
      } else {
        void togglePlay();
      }

      return;
    }

    if (event.key.toLowerCase() === "m") {
      event.preventDefault();
      toggleMute();
    }
  };

  const mediaStatus = hasError
    ? "Unable to load video"
    : playbackBlocked
      ? "Autoplay paused. Press play."
      : isLoading
        ? "Loading video"
        : opensViewerFromSurface
          ? "Click to open viewer"
          : isActive && autoPlay
            ? "Muted autoplay preview"
            : !canPlayInline
              ? "Open for a larger view"
              : isPlaying
                ? "Playing"
                : "Ready to play";

  const handleSurfaceActivate = async () => {
    if (opensViewerFromSurface) {
      onOpen?.();
      return;
    }

    await togglePlay();
  };

  return (
    <div
      aria-label={`${title} video player`}
      className={cn(
        "group/video relative isolate w-full min-w-0 overflow-hidden bg-black text-white",
        useMinimalChrome
          ? "rounded-none border-none shadow-none"
          : "border border-white/10",
        mode === "modal"
          ? "aspect-video min-h-[20rem] sm:min-h-[24rem] lg:min-h-[32rem]"
          : "aspect-video min-h-[16rem] sm:min-h-[18rem]",
        className
      )}
      onKeyDown={handleKeyDown}
      role="group"
      tabIndex={0}
    >
      {poster ? (
        <img
          alt=""
          aria-hidden
          className="absolute inset-0 size-full scale-110 object-cover opacity-35 blur-2xl"
          src={poster}
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_40%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.68))]" />

      {src ? (
        <video
          autoPlay={autoPlay}
          className={cn(
            "relative z-10 size-full bg-black",
            opensViewerFromSurface && "cursor-pointer",
            mode === "modal" ? "object-contain" : "object-cover"
          )}
          loop={loop}
          muted
          onCanPlay={() => setIsLoading(false)}
          onClick={() => void handleSurfaceActivate()}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
            setIsPlaying(false);
          }}
          onLoadedData={() => setIsLoading(false)}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            setDuration(video.duration);
            setIsLoading(false);
          }}
          onLoadStart={() => setIsLoading(true)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => {
            setIsPlaying(true);
            setIsLoading(false);
            setPlaybackBlocked(false);
          }}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            setCurrentTime(video.currentTime);
            setDuration(video.duration || 0);
          }}
          onWaiting={() => setIsLoading(true)}
          playsInline
          poster={poster}
          preload={preload}
          ref={videoRef}
          src={src}
        />
      ) : null}

      {!useMinimalChrome ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-4">
          <div className="border border-white/14 bg-black/36 px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-white/88 backdrop-blur-md">
            {mediaStatus}
          </div>
          <div className="border border-white/14 bg-black/36 px-3 py-1 text-sm font-medium text-white/88 backdrop-blur-md">
            {duration > 0 ? formatTime(duration) : "Video"}
          </div>
        </div>
      ) : null}

      {!useMinimalChrome && !hasError && onOpen ? (
        <button
          aria-label="Open expanded video viewer"
          className={cn(
            controlButtonClass,
            "absolute top-3 right-3 z-30 size-10 sm:top-4 sm:right-4"
          )}
          onClick={onOpen}
          type="button"
        >
          <Maximize2 className="size-4" />
        </button>
      ) : null}

      {showPrimaryOverlayButton ? (
        <button
          aria-label={
            opensViewerFromSurface
              ? "Open expanded video viewer"
              : canPlayInline
                ? "Play video"
                : "Open expanded video viewer"
          }
          className={cn(
            controlButtonClass,
            "absolute inset-0 z-20 m-auto size-16 sm:size-20"
          )}
          onClick={() => void handleSurfaceActivate()}
          type="button"
        >
          {opensViewerFromSurface ? (
            <Maximize2 className="size-6 sm:size-7" />
          ) : canPlayInline ? (
            <Play className="size-7 fill-current sm:size-8" />
          ) : (
            <Maximize2 className="size-6 sm:size-7" />
          )}
        </button>
      ) : null}

      {isLoading && !hasError ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="border border-white/14 bg-black/46 p-4 text-white backdrop-blur-md">
            <Loader2 className="size-7 animate-spin" />
          </div>
        </div>
      ) : null}

      {hasError ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[linear-gradient(180deg,rgba(13,12,11,0.62),rgba(13,12,11,0.92))] p-5">
          <div className="flex max-w-sm flex-col items-center gap-3 border border-white/12 bg-black/38 px-5 py-6 text-center backdrop-blur-xl">
            <AlertCircle className="size-8 text-white/80" />
            <div className="space-y-1">
              <p className="text-base font-medium text-white">Video unavailable</p>
              <p className="text-sm leading-6 text-white/70">
                The video source could not be loaded. Check the asset URL or try again.
              </p>
            </div>
            <CartoonButton
              aria-label="Retry loading video"
              className="h-10 px-4 text-sm"
              color="var(--success)"
              icon={<RefreshCcw className="size-4" />}
              onClick={handleRetry}
              size="default"
              text="Retry"
            />
          </div>
        </div>
      ) : null}

      {!hasError && !useMinimalChrome ? (
        <div className="absolute inset-x-0 bottom-0 z-20 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.78))] p-3 pt-10 sm:p-4 sm:pt-14">
          {canSeek ? (
            <input
              aria-label="Seek video playback"
              className="mb-3 h-1.5 w-full cursor-pointer accent-white"
              max={duration || 0}
              min={0}
              onChange={(event) => {
                const nextTime = Number(event.currentTarget.value);
                const video = videoRef.current;

                if (!video || !Number.isFinite(nextTime)) {
                  return;
                }

                video.currentTime = nextTime;
                setCurrentTime(nextTime);
              }}
              step={0.1}
              type="range"
              value={Math.min(currentTime, duration || 0)}
            />
          ) : (
            <div className="mb-3 h-1.5 w-full overflow-hidden bg-white/18">
              <div
                className="h-full bg-white/85 transition-[width]"
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`
                }}
              />
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              aria-label={
                opensViewerFromSurface
                  ? "Open expanded video viewer"
                  : canPlayInline
                    ? isPlaying
                      ? "Pause video"
                      : "Play video"
                    : "Open expanded video viewer"
              }
              className={cn(controlButtonClass, "size-10 sm:size-11")}
              onClick={
                opensViewerFromSurface ? onOpen : () => void togglePlay()
              }
              type="button"
            >
              {opensViewerFromSurface ? (
                <Maximize2 className="size-4 sm:size-5" />
              ) : canPlayInline && isPlaying ? (
                <Pause className="size-4 fill-current sm:size-5" />
              ) : canPlayInline ? (
                <Play className="size-4 fill-current sm:size-5" />
              ) : (
                <Maximize2 className="size-4 sm:size-5" />
              )}
            </button>

            <button
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className={cn(controlButtonClass, "size-10 sm:size-11")}
              onClick={toggleMute}
              type="button"
            >
              {isMuted ? (
                <VolumeX className="size-4 sm:size-5" />
              ) : (
                <Volume2 className="size-4 sm:size-5" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{title}</p>
              <p className="text-xs tracking-[0.12em] text-white/68 uppercase">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>

            {onOpen && mode === "card" ? (
              <button
                aria-label="Open expanded video viewer"
                className={cn(controlButtonClass, "size-10 sm:size-11")}
                onClick={onOpen}
                type="button"
              >
                <Maximize2 className="size-4 sm:size-5" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
