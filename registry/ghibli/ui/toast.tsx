import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn, focusRingClass } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface ToastOptions {
  description?: string;
  duration?: number;
  title?: string;
}

interface ToastEventDetail extends ToastOptions {
  variant: ToastVariant;
}

interface ToastItem extends ToastEventDetail {
  id: number;
}

const TOAST_EVENT = "ghibli.toast";
const DEFAULT_DURATION_MS = 5000;
const MAX_VISIBLE_TOASTS = 4;

let nextToastID = 0;

function notify(
  variant: ToastVariant,
  message: string,
  options: Omit<ToastOptions, "description"> = {},
) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<ToastEventDetail>(TOAST_EVENT, {
      detail: {
        ...options,
        description: message,
        variant,
      },
    }),
  );
}

export const toast = {
  error: (message: string, options?: Omit<ToastOptions, "description">) =>
    notify("error", message, options),
  info: (message: string, options?: Omit<ToastOptions, "description">) =>
    notify("info", message, options),
  success: (message: string, options?: Omit<ToastOptions, "description">) =>
    notify("success", message, options),
};

const toastVariantClass: Record<ToastVariant, string> = {
  error:
    "border-[color:var(--destructive-soft-border)] bg-[color:color-mix(in_oklab,var(--card)_82%,var(--destructive)_18%)]",
  info: "border-[color:var(--border)] bg-[color:var(--card)]",
  success:
    "border-[color:color-mix(in_oklab,var(--success)_52%,var(--border))] bg-[color:color-mix(in_oklab,var(--card)_86%,var(--success)_14%)]",
};

function useToastItems() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timeoutIDsRef = useRef<number[]>([]);

  useEffect(() => {
    const dismiss = (id: number) => {
      setItems((current) => current.filter((item) => item.id !== id));
    };

    const handleToast = (event: Event) => {
      const { detail } = event as CustomEvent<ToastEventDetail>;
      if (!detail?.description) return;

      const id = nextToastID + 1;
      nextToastID = id;

      setItems((current) =>
        [...current, { ...detail, id }].slice(-MAX_VISIBLE_TOASTS),
      );

      const duration = detail.duration ?? DEFAULT_DURATION_MS;
      if (duration > 0) {
        const timeoutID = window.setTimeout(() => dismiss(id), duration);
        timeoutIDsRef.current.push(timeoutID);
      }
    };

    window.addEventListener(TOAST_EVENT, handleToast);

    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
      timeoutIDsRef.current.forEach((timeoutID) =>
        window.clearTimeout(timeoutID),
      );
      timeoutIDsRef.current = [];
    };
  }, []);

  return [items, setItems] as const;
}

function ToastViewport({ className }: { className?: string }) {
  const [items, setItems] = useToastItems();

  // Always mounted: a screen reader announces changes to a live region it already knows, so one added with its first toast says nothing.
  return (
    <div
      aria-live="polite"
      aria-relevant="additions removals"
      className={cn("pointer-events-none flex flex-col gap-2", className)}
    >
      {items.map((item) => (
        <div
          className={cn(
            "pointer-events-auto grid grid-cols-[1fr_auto] gap-3 border px-4 py-3 text-[color:var(--foreground)] shadow-[var(--theme-dialog-shadow)]",
            toastVariantClass[item.variant],
          )}
          key={item.id}
          role={item.variant === "error" ? "alert" : "status"}
        >
          <div className="grid min-w-0 gap-1">
            {item.title ? (
              <div className="text-sm font-semibold text-[color:var(--foreground)]">
                {item.title}
              </div>
            ) : null}
            <p className="text-sm leading-6 text-[color:color-mix(in_oklab,var(--foreground)_85%,transparent)]">
              {item.description}
            </p>
          </div>
          <button
            aria-label="Dismiss notification"
            className={cn(
              "inline-flex size-7 items-center justify-center text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]",
              focusRingClass,
            )}
            onClick={() =>
              setItems((current) =>
                current.filter((toastItem) => toastItem.id !== item.id),
              )
            }
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function Toaster() {
  if (typeof document === "undefined") return null;

  return createPortal(
    <ToastViewport
      className="toast-viewport fixed left-1/2 top-4 z-[var(--z-toast)] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 sm:left-auto sm:right-6 sm:top-6 sm:w-[calc(100vw-3rem)] sm:translate-x-0"
    />,
    document.body,
  );
}
