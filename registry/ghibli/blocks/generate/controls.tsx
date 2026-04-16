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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { cn, type SelectOption } from "@/lib/utils";

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
  description: string;
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

function GenerateAspectMenuSelect({
  label,
  onValueChange,
  options,
  value
}: {
  label: string;
  onValueChange?: ((value: string) => void) | undefined;
  options: GenerateAspectRatioOption[];
  value: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [aspectRulerValue, setAspectRulerValue] = React.useState<string | null>(null);
  const [showAspectCallout, setShowAspectCallout] = React.useState(false);
  const activeOption = options.find((option) => option.value === value);
  const displayedAspectValue = aspectRulerValue ?? value;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    setAspectRulerValue(nextOpen ? value : null);
    setShowAspectCallout(false);
  };

  const handleAspectRulerSelect = (nextValue: string) => {
    setAspectRulerValue(nextValue);
    setShowAspectCallout(true);
    onValueChange?.(nextValue);
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange} open={open}>
      <HandDrawnFrame
        className="w-full sm:w-auto"
        surfaceClassName="bg-[color:var(--paper)]"
        strokeColor="var(--border)"
        strokeWidth={1.25}
        svgClassName="opacity-85"
        crookednessIntensity={0.3}
      >
        <DropdownMenuTrigger asChild>
          <Button className="w-full bg-transparent hover:bg-white/20 sm:w-auto" variant="ghost">
            <Wand2 className="size-4" />
            <span>{activeOption?.label ?? label}</span>
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
      </HandDrawnFrame>
      <DropdownMenuContent className="w-[min(28.5rem,calc(100vw-1.5rem))] min-w-0 overflow-visible border-[color:var(--border)] bg-[color:var(--foreground)] p-0 text-[color:var(--paper-soft)] ring-0">
        <div className="grid gap-3 bg-[color:var(--foreground)] px-3 pt-4 pb-3">
          <div className="mx-auto flex w-[97.5%] items-center justify-between gap-3">
            <p className="text-sm font-medium tracking-[0.04em] text-[color:var(--paper-soft)]">
              {label}
            </p>

            <Button
              aria-label={`Close ${label.toLowerCase()} options`}
              className="h-8 w-8 shrink-0 p-0 text-[color:var(--paper-soft)] hover:bg-white/10 hover:text-white"
              onClick={() => handleOpenChange(false)}
              size="sm"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="relative mx-auto w-[97.5%] pb-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[3.5rem] left-[7.143%] right-[7.143%] h-px bg-[color:var(--paper)]"
            />

            <DropdownMenuRadioGroup className="relative grid grid-cols-7 items-start" value={displayedAspectValue}>
              {options.map((option) => {
                const isSelected = option.value === displayedAspectValue;

                return (
                  <DropdownMenuRadioItem
                    aria-label={`${option.label} ${option.description}`}
                    className={cn(
                      "group/aspect-ruler relative flex min-w-0 cursor-pointer justify-center rounded-none bg-transparent px-0 py-0 text-[color:var(--paper-soft)] focus:bg-transparent focus:text-[color:var(--paper-soft)] [&_[data-slot=dropdown-menu-radio-item-indicator]]:hidden",
                      option.disabled && "pointer-events-none opacity-40"
                    )}
                    disabled={option.disabled}
                    key={option.value}
                    onSelect={(event) => {
                      event.preventDefault();
                      handleAspectRulerSelect(option.value);
                    }}
                    value={option.value}
                  >
                    <span className="relative flex h-[4.75rem] w-full items-start justify-center">
                      {showAspectCallout && isSelected ? (
                        <span className="absolute top-0 inline-grid min-w-[6.9rem] max-w-[7.4rem] items-center justify-center border border-[color:var(--border)] bg-[color:var(--paper-soft)] px-2 py-1 text-center text-[11px] font-medium leading-tight text-[color:var(--foreground)] shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
                          <span>{option.label}</span>
                          <span>({option.description})</span>
                        </span>
                      ) : null}

                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute top-[2.8rem] h-4 w-px bg-[color:var(--paper)] transition-opacity",
                          isSelected ? "opacity-100" : "opacity-80"
                        )}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute top-[3.3rem] rounded-full border border-[color:var(--paper)] transition-all",
                          isSelected
                            ? "size-4 bg-[color:var(--paper)] shadow-[0_0_0_2px_color-mix(in_oklab,var(--foreground)_82%,transparent)]"
                            : "size-2 bg-[color:var(--foreground)] group-hover/aspect-ruler:bg-[color:var(--paper)]"
                        )}
                      />
                    </span>
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
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
  onValueChange?: ((value: string) => void) | undefined;
  options: GenerateAspectRatioOption[];
  value: string;
}

export function GenerateAspectRatioSelect({
  onValueChange,
  options,
  value
}: GenerateAspectRatioSelectProps) {
  return (
    <GenerateAspectMenuSelect
      label="Aspect ratio"
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
