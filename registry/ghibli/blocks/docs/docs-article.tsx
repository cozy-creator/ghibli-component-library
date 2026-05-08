import * as React from "react";
import { Check, Copy } from "lucide-react";

import {
  cn,
  copyTextToClipboard,
  docsCodeBlockButtonClass,
  docsCodeBlockHeaderClass,
  docsCodeBlockOverlayClass,
  docsCodeBlockPreClass,
  docsCodeBlockSurfaceClass,
  paperSurfaceClass,
} from "@/lib/utils";

interface DocsArticleProps {
  children: React.ReactNode;
  className?: string;
}

export function DocsArticle({ children, className }: DocsArticleProps) {
  return (
    <article
      className={cn(
        paperSurfaceClass,
        "overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.28),transparent_18rem),color-mix(in_oklab,var(--paper)_99%,white)] p-6 md:p-8",
        className
      )}
    >
      <div className="max-w-none text-[color:var(--card-foreground)] leading-[1.85] [&_a]:text-[color:var(--ink-strong)] [&_a]:underline [&_a]:decoration-[color-mix(in_oklab,var(--accent)_50%,transparent)] [&_a]:underline-offset-[0.24em] [&_code]:inline-flex [&_code]:items-center [&_code]:border [&_code]:border-[color:var(--border)] [&_code]:bg-[rgba(255,255,255,0.45)] [&_code]:px-[0.55rem] [&_code]:py-[0.12rem] [&_code]:font-mono [&_code]:text-[0.82em] [&_code]:text-[color:var(--ink-strong)]">
        {children}
      </div>
    </article>
  );
}

export function DocsH2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "mb-3 mt-10 border-b border-[color:var(--border)] pb-3 font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)] first:mt-0",
        className
      )}
      {...props}
    />
  );
}

export function DocsH3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "mb-2 mt-8 font-[var(--font-heading)] text-2xl text-[color:var(--ink-strong)]",
        className
      )}
      {...props}
    />
  );
}

export function DocsParagraph({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("mb-4 text-sm leading-8 text-muted-foreground", className)} {...props} />;
}

export function DocsList({
  children,
  className,
  ordered = false
}: {
  children: React.ReactNode;
  className?: string;
  ordered?: boolean;
}) {
  const Comp = ordered ? "ol" : "ul";

  return (
    <Comp
      className={cn(
        "mb-5 space-y-2 pl-5 text-sm leading-8 text-muted-foreground",
        ordered ? "list-decimal" : "list-disc",
        className
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
    <div
      className={cn(
        "mb-5 border border-[color:var(--meadow-border)] bg-[color:rgba(223,234,214,0.72)] px-4 py-3 text-sm leading-7 text-[color:var(--meadow-ink)]",
        className
      )}
      {...props}
    />
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
