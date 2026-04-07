import * as React from "react";
import { Play, Sparkles, Heart, MessageCircle, Repeat2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
        "mx-auto w-fit max-w-full bg-[color:color-mix(in_oklab,var(--card)_84%,white)] px-1.5 py-1.5 max-[424px]:w-full",
        className
      )}
      strokeColor="var(--border)"
      strokeWidth={1.5}
      variant="steady"
    >
      <TabsList className="gap-1 border-0 bg-transparent p-0 shadow-none max-[424px]:grid max-[424px]:w-full max-[424px]:grid-cols-3 max-[424px]:gap-1">
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;

          return (
            <TabsTrigger
              className="min-w-0 bg-transparent p-0 text-[color:var(--muted-foreground)] shadow-none hover:text-[color:var(--foreground)] data-[state=active]:bg-transparent data-[state=active]:shadow-none max-[424px]:w-full max-[424px]:text-xs"
              disabled={disabled || tab.disabled}
              key={tab.value}
              value={tab.value}
            >
              {isActive ? (
                <HandDrawnFrame
                  className="inline-flex max-w-full bg-[color:color-mix(in_oklab,var(--ring)_22%,white)] px-4 py-2 text-[color:var(--primary)] max-[424px]:px-2"
                  contentClassName="flex min-w-0 items-center justify-center text-center leading-none"
                  strokeColor="var(--border)"
                  strokeWidth={1.35}
                  svgClassName="size-full"
                  variant="pill"
                >
                  <span className="whitespace-nowrap">{tab.label}</span>
                </HandDrawnFrame>
              ) : (
                <span className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 max-[424px]:px-2">
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
  badge,
  imageAlt,
  imageUrl,
  meta,
  onClick,
  summary,
  title
}: CommunityImageCardProps) {
  return (
    <button className="w-full text-left" onClick={onClick} type="button">
      <Card className="overflow-hidden transition-transform hover:-translate-y-1">
        <div className="aspect-[3/4] overflow-hidden border-b border-[color:var(--border)] bg-[color:var(--paper-soft)]">
          <img
            alt={imageAlt ?? title}
            className="size-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            src={imageUrl}
          />
        </div>
        <CardHeader>
          {badge ? <Badge>{badge}</Badge> : null}
          <CardTitle>{title}</CardTitle>
          {summary ? <CardDescription>{summary}</CardDescription> : null}
        </CardHeader>
        {meta ? <CardFooter className="text-xs text-[color:var(--muted-foreground)]">{meta}</CardFooter> : null}
      </Card>
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
    <button className="w-full text-left" onClick={onPlay} type="button">
      <Card className="overflow-hidden transition-transform hover:-translate-y-1">
        <div className="relative aspect-video overflow-hidden border-b border-[color:var(--border)] bg-[color:var(--paper-soft)]">
          <img alt={posterAlt ?? title} className="size-full object-cover" src={posterUrl} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(42,31,23,0.34))]" />
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-xs text-white backdrop-blur-sm">
            <Play className="size-3 fill-current" />
            {duration ?? "Preview"}
          </div>
        </div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        {meta ? <CardFooter className="text-xs text-[color:var(--muted-foreground)]">{meta}</CardFooter> : null}
      </Card>
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
    <Card>
      <CardHeader className="grid grid-cols-[auto_1fr_auto] items-start gap-3">
        <Avatar>
          {avatarUrl ? <AvatarImage alt={author} src={avatarUrl} /> : null}
          <AvatarFallback>{avatarFallback ?? author.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <CardTitle className="text-xl">{author}</CardTitle>
          <p className="text-sm text-[color:var(--muted-foreground)]">@{handle}</p>
        </div>
        <Badge tone="river">x-post</Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
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
      </CardContent>
      <CardFooter className="flex flex-wrap gap-4 text-xs text-[color:var(--muted-foreground)]">
        <Metric icon={MessageCircle}>{metrics?.replies ?? "24"}</Metric>
        <Metric icon={Repeat2}>{metrics?.reposts ?? "48"}</Metric>
        <Metric icon={Heart}>{metrics?.likes ?? "180"}</Metric>
      </CardFooter>
    </Card>
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
      strokeColor="var(--border)"
      strokeWidth={1.55}
      variant="card"
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
