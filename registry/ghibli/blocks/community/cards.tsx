import * as React from "react";
import { AlertCircle, Heart, Loader2, MessageCircle, Repeat2, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CommunityVideoPlayer } from "@/components/blocks/community/video-player";

export interface CommunityTabsListItem {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface CommunityTabsListProps {
  activeTab: string;
  className?: string;
  disabled?: boolean;
  tabs?: CommunityTabsListItem[];
}

const defaultCommunityTabs = [
  { label: "Live Feed", value: "live-feed" },
  { label: "Video", value: "video" },
  { label: "X Posts", value: "x-posts" }
] satisfies CommunityTabsListItem[];

export function CommunityTabsList({
  activeTab,
  className,
  disabled = false,
  tabs = defaultCommunityTabs
}: CommunityTabsListProps) {
  return (
    <HandDrawnFrame
      className={cn(
        "ghibli-community-tabs-frame mx-auto w-fit max-w-full bg-[color:color-mix(in_oklab,var(--card)_84%,white)] px-1.5 py-1.5 max-[424px]:w-full",
        className
      )}
      deformationIntensity={0.45}
      shape="surface"
      strokeColor="var(--border)"
      strokeWidth={1.5}
    >
      <TabsList className="ghibli-community-tabs-list gap-1 border-0 bg-transparent p-0 shadow-none max-[424px]:grid max-[424px]:w-full max-[424px]:grid-cols-3 max-[424px]:gap-1">
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;

          return (
            <TabsTrigger
              className="ghibli-community-tabs-trigger min-w-0 bg-transparent p-0 text-[color:var(--muted-foreground)] shadow-none hover:text-[color:var(--foreground)] data-[state=active]:bg-transparent data-[state=active]:shadow-none max-[424px]:w-full max-[424px]:text-xs"
              disabled={disabled || tab.disabled}
              key={tab.value}
              value={tab.value}
            >
              {isActive ? (
                <HandDrawnFrame
                  className="ghibli-community-tabs-pill inline-flex max-w-full bg-[color:color-mix(in_oklab,var(--ring)_22%,white)] px-4 py-2 text-[color:var(--primary)] max-[424px]:px-2"
                  contentClassName="ghibli-community-tabs-pill-content flex min-w-0 items-center justify-center text-center leading-none"
                  deformationIntensity={0.9}
                  shape="pill"
                  strokeColor="var(--border)"
                  strokeWidth={1.35}
                  svgClassName="size-full"
                >
                  <span className="ghibli-community-tabs-text whitespace-nowrap">{tab.label}</span>
                </HandDrawnFrame>
              ) : (
                <span className="ghibli-community-tabs-label inline-flex items-center justify-center whitespace-nowrap px-4 py-2 max-[424px]:px-2">
                  {tab.label}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </HandDrawnFrame>
  );
}

export interface CommunityImageCardProps {
  badge?: string;
  fallbackImageUrl?: string;
  imageAlt?: string;
  imageUrl: string;
  meta?: string;
  onClick?: () => void;
  summary?: string;
  title: string;
}

type CommunityImageStatus = "loading" | "ready" | "error";

interface CommunityImageLoadState {
  hasError: boolean;
  readySrc: string | null;
  sourceKey: string;
  useFallback: boolean;
}

function createCommunityImageLoadState(
  sourceKey: string,
  hasPrimarySource: boolean
): CommunityImageLoadState {
  return {
    hasError: !hasPrimarySource,
    readySrc: null,
    sourceKey,
    useFallback: false
  };
}

export function CommunityImageCard({
  fallbackImageUrl,
  imageAlt,
  imageUrl,
  meta,
  onClick,
  summary,
  title
}: CommunityImageCardProps) {
  const primarySrc = imageUrl;
  const fallbackSrc =
    fallbackImageUrl && fallbackImageUrl !== imageUrl ? fallbackImageUrl : null;
  const sourceKey = `${primarySrc ?? ""}|${fallbackSrc ?? ""}`;
  const modelLabel = title;
  const altText = imageAlt ?? title;
  const [loadState, setLoadState] = React.useState<CommunityImageLoadState>(() =>
    createCommunityImageLoadState(sourceKey, Boolean(primarySrc))
  );
  const currentLoadState =
    loadState.sourceKey === sourceKey
      ? loadState
      : createCommunityImageLoadState(sourceKey, Boolean(primarySrc));
  const resolvedImageSrc =
    (currentLoadState.useFallback ? fallbackSrc : primarySrc) ?? null;
  const status: CommunityImageStatus = !resolvedImageSrc
    ? "error"
    : currentLoadState.hasError
      ? "error"
      : currentLoadState.readySrc === resolvedImageSrc
        ? "ready"
        : "loading";

  const handleLoad = () => {
    if (!resolvedImageSrc) {
      return;
    }

    setLoadState((current) => {
      const nextState =
        current.sourceKey === sourceKey
          ? current
          : createCommunityImageLoadState(sourceKey, Boolean(primarySrc));

      return {
        ...nextState,
        hasError: false,
        readySrc: resolvedImageSrc
      };
    });
  };

  const handleError = () => {
    setLoadState((current) => {
      const nextState =
        current.sourceKey === sourceKey
          ? current
          : createCommunityImageLoadState(sourceKey, Boolean(primarySrc));

      if (!nextState.useFallback && fallbackSrc) {
        return {
          ...nextState,
          hasError: false,
          readySrc: null,
          useFallback: true
        };
      }

      return {
        ...nextState,
        hasError: true,
        readySrc: null
      };
    });
  };

  return (
    <article className="max-[402px]:h-full">
      <button
        aria-label={`Open ${modelLabel}`}
        className="group block w-full text-left max-[402px]:h-full"
        onClick={onClick}
        title={summary ?? meta ?? title}
        type="button"
      >
        <HandDrawnFrame
          className="overflow-hidden bg-[linear-gradient(180deg,rgba(249,243,226,0.98),rgba(239,227,193,0.98))] transition-transform duration-300 group-hover:-translate-y-1 max-[402px]:h-full"
          clipContent
          contentClassName="max-[402px]:h-full"
          deformationIntensity={0.6}
          seed={`${modelLabel}-image-card`}
          shape="card"
          strokeColor="var(--border)"
          strokeWidth={1.55}
        >
          <Card className="gap-0 overflow-hidden border-0 bg-transparent py-0 shadow-none max-[402px]:flex max-[402px]:h-full max-[402px]:flex-col">
            <div className="relative aspect-[4/5] overflow-hidden border-b-2 border-[color:var(--surface-highlight-border)] bg-[color:var(--surface-highlight)] max-[402px]:shrink-0">
              {resolvedImageSrc ? (
                <img
                  alt={altText}
                  className="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  decoding="async"
                  key={resolvedImageSrc}
                  loading="lazy"
                  onError={handleError}
                  onLoad={handleLoad}
                  src={resolvedImageSrc}
                  style={{ opacity: status === "ready" ? 1 : 0.12 }}
                />
              ) : null}

              {status === "loading" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(250,244,227,0.44),rgba(230,211,163,0.8))]">
                  <div className="border border-[color:var(--surface-highlight-border)] bg-white/72 p-4 text-[color:var(--ink-strong)] backdrop-blur-sm">
                    <Loader2 className="size-6 animate-spin" />
                  </div>
                </div>
              ) : null}

              {status === "error" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(128,101,56,0.22),rgba(87,61,29,0.58))] p-5 text-center">
                  <div className="flex max-w-[13rem] flex-col items-center gap-2 border border-[#f0e1bb] bg-[rgba(67,47,20,0.38)] px-4 py-5 text-white backdrop-blur-md">
                    <AlertCircle className="size-6" />
                    <p className="text-sm font-medium">Preview unavailable</p>
                    <p className="text-xs leading-5 text-white/80">
                      Open the image to retry the full asset.
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_35%,rgba(59,39,15,0.18))]" />
            </div>
            <div className="px-3 py-3 text-center font-[var(--font-heading)] text-[1.1rem] leading-tight text-[color:var(--ink-strong)] sm:px-4 sm:py-3.5 max-[402px]:flex max-[402px]:min-h-[4.9rem] max-[402px]:flex-1 max-[402px]:items-center max-[402px]:justify-center">
              {modelLabel}
            </div>
          </Card>
        </HandDrawnFrame>
      </button>
    </article>
  );
}

