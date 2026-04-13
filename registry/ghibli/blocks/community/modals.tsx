import * as React from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Loader2, Play, RefreshCcw, X } from "lucide-react";

import { CommunityAssetDetailsPanel } from "@/components/blocks/community/asset-details-panel";
import { Button } from "@/components/ui/button";
import { CartoonButton } from "@/components/ui/cartoon-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { cn } from "@/lib/utils";

export interface CommunityImageModalItem {
  authorName?: string;
  createdAtLabel?: string;
  description?: string;
  fileUrl?: string;
  id: string;
  imageAlt?: string;
  imageUrl: string;
  meta?: string;
  negativePromptText?: string;
  promptText?: string;
  title: string;
}

export interface CommunityImageModalProps {
  currentIndex: number;
  images: CommunityImageModalItem[];
  onNext?: () => void;
  onOpenChange: (open: boolean) => void;
  onPrev?: () => void;
  open: boolean;
}

export interface CommunityVideoModalItem {
  authorName?: string;
  createdAtLabel?: string;
  description?: string;
  id: string;
  meta?: string;
  negativePromptText?: string;
  posterUrl?: string;
  promptText?: string;
  title: string;
  videoUrl: string;
}

export interface CommunityVideoModalProps {
  currentIndex: number;
  onNext?: () => void;
  onOpenChange: (open: boolean) => void;
  onPrev?: () => void;
  open: boolean;
  videos: CommunityVideoModalItem[];
}

type CommunityImageStatus = "loading" | "ready" | "error";
type CommunityPlayerStatus = "loading" | "ready" | "error";

const modalFrameStrokeColor =
  "color-mix(in oklab, var(--primary-foreground) 16%, transparent)";
const modalFrameSoftStrokeColor =
  "color-mix(in oklab, var(--primary-foreground) 14%, transparent)";
const modalFrameBrightStrokeColor =
  "color-mix(in oklab, var(--primary-foreground) 22%, transparent)";
const modalFrameRaisedStrokeColor =
  "color-mix(in oklab, var(--primary-foreground) 18%, transparent)";
const modalSurfaceClass =
  "bg-[color:color-mix(in_oklab,var(--foreground)_82%,transparent)]";
const modalSurfaceHoverOverlayClass =
  "hover:bg-[color:color-mix(in_oklab,var(--primary-foreground)_10%,transparent)]";
const modalStatusOverlayClass =
  "bg-[color:color-mix(in_oklab,var(--ink-strong)_28%,transparent)]";
const modalStatusGradientClass =
  "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--secondary-foreground)_28%,transparent),color-mix(in_oklab,var(--foreground)_82%,transparent))]";
const modalCalloutFillClass =
  "bg-[color:color-mix(in_oklab,var(--primary-foreground)_72%,transparent)]";
const modalCalloutTextClass = "text-[color:var(--ink-strong)]";
const modalErrorCardFillClass =
  "bg-[color:color-mix(in_oklab,var(--ink-strong)_20%,transparent)]";
const modalErrorTextClass = "text-[color:var(--primary-foreground)]";
const modalErrorMutedTextClass =
  "text-[color:color-mix(in_oklab,var(--primary-foreground)_78%,transparent)]";
const stageTextureStyle: React.CSSProperties = {
  backgroundBlendMode: "multiply, normal, normal",
  backgroundImage:
    "var(--texture-paper-overlay-image), radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 44%), linear-gradient(180deg, color-mix(in oklab, var(--secondary-foreground) 84%, white 4%), color-mix(in oklab, var(--secondary-foreground) 96%, black 10%))",
  backgroundRepeat: "repeat, no-repeat, no-repeat"
};

function resolveCommunityAuthorLabel(authorName?: string) {
  return authorName?.trim() || "Community creator";
}

function resolveCommunityCreatedAtLabel(createdAtLabel?: string, meta?: string) {
  return createdAtLabel?.trim() || meta?.trim() || "Recently";
}

function resolveCommunityPromptText(promptText?: string, description?: string) {
  return promptText?.trim() || description?.trim() || "Unavailable";
}

