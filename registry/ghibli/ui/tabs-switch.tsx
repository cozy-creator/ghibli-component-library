import * as React from "react";

import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface TabsSwitchItem {
  disabled?: boolean;
  label: React.ReactNode;
  value: string;
}

export interface TabsSwitchProps extends Omit<
  React.ComponentProps<typeof TabsList>,
  "children" | "className"
> {
  className?: string;
  disabled?: boolean;
  listClassName?: string;
  tabs: readonly TabsSwitchItem[];
  triggerClassName?: string;
}

export function TabsSwitch({
  className,
  disabled = false,
  listClassName,
  style,
  tabs,
  triggerClassName,
  ...props
}: TabsSwitchProps) {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <HandDrawnFrame
      className={cn(
        "ghibli-tabs-switch-frame mx-auto w-fit max-w-full max-[424px]:w-full",
        className,
      )}
      contentClassName="px-1.5 py-1.5"
      data-slot="tabs-switch"
      surfaceClassName="bg-[color:color-mix(in_oklab,var(--card)_84%,white)]"
      strokeColor="var(--border)"
      strokeWidth={1.5}
      crookedness={0.45}
    >
      <TabsList
        className={cn(
          "ghibli-tabs-switch-list gap-1 border-0 bg-transparent p-0 shadow-none max-[424px]:grid max-[424px]:w-full max-[424px]:gap-1",
          listClassName,
        )}
        data-slot="tabs-switch-list"
        style={{
          ...style,
          gridTemplateColumns: `repeat(${Math.max(tabs.length, 1)}, minmax(0, 1fr))`,
        }}
        {...props}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            className={cn(
              "ghibli-tabs-switch-trigger group/tabs-switch-trigger min-w-0 bg-transparent p-0 text-[color:var(--muted-foreground)] shadow-none transition-colors hover:text-[color:var(--foreground)] data-[state=active]:bg-transparent data-[state=active]:shadow-none max-[424px]:w-full max-[424px]:text-xs",
              triggerClassName,
            )}
            disabled={disabled || tab.disabled}
            key={tab.value}
            value={tab.value}
          >
            <HandDrawnFrame
              className="ghibli-tabs-switch-pill inline-flex max-w-full text-[color:var(--muted-foreground)] transition-[color,transform] duration-200 group-hover/tabs-switch-trigger:text-[color:var(--foreground)] group-data-[state=active]/tabs-switch-trigger:-translate-y-px group-data-[state=active]/tabs-switch-trigger:text-[color:var(--primary)]"
              contentClassName="ghibli-tabs-switch-pill-content flex min-w-0 items-center justify-center px-4 py-2 text-center leading-tight max-[424px]:px-2"
              surfaceClassName="bg-[color:color-mix(in_oklab,var(--ring)_22%,white)] opacity-0 transition-opacity duration-200 group-data-[state=active]/tabs-switch-trigger:opacity-100"
              strokeColor="var(--border)"
              strokeWidth={1.35}
              svgClassName="size-full opacity-0 transition-opacity duration-200 group-data-[state=active]/tabs-switch-trigger:opacity-100"
              crookedness={0.9}
            >
              <span className="ghibli-tabs-switch-text max-w-full whitespace-nowrap">
                {tab.label}
              </span>
            </HandDrawnFrame>
          </TabsTrigger>
        ))}
      </TabsList>
    </HandDrawnFrame>
  );
}
