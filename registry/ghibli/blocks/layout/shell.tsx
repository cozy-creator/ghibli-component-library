import * as React from "react";
import { ExternalLink, LogOut, Menu, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { cn, focusRingClass, type NavItem } from "@/lib/utils";

export interface ShellNavItem extends NavItem {
  active?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  iconOnly?: boolean;
  onClick?: () => void;
}

export interface ShellUserMenuItem {
  destructive?: boolean;
  icon?: React.ReactNode;
  id: string;
  label: string;
  onSelect?: () => void;
}

export interface ShellUser {
  avatarUrl?: string;
  initials?: string;
  menuItems?: ShellUserMenuItem[];
  name: string;
  subtitle?: string;
}

type RenderLink = (
  item: ShellNavItem,
  className: string,
  children: React.ReactNode
) => React.ReactNode;

export interface ShellHeaderProps {
  brand: React.ReactNode;
  className?: string;
  mobileTitle?: string;
  navItems: ShellNavItem[];
  primaryAction?: React.ReactNode;
  renderLink?: RenderLink | undefined;
  socialItems?: ShellNavItem[];
  user?: ShellUser | undefined;
}

export interface ShellFooterLink {
  href: string;
  text: string;
}

export interface ShellFooterProps {
  ariaLabel?: string;
  brand?: React.ReactNode;
  className?: string;
  columns: ShellFooterLink[];
  text: React.ReactNode;
}

function HeaderLink({
  closeOnActivate = false,
  item,
  renderLink
}: {
  closeOnActivate?: boolean;
  item: ShellNavItem;
  renderLink?: RenderLink | undefined;
}) {
  const linkClassName = cn(
    "inline-flex text-sm transition-colors",
    item.active
      ? "text-[color:var(--ink-strong)]"
      : "items-center gap-2 px-3 py-2 text-muted-foreground hover:bg-white/45 hover:text-foreground",
    item.iconOnly && !item.active && "justify-center gap-0 px-1.5"
  );
  const inlineContent = (
    <>
      {item.icon}
      {item.iconOnly ? <span className="sr-only">{item.label}</span> : item.label}
      {item.external && !item.iconOnly ? <ExternalLink className="size-3.5" /> : null}
    </>
  );
  const content =
    item.active && !item.iconOnly ? (
      <HandDrawnFrame
        className="bg-[color:var(--paper)] px-3 py-2"
        contentClassName="inline-flex items-center gap-2"
        strokeColor="var(--border)"
        strokeWidth={1.55}
        variant="pill"
      >
        {inlineContent}
      </HandDrawnFrame>
    ) : (
      inlineContent
    );

  const renderedLink = renderLink ? (
    renderLink(item, linkClassName, content)
  ) : (
    <a className={linkClassName} href={item.href} onClick={item.onClick}>
      {content}
    </a>
  );

  if (closeOnActivate && React.isValidElement(renderedLink)) {
    return <SheetClose asChild>{renderedLink}</SheetClose>;
  }

  return renderedLink;
}

export function ShellHeader({
  brand,
  className,
  mobileTitle = "Navigation",
  navItems,
  primaryAction,
  renderLink,
  socialItems = [],
  user
}: ShellHeaderProps) {
  return (
    <header className="sticky top-4 z-40">
      <HandDrawnFrame
        className={cn("bg-[#f4e5c3] px-4 py-3 backdrop-blur-md", className)}
        strokeColor="var(--border)"
        strokeWidth={2.1}
        variant="banner"
      >
        <div className="flex items-center gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4">
          <div className="min-w-0 flex-1 lg:flex-none lg:justify-self-start">{brand}</div>
          <nav className="hidden items-center gap-1 lg:flex lg:justify-self-center">
            {navItems.map((item) => (
              <HeaderLink item={item} key={item.href} renderLink={renderLink} />
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex lg:justify-self-end">
            <div className="flex items-center gap-0">
              {socialItems.map((item) => (
                <HeaderLink item={item} key={item.href} renderLink={renderLink} />
              ))}
            </div>
            {user ? <ShellHeaderUser user={user} /> : null}
            {primaryAction}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="lg:hidden" size="icon" variant="secondary">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{mobileTitle}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <HeaderLink
                    closeOnActivate
                    item={item}
                    key={item.href}
                    renderLink={renderLink}
                  />
                ))}
                {socialItems.map((item) => (
                  <HeaderLink
                    closeOnActivate
                    item={item}
                    key={item.href}
                    renderLink={renderLink}
                  />
                ))}
                {primaryAction ? (
                  <div className="pt-2">
                    {React.isValidElement(primaryAction) ? (
                      <SheetClose asChild>{primaryAction}</SheetClose>
                    ) : (
                      primaryAction
                    )}
                  </div>
                ) : null}
                {user ? (
                  <div className="grid gap-3 border border-[color:var(--border)] bg-[color:var(--paper-soft)] p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar size="sm">
                        {user.avatarUrl ? <AvatarImage alt={user.name} src={user.avatarUrl} /> : null}
                        <AvatarFallback>
                          {user.initials ?? user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid min-w-0 flex-1 gap-0.5">
                        <span
                          className="truncate text-sm font-medium text-[color:var(--ink-strong)]"
                          title={user.name}
                        >
                          {user.name}
                        </span>
                        {user.subtitle ? (
                          <span
                            className="truncate text-xs text-muted-foreground"
                            title={user.subtitle}
                          >
                            {user.subtitle}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {user.menuItems?.length ? (
                      <div className="grid gap-2">
                        {user.menuItems.map((item) => (
                          <SheetClose asChild key={item.id}>
                            <Button
                              className="justify-start"
                              onClick={item.onSelect}
                              variant={item.destructive ? "ghost" : "secondary"}
                            >
                              {item.icon}
                              {item.label}
                            </Button>
                          </SheetClose>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </HandDrawnFrame>
    </header>
  );
}

function ShellHeaderUser({ user }: { user: ShellUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex max-w-[16rem] items-center align-middle",
            focusRingClass
          )}
        >
          <HandDrawnFrame
            className="min-w-0 bg-white/45 px-2 py-2"
            contentClassName="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3"
            strokeColor="var(--border)"
            strokeWidth={1.9}
            variant="steady"
          >
            <Avatar size="sm">
              {user.avatarUrl ? <AvatarImage alt={user.name} src={user.avatarUrl} /> : null}
              <AvatarFallback>
                {user.initials ?? user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className="hidden min-w-0 truncate pb-[0.08em] text-sm leading-[1.2] text-[color:var(--ink-strong)] xl:block"
              title={user.name}
            >
              {user.name}
            </span>
          </HandDrawnFrame>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-max min-w-[10rem] overflow-visible border-0 bg-transparent p-0 ring-0"
      >
        <HandDrawnFrame
          className="w-full bg-[color:var(--paper)] px-1.5 py-1.5"
          contentClassName="grid gap-0.5"
          strokeColor="var(--border)"
          strokeWidth={1.6}
          variant="panel"
        >
          <DropdownMenuItem className="pointer-events-none">
            <UserRound className="size-4" />
            {user.name}
          </DropdownMenuItem>
          {user.subtitle ? (
            <DropdownMenuItem className="pointer-events-none text-muted-foreground">
              {user.subtitle}
            </DropdownMenuItem>
          ) : null}
          {user.menuItems?.map((item) => (
            <DropdownMenuItem
              className={cn(item.destructive && "text-destructive")}
              key={item.id}
              onClick={item.onSelect}
            >
              {item.icon ?? (item.destructive ? <LogOut className="size-4" /> : null)}
              {item.label}
            </DropdownMenuItem>
          ))}
        </HandDrawnFrame>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ShellFooter({
  ariaLabel = "Footer navigation",
  brand,
  className,
  text,
  columns
}: ShellFooterProps) {
  return (
    <footer
      className={cn(
        "py-7 text-sm text-[color:var(--foreground)]",
        className
      )}
      data-site-footer
    >
      <div className="border-t border-[color:var(--foreground)] pt-8 md:pt-10">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4 md:gap-x-6">
          {brand}
          {text ? <p className="text-sm tracking-[0.01em]">{text}</p> : null}
          <nav
            aria-label={ariaLabel}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          >
            {columns.map((col, index) => (
              <a
                className="text-sm transition-colors hover:text-[color:var(--ink-strong)]"
                href={col.href}
                key={`${col.href}-${index}`}
              >
                {col.text}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export type HeaderUserMenuItem = ShellUserMenuItem;
export type HeaderUser = ShellUser;

export interface HeaderProps {
  brand: React.ReactNode;
  currentPath?: string;
  navItems: ShellNavItem[];
  primaryAction?: React.ReactNode;
  socialItems?: ShellNavItem[];
  user?: ShellUser;
}

export function Header({
  brand,
  currentPath,
  navItems,
  primaryAction,
  socialItems = [],
  user
}: HeaderProps) {
  return (
    <ShellHeader
      brand={brand}
      navItems={navItems.map((item) => ({
        ...item,
        active: item.active ?? (currentPath ? currentPath === item.href : false)
      }))}
      primaryAction={primaryAction}
      socialItems={socialItems}
      user={user}
    />
  );
}

export interface FooterColumn {
  id: string;
  links: NavItem[];
  title: string;
}

export interface FooterProps {
  columns: FooterColumn[];
  note: string;
  title: string;
}

export function Footer({ columns, note, title }: FooterProps) {
  return (
    <section className="grid gap-4">
      <div className="grid gap-2">
        <h2 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
          {title}
        </h2>
        <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{note}</p>
      </div>
      <ShellFooter
        columns={columns.flatMap((column) =>
          column.links.map((link) => ({ href: link.href, text: link.label }))
        )}
        text=""
      />
    </section>
  );
}
