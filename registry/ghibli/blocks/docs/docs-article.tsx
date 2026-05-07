import * as React from "react";
import { Check, Copy } from "lucide-react";

import {
  HandDrawnFrame,
  HandDrawnRule,
} from "@/components/ui/hand-drawn-frame";
import {
  cn,
  copyTextToClipboard,
  docsCodeBlockButtonClass,
  docsCodeBlockHeaderClass,
  docsCodeBlockOverlayClass,
  docsCodeBlockPreClass,
  docsCodeBlockSurfaceClass,
} from "@/lib/utils";

interface DocsArticleProps {
  children: React.ReactNode;
  className?: string;
}

export function DocsArticle({ children, className }: DocsArticleProps) {
  return (
    <HandDrawnFrame
      className={cn("w-full", className)}
      contentClassName="px-5 pb-8 pt-14 sm:px-6 sm:pb-8 sm:pt-9 md:px-8 md:pb-8 md:pt-12 lg:pt-14"
      surfaceClassName="bg-[color:var(--theme-docs-article-background)]"
      strokeColor="var(--theme-docs-article-border)"
      strokeWidth={1.6}
      svgClassName="opacity-90"
      crookednessIntensity={0.6}
    >
      <article className="ghibli-prose max-w-none">{children}</article>
    </HandDrawnFrame>
  );
}

export function DocsH2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div className="relative mb-3 mt-10 pb-3 first:mt-0">
      <h2
        className={cn(
          "mb-3 font-[var(--font-heading)] text-3xl text-[color:var(--theme-docs-heading-foreground)]",
          className,
        )}
        {...props}
      />
      <HandDrawnRule
        className="absolute inset-x-0 bottom-0 h-3"
        strokeColor="var(--theme-docs-rule)"
        strokeWidth={1.1}
        svgClassName="opacity-85"
      />
    </div>
  );
}

export function DocsH3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "mb-2 mt-8 font-[var(--font-heading)] text-2xl text-[color:var(--theme-docs-heading-foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export function DocsParagraph({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mb-4 text-sm leading-6 text-[color:var(--theme-docs-body-foreground)] sm:leading-7 md:leading-8",
        className,
      )}
      {...props}
    />
  );
}

export function DocsList({
  children,
  className,
  ordered = false,
}: {
  children: React.ReactNode;
  className?: string;
  ordered?: boolean;
}) {
  const Comp = ordered ? "ol" : "ul";

  return (
    <Comp
      className={cn(
        "mb-5 space-y-2 pl-5 text-sm leading-6 text-[color:var(--theme-docs-body-foreground)] sm:leading-7 md:leading-8",
        ordered ? "list-decimal" : "list-disc",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export function DocsCallout({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <HandDrawnFrame
      className="mb-5"
      contentClassName={cn(
        "px-4 py-3 text-sm leading-7 text-[color:var(--theme-docs-callout-foreground)]",
        className,
      )}
      surfaceClassName="bg-[color:var(--theme-docs-callout-background)]"
      strokeColor="var(--theme-docs-callout-border)"
      strokeWidth={1.2}
      crookednessIntensity={0.4}
    >
      <div className="border-none" {...props} />
    </HandDrawnFrame>
  );
}

export function DocsCodeBlock({
  children,
  className,
  codeText,
  ...props
}: React.ComponentProps<"pre"> & {
  codeText?: string;
}) {
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "error">(
    "idle",
  );
  const resetTimerRef = React.useRef<number | null>(null);
  const resolvedCodeText =
    codeText ?? (typeof children === "string" ? children : undefined);

  React.useEffect(() => {
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
    if (!resolvedCodeText) {
      return;
    }

    const copied = await copyTextToClipboard(resolvedCodeText);
    setCopyState(copied ? "copied" : "error");
    scheduleReset();
  };

  return (
    <div className={cn("mb-5", docsCodeBlockSurfaceClass, className)}>
      <span aria-hidden="true" className={docsCodeBlockOverlayClass} />

      {resolvedCodeText ? (
        <div className={docsCodeBlockHeaderClass}>
          <div className="min-w-0 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[color:var(--theme-docs-code-button-foreground)]">
            Code
          </div>
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
      ) : null}

      <pre className={docsCodeBlockPreClass} {...props}>
        <code className="relative block min-w-full">{children}</code>
      </pre>
    </div>
  );
}

export function DocsTable({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("mb-5 overflow-x-auto", className)} {...props} />;
}
