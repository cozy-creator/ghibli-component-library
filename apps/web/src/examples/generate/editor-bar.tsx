import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Film,
  Loader2,
  Paperclip,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { FormField } from "@/components/blocks/form/form-field";
import { NoticeBanner } from "@/components/blocks/feedback/notice-banner";
import { Button } from "@/components/ui/button";
import { CartoonButton } from "@/components/ui/cartoon-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { cn, type SelectOption } from "@/lib/utils";
import {
  type GenerateAttachment,
  type GenerateAspectRatioOption,
  GenerateAspectRatioSelect,
  GenerateButton,
  GenerateModeToggle,
  type GenerateModelItem,
  type GenerateModelsByBase,
  GenerateModelSelect,
} from "./controls";

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
  "video/webm",
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
  ".zip",
]);

const FILE_PICKER_ACCEPT_ATTR = Array.from(
  new Set([...ACCEPTED_MIME_TYPES, ...ACCEPTED_EXTENSIONS]),
).join(",");
const ATTACHMENT_PREVIEW_MIN_LOADING_MS = 1000;
const DRAG_THRESHOLD = 40;
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
  aspectRatioOptions: GenerateAspectRatioOption[];
  attachments: GenerateAttachment[];
  className?: string;
  defaultExpanded?: boolean;
  disabled?: boolean;
  estimateLabel?: string;
  isAuthenticated?: boolean | undefined;
  isGenerating?: boolean | undefined;
  mode: string;
  modeOptions: SelectOption[];
  model: string;
  modelsByBase: GenerateModelsByBase;
  onAspectRatioChange?: ((value: string) => void) | undefined;
  onAttachmentsSelected?: ((files: FileList) => void) | undefined;
  onGenerate?: (() => void) | undefined;
  onModeChange?: ((value: string) => void) | undefined;
  onModelChange?: ((value: GenerateModelItem["name"]) => void) | undefined;
  onPromptChange?: ((value: string) => void) | undefined;
  onRemoveAttachment?: ((attachmentId: string) => void) | undefined;
  prompt: string;
  selectedModel?: GenerateModelItem | undefined;
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

interface AttachmentFeedback {
  message: string;
  tone: "error" | "muted";
}

function hasDraggedFiles(dataTransfer: DataTransfer | null) {
  return Array.from(dataTransfer?.types ?? []).includes("Files");
}

function getFileExtension(fileName: string) {
  const parts = fileName.toLowerCase().split(".");

  return parts.length > 1 ? `.${parts.pop()}` : "";
}

function isImageFile(file: File) {
  return (
    file.type.startsWith("image/") ||
    [".gif", ".jpeg", ".jpg", ".png", ".webp"].includes(
      getFileExtension(file.name),
    )
  );
}

function isVideoFile(file: File) {
  return (
    file.type.startsWith("video/") ||
    [".mov", ".mp4", ".webm"].includes(getFileExtension(file.name))
  );
}

function isImageAttachment(attachment: GenerateAttachment) {
  return attachment.kind === "image" || Boolean(attachment.previewUrl);
}

function isVideoAttachment(attachment: GenerateAttachment) {
  return attachment.kind === "video";
}

function isSupportedAttachmentFile(file: File) {
  const mimeType = file.type.toLowerCase();

  if (mimeType.startsWith("image/") || mimeType.startsWith("video/")) {
    return true;
  }

  if (mimeType && ACCEPTED_MIME_TYPES.has(mimeType)) {
    return true;
  }

  return ACCEPTED_EXTENSIONS.has(getFileExtension(file.name));
}

function getIncomingAttachmentKey(file: File) {
  const kind = isImageFile(file)
    ? "image"
    : isVideoFile(file)
      ? "video"
      : "file";

  return [kind, file.name.trim().toLowerCase()].join(":");
}

function getExistingAttachmentKey(attachment: GenerateAttachment) {
  const kind = isImageAttachment(attachment)
    ? "image"
    : isVideoAttachment(attachment)
      ? "video"
      : "file";

  return [kind, attachment.name.trim().toLowerCase()].join(":");
}

function buildAttachmentFeedback(
  duplicates: number,
  unsupported: number,
): AttachmentFeedback | null {
  if (duplicates === 0 && unsupported === 0) {
    return null;
  }

  if (duplicates > 0 && unsupported > 0) {
    return {
      message: `Skipped ${duplicates} duplicate and ${unsupported} unsupported attachment${duplicates + unsupported > 1 ? "s" : ""}.`,
      tone: "muted",
    };
  }

  if (duplicates > 0) {
    return {
      message: `Skipped ${duplicates} duplicate attachment${duplicates > 1 ? "s" : ""}.`,
      tone: "muted",
    };
  }

  return {
    message:
      "Unsupported files were ignored. Try images, video, PDF, text, or office files instead.",
    tone: "error",
  };
}

