import * as React from "react";
import { ChevronDown, ImagePlus, Minus, Plus, Sparkles, Wand2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartoonButton } from "@/components/ui/cartoon-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { Textarea } from "@/components/ui/textarea";
import { cn, type SelectOption, useControllableState } from "@/lib/utils";

export interface GenerateAttachment {
  id: string;
  kind?: "image" | "video";
  name: string;
  sizeLabel?: string;
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
      className="inline-block w-full bg-[color:var(--paper-soft)] sm:w-auto"
      strokeColor="var(--border)"
      strokeWidth={1.25}
      svgClassName="opacity-85"
      variant="banner"
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

interface MenuSelectProps {
  contentClassName?: string;
  icon?: React.ReactNode;
  label: string;
  onValueChange?: ((value: string) => void) | undefined;
  optionVariant?: "default" | "radio-list" | "aspect-ruler";
  options: SelectOption[];
  value: string;
}

function MenuSelect({
  contentClassName,
  icon,
  label,
  onValueChange,
  optionVariant = "default",
  options,
  value
}: MenuSelectProps) {
  const [open, setOpen] = React.useState(false);
  const isAspectRuler = optionVariant === "aspect-ruler";
  const [aspectRulerValue, setAspectRulerValue] = React.useState<string | null>(null);
  const [showAspectCallout, setShowAspectCallout] = React.useState(false);
  const activeOption = options.find((option) => option.value === value);
  const displayedAspectValue = isAspectRuler ? aspectRulerValue ?? value : value;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (isAspectRuler) {
      setAspectRulerValue(nextOpen ? value : null);
      setShowAspectCallout(false);
    }
  };

