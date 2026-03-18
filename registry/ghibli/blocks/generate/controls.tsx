import * as React from "react";
import { ChevronDown, ImagePlus, Minus, Plus, Sparkles, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { cn, type SelectOption, useControllableState } from "@/lib/utils";

export interface GenerateAttachment {
  id: string;
  kind?: "image" | "video";
  name: string;
  sizeLabel?: string;
}

interface ChoiceChipProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

function ChoiceChip({ active, children, onClick }: ChoiceChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors",
        active
          ? "border-[color:var(--primary-edge)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
          : "border-[color:var(--border)] bg-[color:var(--paper-soft)] text-[color:var(--foreground)] hover:bg-white/60"
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
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
  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--paper-soft)] p-1">
      {options.map((option) => (
        <ChoiceChip
          active={option.value === value}
          key={option.value}
          onClick={() => onValueChange?.(option.value)}
        >
          {option.label}
        </ChoiceChip>
      ))}
    </div>
  );
}

interface MenuSelectProps {
  icon?: React.ReactNode;
  label: string;
  onValueChange?: ((value: string) => void) | undefined;
  options: SelectOption[];
  value: string;
}

function MenuSelect({ icon, label, onValueChange, options, value }: MenuSelectProps) {
  const activeOption = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          {icon}
          <span>{activeOption?.label ?? label}</span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup onValueChange={onValueChange} value={value}>
          {options.map((option) => (
            <DropdownMenuRadioItem itemValue={option.value} key={option.value}>
              <div className="grid gap-0.5">
                <span>{option.label}</span>
                {option.description ? (
                  <span className="text-xs text-[color:var(--muted-foreground)]">
                    {option.description}
                  </span>
                ) : null}
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
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
  return <MenuSelect icon={<Wand2 className="size-4" />} label="Aspect ratio" {...props} />;
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
    <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--paper-soft)] px-2 py-1">
      <Button
        disabled={value <= min}
        onClick={() => onValueChange?.(value - 1)}
        size="sm"
        variant="ghost"
      >
        <Minus className="size-4" />
      </Button>
      <span className="min-w-10 text-center text-sm font-medium">{value} imgs</span>
      <Button
        disabled={value >= max}
        onClick={() => onValueChange?.(value + 1)}
        size="sm"
        variant="ghost"
      >
        <Plus className="size-4" />
      </Button>
    </div>
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
        <label className="grid cursor-pointer gap-2 rounded-[calc(var(--radius)-0.25rem)] border border-dashed border-[color:var(--border-strong)] bg-[color:var(--paper-soft)] p-4 text-sm text-[color:var(--muted-foreground)]">
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
                className="flex items-center justify-between gap-3 rounded-[calc(var(--radius)-0.35rem)] border border-[color:var(--border)] bg-white/40 px-3 py-2"
                key={attachment.id}
              >
                <div className="grid">
                  <span className="text-sm font-medium">{attachment.name}</span>
                  <span className="text-xs text-[color:var(--muted-foreground)]">
                    {attachment.kind ?? "file"}
                    {attachment.sizeLabel ? ` • ${attachment.sizeLabel}` : ""}
                  </span>
                </div>
                <Button
                  onClick={() => onRemoveAttachment?.(attachment.id)}
                  size="sm"
                  variant="ghost"
                >
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
    <Button disabled={disabled} onClick={onClick} size="lg">
      <Sparkles className="size-4" />
      {isGenerating ? "Generating..." : isAuthenticated ? label : "Sign in to generate"}
    </Button>
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
