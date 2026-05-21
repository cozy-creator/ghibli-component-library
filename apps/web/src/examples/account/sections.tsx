import * as React from "react";
import {
  Camera,
  Link2,
  Loader2,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartoonButton } from "@/components/ui/cartoon-button";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function SectionShell({
  children,
  description,
  icon: Icon,
  title,
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
  passwordActionLabel,
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
        crookedness={0.35}
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
                              : "group-hover:brightness-[0.45] group-focus-within:brightness-[0.45]",
                          )}
                          src={avatarUrl}
                        />
                      ) : (
                        <AvatarFallback
                          className={cn(
                            "text-3xl transition duration-200",
                            isUploadingAvatar
                              ? "brightness-[0.45]"
                              : "group-hover:brightness-[0.45] group-focus-within:brightness-[0.45]",
                          )}
                        >
                          {initial}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute inset-0 bg-black/45 transition duration-200",
                        isUploadingAvatar
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                      )}
                    />

                    <div
                      className={cn(
                        "pointer-events-none absolute inset-0 flex items-center justify-center transition duration-200",
                        isUploadingAvatar
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                      )}
                    >
                      <button
                        aria-label={
                          hasCustomAvatar
                            ? "Change profile photo"
                            : "Upload profile photo"
                        }
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
                  text={
                    passwordActionLabel ??
                    (hasPassword ? "Change password" : "Set password")
                  }
                  type="button"
                />
              </div>
            </div>

            {avatarError ? (
              <p className="text-xs text-destructive">{avatarError}</p>
            ) : null}
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
  planLabel,
}: AccountProfileSectionProps) {
  return (
    <SectionShell description={headline} icon={UserRound} title="Profile">
      <div className="flex flex-col gap-4 rounded-[calc(var(--radius)-0.25rem)] border border-[color:var(--border)] bg-[color:var(--paper-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            {avatarUrl ? (
              <AvatarImage alt={name} src={avatarUrl} />
            ) : (
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="grid gap-1">
            <h3 className="font-[var(--font-heading)] text-2xl text-[color:var(--ink-strong)]">
              {name}
            </h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">
              {email}
            </p>
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
  accounts,
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
                <span className="font-medium text-[color:var(--ink-strong)]">
                  {account.name}
                </span>
                <Badge
                  tone={account.state === "connected" ? "meadow" : "cloud"}
                  variant="soft"
                >
                  {account.state}
                </Badge>
              </div>
              {account.meta ? (
                <span className="text-sm text-[color:var(--muted-foreground)]">
                  {account.meta}
                </span>
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
  id: string;
  name: string;
  onSelect?: () => void;
  priceLabel: string;
  subtitle?: string;
}

export interface AccountSubscriptionSectionProps {
  actions?: React.ReactNode;
  activeOfferId?: string;
  balanceLabel?: string;
  offers: SubscriptionOffer[];
  planName: string;
  priceName?: string;
  renewalLabel?: string;
  renewalText?: string;
}

function SubscriptionSummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-right text-sm text-[color:var(--ink-strong)]">
        {value}
      </div>
    </div>
  );
}

function SubscriptionOfferCard({
  actionLabel,
  isActive,
  offer,
}: {
  actionLabel: string;
  isActive: boolean;
  offer: SubscriptionOffer;
}) {
  return (
    <HandDrawnFrame
      className="h-full"
      contentClassName="flex h-full flex-col p-5"
      crookedness={3}
      strokeColor={isActive ? "var(--primary-edge)" : "var(--border-soft)"}
      strokeWidth={1.1}
      surfaceClassName={
        isActive
          ? "bg-[color:var(--primary-soft)]"
          : "bg-[color:color-mix(in_oklab,var(--card)_46%,transparent)]"
      }
      svgClassName="opacity-90"
    >
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold text-[color:var(--ink-strong)]">
          {offer.name}
        </p>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
            {offer.priceLabel}
          </span>
        </div>
        {offer.subtitle ? (
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {offer.subtitle}
          </p>
        ) : null}
      </div>
      <CartoonButton
        className="mt-6 w-full"
        color={isActive ? "var(--border-strong)" : "var(--success)"}
        disabled={isActive}
        onClick={offer.onSelect ?? null}
        text={actionLabel}
      />
    </HandDrawnFrame>
  );
}

export function AccountSubscriptionSection({
  actions,
  activeOfferId,
  balanceLabel,
  offers,
  planName,
  priceName,
  renewalLabel = "Renews on",
  renewalText,
}: AccountSubscriptionSectionProps) {
  const hasActive = Boolean(activeOfferId);
  const accountSurfaceClass =
    "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_50%,var(--primary-foreground)),color-mix(in_oklab,var(--paper-soft)_96%,var(--primary-foreground)))]";

  return (
    <div className="space-y-6">
      <HandDrawnFrame
        crookedness={0.35}
        strokeColor="var(--border)"
        strokeWidth={1.65}
        surfaceClassName={accountSurfaceClass}
      >
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-xl">Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {balanceLabel ? (
              <SubscriptionSummaryRow
                label="Available API Credits"
                value={<span className="font-semibold">{balanceLabel}</span>}
              />
            ) : null}
            <SubscriptionSummaryRow
              label="Current Plan"
              value={
                <div className="space-y-0.5">
                  <div className="font-semibold">{planName}</div>
                  {priceName ? (
                    <div className="text-muted-foreground">{priceName}</div>
                  ) : null}
                </div>
              }
            />
            {renewalText ? (
              <SubscriptionSummaryRow
                label={renewalLabel}
                value={<span className="font-semibold">{renewalText}</span>}
              />
            ) : null}
            {actions ? (
              <div className="flex flex-wrap gap-2 pt-1">{actions}</div>
            ) : null}
          </CardContent>
        </Card>
      </HandDrawnFrame>

      <section className="space-y-3">
        <h2 className="font-[var(--font-heading)] text-2xl text-[color:var(--ink-strong)]">
          Available Plans
        </h2>
        {offers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No subscription products available.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => {
              const isActive = offer.id === activeOfferId;
              const actionLabel = isActive
                ? "Current plan"
                : hasActive
                  ? "Change plan"
                  : "Subscribe";
              return (
                <SubscriptionOfferCard
                  actionLabel={actionLabel}
                  isActive={isActive}
                  key={offer.id}
                  offer={offer}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export interface CreditLedgerEntry {
  activity: string;
  amountLabel: string;
  date: string;
  direction?: "credit" | "debit";
  id: string;
}

export interface AccountApiCreditsSectionProps {
  emptyMessage?: string;
  ledger: CreditLedgerEntry[];
  title?: string;
}

export function AccountApiCreditsSection({
  emptyMessage = "You have not bought GPU time yet.",
  ledger,
  title = "Payments",
}: AccountApiCreditsSectionProps) {
  return (
    <HandDrawnFrame
      crookedness={0.35}
      strokeColor="var(--border)"
      strokeWidth={1.65}
      surfaceClassName="bg-[image:var(--surface-panel-gradient)]"
    >
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {ledger.length === 0 ? (
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--border-soft)] text-left text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
                    <th className="py-3 pr-6 font-medium">Date</th>
                    <th className="py-3 pr-6 font-medium">Activity</th>
                    <th className="py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((entry) => (
                    <tr
                      className="border-b border-[color:var(--border-faint)] last:border-b-0"
                      key={entry.id}
                    >
                      <td className="py-3 pr-6 text-[color:var(--foreground)]">
                        {entry.date}
                      </td>
                      <td className="py-3 pr-6 text-[color:var(--foreground)]">
                        {entry.activity}
                      </td>
                      <td
                        className={cn(
                          "py-3 text-right font-medium",
                          entry.direction === "debit"
                            ? "text-destructive"
                            : "text-primary",
                        )}
                      >
                        {entry.amountLabel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </HandDrawnFrame>
  );
}
