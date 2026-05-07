import * as React from "react";

import { Button } from "@/components/ui/button";
import { CartoonButton } from "@/components/ui/cartoon-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import {
  normalizeAvailableThemeId,
  THEME_OPTIONS,
  useTheme,
  type ThemeOptionId,
} from "@/lib/theme";

import { ThemeOptionCard } from "./theme-option-card";

const GRID_COLUMNS = 2;

export interface ChangeThemeModalProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function ChangeThemeModal({
  onOpenChange,
  open,
}: ChangeThemeModalProps) {
  const { setTheme, theme } = useTheme();
  const [pendingThemeId, setPendingThemeId] = React.useState<ThemeOptionId>(
    normalizeAvailableThemeId(theme),
  );
  const cardRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  React.useEffect(() => {
    if (open) {
      setPendingThemeId(normalizeAvailableThemeId(theme));
    }
  }, [open, theme]);

  const availableIndexes = React.useMemo(
    () =>
      THEME_OPTIONS.reduce<number[]>((accumulator, option, index) => {
        if (option.available) {
          accumulator.push(index);
        }
        return accumulator;
      }, []),
    [],
  );

  const tabStopThemeId = React.useMemo(() => {
    const pendingIndex = THEME_OPTIONS.findIndex(
      (option) => option.id === pendingThemeId,
    );
    if (pendingIndex >= 0 && THEME_OPTIONS[pendingIndex]?.available) {
      return pendingThemeId;
    }
    const firstAvailable = THEME_OPTIONS.find((option) => option.available);
    return firstAvailable?.id ?? pendingThemeId;
  }, [pendingThemeId]);

  const focusCardAt = React.useCallback((index: number) => {
    const node = cardRefs.current[index];
    node?.focus();
  }, []);

  const moveFocus = React.useCallback(
    (currentIndex: number, delta: number) => {
      if (availableIndexes.length === 0) {
        return;
      }
      const currentAvailableIndex = availableIndexes.indexOf(currentIndex);
      const nextAvailableIndex =
        currentAvailableIndex < 0
          ? 0
          : (currentAvailableIndex + delta + availableIndexes.length) %
            availableIndexes.length;
      const targetIndex = availableIndexes[nextAvailableIndex];
      if (typeof targetIndex === "number") {
        focusCardAt(targetIndex);
      }
    },
    [availableIndexes, focusCardAt],
  );

  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveFocus(index, event.key === "ArrowDown" ? GRID_COLUMNS : 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveFocus(index, event.key === "ArrowUp" ? -GRID_COLUMNS : -1);
        break;
      case "Home":
        event.preventDefault();
        if (availableIndexes[0] !== undefined) {
          focusCardAt(availableIndexes[0]);
        }
        break;
      case "End": {
        event.preventDefault();
        const last = availableIndexes[availableIndexes.length - 1];
        if (last !== undefined) {
          focusCardAt(last);
        }
        break;
      }
      case " ":
      case "Enter": {
        const option = THEME_OPTIONS[index];
        if (option?.available) {
          event.preventDefault();
          setPendingThemeId(option.id);
        }
        break;
      }
      default:
        break;
    }
  };

  const handleApplyTheme = () => {
    setTheme(pendingThemeId);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="border-transparent bg-transparent p-0 shadow-none sm:max-w-[30rem]"
        showCloseButton={false}
      >
        <HandDrawnFrame
          contentClassName="px-5 py-5"
          crookedness={0.6}
          strokeColor="var(--border)"
          strokeWidth={1.45}
          surfaceClassName="bg-[color:var(--card)]"
          svgClassName="opacity-70"
        >
          <DialogHeader className="pr-10">
            <DialogTitle>Change Theme</DialogTitle>
            <DialogDescription className="sr-only">
              Select a visual theme preview and apply it. Unavailable themes are
              shown for preview only.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div
              aria-label="Theme options"
              className="grid grid-cols-2 gap-3"
              role="radiogroup"
            >
              {THEME_OPTIONS.map((option, index) => {
                const selected = option.id === pendingThemeId;
                return (
                  <ThemeOptionCard
                    key={option.id}
                    onKeyDown={(event) => handleCardKeyDown(event, index)}
                    onSelect={(themeId) => setPendingThemeId(themeId)}
                    option={option}
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                    selected={selected}
                    tabIndex={option.id === tabStopThemeId ? 0 : -1}
                  />
                );
              })}
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <CartoonButton
                className="min-w-[9.5rem] justify-center"
                color="var(--success)"
                onClick={handleApplyTheme}
                size="sm"
                text="Apply Theme"
              />
              <Button
                onClick={() => onOpenChange(false)}
                size="sm"
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </div>
        </HandDrawnFrame>
      </DialogContent>
    </Dialog>
  );
}