function ModalCloseButton({
  className,
  label,
  onClick,
  shape = "banner"
}: {
  className?: string;
  label: string;
  onClick: () => void;
  shape?: "banner" | "organic";
}) {
  return (
    <HandDrawnFrame
      clipContent
      className={className}
      contentClassName={cn(
        shape === "banner"
          ? "[@media(min-width:1024px)]:mt-2 text-[color:var(--primary-foreground)] backdrop-blur-sm"
          : "text-[color:var(--primary-foreground)] backdrop-blur-sm",
        modalSurfaceClass
      )}
      deformationIntensity={0.55}
      shape={shape}
      strokeColor={modalFrameStrokeColor}
      strokeWidth={1.05}
      svgClassName="opacity-95"
    >
      <Button
        aria-label={label}
        className={cn(
          "border-0 bg-transparent text-inherit hover:text-[color:var(--primary-foreground)]",
          modalSurfaceHoverOverlayClass,
          "sm:size-10"
        )}
        onClick={onClick}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <X className="size-4.5" />
      </Button>
    </HandDrawnFrame>
  );
}

function ExpandedImagePane({
  image,
  onClose
}: {
  image: CommunityImageModalItem;
  onClose: () => void;
}) {
  const [status, setStatus] = React.useState<CommunityImageStatus>(
    image.fileUrl ?? image.imageUrl ? "loading" : "error"
  );
  const [reloadToken, setReloadToken] = React.useState(0);
  const imageSource = image.fileUrl ?? image.imageUrl;
  const authorName = resolveCommunityAuthorLabel(image.authorName);
  const createdAtLabel = resolveCommunityCreatedAtLabel(
    image.createdAtLabel,
    image.meta
  );
  const promptText = resolveCommunityPromptText(
    image.promptText,
    image.description
  );
  const negativePromptText = image.negativePromptText?.trim();

  return (
    <HandDrawnFrame
      clipContent
      className="ghibli-community-image-viewer"
      contentClassName="h-full"
      deformationIntensity={0.32}
      shape="surface"
      strokeColor={modalFrameSoftStrokeColor}
      strokeWidth={1.2}
      svgClassName="opacity-95"
    >
      <section className="ghibli-community-viewer-surface size-full" style={stageTextureStyle}>
        <div className="ghibli-community-image-viewer-scroll scrollbar-hidden">
          <div className="ghibli-community-image-viewer-grid">
            <HandDrawnFrame
              clipContent
              className="ghibli-community-image-viewer-stage"
              contentClassName="h-full"
              deformationIntensity={0.9}
              shape="surface"
              strokeColor="transparent"
              strokeWidth={1.15}
              svgClassName="opacity-95"
            >
              <div className="relative h-full">
                <ModalCloseButton
                  className="ghibli-community-image-viewer-close-mobile"
                  label="Close expanded image viewer"
                  onClick={onClose}
                />

                <div className="ghibli-community-image-viewer-media">
                  {imageSource ? (
                    <img
                      alt={image.imageAlt ?? image.title}
                      className="ghibli-community-image-viewer-image"
                      key={`${image.id}-${reloadToken}`}
                      onError={() => setStatus("error")}
                      onLoad={() => setStatus("ready")}
                      src={imageSource}
                    />
                  ) : null}
                </div>

                {status === "loading" ? (
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 z-20 flex items-center justify-center",
                      modalStatusOverlayClass
                    )}
                  >
                    <HandDrawnFrame
                      clipContent
                      contentClassName={cn(
                        "p-4 backdrop-blur-md",
                        modalCalloutFillClass,
                        modalCalloutTextClass
                      )}
                      deformationIntensity={0.45}
                      shape="panel"
                      strokeColor={modalFrameBrightStrokeColor}
                      strokeWidth={1}
                      svgClassName="opacity-90"
                    >
                      <Loader2 className="size-7 animate-spin" />
                    </HandDrawnFrame>
                  </div>
                ) : null}

                {status === "error" ? (
                  <div
                    className={cn(
                      "absolute inset-0 z-20 flex items-center justify-center p-6",
                      modalStatusGradientClass
                    )}
                  >
                    <HandDrawnFrame
                      clipContent
                      className="max-w-md"
                      contentClassName={cn(
                        "flex flex-col items-center gap-3 px-5 py-6 text-center backdrop-blur-xl",
                        modalErrorCardFillClass,
                        modalErrorTextClass
                      )}
                      deformationIntensity={0.5}
                      shape="panel"
                      strokeColor={modalFrameRaisedStrokeColor}
                      strokeWidth={1.1}
                      svgClassName="opacity-90"
                    >
                      <ImageIcon className="size-8" />
                      <p className="text-lg font-medium">Image unavailable</p>
                      <p
                        className={cn(
                          "text-sm leading-6",
                          modalErrorMutedTextClass
                        )}
                      >
                        The image could not be loaded. Try reloading the full-size asset.
                      </p>
                      <CartoonButton
                        color="var(--success)"
                        icon={<RefreshCcw className="size-4" />}
                        onClick={() => {
                          setStatus("loading");
                          setReloadToken((current) => current + 1);
                        }}
                        text="Retry"
                      />
                    </HandDrawnFrame>
                  </div>
                ) : null}
              </div>
            </HandDrawnFrame>

            <CommunityAssetDetailsPanel
              action={
                <ModalCloseButton
                  label="Close expanded image viewer"
                  onClick={onClose}
                />
              }
              actionWrapperClassName="ghibli-community-image-viewer-close-desktop"
              authorName={authorName}
              className="ghibli-community-image-viewer-details"
              contentClassName="ghibli-community-image-viewer-details-content"
              createdAtLabel={createdAtLabel}
              modelLabel={image.title}
              promptText={promptText}
              {...(negativePromptText ? { negativePromptText } : {})}
            />
          </div>
        </div>
      </section>
    </HandDrawnFrame>
  );
}

