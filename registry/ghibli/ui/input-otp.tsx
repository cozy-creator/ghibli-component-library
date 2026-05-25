import * as React from "react";
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp";

import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { cn } from "@/lib/utils";

export function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput>) {
  return (
    <OTPInput
      className={cn("disabled:cursor-not-allowed", className)}
      containerClassName={cn(
        "flex items-center gap-1.5 has-disabled:opacity-60 sm:gap-2",
        containerClassName,
      )}
      data-slot="input-otp"
      {...props}
    />
  );
}

export function InputOTPGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-1.5 sm:gap-2", className)}
      data-slot="input-otp-group"
      {...props}
    />
  );
}

export function InputOTPSlot({
  className,
  index,
  ...props
}: React.ComponentProps<"div"> & { index: number }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const slot = inputOTPContext?.slots[index];

  return (
    <HandDrawnFrame
      className={cn(
        "relative size-10 shrink-0 text-[color:var(--foreground)] sm:size-11",
        slot?.isActive && "text-[color:var(--ink-strong)]",
        className,
      )}
      contentClassName="flex size-full items-center justify-center p-0 text-lg font-semibold tabular-nums sm:text-xl"
      data-active={slot?.isActive}
      data-slot="input-otp-slot"
      strokeColor={
        slot?.isActive ? "var(--ring)" : "var(--border)"
      }
      strokeWidthRange={slot?.isActive ? [1.7, 1.7] : [1.25, 1.25]}
      surfaceClassName="bg-[color:color-mix(in_oklab,var(--paper-soft)_90%,white)]"
      svgClassName="opacity-85"
      crookedness={0.3}
      {...props}
    >
      {slot?.char}
      {slot?.hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-pulse bg-[color:var(--ink-strong)]" />
        </div>
      ) : null}
    </HandDrawnFrame>
  );
}

export function normalizeOneTimeCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

export { REGEXP_ONLY_DIGITS };
