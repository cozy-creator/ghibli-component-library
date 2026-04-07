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
          "group/avatar relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-[color:var(--border-strong)] bg-[color:var(--paper-soft)]",
          avatarSizes[size],
          className
        )}
        data-size={size}
        data-slot="avatar"
        {...props}
      >
        {children}
      </div>
    </AvatarContext.Provider>
  );
}

export function AvatarImage({ alt, className, ...props }: React.ComponentProps<"img">) {
  return (
    <img
      alt={alt}
      className={cn("aspect-square size-full object-cover", className)}
      data-slot="avatar-image"
      {...props}
    />
  );
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
  const { size } = React.useContext(AvatarContext);

  return (
    <span
      className={cn(
        "absolute bottom-0 right-0 z-10 inline-flex items-center justify-center bg-[color:var(--primary)] text-[color:var(--primary-foreground)] ring-2 ring-[color:var(--card)] select-none",
        size === "sm"
          ? "size-2.5 [&>svg]:hidden"
          : size === "lg"
            ? "size-4 [&>svg]:size-2.5"
            : "size-3 [&>svg]:size-2",
        className
      )}
      data-slot="avatar-badge"
      {...props}
    />
  );
}

export function AvatarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group/avatar-group flex -space-x-3 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-[color:var(--card)]",
        className
      )}
      data-slot="avatar-group"
      {...props}
    />
  );
}

export function AvatarGroupCount({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center border border-[color:var(--border-strong)] bg-[color:var(--paper)] text-sm text-[color:var(--ink-soft)] ring-2 ring-[color:var(--card)] group-has-data-[size=lg]/avatar-group:size-14 group-has-data-[size=sm]/avatar-group:size-8 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      data-slot="avatar-group-count"
      {...props}
    />
  );
}
