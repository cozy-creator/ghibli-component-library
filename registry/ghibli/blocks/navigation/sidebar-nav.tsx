import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn, paperSurfaceClass } from "@/lib/utils";

export interface SidebarNavItem {
  active?: boolean;
  badge?: React.ReactNode;
  description?: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  id: string;
  label: string;
  onClick?: () => void;
}

export interface SidebarNavGroup {
  id: string;
  items: SidebarNavItem[];
  label?: string;
}

interface SidebarNavProps {
  className?: string;
  groups: SidebarNavGroup[];
  renderItem?: (item: SidebarNavItem, className: string) => React.ReactNode;
}

export function SidebarNav({ className, groups, renderItem }: SidebarNavProps) {
  return (
    <nav className={cn(paperSurfaceClass, "grid gap-4 p-4", className)}>
      {groups.map((group) => (
        <div className="grid gap-2" key={group.id}>
          {group.label ? (
            <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {group.label}
            </p>
          ) : null}
          <div className="grid gap-1">
            {group.items.map((item) => {
              const itemClassName = cn(
                "flex w-full items-start gap-3 px-3 py-3 text-left text-sm transition-all",
                item.active
                  ? "bg-[color:var(--paper)] text-[color:var(--ink-strong)]"
                  : "text-muted-foreground hover:bg-white/45 hover:text-foreground"
              );

              if (renderItem) {
                return <div key={item.id}>{renderItem(item, itemClassName)}</div>;
              }

              return (
                <Button
                  className={cn(
                    itemClassName,
                    "h-auto justify-start border-0 bg-transparent p-0 shadow-none hover:translate-y-0"
                  )}
                  key={item.id}
                  onClick={item.onClick}
                  type="button"
                  variant="ghost"
                >
                  {item.icon ? <span className="mt-0.5 shrink-0">{item.icon}</span> : null}
                  <span className="grid gap-1">
                    <span className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge}
                    </span>
                    {item.description ? (
                      <span className="text-xs leading-6 text-muted-foreground">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
