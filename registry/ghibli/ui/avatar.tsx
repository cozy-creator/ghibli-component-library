import * as React from "react";

import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "default" | "lg";

const avatarSizes: Record<AvatarSize, string> = {
  default: "size-10",
  lg: "size-14",
  sm: "size-8"
};

interface AvatarContextValue {
  size: AvatarSize;
}

const AvatarContext = React.createContext<AvatarContextValue>({ size: "default" });

export function Avatar({
  children,
  className,
  size = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: AvatarSize }) {
  return (
    <AvatarContext.Provider value={{ size }}>
      <div
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[color:var(--border-strong)] bg-[color:var(--paper-soft)] shadow-[var(--shadow-soft)]",
          avatarSizes[size],
          className
        )}
        data-slot="avatar"
        {...props}
      >
        {children}
      </div>
    </AvatarContext.Provider>
  );
}

export function AvatarImage({ alt, className, ...props }: React.ComponentProps<"img">) {
  return <img alt={alt} className={cn("size-full object-cover", className)} data-slot="avatar-image" {...props} />;
}

export function AvatarFallback({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  const { size } = React.useContext(AvatarContext);
  return (
    <span
      className={cn(
        "inline-flex size-full items-center justify-center bg-[color:var(--paper)] font-semibold text-[color:var(--ink-strong)]",
        size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm",
        className
      )}
      data-slot="avatar-fallback"
      {...props}
    >
      {children}
    </span>
  );
}

export function AvatarBadge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "absolute bottom-0 right-0 inline-flex size-3 rounded-full border border-white bg-[color:var(--primary)]",
        className
      )}
      data-slot="avatar-badge"
      {...props}
    />
  );
}

export function AvatarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex -space-x-3 [&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-[color:var(--background)]", className)} data-slot="avatar-group" {...props} />
  );
}