  const handleAspectRulerSelect = (nextValue: string) => {
    setAspectRulerValue(nextValue);
    setShowAspectCallout(true);
    onValueChange?.(nextValue);
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange} open={open}>
      <HandDrawnFrame
        className="w-full bg-[color:var(--paper)] sm:w-auto"
        strokeColor="var(--border)"
        strokeWidth={1.25}
        svgClassName="opacity-85"
        variant="banner"
      >
        <DropdownMenuTrigger asChild>
          <Button className="w-full bg-transparent hover:bg-white/20 sm:w-auto" variant="ghost">
            {icon}
            <span>{activeOption?.label ?? label}</span>
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
      </HandDrawnFrame>
      <DropdownMenuContent
        className={cn(
          isAspectRuler &&
            "w-[min(28.5rem,calc(100vw-1.5rem))] min-w-0 overflow-visible border-[color:var(--border)] bg-[color:var(--foreground)] p-0 text-[color:var(--paper-soft)] ring-0",
          optionVariant === "radio-list" && "min-w-0 p-1.5",
          contentClassName
        )}
      >
        {isAspectRuler ? (
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
                      className={cn(
                        "group/aspect-ruler relative flex min-w-0 cursor-pointer justify-center rounded-none bg-transparent px-0 py-0 text-[color:var(--paper-soft)] focus:bg-transparent focus:text-[color:var(--paper-soft)]",
                        option.disabled && "pointer-events-none opacity-40"
                      )}
                      disabled={option.disabled}
                      key={option.value}
                      onClick={() => handleAspectRulerSelect(option.value)}
                      value={option.value}
                    >
                      <span className="relative flex h-[4.75rem] w-full items-start justify-center">
                        {showAspectCallout && isSelected ? (
                          <span className="absolute top-0 inline-grid min-w-[6.9rem] max-w-[7.4rem] items-center justify-center border border-[color:var(--border)] bg-[color:var(--paper-soft)] px-2 py-1 text-center text-[11px] font-medium leading-tight text-[color:var(--foreground)] shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
                            <span>{option.label}</span>
                            {option.description ? <span>({option.description})</span> : null}
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
        ) : (
          <>
            <DropdownMenuLabel
              className={cn(
                optionVariant === "radio-list" &&
                  "px-2 pb-1 text-center text-[13px] font-medium leading-tight whitespace-nowrap text-[color:var(--foreground)] sm:text-sm"
              )}
            >
              {label}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup onValueChange={onValueChange} value={value}>
              {options.map((option) => (
                <DropdownMenuRadioItem
                  className={cn(
                    optionVariant === "radio-list" &&
                      "group/aspect-option gap-3 rounded-none px-2.5 py-2 pr-2 text-base text-[color:var(--foreground)] focus:bg-[color:var(--paper-soft)] focus:text-[color:var(--foreground)]"
                  )}
                  key={option.value}
                  value={option.value}
                >
                  {optionVariant === "radio-list" ? (
                    <>
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] transition-colors group-data-[state=checked]/aspect-option:border-[color:var(--foreground)]">
                        <span className="size-2 rounded-full bg-[color:var(--foreground)] opacity-0 transition-opacity group-data-[state=checked]/aspect-option:opacity-100" />
                      </span>
                      <span>{option.label}</span>
                    </>
                  ) : (
                    <div className="grid gap-0.5">
                      <span>{option.label}</span>
                      {option.description ? (
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      ) : null}
                    </div>
                  )}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface GenerateModelSelectProps {
  onValueChange?: ((value: string) => void) | undefined;
  options: SelectOption[];
  value: string;
}

export function GenerateModelSelect(props: GenerateModelSelectProps) {
  return <MenuSelect icon={<Sparkles className="size-4" />} label="Model" {...props} />;
}

export interface GenerateAspectRatioSelectProps {
  onValueChange?: ((value: string) => void) | undefined;
  options: SelectOption[];
  value: string;
}

export function GenerateAspectRatioSelect(props: GenerateAspectRatioSelectProps) {
  return (
    <MenuSelect
      icon={<Wand2 className="size-4" />}
      label="Aspect ratio"
      optionVariant="aspect-ruler"
      {...props}
    />
  );
}

export interface GenerateNumImagesControlProps {
  max?: number;
  min?: number;
  onValueChange?: ((value: number) => void) | undefined;
  value: number;
}

export function GenerateNumImagesControl({
  max = 8,
  min = 1,
  onValueChange,
  value
}: GenerateNumImagesControlProps) {
  return (
    <HandDrawnFrame
      className="w-full bg-[color:var(--paper)] sm:w-auto"
      strokeColor="var(--border)"
      strokeWidth={1.25}
      svgClassName="opacity-85"
      variant="banner"
    >
      <div className="inline-flex h-11 items-center gap-1 px-1">
        <Button disabled={value <= min} onClick={() => onValueChange?.(value - 1)} size="sm" variant="ghost">
          <Minus className="size-4" />
        </Button>
        <span className="min-w-10 text-center text-sm font-medium">{value} imgs</span>
        <Button disabled={value >= max} onClick={() => onValueChange?.(value + 1)} size="sm" variant="ghost">
          <Plus className="size-4" />
        </Button>
      </div>
    </HandDrawnFrame>
  );
}

export interface GenerateNegativePromptMenuProps {
  label?: string;
  onOpenChange?: ((open: boolean) => void) | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  open?: boolean | undefined;
  value: string;
}

export function GenerateNegativePromptMenu({
  label = "Negative prompt",
  onOpenChange,
  onValueChange,
  open,
  value
}: GenerateNegativePromptMenuProps) {
  const [isOpen, setIsOpen] = useControllableState({
    defaultValue: false,
    onChange: onOpenChange,
    value: open
  });

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Negative prompt</DialogTitle>
          <DialogDescription>
            Keep this optional and lightweight so it fits smaller editor surfaces.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          onChange={(event) => onValueChange?.(event.target.value)}
          placeholder="Things to avoid in the render..."
          value={value}
        />
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="secondary">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export interface GenerateUploadDialogProps {
  attachments: GenerateAttachment[];
  onFilesSelected?: ((files: FileList) => void) | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  onRemoveAttachment?: ((attachmentId: string) => void) | undefined;
  open?: boolean | undefined;
}

export function GenerateUploadDialog({
  attachments,
  onFilesSelected,
  onOpenChange,
  onRemoveAttachment,
  open
}: GenerateUploadDialogProps) {
  const [isOpen, setIsOpen] = useControllableState({
    defaultValue: false,
    onChange: onOpenChange,
    value: open
  });

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <ImagePlus className="size-4" />
          Attachments
          {attachments.length ? ` (${attachments.length})` : ""}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach reference media</DialogTitle>
          <DialogDescription>
            Accept files from the host app while keeping the surface fully presentational.
          </DialogDescription>
        </DialogHeader>
        <label className="grid cursor-pointer gap-2 border border-dashed border-[color:var(--border-strong)] bg-[color:var(--paper-soft)] p-4 text-sm text-[color:var(--muted-foreground)]">
          <span>Choose images or videos</span>
          <input
            className="sr-only"
            multiple
            onChange={(event) => {
              if (event.target.files) {
                onFilesSelected?.(event.target.files);
              }
            }}
            type="file"
          />
        </label>
        <div className="grid gap-2">
          {attachments.length === 0 ? (
            <p className="text-sm text-[color:var(--muted-foreground)]">No files attached yet.</p>
          ) : (
            attachments.map((attachment) => (
              <div
                className="flex items-center justify-between gap-3 border border-[color:var(--border)] bg-white/40 px-3 py-2"
                key={attachment.id}
              >
                <div className="grid">
                  <span className="text-sm font-medium">{attachment.name}</span>
                  <span className="text-xs text-[color:var(--muted-foreground)]">
                    {attachment.kind ?? "file"}
                    {attachment.sizeLabel ? ` • ${attachment.sizeLabel}` : ""}
                  </span>
                </div>
                <Button onClick={() => onRemoveAttachment?.(attachment.id)} size="sm" variant="ghost">
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
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

export interface GenerateQuickPickProps {
  items: SelectOption[];
  onSelect?: ((value: string) => void) | undefined;
}

export function GenerateQuickPicks({ items, onSelect }: GenerateQuickPickProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Quick picks</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Prompt starters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem key={item.value} onClick={() => onSelect?.(item.value)}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
