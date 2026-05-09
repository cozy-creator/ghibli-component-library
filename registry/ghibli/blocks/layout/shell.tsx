import * as React from "react";
import { ExternalLink, LogOut, Menu } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeFrame, ThemeRule } from "@/components/ui/theme-frame";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  THEME_FRAME_VARIANTS,
  THEME_RULE_VARIANTS,
} from "@/lib/theme/theme-frame-config";

import { cn, focusRingClass, type NavItem } from "@/lib/utils";

export interface ShellNavItem extends NavItem {
  active?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  iconOnly?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
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
  children: React.ReactNode,
) => React.ReactNode;

type HeaderLinkLayout = "desktop" | "sheet";

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
  layout = "desktop",
  renderLink,
}: {
  closeOnActivate?: boolean;
  item: ShellNavItem;
  layout?: HeaderLinkLayout;
  renderLink?: RenderLink | undefined;
}) {
  const isSheet = layout === "sheet";
  const linkClassName = isSheet
    ? "block w-full text-[color:var(--theme-shell-nav-link-foreground)]"
    : item.active
      ? cn(
          "inline-flex text-sm font-medium transition-colors",
          item.iconOnly
            ? "items-center justify-center rounded-[var(--theme-radius-sm)] px-2.5 py-2 text-[color:var(--theme-shell-nav-active-foreground)]"
            : "text-[color:var(--theme-shell-nav-active-foreground)]",
        )
      : cn(
          "inline-flex items-center rounded-[var(--theme-radius-sm)] text-sm font-medium transition-colors",
          item.iconOnly
            ? "justify-center px-2.5 py-2 text-[color:var(--theme-shell-nav-icon-foreground)] hover:bg-[color:var(--theme-shell-nav-icon-hover-background)] hover:text-[color:var(--theme-shell-nav-icon-hover-foreground)]"
            : "gap-2 px-3 py-2 text-[color:var(--theme-shell-nav-link-foreground)] hover:bg-[color:var(--theme-shell-nav-link-hover-background)] hover:text-[color:var(--theme-shell-nav-link-hover-foreground)]",
        );
  const inlineContent = (
    <>
      {item.icon}
      {item.iconOnly ? (
        <span className="sr-only">{item.label}</span>
      ) : (
        item.label
      )}
      {item.external && !item.iconOnly ? (
        <ExternalLink className="size-3.5" />
      ) : null}
    </>
  );
  const content =
    item.active && !item.iconOnly ? (
      <ThemeFrame
        className={cn(isSheet ? "w-full" : undefined)}
        contentClassName={cn(
          isSheet
            ? "flex items-center gap-2.5 px-3 py-3 text-[0.95rem] leading-none text-[color:var(--theme-shell-nav-active-foreground)]"
            : "inline-flex items-center gap-2 px-3 py-2 text-[color:var(--theme-shell-nav-active-foreground)]",
        )}
        surfaceClassName="bg-[color:var(--theme-shell-nav-active-background)]"
        strokeColor="var(--theme-shell-nav-active-border)"
        variant={THEME_FRAME_VARIANTS.shellNavActive}
      >
        {inlineContent}
      </ThemeFrame>
    ) : isSheet ? (
      <div
        className={cn(
          item.iconOnly
            ? "flex min-h-12 w-full items-center justify-center rounded-[var(--theme-radius-md)] border border-[color:var(--theme-shell-mobile-surface-border)] bg-[color:var(--theme-shell-mobile-surface-background)] px-3 py-2.5 text-[color:var(--theme-shell-nav-icon-foreground)] transition-colors hover:bg-[color:var(--theme-shell-nav-icon-hover-background)] hover:text-[color:var(--theme-shell-nav-icon-hover-foreground)]"
            : "flex min-h-12 w-full items-center gap-2.5 rounded-[var(--theme-radius-md)] px-3 py-3 text-[0.95rem] leading-none text-[color:var(--theme-shell-nav-link-foreground)] transition-colors hover:bg-[color:var(--theme-shell-nav-link-hover-background)] hover:text-[color:var(--theme-shell-nav-link-hover-foreground)]",
        )}
      >
        {inlineContent}
      </div>
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

function renderSheetPrimaryAction(primaryAction: React.ReactNode) {
  if (!React.isValidElement<{ className?: string }>(primaryAction)) {
    return primaryAction;
  }

  return React.cloneElement(primaryAction, {
    className: cn(
      primaryAction.props.className,
      "w-full justify-center sm:w-full",
    ),
  });
}

export function ShellHeader({
  brand,
  className,
  mobileTitle = "Navigation",
  navItems,
  primaryAction,
  renderLink,
  socialItems = [],
  user,
}: ShellHeaderProps) {
  const hasNavItems = navItems.length > 0;
  const sheetPrimaryAction = primaryAction
    ? renderSheetPrimaryAction(primaryAction)
    : null;

  return (
    <header className="sticky top-4 z-40">
      <ThemeFrame
        className={className}
        contentClassName="px-4 py-3 md:px-5"
        surfaceClassName="bg-[color:var(--theme-shell-header-background)] bg-[image:var(--theme-shell-header-background-image)] backdrop-blur-md"
        strokeColor="var(--theme-shell-header-border)"
        style={{ boxShadow: "var(--theme-shell-header-shadow)" }}
        variant={THEME_FRAME_VARIANTS.shellHeader}
      >
        <div
          className="shell-header-layout"
          data-has-nav={hasNavItems ? "true" : "false"}
        >
          <div className="shell-header-brand">{brand}</div>
          {hasNavItems ? (
            <nav className="shell-header-desktop-nav items-center gap-1 lg:justify-self-center">
              {navItems.map((item) => (
                <HeaderLink
                  item={item}
                  key={item.href}
                  renderLink={renderLink}
                />
              ))}
            </nav>
          ) : null}
          <div className="shell-header-desktop-actions items-center gap-2 lg:justify-self-end">
            <div className="flex items-center gap-2">
              {socialItems.map((item) => (
                <HeaderLink
                  item={item}
                  key={item.href}
                  renderLink={renderLink}
                />
              ))}
            </div>
            {user ? <ShellHeaderUser user={user} /> : null}
            {primaryAction}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="shell-header-mobile-trigger rounded-[var(--theme-radius-sm)] border-transparent bg-transparent text-[color:var(--theme-shell-nav-icon-foreground)] shadow-none hover:bg-[color:var(--theme-shell-nav-icon-hover-background)] hover:text-[color:var(--theme-shell-nav-icon-hover-foreground)]"
                size="icon"
                variant="ghost"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="shell-header-sheet border-[color:var(--theme-shell-mobile-surface-border)]">
              <SheetHeader className="border-b border-[color:var(--theme-shell-mobile-surface-border)] px-5 pt-5 pb-4">
                <SheetTitle>{mobileTitle}</SheetTitle>
              </SheetHeader>
              <div className="flex min-h-0 flex-1 flex-col gap-6 px-4 pb-5">
                {hasNavItems ? (
                  <nav className="grid gap-1.5">
                    {navItems.map((item) => (
                      <HeaderLink
                        closeOnActivate
                        item={item}
                        key={item.href}
                        layout="sheet"
                        renderLink={renderLink}
                      />
                    ))}
                  </nav>
                ) : null}
                {user ? (
                  <div className="grid gap-3 rounded-[var(--theme-radius-lg)] border border-[color:var(--theme-shell-mobile-surface-border)] bg-[color:var(--theme-shell-mobile-surface-background)] p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar size="sm">
                        {user.avatarUrl ? (
                          <AvatarImage alt={user.name} src={user.avatarUrl} />
                        ) : (
                          <AvatarFallback>
                            {user.initials ??
                              user.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
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
                              className="w-full justify-start"
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
                <div className="mt-auto grid gap-3">
                  {socialItems.length ? (
                    <div className="grid grid-cols-2 gap-2">
                      {socialItems.map((item) => (
                        <HeaderLink
                          closeOnActivate
                          item={item}
                          key={item.href}
                          layout="sheet"
                          renderLink={renderLink}
                        />
                      ))}
                    </div>
                  ) : null}
                  {sheetPrimaryAction ? (
                    <div>
                      {React.isValidElement(sheetPrimaryAction) ? (
                        <SheetClose asChild>{sheetPrimaryAction}</SheetClose>
                      ) : (
                        sheetPrimaryAction
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </ThemeFrame>
    </header>
  );
}

function ShellHeaderUser({ user }: { user: ShellUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={user.name}
          className={cn(
            "inline-flex max-w-[16rem] items-center rounded-[var(--theme-radius-md)] align-middle",
            focusRingClass,
          )}
        >
          <ThemeFrame
            className="min-w-0"
            contentClassName="shell-header-user-trigger px-3 py-2"
            surfaceClassName="bg-[color:var(--theme-shell-user-chip-background)]"
            strokeColor="var(--theme-shell-user-chip-border)"
            variant={THEME_FRAME_VARIANTS.shellUserChip}
          >
            <Avatar size="sm">
              {user.avatarUrl ? (
                <AvatarImage alt={user.name} src={user.avatarUrl} />
              ) : (
                <AvatarFallback>
                  {user.initials ?? user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <span
              className="hidden min-w-0 truncate pb-[0.08em] text-sm leading-[1.2] text-[color:var(--ink-strong)] xl:block"
              title={user.name}
            >
              {user.name}
            </span>
          </ThemeFrame>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="shell-header-user-menu overflow-visible border-0 bg-transparent p-0 ring-0"
        style={{
          minWidth: "var(--radix-popover-trigger-width)",
          width: "var(--radix-popover-trigger-width)",
        }}
      >
        <ThemeFrame
          className="w-full"
          contentClassName="grid gap-1 px-3 py-2"
          surfaceClassName="bg-[color:var(--theme-shell-user-menu-background)]"
          strokeColor="var(--theme-shell-user-menu-border)"
          variant={THEME_FRAME_VARIANTS.shellUserMenu}
        >
          {user.menuItems?.map((item) => (
            <DropdownMenuItem
              className={cn(
                "gap-1.5 px-0 py-1.5 whitespace-nowrap hover:bg-[color:var(--theme-shell-user-menu-item-highlight-background)] hover:text-[color:var(--theme-shell-user-menu-item-highlight-foreground)] focus:bg-[color:var(--theme-shell-user-menu-item-highlight-background)] focus:text-[color:var(--theme-shell-user-menu-item-highlight-foreground)] data-[highlighted]:bg-[color:var(--theme-shell-user-menu-item-highlight-background)] data-[highlighted]:text-[color:var(--theme-shell-user-menu-item-highlight-foreground)]",
                item.destructive
                  ? "text-destructive hover:text-[color:var(--theme-shell-user-menu-item-destructive-highlight-foreground)] focus:text-[color:var(--theme-shell-user-menu-item-destructive-highlight-foreground)] data-[highlighted]:text-[color:var(--theme-shell-user-menu-item-destructive-highlight-foreground)]"
                  : "text-[color:var(--foreground)]",
              )}
              key={item.id}
              onClick={item.onSelect}
            >
              {item.icon ??
                (item.destructive ? <LogOut className="size-4" /> : null)}
              {item.label}
            </DropdownMenuItem>
          ))}
        </ThemeFrame>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ShellFooter({
  ariaLabel = "Footer navigation",
  brand,
  className,
  text,
  columns,
}: ShellFooterProps) {
  return (
    <footer
      className={cn("py-7 text-sm text-[color:var(--foreground)]", className)}
      data-site-footer
    >
      <div className="relative pt-8 md:pt-10">
        <ThemeRule
          className="absolute inset-x-0 top-0 h-3"
          strokeColor="var(--foreground)"
          svgClassName="opacity-85"
          variant={THEME_RULE_VARIANTS.footerDivider}
        />
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
  user,
}: HeaderProps) {
  return (
    <ShellHeader
      brand={brand}
      navItems={navItems.map((item) => ({
        ...item,
        active:
          item.active ?? (currentPath ? currentPath === item.href : false),
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
        <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
          {note}
        </p>
      </div>
      <ShellFooter
        columns={columns.flatMap((column) =>
          column.links.map((link) => ({ href: link.href, text: link.label })),
        )}
        text=""
      />
    </section>
  );
}