function ExpandedVideoPane({
  onClose,
  video
}: {
  onClose: () => void;
  video: CommunityVideoModalItem;
}) {
  const [isMuted, setIsMuted] = React.useState(true);
  const [playerStatus, setPlayerStatus] = React.useState<CommunityPlayerStatus>(
    video.videoUrl ? "loading" : "error"
  );
  const [reloadToken, setReloadToken] = React.useState(0);
  const authorName = resolveCommunityAuthorLabel(video.authorName);
  const createdAtLabel = resolveCommunityCreatedAtLabel(
    video.createdAtLabel,
    video.meta
  );
  const promptText = resolveCommunityPromptText(
    video.promptText,
    video.description
  );
  const negativePromptText = video.negativePromptText?.trim();

  return (
    <HandDrawnFrame
      clipContent
      className="ghibli-community-video-viewer"
      contentClassName="h-full"
      deformationIntensity={0.32}
      shape="surface"
      strokeColor={modalFrameSoftStrokeColor}
      strokeWidth={1.2}
      svgClassName="opacity-95"
    >
      <section className="ghibli-community-viewer-surface size-full" style={stageTextureStyle}>
        <ModalCloseButton
          className="ghibli-community-video-viewer-close"
          label="Close expanded video viewer"
          onClick={onClose}
          shape="organic"
        />

        <div className="ghibli-community-video-viewer-scroll scrollbar-hidden">
          <div className="ghibli-community-video-viewer-inner">
            <HandDrawnFrame
              clipContent
              className="ghibli-community-video-viewer-stage"
              contentClassName="bg-black"
              deformationIntensity={0.42}
              shape="surface"
              strokeColor={modalFrameStrokeColor}
              strokeWidth={1.15}
              svgClassName="opacity-95"
            >
              {video.videoUrl ? (
                <video
                  autoPlay
                  className="block h-auto w-full max-w-none bg-black"
                  controls
                  key={`${video.id}-${reloadToken}`}
                  muted={isMuted}
                  onCanPlay={() => setPlayerStatus("ready")}
                  onError={() => setPlayerStatus("error")}
                  onLoadedData={() => setPlayerStatus("ready")}
                  onLoadStart={() => setPlayerStatus("loading")}
                  onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
                  onWaiting={() =>
                    setPlayerStatus((current) =>
                      current === "error" ? current : "loading"
                    )
                  }
                  playsInline
                  poster={video.posterUrl}
                  preload="auto"
                  src={video.videoUrl}
                />
              ) : null}
            </HandDrawnFrame>

            <CommunityAssetDetailsPanel
              authorName={authorName}
              createdAtLabel={createdAtLabel}
              modelLabel={video.title}
              promptText={promptText}
              {...(negativePromptText ? { negativePromptText } : {})}
            />
          </div>
        </div>

        {playerStatus === "loading" ? (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-20 flex items-center justify-center",
              modalStatusOverlayClass
            )}
          >
            <HandDrawnFrame
              clipContent
              contentClassName={cn(
                "p-4 backdrop-blur-md",
                modalCalloutFillClass,
                modalCalloutTextClass
              )}
              deformationIntensity={0.45}
              shape="panel"
              strokeColor={modalFrameBrightStrokeColor}
              strokeWidth={1}
              svgClassName="opacity-90"
            >
              <Loader2 className="size-7 animate-spin" />
            </HandDrawnFrame>
          </div>
        ) : null}

        {playerStatus === "error" ? (
          <div
            className={cn(
              "absolute inset-0 z-20 flex items-center justify-center p-6",
              modalStatusGradientClass
            )}
          >
            <HandDrawnFrame
              clipContent
              className="max-w-md"
              contentClassName={cn(
                "flex flex-col items-center gap-3 px-5 py-6 text-center backdrop-blur-xl",
                modalErrorCardFillClass,
                modalErrorTextClass
              )}
              deformationIntensity={0.5}
              shape="panel"
              strokeColor={modalFrameRaisedStrokeColor}
              strokeWidth={1.1}
              svgClassName="opacity-90"
            >
              <Play className="size-8 fill-current" />
              <p className="text-lg font-medium">Video unavailable</p>
              <p
                className={cn(
                  "text-sm leading-6",
                  modalErrorMutedTextClass
                )}
              >
                The player could not load this video. Try reloading the asset.
              </p>
              <CartoonButton
                color="var(--success)"
                icon={<RefreshCcw className="size-4" />}
                onClick={() => {
                  setPlayerStatus("loading");
                  setReloadToken((current) => current + 1);
                }}
                text="Retry"
              />
            </HandDrawnFrame>
          </div>
        ) : null}
      </section>
    </HandDrawnFrame>
  );
}