export interface CommunityVideoCardProps {
  isActive?: boolean;
  onClick?: () => void;
  onPlay?: () => void;
  posterAlt?: string;
  posterUrl?: string;
  title: string;
  videoUrl?: string;
}

export function CommunityVideoCard({
  isActive = false,
  onClick,
  onPlay,
  posterAlt,
  posterUrl,
  title,
  videoUrl
}: CommunityVideoCardProps) {
  const handleOpen = onClick ?? onPlay;

  return (
    <article
      className="group"
      onClick={(event) => {
        const target = event.target;

        if (
          !(target instanceof Element) ||
          target.closest("button, input, video")
        ) {
          return;
        }

        handleOpen?.();
      }}
    >
      <HandDrawnFrame
        className="overflow-hidden bg-[linear-gradient(180deg,rgba(249,243,226,0.98),rgba(239,227,193,0.98))] transition-transform duration-300 group-hover:-translate-y-1"
        clipContent
        deformationIntensity={0.6}
        seed={`${title}-video-card`}
        shape="card"
        strokeColor="var(--border)"
        strokeWidth={1.55}
      >
        <Card className="gap-0 overflow-hidden border-0 bg-transparent py-0 shadow-none">
          <div className="border-b-2 border-[color:var(--surface-highlight-border)] bg-[color:var(--surface-highlight)]">
            <CommunityVideoPlayer
              autoPlay={isActive}
              chrome="minimal"
              className="rounded-none border-none shadow-none"
              isActive={isActive}
              loop
              mode="card"
              preload="metadata"
              title={posterAlt ?? title}
              {...(handleOpen ? { onOpen: handleOpen } : {})}
              {...(posterUrl ? { poster: posterUrl } : {})}
              {...(videoUrl ? { src: videoUrl } : {})}
            />
          </div>
          <div className="px-4 py-3 text-center font-[var(--font-heading)] text-[1.1rem] leading-tight text-[color:var(--ink-strong)] sm:px-5 sm:py-3.5">
            {title}
          </div>
        </Card>
      </HandDrawnFrame>
    </article>
  );
}

