import * as React from "react";
import { FileText, Film, ImageIcon, Loader2, Paperclip, Upload, X } from "lucide-react";

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

const ACCEPTED_MIME_TYPES = new Set([
  "application/json",
  "application/msword",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/x-zip-compressed",
  "application/zip",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/csv",
  "text/markdown",
  "text/plain",
  "video/mp4",
  "video/quicktime",
  "video/webm"
]);

const ACCEPTED_EXTENSIONS = new Set([
  ".csv",
  ".doc",
  ".docx",
  ".gif",
  ".jpeg",
  ".jpg",
  ".json",
  ".md",
  ".mov",
  ".mp4",
  ".pdf",
  ".png",
  ".ppt",
  ".pptx",
  ".txt",
  ".webm",
  ".webp",
  ".xls",
  ".xlsx",
  ".zip"
]);

const FILE_PICKER_ACCEPT_ATTR = Array.from(new Set([...ACCEPTED_MIME_TYPES, ...ACCEPTED_EXTENSIONS])).join(",");
const PROMPT_COMPOSER_MIN_HEIGHT = 104;
const PROMPT_COMPOSER_MAX_HEIGHT = 196;
const PROMPT_COMPOSER_MAX_HEIGHT_WITH_ATTACHMENTS = 288;
const PROMPT_TEXTAREA_LINE_HEIGHT = 28;
const PROMPT_TEXTAREA_MAX_LINES_WITH_ATTACHMENTS = 3;
const PROMPT_TEXTAREA_MAX_HEIGHT_WITH_ATTACHMENTS =
  PROMPT_TEXTAREA_LINE_HEIGHT * PROMPT_TEXTAREA_MAX_LINES_WITH_ATTACHMENTS + 24;
const PROMPT_TEXTAREA_MIN_HEIGHT = 40;
const PROMPT_TEXTAREA_MIN_HEIGHT_WITH_ATTACHMENTS = 52;

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

type AttachmentPreviewStatus = "error" | "loading" | "ready";

