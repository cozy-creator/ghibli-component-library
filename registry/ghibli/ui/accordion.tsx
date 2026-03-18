import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn, focusRingClass } from "@/lib/utils";

type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  toggleItem: (itemValue: string) => void;
  type: AccordionType;
  value: string | string[] | undefined;
}

interface AccordionItemContextValue {
  disabled?: boolean | undefined;
  open: boolean;
  value: string;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean;
  defaultValue?: string | string[] | undefined;
  onValueChange?: ((value: string | string[]) => void) | undefined;
  type?: AccordionType;
  value?: string | string[] | undefined;
}

export function Accordion({
  children,
  className,
  collapsible = true,
  defaultValue,
  onValueChange,
  type = "single",
  value,
  ...props
}: AccordionProps) {
  const fallbackValue = defaultValue ?? (type === "multiple" ? [] : "");
  const [currentValue, setCurrentValue] = React.useState<string | string[]>(
    value ?? fallbackValue
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      if (type === "multiple") {
        const nextValue = Array.isArray(currentValue)
          ? currentValue.includes(itemValue)
            ? currentValue.filter((valueItem) => valueItem !== itemValue)
            : [...currentValue, itemValue]
          : [itemValue];

        if (value === undefined) {
          setCurrentValue(nextValue);
        }

        onValueChange?.(nextValue);
        return;
      }

      const nextValue = currentValue === itemValue ? (collapsible ? "" : itemValue) : itemValue;

      if (value === undefined) {
        setCurrentValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [collapsible, currentValue, onValueChange, type, value]
  );

  return (
    <AccordionContext.Provider value={{ toggleItem, type, value: currentValue }}>
      <div className={cn("grid gap-2", className)} data-slot="accordion" {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  children,
  className,
  disabled,
  value,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
  value: string;
}) {
  const context = React.useContext(AccordionContext);

  if (!context) {
    throw new Error("AccordionItem must be used inside Accordion.");
  }

  const open =
    context.type === "multiple"
      ? Array.isArray(context.value) && context.value.includes(value)
      : context.value === value;

  return (
    <AccordionItemContext.Provider value={{ disabled, open, value }}>
      <div
        className={cn(
          "rounded-[calc(var(--radius)-0.2rem)] border border-[color:var(--border)] bg-white/35 px-4",
          className
        )}
        data-slot="accordion-item"
        data-state={open ? "open" : "closed"}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const accordionContext = React.useContext(AccordionContext);
  const itemContext = React.useContext(AccordionItemContext);

  if (!accordionContext || !itemContext) {
    throw new Error("AccordionTrigger must be used inside AccordionItem.");
  }

  return (
    <button
      className={cn(
        "flex w-full items-center justify-between gap-3 py-4 text-left text-sm font-medium text-[color:var(--ink-strong)] transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        focusRingClass,
        className
      )}
      data-slot="accordion-trigger"
      disabled={itemContext.disabled}
      onClick={(event) => {
        props.onClick?.(event);

        if (event.defaultPrevented || itemContext.disabled) {
          return;
        }

        accordionContext.toggleItem(itemContext.value);
      }}
      type="button"
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn("size-4 transition-transform", itemContext.open && "rotate-180")}
      />
    </button>
  );
}

export function AccordionContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const itemContext = React.useContext(AccordionItemContext);

  if (!itemContext) {
    throw new Error("AccordionContent must be used inside AccordionItem.");
  }

  return (
    <div
      className={cn(
        "grid overflow-hidden text-sm text-[color:var(--muted-foreground)] transition-all",
        itemContext.open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]",
        className
      )}
      data-slot="accordion-content"
      {...props}
    >
      <div className="min-h-0 overflow-hidden leading-7">{children}</div>
    </div>
  );
}