export function CommunityImageModal({
  currentIndex,
  images,
  onNext,
  onOpenChange,
  onPrev,
  open
}: CommunityImageModalProps) {
  const image = images[currentIndex];
  const title = image?.title ?? "Community image";

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }

      if (event.key === "ArrowLeft" && currentIndex > 0) {
        onPrev?.();
      }

      if (event.key === "ArrowRight" && currentIndex < images.length - 1) {
        onNext?.();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, images.length, onNext, onOpenChange, onPrev, open]);

  if (!image) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="ghibli-community-modal-content"
        overlayClassName="ghibli-community-modal-overlay"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Community image full-size preview.</DialogDescription>
        </DialogHeader>

        <div className="ghibli-community-modal-shell">
          <Button
            aria-label="Show previous image"
            className="ghibli-community-modal-nav ghibli-community-modal-nav--prev"
            disabled={currentIndex <= 0}
            onClick={onPrev}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronLeft className="size-5" />
          </Button>

          <ExpandedImagePane
            image={image}
            key={`${image.id}:${image.fileUrl ?? image.imageUrl}`}
            onClose={() => onOpenChange(false)}
          />

          <Button
            aria-label="Show next image"
            className="ghibli-community-modal-nav ghibli-community-modal-nav--next"
            disabled={currentIndex >= images.length - 1}
            onClick={onNext}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CommunityVideoModal({
  currentIndex,
  onNext,
  onOpenChange,
  onPrev,
  open,
  videos
}: CommunityVideoModalProps) {
  const video = videos[currentIndex];
  const title = video?.title ?? "Community video";

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }

      if (event.key === "ArrowLeft" && currentIndex > 0) {
        onPrev?.();
      }

      if (event.key === "ArrowRight" && currentIndex < videos.length - 1) {
        onNext?.();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, onNext, onOpenChange, onPrev, open, videos.length]);

  if (!video) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="ghibli-community-modal-content"
        overlayClassName="ghibli-community-modal-overlay"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Community video full-size preview.</DialogDescription>
        </DialogHeader>

        <div className="ghibli-community-modal-shell">
          <Button
            aria-label="Show previous video"
            className="ghibli-community-modal-nav ghibli-community-modal-nav--prev"
            disabled={currentIndex <= 0}
            onClick={onPrev}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronLeft className="size-5" />
          </Button>

          <ExpandedVideoPane
            key={`${video.id}:${video.videoUrl}`}
            onClose={() => onOpenChange(false)}
            video={video}
          />

          <Button
            aria-label="Show next video"
            className="ghibli-community-modal-nav ghibli-community-modal-nav--next"
            disabled={currentIndex >= videos.length - 1}
            onClick={onNext}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