function hasDraggedFiles(dataTransfer: DataTransfer | null) {
  return Array.from(dataTransfer?.types ?? []).includes("Files");
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

function AttachmentChip({
  attachment,
  onRemove
}: {
  attachment: GenerateAttachment;
  onRemove?: (() => void) | undefined;
}) {
  const isImage = attachment.kind === "image";
  const [previewStatus, setPreviewStatus] = React.useState<AttachmentPreviewStatus>(
    isImage ? (attachment.previewUrl ? "loading" : "error") : "ready"
  );

  React.useEffect(() => {
    if (!isImage) {
      setPreviewStatus("ready");
      return;
    }

    setPreviewStatus(attachment.previewUrl ? "loading" : "error");
  }, [attachment.previewUrl, isImage]);

  if (isImage) {
    return (
      <div className="relative size-24 shrink-0 overflow-hidden border border-[color:var(--border-soft)] bg-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
        {attachment.previewUrl ? (
          <img
            alt=""
            aria-hidden
            className={cn(
              "size-full object-cover transition duration-300",
              previewStatus === "ready"
                ? "scale-100 opacity-100 blur-0"
                : "scale-110 opacity-70 blur-md"
            )}
            onError={() => setPreviewStatus("error")}
            onLoad={() => setPreviewStatus("ready")}
            src={attachment.previewUrl}
          />
        ) : null}

        {previewStatus === "loading" ? (
          <span className="absolute inset-0 grid place-items-center bg-[color:rgba(255,251,244,0.72)]">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </span>
        ) : null}

        {previewStatus === "error" ? (
          <span className="absolute inset-0 inline-flex items-center justify-center bg-[color:rgba(255,251,244,0.84)] text-muted-foreground">
            <ImageIcon className="size-4" />
          </span>
        ) : null}

        {onRemove ? (
          <button
            aria-label={`Remove ${attachment.name}`}
            className="absolute right-1.5 top-1.5 z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-[color:rgba(255,251,244,0.96)] text-muted-foreground shadow-sm transition hover:bg-white hover:text-[color:var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
            onClick={onRemove}
            type="button"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="inline-flex max-w-full items-center gap-2 border border-[color:var(--border-soft)] bg-white/80 px-1.5 py-1 text-xs">
      <span className="inline-flex size-10 shrink-0 items-center justify-center bg-[color:var(--paper-soft)] text-muted-foreground">
        {attachmentIcon(attachment.kind)}
      </span>

      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium text-[color:var(--foreground)]">
          {attachment.name}
        </p>
        {attachment.sizeLabel ? (
          <p className="truncate text-[10px] text-muted-foreground">{attachment.sizeLabel}</p>
        ) : null}
      </div>

      {onRemove ? (
        <button
          aria-label={`Remove ${attachment.name}`}
          className="inline-flex size-6 shrink-0 items-center justify-center text-muted-foreground transition hover:bg-[color:var(--paper-soft)] hover:text-[color:var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
          onClick={onRemove}
          type="button"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
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
  const attachmentsRef = React.useRef<HTMLDivElement | null>(null);
  const footerRef = React.useRef<HTMLDivElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const dragDepthRef = React.useRef(0);
  const [composerHeight, setComposerHeight] = React.useState(PROMPT_COMPOSER_MIN_HEIGHT);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = React.useState(false);
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);
  const [isTextareaOverflowing, setIsTextareaOverflowing] = React.useState(false);
  const [textareaHeight, setTextareaHeight] = React.useState(PROMPT_TEXTAREA_MIN_HEIGHT);

  const syncComposerLayout = React.useCallback(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "0px";

    const attachmentsHeight = attachmentsRef.current?.offsetHeight ?? 0;
    const footerHeight = footerRef.current?.offsetHeight ?? 0;
    const hasAttachments = attachments.length > 0;
    const minTextareaHeight = hasAttachments
      ? PROMPT_TEXTAREA_MIN_HEIGHT_WITH_ATTACHMENTS
      : PROMPT_TEXTAREA_MIN_HEIGHT;
    const maxComposerHeight = hasAttachments
      ? Math.max(
          PROMPT_COMPOSER_MAX_HEIGHT_WITH_ATTACHMENTS,
          attachmentsHeight + footerHeight + PROMPT_TEXTAREA_MAX_HEIGHT_WITH_ATTACHMENTS
        )
      : PROMPT_COMPOSER_MAX_HEIGHT;
    const maxTextareaHeight = Math.max(
      minTextareaHeight,
      hasAttachments
        ? PROMPT_TEXTAREA_MAX_HEIGHT_WITH_ATTACHMENTS
        : maxComposerHeight - attachmentsHeight - footerHeight
    );
    const desiredTextareaHeight = Math.max(textarea.scrollHeight, minTextareaHeight);
    const nextTextareaHeight = Math.min(desiredTextareaHeight, maxTextareaHeight);
    const nextComposerHeight = Math.min(
      maxComposerHeight,
      Math.max(PROMPT_COMPOSER_MIN_HEIGHT, attachmentsHeight + footerHeight + nextTextareaHeight)
    );

    textarea.style.height = `${nextTextareaHeight}px`;
    setTextareaHeight(nextTextareaHeight);
    setComposerHeight(nextComposerHeight);
    setIsTextareaOverflowing(desiredTextareaHeight > maxTextareaHeight);
  }, [attachments.length]);

  React.useEffect(() => {
    syncComposerLayout();
  }, [attachments, prompt, syncComposerLayout]);

  React.useEffect(() => {
    window.addEventListener("resize", syncComposerLayout);

    return () => window.removeEventListener("resize", syncComposerLayout);
  }, [syncComposerLayout]);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onAttachmentsSelected?.(event.target.files);
    }

    event.target.value = "";
    setIsAttachmentMenuOpen(false);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    if (!hasDraggedFiles(event.dataTransfer)) return;

    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDraggingOver(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!hasDraggedFiles(event.dataTransfer)) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (!hasDraggedFiles(event.dataTransfer)) return;

    event.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

    if (dragDepthRef.current === 0) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!hasDraggedFiles(event.dataTransfer)) return;

    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDraggingOver(false);

    if (event.dataTransfer.files.length > 0) {
      onAttachmentsSelected?.(event.dataTransfer.files);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <HandDrawnFrame
        className={cn(
          "overflow-hidden bg-[color:color-mix(in_oklab,var(--paper-soft)_90%,white)] transition-colors",
          isDraggingOver
            ? "bg-[color:color-mix(in_oklab,var(--paper-soft)_72%,var(--primary)_28%)]"
            : ""
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        pathClassName={cn(isDraggingOver && "[stroke-dasharray:6_5]")}
        shape="card"
        strokeColor={isDraggingOver ? "var(--primary-edge)" : "var(--border)"}
        strokeWidth={1.25}
        svgClassName="opacity-85"
        variant={0.3}
      >
        <div
          className="flex flex-col overflow-hidden"
          style={{
            height: `${composerHeight}px`,
            minHeight: `${PROMPT_COMPOSER_MIN_HEIGHT}px`
          }}
        >
          {attachments.length > 0 ? (
            <div
              className="shrink-0 flex flex-wrap gap-3 px-4 pt-4 pb-3"
              ref={attachmentsRef}
            >
              {attachments.map((attachment) => (
                <AttachmentChip
                  attachment={attachment}
                  key={attachment.id}
                  onRemove={onRemoveAttachment ? () => onRemoveAttachment(attachment.id) : undefined}
                />
              ))}
            </div>
          ) : null}

          <div className="min-h-0 flex-1 px-4 pb-1">
            <textarea
              className={cn(
                "scrollbar-hidden w-full resize-none bg-transparent px-0 py-2 text-sm leading-7 text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted-foreground)]",
                isTextareaOverflowing ? "overflow-y-auto" : "overflow-hidden"
              )}
              maxLength={maxLength}
              onChange={(event) => onPromptChange?.(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              ref={textareaRef}
              rows={1}
              style={{ height: `${textareaHeight}px` }}
              value={prompt}
            />
          </div>

          <div
            className="flex items-center justify-between gap-3 px-3 pt-3 pb-3"
            ref={footerRef}
          >
            <div>
              <DropdownMenu onOpenChange={setIsAttachmentMenuOpen} open={isAttachmentMenuOpen}>
                <HandDrawnFrame
                  className="inline-flex shrink-0 bg-white/45 p-0.5"
                  shape="organic"
                  strokeColor="var(--border-strong)"
                  strokeWidth={1.85}
                  variant={0.7}
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
                    shape="surface"
                    strokeColor="var(--border)"
                    strokeWidth={1.6}
                    variant={0.9}
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
                accept={FILE_PICKER_ACCEPT_ATTR}
                aria-label="Add photos or files"
                className="hidden"
                multiple
                onChange={handleFileInput}
                ref={fileInputRef}
                type="file"
              />
            </div>

            <span className="truncate text-xs text-muted-foreground">
              {attachments.length > 0 ? "" : "Drag photos or files here"}
            </span>
          </div>

          {isDraggingOver ? (
            <div className="pointer-events-none absolute inset-2 z-10 grid place-items-center border-2 border-dashed border-[color:var(--primary-edge)] bg-[color:rgba(255,251,244,0.94)]">
              <div className="grid gap-2 px-6 text-center">
                <span className="mx-auto inline-flex size-11 items-center justify-center border border-[color:var(--primary-edge)] bg-white/90 text-[color:var(--primary)]">
                  <Upload className="size-4" />
                </span>
                <p className="text-sm font-medium text-[color:var(--ink-strong)]">
                  Drop photos or files here
                </p>
                <p className="text-xs text-muted-foreground">
                  Images, video, PDF, text, and office files are supported.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </HandDrawnFrame>
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
      className={cn("bg-[color:var(--card)] px-4 py-4 md:px-5 md:py-5", className)}
      shape="banner"
      strokeColor="var(--border)"
      strokeWidth={2.1}
      variant={0.9}
    >
      <div className="grid gap-4">
        <GeneratePromptComposer
          attachments={attachments}
          onAttachmentsSelected={onAttachmentsSelected}
          onPromptChange={onPromptChange}
          onRemoveAttachment={onRemoveAttachment}
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
