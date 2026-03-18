import * as React from "react";
import { type LucideIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, scenicToneClass, type ScenicTone } from "@/lib/utils";

export interface EmptyStateProps {
  action?: React.ReactNode;
  description: string;
  icon?: LucideIcon;
  tone?: ScenicTone;
  title: string;
}

export function EmptyState({
  action,
  description,
  icon: Icon = Sparkles,
  tone = "cloud",
  title
}: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", scenicToneClass(tone))}>
      <CardHeader className="justify-items-center text-center">
        <div className="inline-flex size-14 items-center justify-center rounded-full border border-current/20 bg-white/45">
          <Icon className="size-6" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action ? (
        <CardContent className="flex justify-center pt-0">{action}</CardContent>
      ) : null}
    </Card>
  );
}

export function EmptyStateAction({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button className={className} {...props}>
      {children}
    </Button>
  );
}
