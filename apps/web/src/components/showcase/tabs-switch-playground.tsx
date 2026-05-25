import { useEffect, useMemo, useState } from "react";

import {
  Button,
  cn,
  DocsCodeBlock,
  FormField,
  HandDrawnFrame,
  Input,
  Tabs,
  TabsContent,
  TabsSwitch,
} from "@ghibli/ui";

export type TabsSwitchPlaygroundItemState = {
  disabled: boolean;
  label: string;
};

export type TabsSwitchPlaygroundState = {
  activeIndex: number;
  items: TabsSwitchPlaygroundItemState[];
};

type ResolvedTabsSwitchItem = {
  disabled: boolean;
  label: string;
  previewText: string;
  value: string;
};

const previewDescriptions = [
  "Recent activity, shared notes, and highlighted updates.",
  "Featured media, previews, and short-form content.",
  "Community posts, announcements, and external updates.",
];

export const defaultTabsSwitchPlaygroundState: TabsSwitchPlaygroundState = {
  activeIndex: 0,
  items: [
    { disabled: false, label: "Updates" },
    { disabled: false, label: "Media" },
    { disabled: false, label: "Social" },
  ],
};

function slugifyTabLabel(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildResolvedTabs(
  items: TabsSwitchPlaygroundItemState[],
): ResolvedTabsSwitchItem[] {
  const usedValues = new Set<string>();

  return items.map((item, index) => {
    const label = item.label.trim() || `Tab ${index + 1}`;
    const baseValue = slugifyTabLabel(label) || `tab-${index + 1}`;
    let value = baseValue;
    let suffix = 2;

    while (usedValues.has(value)) {
      value = `${baseValue}-${suffix}`;
      suffix += 1;
    }

    usedValues.add(value);

    return {
      disabled: item.disabled,
      label,
      previewText:
        previewDescriptions[index] ?? `${label} content for the current view.`,
      value,
    };
  });
}

function resolveActiveIndex(
  items: ResolvedTabsSwitchItem[],
  activeIndex: number,
) {
  if (
    activeIndex >= 0 &&
    activeIndex < items.length &&
    !items[activeIndex]?.disabled
  ) {
    return activeIndex;
  }

  return items.findIndex((item) => !item.disabled);
}

export function buildTabsSwitchPlaygroundSnippet(
  state: TabsSwitchPlaygroundState,
) {
  const tabs = buildResolvedTabs(state.items);
  const activeIndex = resolveActiveIndex(tabs, state.activeIndex);
  const activeValue =
    tabs[activeIndex]?.value ??
    tabs.find((tab) => !tab.disabled)?.value ??
    "tab-1";
  const tabsLiteral = tabs
    .map((tab) => {
      const fields = [
        `label: ${JSON.stringify(tab.label)}`,
        `value: ${JSON.stringify(tab.value)}`,
      ];

      if (tab.disabled) {
        fields.push("disabled: true");
      }

      return `      { ${fields.join(", ")} },`;
    })
    .join("\n");
  const contentLiteral = tabs
    .map(
      (tab) =>
        `  <TabsContent value=${JSON.stringify(tab.value)}>${tab.label} content</TabsContent>`,
    )
    .join("\n");

  return `import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsSwitch } from "@/components/ui/tabs-switch";

<Tabs defaultValue=${JSON.stringify(activeValue)}>
  <TabsSwitch
    tabs={[
${tabsLiteral}
    ]}
  />
${contentLiteral}
</Tabs>`;
}

function PlaygroundCodeBlock({ children }: { children: string }) {
  return (
    <DocsCodeBlock className="mb-0 max-w-full" codeText={children}>
      {children}
    </DocsCodeBlock>
  );
}

export function TabsSwitchPlayground() {
  const [state, setState] = useState<TabsSwitchPlaygroundState>(
    defaultTabsSwitchPlaygroundState,
  );

  const resolvedTabs = useMemo(
    () => buildResolvedTabs(state.items),
    [state.items],
  );
  const enabledCount = resolvedTabs.filter((tab) => !tab.disabled).length;
  const safeActiveIndex = resolveActiveIndex(resolvedTabs, state.activeIndex);
  const activeTab =
    resolvedTabs[safeActiveIndex] ??
    resolvedTabs.find((tab) => !tab.disabled) ??
    resolvedTabs[0];
  const snippet = useMemo(
    () => buildTabsSwitchPlaygroundSnippet(state),
    [state],
  );

  useEffect(() => {
    if (safeActiveIndex === -1 || safeActiveIndex === state.activeIndex) {
      return;
    }

    setState((current) => ({ ...current, activeIndex: safeActiveIndex }));
  }, [safeActiveIndex, state.activeIndex]);

  const updateLabel = (index: number, label: string) =>
    setState((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, label } : item,
      ),
    }));

  const updateDisabled = (index: number, disabled: boolean) =>
    setState((current) => {
      const nextItems = current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, disabled } : item,
      );
      const nextEnabledCount = nextItems.filter(
        (item) => !item.disabled,
      ).length;

      if (nextEnabledCount === 0) {
        return current;
      }

      return {
        ...current,
        items: nextItems,
      };
    });

  return (
    <div className="grid gap-4" data-testid="tabs-switch-playground">
      <div
        className="min-w-0 border border-[color:var(--border-soft)] bg-[color:rgba(255,255,255,0.35)] p-4"
        data-testid="tabs-switch-playground-preview"
      >
        <div className="grid gap-4">
          <div className="grid gap-1">
            <p className="font-[var(--font-heading)] text-lg text-[color:var(--ink-strong)]">
              Interactive playground
            </p>
            <p className="text-xs leading-6 text-[color:var(--muted-foreground)]">
              Edit the option labels, change the active tab, and preview the
              installable switch live.
            </p>
          </div>

          {activeTab ? (
            <Tabs
              className="grid gap-4"
              onValueChange={(value) => {
                const nextIndex = resolvedTabs.findIndex(
                  (tab) => tab.value === value,
                );

                if (nextIndex !== -1) {
                  setState((current) => ({
                    ...current,
                    activeIndex: nextIndex,
                  }));
                }
              }}
              value={activeTab.value}
            >
              <TabsSwitch
                aria-label="Tabs switch playground preview"
                tabs={resolvedTabs}
              />
              {resolvedTabs.map((tab) => (
                <TabsContent className="mt-0" key={tab.value} value={tab.value}>
                  <HandDrawnFrame
                    contentClassName="px-5 py-5"
                    surfaceClassName="bg-[color:var(--card)]"
                    strokeWidthRange={[1.4, 1.4]}
                    crookedness={0.6}
                  >
                    <p className="font-[var(--font-heading)] text-xl text-[color:var(--ink-strong)]">
                      {tab.label}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {tab.previewText}
                    </p>
                  </HandDrawnFrame>
                </TabsContent>
              ))}
            </Tabs>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        <div className="grid content-start gap-3 border border-[color:var(--border-soft)] bg-[color:rgba(255,255,255,0.35)] p-4">
          <div className="grid gap-1">
            <p className="font-[var(--font-heading)] text-lg text-[color:var(--ink-strong)]">
              Switch controls
            </p>
            <p className="text-xs leading-6 text-[color:var(--muted-foreground)]">
              The generated snippet stays in sync with the list-driven API.
            </p>
          </div>

          <FormField label="Active tab">
            <div
              aria-label="Active tab"
              className="grid gap-1.5"
              role="radiogroup"
              style={{
                gridTemplateColumns: `repeat(${Math.min(resolvedTabs.length, 3)}, minmax(0, 1fr))`,
              }}
            >
              {resolvedTabs.map((tab, index) => {
                const isActive = index === safeActiveIndex;

                return (
                  <button
                    aria-pressed={isActive}
                    className={cn(
                      "border px-2.5 py-2 text-xs leading-none transition-colors",
                      isActive
                        ? "border-[color:var(--border)] bg-[color:var(--paper)] text-[color:var(--ink-strong)]"
                        : "border-[color:var(--border-soft)] bg-[color:var(--paper-soft)] text-[color:var(--muted-foreground)] hover:text-[color:var(--ink-strong)]",
                    )}
                    disabled={tab.disabled}
                    key={tab.value}
                    onClick={() =>
                      setState((current) => ({
                        ...current,
                        activeIndex: index,
                      }))
                    }
                    type="button"
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </FormField>

          {state.items.map((item, index) => {
            const inputId = `tabs-switch-playground-label-${index}`;
            const disableInputId = `tabs-switch-playground-disabled-${index}`;
            const canDisable = !item.disabled && enabledCount > 1;

            return (
              <FormField
                action={
                  <label
                    className={cn(
                      "inline-flex items-center gap-2 text-xs",
                      canDisable || item.disabled
                        ? "cursor-pointer text-[color:var(--ink-strong)]"
                        : "cursor-not-allowed text-[color:var(--muted-foreground)]",
                    )}
                    htmlFor={disableInputId}
                  >
                    <input
                      checked={item.disabled}
                      className="size-4 cursor-pointer accent-[color:var(--ink-strong)]"
                      disabled={!canDisable && !item.disabled}
                      id={disableInputId}
                      onChange={(event) =>
                        updateDisabled(index, event.currentTarget.checked)
                      }
                      type="checkbox"
                    />
                    Disabled
                  </label>
                }
                description={`Value: ${
                  resolvedTabs[index]?.value ?? `tab-${index + 1}`
                }`}
                htmlFor={inputId}
                key={inputId}
                label={`Option ${index + 1} label`}
              >
                <Input
                  id={inputId}
                  onChange={(event) =>
                    updateLabel(index, event.currentTarget.value)
                  }
                  value={item.label}
                />
              </FormField>
            );
          })}

          <p className="text-xs leading-6 text-[color:var(--muted-foreground)]">
            At least one option stays enabled so the preview always has a valid
            active tab.
          </p>

          <Button
            className="mt-1"
            onClick={() => setState(defaultTabsSwitchPlaygroundState)}
            type="button"
            variant="secondary"
          >
            Reset
          </Button>
        </div>

        <div className="min-w-0">
          <PlaygroundCodeBlock>{snippet}</PlaygroundCodeBlock>
        </div>
      </div>
    </div>
  );
}
