import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import {
  cn,
  copyTextToClipboard,
  docsCodeBlockButtonClass,
  docsCodeBlockHeaderClass,
  docsCodeBlockOverlayClass,
  docsCodeBlockPreClass,
  docsCodeBlockSurfaceClass,
} from "@ghibli/ui";

import type { SourceSnippet } from "@/apps/web/src/data/library-docs";

export interface CodeBlockProps {
  snippet: SourceSnippet;
}

export function CodeBlock({ snippet }: CodeBlockProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const scheduleReset = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopyState("idle");
      resetTimerRef.current = null;
    }, 1800);
  };

  const handleCopy = async () => {
    const copied = await copyTextToClipboard(snippet.code);
    setCopyState(copied ? "copied" : "error");
    scheduleReset();
  };

  return (
    <div className={docsCodeBlockSurfaceClass}>
      <div aria-hidden="true" className={docsCodeBlockOverlayClass} />
      <div className={cn(docsCodeBlockHeaderClass, "gap-4 pl-4 pr-3")}>
        <div className="min-w-0">
          <div className="truncate font-[var(--font-heading)] text-lg leading-tight text-[color:var(--theme-docs-code-foreground)]">
            {snippet.title}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden rounded-full border border-[color:var(--theme-docs-code-button-border)] bg-[color:var(--theme-docs-code-button-background)] px-2 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[color:var(--theme-docs-code-button-foreground)] sm:inline-flex">
            {snippet.language}
          </span>
          <button
            aria-label={
              copyState === "copied"
                ? "Copied code block"
                : copyState === "error"
                  ? "Retry copy"
                  : "Copy code block"
            }
            className={docsCodeBlockButtonClass}
            onClick={() => void handleCopy()}
            type="button"
          >
            {copyState === "copied" ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copyState === "copied"
              ? "Copied"
              : copyState === "error"
                ? "Retry"
                : "Copy"}
          </button>
        </div>
      </div>
      <pre className={docsCodeBlockPreClass}>
        <code className="relative block min-w-full">{snippet.code}</code>
      </pre>
    </div>
  );
}
