import * as React from "react";
import { CheckCircle2, Coins, Link2, Sparkles, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
