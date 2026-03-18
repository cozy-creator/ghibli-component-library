import * as React from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export interface CommunityImageModalItem {
  description?: string;
  id: string;
  imageAlt?: string;
  imageUrl: string;
  meta?: string;
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

export function CommunityImageModal({
  currentIndex,
  images,
  onNext,
  onOpenChange,
  onPrev,
  open
}: CommunityImageModalProps) {
  const item = images[currentIndex];

  if (!item) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(96vw,72rem)] p-0 overflow-hidden">
        <div className="grid md:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
          <div className="relative bg-[color:var(--paper-soft)]">
            <img alt={item.imageAlt ?? item.title} className="h-full w-full object-cover" src={item.imageUrl} />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
              <Button disabled={!onPrev} onClick={onPrev} size="sm" variant="secondary">
                <ChevronLeft className="size-4" />
                Prev
              </Button>
              <Button disabled={!onNext} onClick={onNext} size="sm" variant="secondary">
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-4 p-5">
            <DialogHeader>
              <Badge tone="river">Community image</Badge>
              <DialogTitle>{item.title}</DialogTitle>
              {item.description ? <DialogDescription>{item.description}</DialogDescription> : null}
            </DialogHeader>
            {item.meta ? (
              <div className="rounded-[calc(var(--radius)-0.35rem)] border border-[color:var(--border)] bg-[color:var(--paper-soft)] px-3 py-2 text-sm text-[color:var(--muted-foreground)]">
                {item.meta}
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export interface CommunityVideoModalItem {
  description?: string;
  id: string;
  meta?: string;
  posterUrl?: string;
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

export function CommunityVideoModal({
  currentIndex,
  onNext,
  onOpenChange,
  onPrev,
  open,
  videos
}: CommunityVideoModalProps) {
  const item = videos[currentIndex];

  if (!item) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(96vw,72rem)] overflow-hidden p-0">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.82fr)]">
          <div className="bg-[color:rgba(26,24,21,0.92)] p-3">
            <video
              autoPlay
              className="aspect-video w-full rounded-[calc(var(--radius)-0.3rem)] bg-black"
              controls
              poster={item.posterUrl}
              src={item.videoUrl}
            />
          </div>
          <div className="grid gap-4 p-5">
            <DialogHeader>
              <Badge tone="lantern">
                <Play className="size-3 fill-current" />
                Video
              </Badge>
              <DialogTitle>{item.title}</DialogTitle>
              {item.description ? <DialogDescription>{item.description}</DialogDescription> : null}
            </DialogHeader>
            {item.meta ? (
              <div className="rounded-[calc(var(--radius)-0.35rem)] border border-[color:var(--border)] bg-[color:var(--paper-soft)] px-3 py-2 text-sm text-[color:var(--muted-foreground)]">
                {item.meta}
              </div>
            ) : null}
            <div className="mt-auto flex items-center justify-between gap-3">
              <Button disabled={!onPrev} onClick={onPrev} variant="secondary">
                <ChevronLeft className="size-4" />
                Prev
              </Button>
              <Button disabled={!onNext} onClick={onNext} variant="secondary">
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
