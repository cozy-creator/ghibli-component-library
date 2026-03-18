import * as React from "react";
import { ArrowLeft, KeyRound, Lock, Mail, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function Field({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("grid gap-2", className)}>{children}</div>;
}

function FieldLabel({
  children,
  icon: Icon
}: {
  children: React.ReactNode;
  icon: typeof Mail;
}) {
  return (
    <Label className="gap-2">
      <Icon className="size-4 text-[color:var(--muted-foreground)]" />
      {children}
    </Label>
  );
}

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
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{helperText}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <Field>
            <FieldLabel icon={Mail}>Email</FieldLabel>
            <Input
              autoComplete="email"
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="melina@ghibli-ui.dev"
              type="email"
              value={email}
            />
          </Field>
          <Field>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel icon={Lock}>Password</FieldLabel>
              {onForgotPassword ? (
                <button
                  className="text-xs text-[color:var(--muted-foreground)] underline-offset-4 hover:text-[color:var(--ink-strong)] hover:underline"
                  onClick={(event) => {
                    event.preventDefault();
                    onForgotPassword();
                  }}
                  type="button"
                >
                  Forgot password?
                </button>
              ) : null}
            </div>
            <Input
              autoComplete="current-password"
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Your passphrase"
              type="password"
              value={password}
            />
          </Field>
          {error ? (
            <p className="rounded-[calc(var(--radius)-0.35rem)] border border-[color:var(--danger-edge)] bg-[color:rgba(202,117,93,0.16)] px-3 py-2 text-sm text-[color:var(--danger)]">
              {error}
            </p>
          ) : null}
          <Button disabled={submitting} type="submit">
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
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
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{helperText}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <Field>
            <FieldLabel icon={UserRound}>Display name</FieldLabel>
            <Input onChange={(event) => onNameChange(event.target.value)} placeholder="Melina" value={name} />
          </Field>
          <Field>
            <FieldLabel icon={Mail}>Email</FieldLabel>
            <Input
              autoComplete="email"
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="melina@ghibli-ui.dev"
              type="email"
              value={email}
            />
          </Field>
          <Field className="md:grid-cols-2 md:gap-4">
            <div className="grid gap-2">
              <FieldLabel icon={Lock}>Password</FieldLabel>
              <Input
                autoComplete="new-password"
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="Choose a passphrase"
                type="password"
                value={password}
              />
            </div>
            <div className="grid gap-2">
              <FieldLabel icon={KeyRound}>Confirm</FieldLabel>
              <Input
                autoComplete="new-password"
                onChange={(event) => onConfirmPasswordChange(event.target.value)}
                placeholder="Repeat password"
                type="password"
                value={confirmPassword}
              />
            </div>
          </Field>
          {error ? (
            <p className="rounded-[calc(var(--radius)-0.35rem)] border border-[color:var(--danger-edge)] bg-[color:rgba(202,117,93,0.16)] px-3 py-2 text-sm text-[color:var(--danger)]">
              {error}
            </p>
          ) : null}
          <Button disabled={submitting} type="submit">
            {submitting ? "Creating..." : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
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
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="grid gap-2">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{helperText}</CardDescription>
          </div>
          {onBack ? (
            <Button onClick={onBack} size="sm" type="button" variant="ghost">
              <ArrowLeft className="size-4" />
              Back
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <Field>
            <FieldLabel icon={Mail}>Email</FieldLabel>
            <Input
              autoComplete="email"
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="melina@ghibli-ui.dev"
              type="email"
              value={email}
            />
          </Field>
          {error ? (
            <p className="rounded-[calc(var(--radius)-0.35rem)] border border-[color:var(--danger-edge)] bg-[color:rgba(202,117,93,0.16)] px-3 py-2 text-sm text-[color:var(--danger)]">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="rounded-[calc(var(--radius)-0.35rem)] border border-[color:var(--meadow-border)] bg-[color:rgba(160,191,153,0.2)] px-3 py-2 text-sm text-[color:var(--meadow-ink)]">
              {message}
            </p>
          ) : null}
          <Button disabled={submitting} type="submit">
            {submitting ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
