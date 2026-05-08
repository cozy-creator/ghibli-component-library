import * as React from "react";
import { ChevronDown, Sparkles, Wand2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartoonButton } from "@/components/ui/cartoon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { ThemeFrame } from "@/components/ui/theme-frame";
import { cn, type SelectOption } from "@/lib/utils";
import { THEME_FRAME_VARIANTS } from "@/lib/theme/theme-frame-config";

const EXPERTISE_COLORS: Record<string, string> = {
  "3d-game": "#FF4500",
  anime: "#FFC0CB",
  cartoon: "#FFD700",
  "classical-art": "#8B4513",
  "hyper-real": "#6A5ACD",
  "physical-art": "#2F4F4F",
  photo: "#3EB489",
  pixar: "#00BFFF",
  videogame: "#FF1493"
};

export interface GenerateAttachment {
  id: string;
  kind?: "file" | "image" | "video";
  name: string;
  previewUrl?: string;
  sizeLabel?: string;
}

export interface GenerateModelItem {
  baseModel: string;
  description: string;
  displayName: string;
  expectedTimeSec: number;
  expertise: string[];
  name: string;
  supportsVideo?: boolean;
}

export type GenerateModelsByBase = Record<string, GenerateModelItem[]>;

export interface GenerateAspectRatioOption extends SelectOption {
  description?: string;
  height?: number;
  width?: number;
}

export interface GenerateModeToggleProps {
  onValueChange?: ((value: string) => void) | undefined;
  options: SelectOption[];
  value: string;
}

export function GenerateModeToggle({
  onValueChange,
  options,
  value
}: GenerateModeToggleProps) {
  const optionCount = Math.max(options.length, 1);
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );

  return (
    <HandDrawnFrame
      className="inline-block w-full sm:w-auto"
      surfaceClassName="bg-[color:var(--paper-soft)]"
      strokeColor="var(--border)"
      strokeWidth={1.25}
      svgClassName="opacity-85"
      crookednessIntensity={0.3}
    >
      <div
        aria-label="Generation mode"
        className="relative inline-grid h-11 w-full overflow-hidden p-1"
        role="radiogroup"
        style={{ gridTemplateColumns: `repeat(${optionCount}, minmax(0, 1fr))` }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-1 left-1 border border-[color:var(--primary-edge)] bg-[color:var(--primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: `translateX(calc(${activeIndex} * 100%))`,
            width: `calc((100% - 0.5rem) / ${optionCount})`
          }}
        />
        {options.map((option) => (
          <button
            aria-checked={option.value === value}
            className={cn(
              "relative z-10 inline-flex h-full items-center justify-center px-4 text-sm font-medium transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-inset",
              option.value === value
                ? "text-[color:var(--primary-foreground)]"
                : "text-[color:var(--foreground)] hover:text-[color:var(--ink-strong)]",
              option.disabled && "pointer-events-none opacity-50"
            )}
            key={option.value}
            onClick={() => onValueChange?.(option.value)}
            role="radio"
            type="button"
          >
            <span className="truncate">{option.label}</span>
          </button>
        ))}
      </div>
    </HandDrawnFrame>
  );
}

type ResolvedGenerateAspectRatioOption = GenerateAspectRatioOption & {
  height: number;
  width: number;
};

function parseAspectRatioDimensions(value: string | undefined) {
  if (!value) {
    return null;
  }

  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);

  if (!match) {
    return null;
  }

  const width = Number(match[1]);
  const height = Number(match[2]);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }

  return { height, width };
}

function resolveAspectRatioOption(
  option: GenerateAspectRatioOption
): ResolvedGenerateAspectRatioOption {
  const width = option.width;
  const height = option.height;
  const hasExplicitDimensions =
    typeof width === "number" &&
    typeof height === "number" &&
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    width > 0 &&
    height > 0;
  const parsedDimensions =
    parseAspectRatioDimensions(option.value) ?? parseAspectRatioDimensions(option.label);

  return {
    ...option,
    height: hasExplicitDimensions ? height : (parsedDimensions?.height ?? 1),
    width: hasExplicitDimensions ? width : (parsedDimensions?.width ?? 1)
  };
}

