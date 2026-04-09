import * as React from "react";
import { Heart, MessageCircle, Play, Repeat2, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
      shape="surface"
      strokeColor="var(--border)"
      strokeWidth={1.5}
      variant={0.45}
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
                  shape="pill"
                  strokeColor="var(--border)"
                  strokeWidth={1.35}
                  svgClassName="size-full"
                  variant={0.9}
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
  imageAlt?: string;
  imageUrl: string;
  meta?: string;
  onClick?: () => void;
  summary?: string;
  title: string;
}

export function CommunityImageCard({
  imageAlt,
  imageUrl,
  meta,
  onClick,
  summary,
  title
}: CommunityImageCardProps) {
  return (
    <button
      aria-label={`Open ${title}`}
      className="group block w-full text-left"
      onClick={onClick}
      title={summary ?? meta ?? title}
      type="button"
    >
      <HandDrawnFrame
        className="overflow-hidden bg-[linear-gradient(180deg,rgba(249,243,226,0.98),rgba(239,227,193,0.98))] transition-transform duration-300 group-hover:-translate-y-1"
        clipContent
        shape="card"
        strokeColor="var(--border)"
        strokeWidth={1.55}
        variant={0.6}
        variation={1}
      >
        <Card className="gap-0 overflow-hidden border-0 bg-transparent py-0 shadow-none">
          <div className="relative aspect-[4/5] overflow-hidden border-b-2 border-[color:var(--border-soft)] bg-[color:var(--paper-soft)]">
            <img
              alt={imageAlt ?? title}
              className="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
              src={imageUrl}
            />
            {meta ? (
              <span className="absolute left-3 top-3 border border-[color:var(--border-soft)] bg-[color:rgba(255,251,244,0.82)] px-2 py-1 text-[10px] font-medium tracking-[0.08em] text-[color:var(--ink-strong)] uppercase">
                {meta}
              </span>
            ) : null}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_35%,rgba(59,39,15,0.18))]" />
          </div>
          <div className="px-3 py-3 text-center font-[var(--font-heading)] text-[1.1rem] leading-tight text-[color:var(--ink-strong)] sm:px-4 sm:py-3.5">
            {title}
          </div>
        </Card>
      </HandDrawnFrame>
    </button>
  );
}

export interface CommunityVideoCardProps {
  duration?: string;
  meta?: string;
  onPlay?: () => void;
  posterAlt?: string;
  posterUrl: string;
  title: string;
}

export function CommunityVideoCard({
  duration,
  meta,
  onPlay,
  posterAlt,
  posterUrl,
  title
}: CommunityVideoCardProps) {
  return (
    <button
      aria-label={`Play ${title}`}
      className="group block w-full text-left"
      onClick={onPlay}
      title={meta ?? title}
      type="button"
    >
      <HandDrawnFrame
        className="overflow-hidden bg-[linear-gradient(180deg,rgba(249,243,226,0.98),rgba(239,227,193,0.98))] transition-transform duration-300 group-hover:-translate-y-1"
        clipContent
        shape="card"
        strokeColor="var(--border)"
        strokeWidth={1.55}
        variant={0.6}
        variation={1}
      >
        <Card className="gap-0 overflow-hidden border-0 bg-transparent py-0 shadow-none">
          <div className="relative aspect-video overflow-hidden border-b-2 border-[color:var(--border-soft)] bg-[color:var(--paper-soft)]">
            <img alt={posterAlt ?? title} className="size-full object-cover" src={posterUrl} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_40%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.68))]" />
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 border border-white/20 bg-black/42 px-3 py-1 text-xs text-white backdrop-blur-md">
              <Play className="size-3.5 fill-current" />
              {duration ?? "Preview"}
            </span>
          </div>
          <div className="px-4 py-3 text-center font-[var(--font-heading)] text-[1.1rem] leading-tight text-[color:var(--ink-strong)] sm:px-5 sm:py-3.5">
            {title}
          </div>
        </Card>
      </HandDrawnFrame>
    </button>
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
      shape="card"
      strokeColor="var(--border)"
      strokeWidth={1.55}
      variant={0.6}
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
