import * as React from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { FormField } from "@/components/blocks/form/form-field";
import { NoticeBanner } from "@/components/blocks/feedback/notice-banner";
import { CartoonButton } from "@/components/ui/cartoon-button";
import { Input } from "@/components/ui/input";

interface BaseAuthFormProps {
  className?: string;
  error?: string;
  helperText?: string;
  submitting?: boolean;
  title?: string;
}

export interface LoginFormProps extends BaseAuthFormProps {
  email: string;
  onEmailChange: (value: string) => void;
  onForgotPassword?: () => void;
  onPasswordChange: (value: string) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  password: string;
}

export function LoginForm({
  className,
  email,
  error,
  helperText = "Use this form inside dialogs, sidebars, or full-page auth screens.",
  onEmailChange,
  onForgotPassword,
  onPasswordChange,
  onSubmit,
  password,
  submitting,
  title = "Sign in"
}: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form className={className ? `${className} space-y-4` : "space-y-4"} onSubmit={onSubmit}>
      <div className="space-y-1">
        <h3 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">{title}</h3>
        <p className="text-sm leading-7 text-muted-foreground">{helperText}</p>
      </div>

      <FormField htmlFor="login-email" label="Email or username">
        <Input
          autoComplete="email"
          id="login-email"
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          value={email}
        />
      </FormField>

      <FormField
        action={
          onForgotPassword ? (
            <button
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
              onClick={onForgotPassword}
              type="button"
            >
              Forgot password?
            </button>
          ) : undefined
        }
        htmlFor="login-password"
        label="Password"
      >
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
        color="#7b9d68"
        disabled={submitting}
        loading={Boolean(submitting)}
        loadingText="Signing in..."
        text="Sign in"
        type="submit"
      />
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
}

export function RegisterForm({
  className,
  confirmPassword,
  email,
  error,
  helperText = "Create a soft, welcoming entry point for new users.",
  name,
  onConfirmPasswordChange,
  onEmailChange,
  onNameChange,
  onPasswordChange,
  onSubmit,
  password,
  submitting,
  title = "Create account"
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <form className={className ? `${className} space-y-4` : "space-y-4"} onSubmit={onSubmit}>
      <div className="space-y-1">
        <h3 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">{title}</h3>
        <p className="text-sm leading-7 text-muted-foreground">{helperText}</p>
      </div>

      <FormField htmlFor="register-name" label="Display name">
        <Input
          id="register-name"
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Melina"
          value={name}
        />
      </FormField>

      <FormField htmlFor="register-email" label="Email">
        <Input
          autoComplete="email"
          id="register-email"
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          type="email"
          value={email}
        />
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField htmlFor="register-password" label="Password">
          <div className="relative">
            <Input
              autoComplete="new-password"
              className="pr-10"
              id="register-password"
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Choose a passphrase"
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

        <FormField htmlFor="register-confirm-password" label="Confirm password">
          <div className="relative">
            <Input
              autoComplete="new-password"
              className="pr-10"
              id="register-confirm-password"
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
              placeholder="Repeat password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
            />
            <button
              className="absolute right-3 top-1/2 z-30 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirmPassword((previous) => !previous)}
              type="button"
            >
              {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </FormField>
      </div>

      {error ? (
        <NoticeBanner
          description={error}
          title="Registration couldn’t be completed."
          tone="rose"
        />
      ) : null}

      <CartoonButton
        className="w-full"
        color="#7b9d68"
        disabled={submitting}
        loading={Boolean(submitting)}
        loadingText="Creating account..."
        text="Create account"
        type="submit"
      />
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
    <form className={className ? `${className} space-y-4` : "space-y-4"} onSubmit={onSubmit}>
      <div className="space-y-1">
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