export interface CommunityXPostCardProps {
  author: string;
  avatarFallback?: string;
  avatarUrl?: string;
  body: string;
  handle: string;
  mediaUrl?: string;
  metrics?: {
    likes?: string;
    replies?: string;
    reposts?: string;
  };
  note?: string;
}

function Metric({
  children,
  icon: Icon
}: {
  children: React.ReactNode;
  icon: typeof Heart;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <Icon className="size-4" />
      {children}
    </span>
  );
}

export function CommunityXPostCard({
  author,
  avatarFallback,
  avatarUrl,
  body,
  handle,
  mediaUrl,
  metrics,
  note
}: CommunityXPostCardProps) {
  return (
    <CommunityEmbedCard
      author={author}
      embed={
        <div className="grid gap-4">
          <p className="text-sm leading-7 text-[color:var(--foreground)]">{body}</p>
          {mediaUrl ? (
            <div className="overflow-hidden rounded-[calc(var(--radius)-0.25rem)] border border-[color:var(--border)]">
              <img alt="" className="aspect-[16/9] w-full object-cover" src={mediaUrl} />
            </div>
          ) : null}
          {note ? (
            <div className="flex items-center gap-2 rounded-[calc(var(--radius)-0.35rem)] bg-[color:var(--paper-soft)] px-3 py-2 text-xs text-[color:var(--muted-foreground)]">
              <Sparkles className="size-4" />
              {note}
            </div>
          ) : null}
        </div>
      }
      footer={
        <div className="flex flex-wrap gap-4 text-xs text-[color:var(--muted-foreground)]">
          <Metric icon={MessageCircle}>{metrics?.replies ?? "24"}</Metric>
          <Metric icon={Repeat2}>{metrics?.reposts ?? "48"}</Metric>
          <Metric icon={Heart}>{metrics?.likes ?? "180"}</Metric>
        </div>
      }
      handle={handle.startsWith("@") ? handle : `@${handle}`}
      title={author}
      {...(avatarFallback ? { avatarFallback } : {})}
      {...(avatarUrl ? { avatarUrl } : {})}
    />
  );
}

export interface CommunityEmbedCardProps {
  author: string;
  avatarFallback?: string;
  avatarUrl?: string;
  embed: React.ReactNode;
  footer?: React.ReactNode;
  handle?: string;
  title?: string;
}

export function CommunityEmbedCard({
  author,
  avatarFallback,
  avatarUrl,
  embed,
  footer,
  handle,
  title
}: CommunityEmbedCardProps) {
  return (
    <HandDrawnFrame
      className="overflow-hidden bg-[color:var(--card)]"
      deformationIntensity={0.6}
      shape="card"
      strokeColor="var(--border)"
      strokeWidth={1.55}
    >
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="grid grid-cols-[auto_1fr_auto] items-start gap-3">
          <Avatar>
            {avatarUrl ? <AvatarImage alt={author} src={avatarUrl} /> : null}
            <AvatarFallback>{avatarFallback ?? author.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <CardTitle className="text-xl">{title ?? author}</CardTitle>
            {handle ? <p className="text-sm text-muted-foreground">{handle}</p> : null}
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">{embed}</CardContent>
        {footer ? (
          <CardFooter className="justify-between gap-3 text-xs text-muted-foreground">
            {footer}
          </CardFooter>
        ) : null}
      </Card>
    </HandDrawnFrame>
  );
}