function createFileList(files: File[]) {
  if (typeof DataTransfer === "undefined") {
    return null;
  }

  const dataTransfer = new DataTransfer();

  for (const file of files) {
    dataTransfer.items.add(file);
  }

  return dataTransfer.files;
}

function DuplicateImageModal({
  duplicateCount = 1,
  onOpenChange,
  open,
}: {
  duplicateCount?: number;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  const isPlural = duplicateCount > 1;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="border-transparent bg-transparent p-0 shadow-none sm:max-w-sm"
        showCloseButton={false}
      >
        <HandDrawnFrame
          contentClassName="px-5 py-5"
          surfaceClassName="bg-[color:var(--card)]"
          strokeColor="var(--border)"
          strokeWidthRange={[1.45, 1.45]}
          svgClassName="opacity-70"
          crookedness={0.6}
        >
          <DialogHeader>
            <DialogTitle>
              {isPlural
                ? "Some of these images are already attached."
                : "This image is already attached."}
            </DialogTitle>
            <DialogDescription>
              {isPlural
                ? "Try dropping different images."
                : "Try dropping a different image."}
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4">
            <CartoonButton
              className="w-full justify-center"
              color="var(--success)"
              onClick={() => onOpenChange(false)}
              text="OK"
            />
          </div>
        </HandDrawnFrame>
      </DialogContent>
    </Dialog>
  );
}

