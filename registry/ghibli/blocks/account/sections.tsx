import * as React from "react";
import { Camera, CheckCircle2, Coins, Link2, Loader2, Pencil, Sparkles, Trash2, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartoonButton } from "@/components/ui/cartoon-button";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function SectionShell({
  children,
  description,
  icon: Icon,
  title
}: {
  children: React.ReactNode;
  description: string;
  icon: typeof UserRound;
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="inline-flex size-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--paper-soft)]">
            <Icon className="size-5 text-[color:var(--ink-strong)]" />
          </div>
          <div className="grid gap-2">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">{children}</CardContent>
    </Card>
  );
}

export interface AccountUserDisplayBoxProps {
  avatarAlt?: string;
  avatarBusy?: "remove" | "upload" | null;
  avatarError?: string;
  avatarUrl?: string;
  className?: string;
  email?: string;
  generatedCount?: number | null;
  generatedLabel?: string;
  hasCustomAvatar?: boolean;
  hasPassword?: boolean;
  isLoadingGeneratedCount?: boolean;
  name: string;
  onEditName?: () => void;
  onPasswordAction?: () => void;
  onRemoveAvatar?: () => void;
  onUploadAvatar?: () => void;
  passwordActionLabel?: string;
}

export function AccountUserDisplayBox({
  avatarAlt,
  avatarBusy = null,
  avatarError,
  avatarUrl,
  className,
  email,
  generatedCount,
  generatedLabel,
  hasCustomAvatar = false,
  hasPassword = true,
  isLoadingGeneratedCount = false,
  name,
  onEditName,
  onPasswordAction,
  onRemoveAvatar,
  onUploadAvatar,
  passwordActionLabel
}: AccountUserDisplayBoxProps) {
  const displayName = name || "Account";
  const initial = displayName[0]?.toUpperCase() ?? "?";
  const isUploadingAvatar = avatarBusy === "upload";
  const generatedText =
    generatedLabel ??
    (generatedCount === null || generatedCount === undefined
      ? "Generations unavailable right now"
      : `${generatedCount} Total generations`);

  return (
    <section className={cn("w-full", className)}>
      <HandDrawnFrame
        className="overflow-hidden"
        surfaceClassName="bg-[linear-gradient(180deg,rgba(255,255,255,0.5),rgba(250,244,232,0.96))]"
        strokeColor="var(--border)"
        strokeWidth={1.65}
        crookednessIntensity={0.35}
      >
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="shrink-0">
                <div className="relative size-24">
                  <div className="group relative size-24 overflow-hidden">
                    <Avatar className="size-24 border-2 border-[color:var(--border-strong)] bg-[color:var(--card)]">
                      {avatarUrl ? (
                        <AvatarImage
                          alt={avatarAlt ?? displayName}
                          className={cn(
                            "transition duration-200",
                            isUploadingAvatar
                              ? "brightness-[0.45]"
                              : "group-hover:brightness-[0.45] group-focus-within:brightness-[0.45]"
                          )}
                          src={avatarUrl}
                        />
                      ) : null}
                      <AvatarFallback
                        className={cn(
                          "text-3xl transition duration-200",
                          isUploadingAvatar
                            ? "brightness-[0.45]"
                            : "group-hover:brightness-[0.45] group-focus-within:brightness-[0.45]"
                        )}
                      >
                        {initial}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute inset-0 bg-black/45 transition duration-200",
                        isUploadingAvatar
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                      )}
                    />

                    <div
                      className={cn(
                        "pointer-events-none absolute inset-0 flex items-center justify-center transition duration-200",
                        isUploadingAvatar
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                      )}
                    >
                      <button
                        aria-label={hasCustomAvatar ? "Change profile photo" : "Upload profile photo"}
                        className="pointer-events-auto flex size-12 items-center justify-center text-white transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                        disabled={avatarBusy !== null}
                        onClick={onUploadAvatar}
                        type="button"
                      >
                        {isUploadingAvatar ? (
                          <Loader2 className="size-6 animate-spin" />
                        ) : (
                          <Camera className="size-6" />
                        )}
                      </button>
                    </div>
                  </div>
                  {hasCustomAvatar ? (
                    <button
                      aria-label="Remove profile photo"
                      className="absolute right-1 bottom-1 z-20 flex size-7 items-center justify-center text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] transition hover:scale-110 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 active:scale-100 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={avatarBusy !== null}
                      onClick={onRemoveAvatar}
                      type="button"
                    >
                      {avatarBusy === "remove" ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <Trash2 className="size-6" />
                      )}
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3 text-left sm:min-h-24 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex min-h-[2.7rem] max-w-full items-center sm:min-h-[3.35rem]">
                    <div className="group/name inline-flex max-w-full items-center gap-1.5">
                      <div className="min-w-0 overflow-hidden pb-[0.08em]">
                        <p
                          className="block truncate font-[var(--font-heading)] text-3xl leading-[1.2] text-[color:var(--ink-strong)] sm:text-4xl"
                          title={displayName}
                        >
                          {displayName}
                        </p>
                      </div>

                      {onEditName ? (
                        <button
                          aria-label="Edit username"
                          className="flex size-7 shrink-0 items-center justify-center text-[color:var(--ink-strong)] transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--border-strong)] focus-visible:ring-offset-2 active:scale-100"
                          onClick={onEditName}
                          type="button"
                        >
                          <Pencil className="size-6" />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <p className="break-all text-sm leading-[1.1] text-[color:var(--foreground)] sm:text-base">
                    {email || "No email address on file"}
                  </p>

                  {isLoadingGeneratedCount ? (
                    <Skeleton className="h-4 w-36 border-0" />
                  ) : (
                    <span className="text-sm leading-[1.1] text-[color:var(--foreground)]">
                      {generatedText}
                    </span>
                  )}
                </div>

                <CartoonButton
                  className="w-full shrink-0 justify-center sm:w-auto sm:self-auto"
                  color="#7b9d68"
                  onClick={onPasswordAction ?? null}
                  size="sm"
                  text={passwordActionLabel ?? (hasPassword ? "Change password" : "Set password")}
                  type="button"
                />
              </div>
            </div>

            {avatarError ? <p className="text-xs text-destructive">{avatarError}</p> : null}
          </CardContent>
        </Card>
      </HandDrawnFrame>
    </section>
  );
}

export interface AccountProfileSectionProps {
  actions?: React.ReactNode;
  avatarUrl?: string;
  email: string;
  headline?: string;
  name: string;
  planLabel?: string;
}

export function AccountProfileSection({
  actions,
  avatarUrl,
  email,
  headline = "Use this section as the quiet account summary at the top of billing pages.",
  name,
  planLabel
}: AccountProfileSectionProps) {
  return (
    <SectionShell description={headline} icon={UserRound} title="Profile">
      <div className="flex flex-col gap-4 rounded-[calc(var(--radius)-0.25rem)] border border-[color:var(--border)] bg-[color:var(--paper-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            {avatarUrl ? <AvatarImage alt={name} src={avatarUrl} /> : null}
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h3 className="font-[var(--font-heading)] text-2xl text-[color:var(--ink-strong)]">
              {name}
            </h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">{email}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {planLabel ? <Badge tone="meadow">{planLabel}</Badge> : null}
          {actions}
        </div>
      </div>
    </SectionShell>
  );
}

export interface LinkedAccount {
  actionLabel?: string;
  id: string;
  meta?: string;
  name: string;
  onAction?: () => void;
  state: "connected" | "disconnected";
}

export interface AccountLinkedAccountsSectionProps {
  accounts: LinkedAccount[];
}

export function AccountLinkedAccountsSection({
  accounts
}: AccountLinkedAccountsSectionProps) {
  return (
    <SectionShell
      description="Show provider connections without coupling the component to any auth SDK."
      icon={Link2}
      title="Linked accounts"
    >
      <div className="grid gap-3">
        {accounts.map((account) => (
          <div
            className="flex flex-col gap-3 rounded-[calc(var(--radius)-0.25rem)] border border-[color:var(--border)] bg-white/35 p-4 sm:flex-row sm:items-center sm:justify-between"
            key={account.id}
          >
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[color:var(--ink-strong)]">{account.name}</span>
                <Badge tone={account.state === "connected" ? "meadow" : "cloud"} variant="soft">
                  {account.state}
                </Badge>
              </div>
              {account.meta ? (
                <span className="text-sm text-[color:var(--muted-foreground)]">{account.meta}</span>
              ) : null}
            </div>
            {account.actionLabel ? (
              <Button onClick={account.onAction} variant="secondary">
                {account.actionLabel}
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export interface SubscriptionOffer {
  description?: string;
  id: string;
  label: string;
  onSelect?: () => void;
  priceLabel: string;
}

export interface AccountSubscriptionSectionProps {
  actions?: React.ReactNode;
  features: string[];
  note?: string;
  offers: SubscriptionOffer[];
  planName: string;
  renewalText?: string;
  status?: string;
}

export function AccountSubscriptionSection({
  actions,
  features,
  note,
  offers,
  planName,
  renewalText,
  status = "active"
}: AccountSubscriptionSectionProps) {
  return (
    <SectionShell
      description="Present offers, current status, and next billing detail in one paper section."
      icon={Sparkles}
      title="Subscription"
    >
      <div className="grid gap-4 rounded-[calc(var(--radius)-0.25rem)] border border-[color:var(--border)] bg-[color:var(--paper-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="grid gap-1">
            <h3 className="font-[var(--font-heading)] text-2xl text-[color:var(--ink-strong)]">
              {planName}
            </h3>
            {renewalText ? (
              <p className="text-sm text-[color:var(--muted-foreground)]">{renewalText}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={status === "active" ? "meadow" : "rose"} variant="soft">
              {status}
            </Badge>
            {actions}
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {features.map((feature) => (
            <div className="flex items-center gap-2 text-sm" key={feature}>
              <CheckCircle2 className="size-4 text-[color:var(--primary)]" />
              {feature}
            </div>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {offers.map((offer) => (
            <Card className="bg-white/55" key={offer.id}>
              <CardHeader>
                <CardTitle className="text-xl">{offer.label}</CardTitle>
                <CardDescription>{offer.description}</CardDescription>
              </CardHeader>
              <CardFooter className="justify-between">
                <span className="font-medium">{offer.priceLabel}</span>
                <Button onClick={offer.onSelect} variant="secondary">
                  Choose
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {note ? <p className="text-sm text-[color:var(--muted-foreground)]">{note}</p> : null}
      </div>
    </SectionShell>
  );
}

export interface CreditLedgerEntry {
  deltaLabel: string;
  id: string;
  meta?: string;
  title: string;
}

export interface CreditOffer {
  id: string;
  label: string;
  onSelect?: () => void;
  priceLabel: string;
}

export interface AccountApiCreditsSectionProps {
  balanceLabel: string;
  ledger: CreditLedgerEntry[];
  offers: CreditOffer[];
}

export function AccountApiCreditsSection({
  balanceLabel,
  ledger,
  offers
}: AccountApiCreditsSectionProps) {
  return (
    <SectionShell
      description="Combine the current credit balance, ledger history, and top-up offers."
      icon={Coins}
      title="API credits"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="grid gap-3 rounded-[calc(var(--radius)-0.25rem)] border border-[color:var(--border)] bg-[color:var(--paper-soft)] p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-[var(--font-heading)] text-2xl text-[color:var(--ink-strong)]">
              Balance
            </h3>
            <Badge tone="lantern">{balanceLabel}</Badge>
          </div>
          <div className="grid gap-2">
            {ledger.map((entry) => (
              <div className="flex items-center justify-between gap-3 text-sm" key={entry.id}>
                <div className="grid gap-1">
                  <span className="font-medium">{entry.title}</span>
                  {entry.meta ? (
                    <span className="text-xs text-[color:var(--muted-foreground)]">{entry.meta}</span>
                  ) : null}
                </div>
                <span className="font-medium">{entry.deltaLabel}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-3">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader>
                <CardTitle className="text-xl">{offer.label}</CardTitle>
              </CardHeader>
              <CardFooter className="justify-between">
                <span>{offer.priceLabel}</span>
                <Button onClick={offer.onSelect} variant="secondary">
                  Buy
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
