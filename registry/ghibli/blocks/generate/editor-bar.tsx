import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
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
    <div
      className={cn(
        "rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:rgba(252,247,237,0.94)] p-4 shadow-[var(--shadow-paper)] backdrop-blur-sm",
        className
      )}
    >
      <div className="grid gap-3">
        <Textarea
          className="min-h-24"
          onChange={(event) => onPromptChange?.(event.target.value)}
          placeholder="Describe the mood, lighting, and story beats you want to generate..."
          value={prompt}
        />
        <div className="flex flex-wrap items-center gap-3">
          <GenerateModeToggle onValueChange={onModeChange} options={modeOptions} value={mode} />
          <GenerateModelSelect onValueChange={onModelChange} options={modelOptions} value={model} />
          <GenerateAspectRatioSelect
            onValueChange={onAspectRatioChange}
            options={aspectRatioOptions}
            value={aspectRatio}
          />
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
          <div className="flex-1" />
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
  );
}
