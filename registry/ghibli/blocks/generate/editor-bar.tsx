import * as React from "react";
import { FileText, Film, ImageIcon, Paperclip, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { cn, type SelectOption } from "@/lib/utils";
import {
  type GenerateAttachment,
  GenerateAspectRatioSelect,
  GenerateButton,
  GenerateModeToggle,
  GenerateModelSelect,
  GenerateNegativePromptMenu,
  GenerateNumImagesControl,
  GenerateUploadDialog
} from "@/components/blocks/generate/controls";

export interface GenerateEditorBarProps {
  aspectRatio: string;
  aspectRatioOptions: SelectOption[];
  attachments: GenerateAttachment[];
  className?: string;
  disabled?: boolean;
  estimateLabel?: string;
  isAuthenticated?: boolean | undefined;
  isGenerating?: boolean | undefined;
  mode: string;
  modeOptions: SelectOption[];
  model: string;
  modelOptions: SelectOption[];
  negativePrompt: string;
  numImages: number;
  onAspectRatioChange?: ((value: string) => void) | undefined;
  onAttachmentsSelected?: ((files: FileList) => void) | undefined;
  onGenerate?: (() => void) | undefined;
  onModeChange?: ((value: string) => void) | undefined;
  onModelChange?: ((value: string) => void) | undefined;
  onNegativePromptChange?: ((value: string) => void) | undefined;
  onNumImagesChange?: ((value: number) => void) | undefined;
  onPromptChange?: ((value: string) => void) | undefined;
  onRemoveAttachment?: ((attachmentId: string) => void) | undefined;
  prompt: string;
}

export interface GeneratePromptComposerProps {
  attachments?: GenerateAttachment[];
  className?: string;
  maxLength?: number;
  onAttachmentsSelected?: ((files: FileList) => void) | undefined;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onPromptChange?: ((value: string) => void) | undefined;
  onRemoveAttachment?: ((attachmentId: string) => void) | undefined;
  placeholder?: string;
  prompt: string;
}

function attachmentIcon(kind: GenerateAttachment["kind"]) {
  if (kind === "image") {
    return <ImageIcon className="size-3.5" />;
  }

  if (kind === "video") {
    return <Film className="size-3.5" />;
  }

  return <FileText className="size-3.5" />;
}

export function GeneratePromptComposer({
  attachments = [],
  className,
  maxLength = 500,
  onAttachmentsSelected,
  onKeyDown,
  onPromptChange,
  onRemoveAttachment,
  placeholder = "Text, image or video",
  prompt
}: GeneratePromptComposerProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className={cn("grid gap-2", className)}>
      <HandDrawnFrame
        className="overflow-hidden bg-[color:color-mix(in_oklab,var(--paper-soft)_90%,white)]"
        strokeColor="var(--border)"
        strokeWidth={1.25}
        svgClassName="opacity-85"
        variant="banner"
      >
        <div className="flex min-h-[104px] flex-col overflow-hidden">
          {attachments.length > 0 ? (
            <div className="flex shrink-0 flex-wrap gap-3 px-4 pt-4 pb-3">
              {attachments.map((attachment) => (
                <div
                  className={cn(
                    "inline-flex max-w-full items-center gap-2 border border-[color:var(--border-soft)] bg-white/80 px-1.5 py-1 text-xs",
                    attachment.kind === "image" && "relative size-24 flex-col items-stretch justify-between overflow-hidden p-0"
                  )}
                  key={attachment.id}
                >
                  {attachment.kind === "image" ? (
                    <div className="grid flex-1 place-items-center bg-[color:var(--paper-soft)] text-muted-foreground">
                      <ImageIcon className="size-5" />
                    </div>
                  ) : (
                    <span className="inline-flex size-10 shrink-0 items-center justify-center bg-[color:var(--paper-soft)] text-muted-foreground">
                      {attachmentIcon(attachment.kind)}
                    </span>
                  )}
                  <div className={cn("min-w-0", attachment.kind === "image" && "px-1.5 pb-1.5")}>
                    <p className="truncate text-[11px] font-medium text-[color:var(--foreground)]">
                      {attachment.name}
                    </p>
                    {attachment.sizeLabel ? (
                      <p className="truncate text-[10px] text-muted-foreground">{attachment.sizeLabel}</p>
                    ) : null}
                  </div>
                  {onRemoveAttachment ? (
                    <button
                      aria-label={`Remove ${attachment.name}`}
                      className={cn(
                        "inline-flex size-6 shrink-0 items-center justify-center text-muted-foreground transition hover:bg-[color:var(--paper-soft)] hover:text-[color:var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
                        attachment.kind === "image" &&
                          "absolute right-1.5 top-1.5 rounded-full border border-[color:var(--border-soft)] bg-[color:rgba(255,251,244,0.96)]"
                      )}
                      onClick={() => onRemoveAttachment(attachment.id)}
                      type="button"
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          <div className="min-h-0 flex-1 px-4 pb-1">
            <textarea
              className="scrollbar-hidden min-h-13 w-full resize-none bg-transparent px-0 py-2 text-sm leading-7 text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted-foreground)]"
              maxLength={maxLength}
              onChange={(event) => onPromptChange?.(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              rows={attachments.length > 0 ? 3 : 2}
              value={prompt}
            />
          </div>

          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 px-3 pt-3 pb-3">
            <div className="min-w-0 shrink-0">
              <DropdownMenu>
                <HandDrawnFrame
                  className="inline-flex shrink-0 bg-white/45 p-0.5"
                  strokeColor="var(--border-strong)"
                  strokeWidth={1.85}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="Open attachment menu"
                      className="bg-transparent hover:bg-white/20"
                      size="icon-xs"
                      type="button"
                      variant="ghost"
                    >
                      <Paperclip className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                </HandDrawnFrame>
                <DropdownMenuContent
                  align="start"
                  aria-label="Attachment options"
                  className="w-56 overflow-visible border-0 bg-transparent p-0 ring-0"
                  side="top"
                >
                  <HandDrawnFrame
                    className="w-full bg-popover px-1.5 py-1.5"
                    contentClassName="grid gap-0.5"
                    strokeColor="var(--border)"
                    strokeWidth={1.6}
                    variant="panel"
                  >
                    <DropdownMenuItem
                      className="gap-3 px-3 py-2 focus:bg-[color:var(--ring)] focus:text-[color:var(--ink-strong)] data-[highlighted]:bg-[color:var(--ring)] data-[highlighted]:text-[color:var(--ink-strong)]"
                      onSelect={(event) => {
                        event.preventDefault();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Paperclip className="size-4 text-muted-foreground" />
                      <div className="grid gap-0.5">
                        <span className="font-medium">Add photos or files</span>
                        <span className="text-xs text-muted-foreground">
                          Images, video, PDF, text, and office docs
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </HandDrawnFrame>
                </DropdownMenuContent>
              </DropdownMenu>

              <input
                aria-label="Add photos or files"
                className="hidden"
                multiple
                onChange={(event) => {
                  if (event.target.files) {
                    onAttachmentsSelected?.(event.target.files);
                  }
                }}
                ref={fileInputRef}
                type="file"
              />
            </div>

            <span className="min-w-0 truncate text-xs text-muted-foreground">
              {attachments.length > 0 ? `${attachments.length} attached` : "Drag photos or files here"}
            </span>
          </div>
        </div>
      </HandDrawnFrame>
      <p className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
        <Upload className="size-3.5" />
        Attach reference media from the host app. This component stays presentational.
      </p>
    </div>
  );
}

export function GenerateEditorBar({
  aspectRatio,
  aspectRatioOptions,
  attachments,
  className,
  disabled,
  estimateLabel,
  isAuthenticated,
  isGenerating,
  mode,
  modeOptions,
  model,
  modelOptions,
  negativePrompt,
  numImages,
  onAspectRatioChange,
  onAttachmentsSelected,
  onGenerate,
  onModeChange,
  onModelChange,
  onNegativePromptChange,
  onNumImagesChange,
  onPromptChange,
  onRemoveAttachment,
  prompt
}: GenerateEditorBarProps) {
  return (
    <HandDrawnFrame
      className={cn(
        "bg-[color:var(--card)] px-4 py-4 md:px-5 md:py-5",
        className
      )}
      strokeColor="var(--border)"
      strokeWidth={2.1}
      variant="banner"
    >
      <div className="grid gap-3">
        <GeneratePromptComposer
          attachments={attachments}
          onAttachmentsSelected={onAttachmentsSelected}
          onPromptChange={onPromptChange}
          onRemoveAttachment={onRemoveAttachment}
          placeholder="Describe the mood, lighting, and story beats you want to generate..."
          prompt={prompt}
        />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-[auto_auto_auto_auto] sm:items-center sm:justify-start">
            <div className="w-full sm:w-auto">
              <GenerateModeToggle onValueChange={onModeChange} options={modeOptions} value={mode} />
            </div>
            <div className="w-full sm:w-auto">
              <GenerateModelSelect onValueChange={onModelChange} options={modelOptions} value={model} />
            </div>
            <div className="w-full sm:w-auto">
              <GenerateAspectRatioSelect
                onValueChange={onAspectRatioChange}
                options={aspectRatioOptions}
                value={aspectRatio}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <GenerateNumImagesControl onValueChange={onNumImagesChange} value={numImages} />
              <GenerateNegativePromptMenu
                onValueChange={onNegativePromptChange}
                value={negativePrompt}
              />
              <GenerateUploadDialog
                attachments={attachments}
                onFilesSelected={onAttachmentsSelected}
                onRemoveAttachment={onRemoveAttachment}
              />
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
            {estimateLabel ? (
              <span className="hidden text-xs text-[color:var(--muted-foreground)] sm:inline">
                {estimateLabel}
              </span>
            ) : null}
            <GenerateButton
              disabled={disabled || !prompt.trim()}
              isAuthenticated={isAuthenticated}
              isGenerating={isGenerating}
              onClick={onGenerate}
            />
          </div>
        </div>
      </div>
    </HandDrawnFrame>
  );
}
