import * as React from "react";
import { Play, Sparkles, Heart, MessageCircle, Repeat2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