function AttachmentChip({
  attachment,
  onRemove,
}: {
  attachment: GenerateAttachment;
  onRemove?: (() => void) | undefined;
}) {
  const isImage = isImageAttachment(attachment);
  const isVideo = isVideoAttachment(attachment);
  const previewKey = isImage ? (attachment.previewUrl ?? "") : "";
  const [previewState, setPreviewState] = React.useState<{
    key: string;
    status: AttachmentPreviewStatus;
  }>(() => ({
    key: previewKey,
    status: isImage ? "loading" : "ready",
  }));
  const visiblePreviewStatus: AttachmentPreviewStatus = isImage
    ? previewState.key === previewKey
      ? previewState.status
      : "loading"
    : "ready";
  const loadingStartedAtRef = React.useRef<number | null>(null);
  const readyTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!isImage) {
      if (readyTimeoutRef.current !== null) {
        window.clearTimeout(readyTimeoutRef.current);
        readyTimeoutRef.current = null;
      }
      return;
    }

    if (readyTimeoutRef.current !== null) {
      window.clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    }

    if (!attachment.previewUrl) {
      return;
    }

    loadingStartedAtRef.current = performance.now();

    return () => {
      if (readyTimeoutRef.current !== null) {
        window.clearTimeout(readyTimeoutRef.current);
        readyTimeoutRef.current = null;
      }
    };
  }, [attachment.previewUrl, isImage]);

  const handlePreviewLoad = React.useCallback(() => {
    const loadingStartedAt = loadingStartedAtRef.current;

    if (loadingStartedAt === null) {
      setPreviewState({ key: previewKey, status: "ready" });
      return;
    }

    const elapsed = performance.now() - loadingStartedAt;
    const remaining = Math.max(0, ATTACHMENT_PREVIEW_MIN_LOADING_MS - elapsed);

    if (remaining === 0) {
      setPreviewState({ key: previewKey, status: "ready" });
      return;
    }

    readyTimeoutRef.current = window.setTimeout(() => {
      readyTimeoutRef.current = null;
      setPreviewState({ key: previewKey, status: "ready" });
    }, remaining);
  }, [previewKey]);

  const handlePreviewError = React.useCallback(() => {
    if (readyTimeoutRef.current !== null) {
      window.clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    }

    setPreviewState({ key: previewKey, status: "error" });
  }, [previewKey]);

  if (isImage) {
    return (
      <div className="relative size-24 shrink-0 overflow-hidden border border-[color:var(--border-soft)] bg-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
        {attachment.previewUrl ? (
          <img
            alt=""
            aria-hidden
            className={cn(
              "size-full object-cover transition duration-300",
              visiblePreviewStatus === "ready"
                ? "scale-100 opacity-100 blur-0"
                : "scale-110 opacity-70 blur-md",
            )}
            onError={handlePreviewError}
            onLoad={handlePreviewLoad}
            src={attachment.previewUrl}
          />
        ) : null}

        {visiblePreviewStatus === "loading" ? (
          <span className="absolute inset-0 grid place-items-center bg-[color:rgba(255,251,244,0.72)]">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </span>
        ) : null}

        {visiblePreviewStatus === "error" ? (
          <span className="absolute inset-0 inline-flex items-center justify-center bg-[color:rgba(255,251,244,0.84)] text-muted-foreground">
            <FileText className="size-4" />
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
        {isVideo ? (
          <Film className="size-3.5" />
        ) : (
          <FileText className="size-3.5" />
        )}
      </span>

      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium text-[color:var(--foreground)]">
          {attachment.name}
        </p>
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
  prompt,
}: GeneratePromptComposerProps) {
  const attachmentsRef = React.useRef<HTMLDivElement | null>(null);
  const footerRef = React.useRef<HTMLDivElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const dragDepthRef = React.useRef(0);
  const [composerHeight, setComposerHeight] = React.useState(
    PROMPT_COMPOSER_MIN_HEIGHT,
  );
  const [feedback, setFeedback] = React.useState<AttachmentFeedback | null>(
    null,
  );
  const [duplicateImageCount, setDuplicateImageCount] = React.useState(0);
  const [isDuplicateImageModalOpen, setIsDuplicateImageModalOpen] =
    React.useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = React.useState(false);
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);
  const [isTextareaOverflowing, setIsTextareaOverflowing] =
    React.useState(false);
  const [textareaHeight, setTextareaHeight] = React.useState(
    PROMPT_TEXTAREA_MIN_HEIGHT,
  );

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
          attachmentsHeight +
            footerHeight +
            PROMPT_TEXTAREA_MAX_HEIGHT_WITH_ATTACHMENTS,
        )
      : PROMPT_COMPOSER_MAX_HEIGHT;
    const maxTextareaHeight = Math.max(
      minTextareaHeight,
      hasAttachments
        ? PROMPT_TEXTAREA_MAX_HEIGHT_WITH_ATTACHMENTS
        : maxComposerHeight - attachmentsHeight - footerHeight,
    );
    const desiredTextareaHeight = Math.max(
      textarea.scrollHeight,
      minTextareaHeight,
    );
    const nextTextareaHeight = Math.min(
      desiredTextareaHeight,
      maxTextareaHeight,
    );
    const nextComposerHeight = Math.min(
      maxComposerHeight,
      Math.max(
        PROMPT_COMPOSER_MIN_HEIGHT,
        attachmentsHeight + footerHeight + nextTextareaHeight,
      ),
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

  const applyIncomingFiles = React.useCallback(
    (incomingFiles: File[], nativeFileList?: FileList | null) => {
      if (incomingFiles.length === 0) return;

      const existingKeys = new Set(attachments.map(getExistingAttachmentKey));
      const nextFiles: File[] = [];
      let duplicateImageTotal = 0;
      let duplicateOtherTotal = 0;
      let unsupportedTotal = 0;

      for (const file of incomingFiles) {
        if (!isSupportedAttachmentFile(file)) {
          unsupportedTotal += 1;
          continue;
        }

        const fileKey = getIncomingAttachmentKey(file);

        if (existingKeys.has(fileKey)) {
          if (isImageFile(file)) {
            duplicateImageTotal += 1;
          } else {
            duplicateOtherTotal += 1;
          }
          continue;
        }

        existingKeys.add(fileKey);
        nextFiles.push(file);
      }

      setFeedback(
        buildAttachmentFeedback(duplicateOtherTotal, unsupportedTotal),
      );
      setDuplicateImageCount(duplicateImageTotal);
      setIsDuplicateImageModalOpen(duplicateImageTotal > 0);
      setIsAttachmentMenuOpen(false);

      if (nextFiles.length === 0 || !onAttachmentsSelected) {
        return;
      }

      if (
        duplicateImageTotal === 0 &&
        duplicateOtherTotal === 0 &&
        unsupportedTotal === 0 &&
        nativeFileList
      ) {
        onAttachmentsSelected(nativeFileList);
        return;
      }

      const filteredFileList = createFileList(nextFiles);

      if (filteredFileList) {
        onAttachmentsSelected(filteredFileList);
      }
    },
    [attachments, onAttachmentsSelected],
  );

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      applyIncomingFiles(Array.from(event.target.files), event.target.files);
    }

    event.target.value = "";
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
    if (!hasDraggedFiles(event.dataTransfer)) {
      setFeedback(null);
      return;
    }

    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDraggingOver(false);

    if (event.dataTransfer.files.length > 0) {
      applyIncomingFiles(Array.from(event.dataTransfer.files));
    }
  };

  const handleAttachmentRemove = React.useCallback(
    (attachmentId: string) => {
      setFeedback(null);
      onRemoveAttachment?.(attachmentId);
    },
    [onRemoveAttachment],
  );

  return (
    <>
      <div className={cn("grid gap-2", className)}>
        <HandDrawnFrame
          className="transition-colors"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          pathClassName={cn(isDraggingOver && "[stroke-dasharray:6_5]")}
          surfaceClassName={cn(
            "bg-[color:color-mix(in_oklab,var(--paper-soft)_90%,white)] transition-colors",
            isDraggingOver &&
              "bg-[color:color-mix(in_oklab,var(--paper-soft)_72%,var(--primary)_28%)]",
          )}
          strokeColor={isDraggingOver ? "var(--primary-edge)" : "var(--border)"}
          strokeWidthRange={[1.25, 1.25]}
          svgClassName="opacity-85"
          crookedness={0.3}
        >
          <div
            className="flex flex-col overflow-hidden"
            style={{
              height: `${composerHeight}px`,
              minHeight: `${PROMPT_COMPOSER_MIN_HEIGHT}px`,
            }}
          >
            {attachments.length > 0 ? (
              <div
                className="shrink-0 flex flex-wrap gap-3 px-4 pb-3 pt-4"
                ref={attachmentsRef}
              >
                {attachments.map((attachment) => (
                  <AttachmentChip
                    attachment={attachment}
                    key={attachment.id}
                    onRemove={
                      onRemoveAttachment
                        ? () => handleAttachmentRemove(attachment.id)
                        : undefined
                    }
                  />
                ))}
              </div>
            ) : null}

            <div className="min-h-0 flex-1 px-4 pb-1">
              <textarea
                className={cn(
                  "scrollbar-hidden w-full resize-none bg-transparent px-0 py-2 text-sm leading-7 text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted-foreground)]",
                  isTextareaOverflowing ? "overflow-y-auto" : "overflow-hidden",
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
              className="flex items-center justify-between gap-3 px-3 pb-3 pt-3"
              ref={footerRef}
            >
              <div>
                <DropdownMenu
                  onOpenChange={setIsAttachmentMenuOpen}
                  open={isAttachmentMenuOpen}
                >
                  <HandDrawnFrame
                    className="inline-flex shrink-0"
                    contentClassName="p-0.5"
                    surfaceClassName="bg-white/45"
                    strokeColor="var(--border-strong)"
                    strokeWidthRange={[1.85, 1.85]}
                    crookedness={0.7}
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
                      className="w-full"
                      contentClassName="grid gap-0.5 px-1.5 py-1.5"
                      surfaceClassName="bg-popover"
                      strokeColor="var(--border)"
                      strokeWidthRange={[1.6, 1.6]}
                      crookedness={0.9}
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
                          <span className="font-medium">
                            Add photos or files
                          </span>
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
                  multiple
                  onChange={handleFileInput}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  type="file"
                />
              </div>

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

        {feedback ? (
          <p
            className={cn(
              "text-xs",
              feedback.tone === "error"
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {feedback.message}
          </p>
        ) : null}
      </div>

      <DuplicateImageModal
        duplicateCount={duplicateImageCount}
        onOpenChange={setIsDuplicateImageModalOpen}
        open={isDuplicateImageModalOpen}
      />
    </>
  );
}

export function GenerateEditorBar({
  aspectRatio,
  aspectRatioOptions,
  attachments,
  className,
  defaultExpanded = false,
  disabled,
  estimateLabel: _estimateLabel,
  isAuthenticated,
  isGenerating,
  mode,
  modeOptions,
  model,
  modelsByBase,
  onAspectRatioChange,
  onAttachmentsSelected,
  onGenerate,
  onModeChange,
  onModelChange,
  onPromptChange,
  onRemoveAttachment,
  prompt,
  selectedModel,
}: GenerateEditorBarProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const dragStartY = React.useRef<number | null>(null);

  const handleGenerate = React.useCallback(() => {
    onGenerate?.();
  }, [onGenerate]);

  const handlePromptKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleGenerate();
      }
    },
    [handleGenerate],
  );

  const handleDragStart = React.useCallback((clientY: number) => {
    dragStartY.current = clientY;
  }, []);

  const handleDragEnd = React.useCallback((clientY: number) => {
    if (dragStartY.current === null) return;

    const delta = dragStartY.current - clientY;
    dragStartY.current = null;

    if (delta > DRAG_THRESHOLD) {
      setIsExpanded(true);
    } else if (delta < -DRAG_THRESHOLD) {
      setIsExpanded(false);
    }
  }, []);

  const handleTouchStart = React.useCallback(
    (event: React.TouchEvent) => {
      const touch = event.touches[0];

      if (!touch) return;

      handleDragStart(touch.clientY);
    },
    [handleDragStart],
  );
  const handleTouchEnd = React.useCallback(
    (event: React.TouchEvent) => {
      const touch = event.changedTouches[0];

      if (!touch) return;

      handleDragEnd(touch.clientY);
    },
    [handleDragEnd],
  );
  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent) => handleDragStart(event.clientY),
    [handleDragStart],
  );
  const handleMouseUp = React.useCallback(
    (event: React.MouseEvent) => handleDragEnd(event.clientY),
    [handleDragEnd],
  );

  const generateDisabled = disabled || isGenerating || !prompt.trim();

  return (
    <div
      className={cn(
        "border-t border-[color:var(--border)] bg-[color:rgba(247,241,229,0.95)] backdrop-blur-md",
        className,
      )}
    >
      <button
        aria-label={isExpanded ? "Collapse editor" : "Expand editor"}
        className="flex w-full cursor-grab touch-none items-center justify-center gap-1 py-2 text-xs text-muted-foreground transition-colors hover:bg-[color:var(--paper-soft)] hover:text-foreground active:cursor-grabbing"
        onClick={() => setIsExpanded((prev) => !prev)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
        type="button"
      >
        <span className="h-1 w-8 bg-[color:var(--border)]" />
        {isExpanded ? (
          <ChevronDown className="size-3.5" />
        ) : (
          <ChevronUp className="size-3.5" />
        )}
      </button>

      {!isExpanded ? (
        <div className="pb-4">
          <div className="flex min-w-0 items-center gap-2">
            <HandDrawnFrame
              className="min-w-0 flex-1"
              surfaceClassName="bg-[color:color-mix(in_oklab,var(--paper-soft)_90%,white)]"
              strokeColor="var(--border)"
              strokeWidthRange={[1.25, 1.25]}
              svgClassName="opacity-85"
              crookedness={0.3}
            >
              <button
                className="flex min-h-11 w-full min-w-0 items-center gap-2 bg-transparent px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-white/40"
                onClick={() => setIsExpanded(true)}
                type="button"
              >
                <Sparkles className="size-4 shrink-0" />
                <span className="truncate">
                  {prompt || "Describe what you want to create..."}
                </span>
              </button>
            </HandDrawnFrame>
            <div className="shrink-0">
              <GenerateButton
                disabled={generateDisabled}
                isAuthenticated={isAuthenticated}
                isGenerating={isGenerating}
                onClick={handleGenerate}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto overscroll-contain pb-2">
          <HandDrawnFrame
            contentClassName="px-4 py-4 md:px-5 md:py-5"
            surfaceClassName="bg-[color:var(--card)]"
            strokeColor="var(--border)"
            strokeWidthRange={[2.1, 2.1]}
            crookedness={0.9}
          >
            <div className="grid gap-4">
              <FormField action={<></>}>
                <GeneratePromptComposer
                  attachments={attachments}
                  onAttachmentsSelected={onAttachmentsSelected}
                  onKeyDown={handlePromptKeyDown}
                  onPromptChange={onPromptChange}
                  onRemoveAttachment={onRemoveAttachment}
                  prompt={prompt}
                />
              </FormField>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid flex-1 gap-3 sm:grid-cols-[auto_auto_auto] sm:items-center sm:justify-start">
                  <div className="w-full sm:w-auto">
                    <GenerateModeToggle
                      onValueChange={onModeChange}
                      options={modeOptions}
                      value={mode}
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <GenerateModelSelect
                      model={model}
                      modelsByBase={modelsByBase}
                      onChange={onModelChange}
                      selectedModel={selectedModel}
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <GenerateAspectRatioSelect
                      onValueChange={onAspectRatioChange}
                      options={aspectRatioOptions}
                      value={aspectRatio}
                    />
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
                  <GenerateButton
                    disabled={generateDisabled}
                    isAuthenticated={isAuthenticated}
                    isGenerating={isGenerating}
                    onClick={handleGenerate}
                  />
                </div>
              </div>

              {isAuthenticated === false ? (
                <NoticeBanner
                  description="You can explore the controls first, then sign in when you're ready to start a job."
                  title="Sign in is required to generate."
                  tone="river"
                />
              ) : null}
            </div>
          </HandDrawnFrame>
        </div>
      )}
    </div>
  );
}
