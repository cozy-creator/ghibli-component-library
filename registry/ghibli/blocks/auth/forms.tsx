import * as React from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { FormField } from "@/components/blocks/form/form-field";
import { NoticeBanner } from "@/components/blocks/feedback/notice-banner";
import { CartoonButton } from "@/components/ui/cartoon-button";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn, focusRingClass } from "@/lib/utils";

interface BaseAuthFormProps {
  className?: string;
  error?: string;
  helperText?: string;
  submitting?: boolean;
  title?: string;
}

interface AuthProviderAction {
  icon?: React.ReactNode;
  id: string;
  label: string;
  onSelect?: () => void;
}

export interface LoginFormProps extends BaseAuthFormProps {
  email: string;
  onEmailChange: (value: string) => void;
  onForgotPassword?: () => void;
  onPasswordChange: (value: string) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  password: string;
  providerActions?: AuthProviderAction[];
}

export function LoginForm({
  className,
  email,
  error,
  helperText,
  onEmailChange,
  onForgotPassword: _onForgotPassword,
  onPasswordChange,
  onSubmit,
  password,
  providerActions = [],
  submitting,
  title
}: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form className={cn("grid gap-4", className)} onSubmit={onSubmit}>
      {title || helperText ? (
        <div className="grid gap-1">
          {title ? (
            <h3 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
              {title}
            </h3>
          ) : null}
          {helperText ? (
            <p className="text-sm leading-7 text-muted-foreground">{helperText}</p>
          ) : null}
        </div>
      ) : null}

      <FormField>
        <Input
          autoComplete="email"
          id="login-email"
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          value={email}
        />
      </FormField>

      <FormField>
        <div className="relative">
          <Input
            autoComplete="current-password"
            className="pr-10"
            id="login-password"
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            className="absolute right-3 top-1/2 z-30 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword((previous) => !previous)}
            type="button"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </FormField>

      {error ? (
        <NoticeBanner
          description={error}
          title="We couldn’t sign you in just yet."
          tone="rose"
        />
      ) : null}

      <CartoonButton
        className="w-full"
        color="var(--success)"
        disabled={submitting}
        loading={Boolean(submitting)}
        loadingText="Signing in..."
        text="Sign in"
        type="submit"
      />

      {providerActions.length > 0 ? (
        <div className="grid gap-3 pt-1">
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Other ways to sign in
            </span>
            <Separator className="flex-1" />
          </div>
          <div className="ghibli-auth-provider-grid grid gap-2">
            {providerActions.map((provider) => (
              <AuthProviderButton key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}

export interface RegisterFormProps extends BaseAuthFormProps {
  confirmPassword: string;
  email: string;
  name: string;
  onConfirmPasswordChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  password: string;
  providerActions?: AuthProviderAction[];
}

export function RegisterForm({
  className,
  confirmPassword,
  email,
  error,
  helperText,
  name,
  onConfirmPasswordChange,
  onEmailChange,
  onNameChange,
  onPasswordChange,
  onSubmit,
  password,
  providerActions = [],
  submitting,
  title
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const maxUsernameLength = 20;

  return (
    <form className={cn("grid gap-4", className)} onSubmit={onSubmit}>
      {title || helperText ? (
        <div className="grid gap-1">
          {title ? (
            <h3 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
              {title}
            </h3>
          ) : null}
          {helperText ? (
            <p className="text-sm leading-7 text-muted-foreground">{helperText}</p>
          ) : null}
        </div>
      ) : null}

      <FormField>
        <div className="relative">
          <Input
            className="pr-14"
            id="register-name"
            maxLength={maxUsernameLength}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="yourname"
            value={name}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
            {name.length}/{maxUsernameLength}
          </span>
        </div>
      </FormField>

      <FormField>
        <Input
          autoComplete="email"
          id="register-email"
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          type="email"
          value={email}
        />
      </FormField>

      <FormField>
        <div className="relative">
          <Input
            autoComplete="new-password"
            className="pr-10"
            id="register-password"
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Min. 8 characters"
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            className="absolute right-3 top-1/2 z-30 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword((previous) => !previous)}
            type="button"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </FormField>

      <FormField>
        <div className="relative">
          <Input
            autoComplete="new-password"
            className="pr-10"
            id="register-confirm-password"
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            placeholder="••••••••"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
          />
          <button
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            className="absolute right-3 top-1/2 z-30 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowConfirmPassword((previous) => !previous)}
            type="button"
          >
            {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </FormField>

      {error ? (
        <NoticeBanner
          description={error}
          title="Registration couldn’t be completed."
          tone="rose"
        />
      ) : null}

      <CartoonButton
        className="w-full"
        color="var(--success)"
        disabled={submitting}
        loading={Boolean(submitting)}
        loadingText="Creating account..."
        text="Create account"
        type="submit"
      />

      {providerActions.length > 0 ? (
        <div className="grid gap-3 pt-1">
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Other ways to register
            </span>
            <Separator className="flex-1" />
          </div>
          <div className="ghibli-auth-provider-grid grid gap-2">
            {providerActions.map((provider) => (
              <AuthProviderButton key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}

export interface ForgotPasswordFormProps extends BaseAuthFormProps {
  email: string;
  message?: string;
  onBack?: () => void;
  onEmailChange: (value: string) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ForgotPasswordForm({
  className,
  email,
  error,
  helperText = "Collect one address and keep the rest of the flow calm.",
  message,
  onBack,
  onEmailChange,
  onSubmit,
  submitting,
  title = "Reset password"
}: ForgotPasswordFormProps) {
  return (
    <form className={cn("grid gap-4", className)} onSubmit={onSubmit}>
      <div className="grid gap-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">{title}</h3>
          {onBack ? (
            <ButtonLike onBack={onBack} />
          ) : null}
        </div>
        <p className="text-sm leading-7 text-muted-foreground">{helperText}</p>
      </div>

      <FormField htmlFor="forgot-password-email" label="Email">
        <Input
          autoComplete="email"
          id="forgot-password-email"
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          type="email"
          value={email}
        />
      </FormField>

      {error ? (
        <NoticeBanner
          description={error}
          title="We couldn’t send the reset link."
          tone="rose"
        />
      ) : null}
      {message ? (
        <NoticeBanner
          description={message}
          title="Check your email"
          tone="meadow"
        />
      ) : null}

      <CartoonButton
        className="w-full"
        color="#7b9d68"
        disabled={submitting}
        loading={Boolean(submitting)}
        loadingText="Sending..."
        text="Send reset link"
        type="submit"
      />
    </form>
  );
}

function ButtonLike({ onBack }: { onBack: () => void }) {
  return (
    <button
      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      onClick={onBack}
      type="button"
    >
      <ArrowLeft className="size-4" />
      Back
    </button>
  );
}

function AuthProviderButton({ provider }: { provider: AuthProviderAction }) {
  const disabled = !provider.onSelect;

  return (
    <HandDrawnFrame
      className={cn(
        "group/auth-provider-frame w-full transition-colors",
        disabled && "opacity-60"
      )}
      surfaceClassName={cn(
        "bg-[color:var(--paper-soft)]",
        !disabled && "group-hover/auth-provider-frame:bg-white/50"
      )}
      strokeColor="var(--border)"
      strokeWidth={1.05}
      svgClassName="opacity-80"
      crookednessIntensity={0.3}
    >
      <button
        className={cn(
          "flex w-full items-center justify-center gap-2 px-3 py-2 text-sm text-[color:var(--foreground)]",
          focusRingClass,
          disabled && "cursor-not-allowed"
        )}
        disabled={disabled}
        onClick={() => provider.onSelect?.()}
        type="button"
      >
        {provider.icon}
        {provider.label}
      </button>
    </HandDrawnFrame>
  );
}