function GenerateAspectMenuSelect({
  icon,
  label,
  onValueChange,
  options,
  value
}: {
  icon?: React.ReactNode;
  label: string;
  onValueChange?: ((value: string) => void) | undefined;
  options: readonly GenerateAspectRatioOption[];
  value: string;
}) {
  const aspectValueId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [aspectRulerValue, setAspectRulerValue] = React.useState<string | null>(null);
  const resolvedOptions = React.useMemo(
    () => options.map(resolveAspectRatioOption),
    [options]
  );
  const selectedOption = resolvedOptions.find((option) => option.value === value);
  const fallbackOption =
    resolvedOptions.find((option) => option.value === "1/1") ?? resolvedOptions[0];
  const activeOption = selectedOption ?? fallbackOption;
  const effectiveValue = activeOption?.value ?? value;
  const displayedAspectValue = aspectRulerValue ?? effectiveValue;
  const selectedAspectIndex = Math.max(
    0,
    resolvedOptions.findIndex((option) => option.value === displayedAspectValue)
  );
  const selectedAspectOption = resolvedOptions[selectedAspectIndex];
  const aspectOptionCount = resolvedOptions.length;
  const safeAspectOptionCount = Math.max(aspectOptionCount, 1);
  const aspectSliderEdgeInset = `calc(100% / ${safeAspectOptionCount * 2})`;
  const getAspectPositionPercent = (index: number) =>
    index <= 0 || aspectOptionCount <= 1 ? 0 : (index / (aspectOptionCount - 1)) * 100;
  const selectedAspectPercent = getAspectPositionPercent(selectedAspectIndex);
  const selectedAspectValueText = selectedAspectOption
    ? [selectedAspectOption.label, selectedAspectOption.description].filter(Boolean).join(" ")
    : displayedAspectValue;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    setAspectRulerValue(nextOpen ? effectiveValue : null);
  };

  const handleAspectRulerSelect = (nextValue: string) => {
    setAspectRulerValue(nextValue);
    onValueChange?.(nextValue);
  };

  const handleAspectSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextIndex = Number(event.currentTarget.value);
    const nextOption = resolvedOptions[nextIndex];

    if (!nextOption || nextOption.disabled) {
      return;
    }

    handleAspectRulerSelect(nextOption.value);
  };

  const handleAspectSliderKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange} open={open}>
      <ThemeFrame
        className="w-full sm:w-auto"
        surfaceClassName="bg-[color:var(--theme-generate-control-strong-background)]"
        strokeColor="var(--theme-generate-control-border)"
        svgClassName="opacity-85"
        variant={THEME_FRAME_VARIANTS.generateControl}
      >
        <DropdownMenuTrigger asChild>
          <Button
            className="w-full bg-transparent text-[color:var(--theme-generate-control-foreground)] hover:bg-[color:var(--theme-generate-control-hover-background)] sm:w-auto"
            variant="ghost"
          >
            {icon}
            <span>{activeOption?.label ?? label}</span>
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
      </ThemeFrame>
      <DropdownMenuContent className="w-[min(28.5rem,calc(100vw-1.5rem))] min-w-0 overflow-visible rounded-[var(--theme-radius-md)] border-[color:var(--theme-generate-menu-border)] bg-[color:var(--theme-generate-menu-background)] p-0 text-[color:var(--theme-generate-menu-foreground)] ring-0">
        <div className="grid gap-3 bg-[color:var(--theme-generate-ruler-background)] px-3 pt-4 pb-3">
          <div className="mx-auto flex w-[97.5%] items-center justify-between gap-3">
            <p className="min-w-0 text-sm font-medium tracking-[0.04em] text-[color:var(--theme-generate-ruler-foreground)]">
              {label}
            </p>

            <Button
              aria-label={`Close ${label.toLowerCase()} options`}
              className="h-8 w-8 shrink-0 p-0 text-[color:var(--theme-generate-ruler-foreground)] hover:bg-[color:var(--theme-generate-control-hover-background)] hover:text-[color:var(--foreground)]"
              onClick={() => handleOpenChange(false)}
              size="sm"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="mx-auto w-[97.5%]">
            <div className="flex h-[7.25rem] min-w-0 flex-col items-center justify-start px-1 py-1.5 text-center text-[color:var(--theme-generate-ruler-foreground)]">
              {selectedAspectOption ? (
                <>
                  <span className="relative z-10 mb-2 flex h-8 w-full min-w-0 items-center justify-center overflow-visible">
                    <span
                      className="flex flex-col items-center gap-0.5 whitespace-nowrap text-center text-xs leading-tight text-[color:var(--generate-aspect-selected-label)] max-[424px]:text-[11px]"
                      id={aspectValueId}
                    >
                      <span>{selectedAspectOption.label}</span>
                      {selectedAspectOption.description ? (
                        <span>({selectedAspectOption.description})</span>
                      ) : null}
                    </span>
                  </span>
                  <span className="flex h-16 w-full items-center justify-center max-[424px]:h-14">
                    <span
                      aria-hidden="true"
                      className="rounded-[var(--theme-radius-sm)] border border-[color:var(--generate-aspect-preview-active-border)] bg-[color:var(--generate-aspect-preview-active-background)] transition-colors"
                      style={{
                        aspectRatio: `${selectedAspectOption.width} / ${selectedAspectOption.height}`,
                        height:
                          selectedAspectOption.height > selectedAspectOption.width
                            ? "3.5rem"
                            : "auto",
                        maxHeight: "3.5rem",
                        maxWidth: "min(3.75rem, 100%)",
                        width:
                          selectedAspectOption.width >= selectedAspectOption.height
                            ? "min(3.75rem, 100%)"
                            : "auto"
                      }}
                    />
                  </span>
                </>
              ) : null}
            </div>

            <div
              className="relative mt-1 px-[var(--generate-aspect-slider-edge-inset)]"
              style={
                {
                  "--generate-aspect-slider-edge-inset": aspectSliderEdgeInset
                } as React.CSSProperties
              }
            >
              <div className="relative h-8">
                <input
                  aria-describedby={selectedAspectOption ? aspectValueId : undefined}
                  aria-label={label}
                  aria-valuetext={selectedAspectValueText}
                  className="generate-aspect-slider absolute inset-0 z-30 h-full w-full cursor-pointer opacity-0"
                  disabled={aspectOptionCount === 0}
                  max={Math.max(aspectOptionCount - 1, 0)}
                  min={0}
                  onChange={handleAspectSliderChange}
                  onKeyDown={handleAspectSliderKeyDown}
                  step={1}
                  type="range"
                  value={selectedAspectIndex}
                />
                <div
                  aria-hidden="true"
                  className="generate-aspect-slider-track pointer-events-none absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[color:var(--generate-aspect-slider-track)]"
                />
                {resolvedOptions.map((option, index) => {
                  const isSelected = option.value === displayedAspectValue;
                  const optionPercent = getAspectPositionPercent(index);

                  return (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute top-1/2 z-10 block rounded-full bg-[color:var(--generate-aspect-slider-dot)] transition-all",
                        isSelected ? "size-3 bg-[color:var(--generate-aspect-slider-dot-active)]" : "size-2"
                      )}
                      key={option.value}
                      style={{
                        left: `${optionPercent}%`,
                        transform: "translate(-50%, -50%)"
                      }}
                    />
                  );
                })}
                <span
                  aria-hidden="true"
                  className="generate-aspect-slider-thumb pointer-events-none absolute top-1/2 z-20 h-5 w-5 rounded-full"
                  style={{
                    left: `${selectedAspectPercent}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface GenerateModelSelectProps {
  model: string;
  modelsByBase: GenerateModelsByBase;
  onChange?: ((modelName: GenerateModelItem["name"]) => void) | undefined;
  selectedModel?: GenerateModelItem | undefined;
}

export function GenerateModelSelect({
  model,
  modelsByBase,
  onChange,
  selectedModel
}: GenerateModelSelectProps) {
  return (
    <DropdownMenu>
      <HandDrawnFrame
        className="w-full sm:w-56"
        surfaceClassName="bg-[color:var(--paper-soft)]"
        strokeColor="var(--border)"
        strokeWidth={1.25}
        svgClassName="opacity-85"
        crookednessIntensity={0.3}
      >
        <DropdownMenuTrigger asChild>
          <button className="flex h-11 w-full items-center gap-1.5 overflow-hidden bg-transparent px-3 text-sm transition-colors hover:bg-white/40">
            <span className="shrink-0 font-medium">{selectedModel?.displayName ?? "Model"}</span>
            <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
              {selectedModel?.expertise.slice(0, 2).map((tag) => (
                <span
                  className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white"
                  key={tag}
                  style={{ backgroundColor: EXPERTISE_COLORS[tag] ?? "#7a6857" }}
                >
                  {tag}
                </span>
              ))}
            </span>
            <ChevronDown className="shrink-0 text-muted-foreground" size={14} />
          </button>
        </DropdownMenuTrigger>
      </HandDrawnFrame>
      <DropdownMenuContent align="start" className="w-96">
        {Object.entries(modelsByBase).map(([baseModel, models], index) => (
          <DropdownMenuGroup key={baseModel}>
            {index > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {baseModel}
            </DropdownMenuLabel>
            {models.map((item) => (
              <DropdownMenuItem
                className={cn("flex flex-col items-start gap-1 py-2", model === item.name && "text-primary")}
                key={item.name}
                onClick={() => onChange?.(item.name)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.displayName}</span>
                  <span className="text-[10px] text-muted-foreground">~{item.expectedTimeSec}s</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.expertise.map((tag) => (
                    <span
                      className="px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white"
                      key={tag}
                      style={{ backgroundColor: EXPERTISE_COLORS[tag] ?? "#7a6857" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface GenerateAspectRatioSelectProps {
  label?: string;
  onValueChange?: ((value: string) => void) | undefined;
  options: readonly GenerateAspectRatioOption[];
  value: string;
}

export function GenerateAspectRatioSelect({
  label = "Aspect ratio",
  onValueChange,
  options,
  value
}: GenerateAspectRatioSelectProps) {
  return (
    <GenerateAspectMenuSelect
      icon={<Wand2 className="size-4" />}
      label={label}
      onValueChange={onValueChange}
      options={options}
      value={value}
    />
  );
}

export interface GenerateButtonProps {
  disabled?: boolean;
  isAuthenticated?: boolean | undefined;
  isGenerating?: boolean | undefined;
  label?: string;
  onClick?: (() => void) | undefined;
}

export function GenerateButton({
  disabled,
  isAuthenticated = true,
  isGenerating,
  label = "Generate",
  onClick
}: GenerateButtonProps) {
  return (
    <CartoonButton
      className="w-full sm:w-auto"
      color="#7b9d68"
      disabled={disabled}
      icon={<Sparkles className="size-4" />}
      loading={Boolean(isGenerating)}
      loadingText="Generating..."
      onClick={onClick ?? null}
      text={isAuthenticated ? label : "Sign in to generate"}
    />
  );
}
