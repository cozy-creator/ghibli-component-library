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

export type RenderLink = (
  item: ShellNavItem,
  className: string,
  children: React.ReactNode,
) => React.ReactNode;

type HeaderLinkLayout = "desktop" | "sheet";

export interface ShellNavbarSlotClassNames {
  end?: string | undefined;
  mobilePanel?: string | undefined;
  mobileTrigger?: string | undefined;
  nav?: string | undefined;
  root?: string | undefined;
  start?: string | undefined;
  userMenu?: string | undefined;
  userTrigger?: string | undefined;
  utility?: string | undefined;
}

export interface NavbarProps {
  brand?: React.ReactNode | undefined;
  className?: string | undefined;
  endContent?: React.ReactNode | undefined;
  mobileTitle?: string | undefined;
  navItems?: ShellNavItem[] | undefined;
  primaryAction?: React.ReactNode | undefined;
  renderLink?: RenderLink | undefined;
  renderUserTrigger?: ((user: ShellUser) => React.ReactNode) | undefined;
  slotClassNames?: ShellNavbarSlotClassNames | undefined;
  startContent?: React.ReactNode | undefined;
  socialItems?: ShellNavItem[] | undefined;
  user?: ShellUser | null | undefined;
  utilityItems?: ShellNavItem[] | undefined;
}

type ResolvedNavbarProps = {
  brand: React.ReactNode | undefined;
  className: string | undefined;
  endContent: React.ReactNode | undefined;
  mobileTitle: string;
  navItems: ShellNavItem[];
  primaryAction: React.ReactNode | undefined;
  renderLink: RenderLink | undefined;
  renderUserTrigger: ((user: ShellUser) => React.ReactNode) | undefined;
  slotClassNames: ShellNavbarSlotClassNames;
  startContent: React.ReactNode | undefined;
  user: ShellUser | null;
  utilityItems: ShellNavItem[];
};

function resolveNavbarProps({
  brand,
  className,
  endContent,
  mobileTitle = "Navigation",
  navItems = [],
  primaryAction,
  renderLink,
  renderUserTrigger,
  slotClassNames = {},
  socialItems,
  startContent,
  user,
  utilityItems,
}: NavbarProps): ResolvedNavbarProps {
  return {
    brand,
    className,
    endContent,
    mobileTitle,
    navItems,
    primaryAction,
    renderLink,
    renderUserTrigger,
    slotClassNames,
    startContent,
    user: user ?? null,
    utilityItems: utilityItems ?? socialItems ?? [],
  };
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
  onActivate,
  renderLink,
}: {
  closeOnActivate?: boolean;
  item: ShellNavItem;
  layout?: HeaderLinkLayout;
  onActivate?: (() => void) | undefined;
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
    <a
      aria-current={item.active ? "page" : undefined}
      className={linkClassName}
      href={item.href}
      onClick={(event) => {
        item.onClick?.(event);

        if (closeOnActivate) {
          onActivate?.();
        }
      }}
    >
      {content}
    </a>
  );

  if (
    closeOnActivate &&
    React.isValidElement<{
      onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    }>(renderedLink)
  ) {
    return React.cloneElement(renderedLink, {
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        renderedLink.props.onClick?.(event);
        onActivate?.();
      },
    });
  }

  return renderedLink;
}

function renderSheetPrimaryAction(
  onActivate: (() => void) | undefined,
  primaryAction: React.ReactNode,
) {
  if (
    !React.isValidElement<{
      className?: string;
      onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    }>(primaryAction)
  ) {
    return primaryAction;
  }

  return React.cloneElement(primaryAction, {
    className: cn(
      primaryAction.props.className,
      "w-full justify-center sm:w-full",
    ),
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      primaryAction.props.onClick?.(event);
      onActivate?.();
    },
  });
}

function getUserInitials(user: ShellUser) {
  return user.initials ?? user.name.slice(0, 2).toUpperCase();
}

function ShellHeaderUserAvatar({ user }: { user: ShellUser }) {
  return (
    <Avatar size="sm">
      {user.avatarUrl ? (
        <AvatarImage alt={user.name} src={user.avatarUrl} />
      ) : (
        <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
      )}
    </Avatar>
  );
}

function ShellHeaderDefaultUserTrigger({ user }: { user: ShellUser }) {
  return (
    <ThemeFrame
      className="min-w-0"
      contentClassName="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-3 py-2"
      surfaceClassName="bg-[color:var(--theme-shell-user-chip-background)]"
      strokeColor="var(--theme-shell-user-chip-border)"
      variant={THEME_FRAME_VARIANTS.shellUserChip}
    >
      <ShellHeaderUserAvatar user={user} />
      <span
        className="hidden min-w-0 truncate pb-[0.08em] text-sm leading-[1.2] text-[color:var(--ink-strong)] xl:block"
        title={user.name}
      >
        {user.name}
      </span>
    </ThemeFrame>
  );
}

function createUserTriggerElement({
  renderUserTrigger,
  slotClassName,
  user,
}: {
  renderUserTrigger: ((user: ShellUser) => React.ReactNode) | undefined;
  slotClassName: string | undefined;
  user: ShellUser;
}) {
  const customTrigger = renderUserTrigger?.(user);

  if (
    customTrigger &&
    React.isValidElement<{
      "aria-label"?: string;
      "data-slot"?: string;
      className?: string;
      role?: string;
      tabIndex?: number;
      type?: string;
    }>(customTrigger) &&
    customTrigger.type !== React.Fragment
  ) {
    const isIntrinsicElement = typeof customTrigger.type === "string";
    const isButtonElement =
      isIntrinsicElement && customTrigger.type === "button";
    const isAnchorElement = isIntrinsicElement && customTrigger.type === "a";

    return React.cloneElement(customTrigger, {
      ...(isButtonElement && customTrigger.props.type === undefined
        ? { type: "button" }
        : {}),
      ...(isIntrinsicElement &&
      !isButtonElement &&
      !isAnchorElement &&
      customTrigger.props.role === undefined
        ? { role: "button" }
        : {}),
      ...(isIntrinsicElement &&
      !isButtonElement &&
      !isAnchorElement &&
      customTrigger.props.tabIndex === undefined
        ? { tabIndex: 0 }
        : {}),
      "aria-label": customTrigger.props["aria-label"] ?? user.name,
      className: cn(customTrigger.props.className, slotClassName),
      "data-slot": "user-trigger",
    });
  }

  return (
    <button
      aria-label={user.name}
      className={cn(
        "inline-flex max-w-[16rem] items-center rounded-[var(--theme-radius-md)] align-middle",
        focusRingClass,
        slotClassName,
      )}
      data-slot="user-trigger"
      type="button"
    >
      {customTrigger ?? <ShellHeaderDefaultUserTrigger user={user} />}
    </button>
  );
}

function ShellHeaderUser({
  renderUserTrigger,
  slotClassNames,
  user,
}: {
  renderUserTrigger?: ((user: ShellUser) => React.ReactNode) | undefined;
  slotClassNames: ShellNavbarSlotClassNames;
  user: ShellUser;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {createUserTriggerElement({
          renderUserTrigger,
          slotClassName: slotClassNames.userTrigger,
          user,
        })}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "overflow-visible border-0 bg-transparent p-0 ring-0",
          slotClassNames.userMenu,
        )}
        sideOffset={4}
        style={{
          minWidth: "var(--radix-popover-trigger-width)",
          width: "var(--radix-popover-trigger-width)",
        }}
      >
        <ThemeFrame
          className="w-full"
          contentClassName="grid gap-1 px-3 py-2"
          data-slot="user-menu"
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
              {...(item.onSelect
                ? {
                    onSelect: () => {
                      item.onSelect?.();
                    },
                  }
                : {})}
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

export function ShellHeader(props: NavbarProps) {
  const {
    brand,
    className,
    endContent,
    mobileTitle,
    navItems,
    primaryAction,
    renderLink,
    renderUserTrigger,
    slotClassNames,
    startContent,
    user,
    utilityItems,
  } = resolveNavbarProps(props);
  const hasStartRegion = Boolean(brand || startContent);
  const hasNavItems = navItems.length > 0;
  const hasUtilityItems = utilityItems.length > 0;
  const hasEndContent = Boolean(endContent);
  const hasUser = Boolean(user);
  const hasDesktopEndRegion =
    hasUtilityItems || hasUser || Boolean(primaryAction) || hasEndContent;
  const hasMobilePanelContent =
    hasNavItems ||
    hasUtilityItems ||
    hasUser ||
    Boolean(primaryAction) ||
    hasEndContent;
  const [isMobilePanelOpen, setIsMobilePanelOpen] = React.useState(false);
  const sheetPrimaryAction = primaryAction
    ? renderSheetPrimaryAction(() => setIsMobilePanelOpen(false), primaryAction)
    : null;

  return (
    <header className="sticky top-4 z-40">
      <ThemeFrame
        className={cn(className, slotClassNames.root)}
        contentClassName="px-4 py-3 md:px-5"
        data-slot="root"
        surfaceClassName="bg-[color:var(--theme-shell-header-background)] bg-[image:var(--theme-shell-header-background-image)] backdrop-blur-md"
        strokeColor="var(--theme-shell-header-border)"
        style={{ boxShadow: "var(--theme-shell-header-shadow)" }}
        variant={THEME_FRAME_VARIANTS.shellHeader}
      >
        <div
          className="flex items-center gap-3 lg:gap-4"
          data-has-end={hasDesktopEndRegion ? "true" : "false"}
          data-has-nav={hasNavItems ? "true" : "false"}
          data-has-start={hasStartRegion ? "true" : "false"}
        >
          <div
            className={cn(
              "min-w-0 flex-1 basis-0 items-center gap-3",
              hasStartRegion ? "flex" : "hidden lg:flex",
              slotClassNames.start,
            )}
            data-slot="start"
          >
            {brand ? (
              <div className="min-w-0 shrink-0" data-slot="brand">
                {brand}
              </div>
            ) : null}
            {startContent ? (
              <div className="min-w-0 flex-1" data-slot="start-content">
                {startContent}
              </div>
            ) : null}
          </div>
          {hasNavItems ? (
            <nav
              aria-label="Primary navigation"
              className={cn(
                "hidden items-center gap-1 lg:flex",
                slotClassNames.nav,
              )}
              data-slot="nav"
            >
              {navItems.map((item) => (
                <HeaderLink
                  item={item}
                  key={item.href}
                  renderLink={renderLink}
                />
              ))}
            </nav>
          ) : null}
          {hasDesktopEndRegion || hasNavItems ? (
            <div
              className={cn(
                "hidden min-w-0 flex-1 basis-0 items-center justify-end gap-2 lg:flex",
                slotClassNames.end,
              )}
              data-slot="end"
            >
              {hasUtilityItems ? (
                <div
                  className={cn(
                    "flex items-center gap-2",
                    slotClassNames.utility,
                  )}
                  data-slot="utility"
                >
                  {utilityItems.map((item) => (
                    <HeaderLink
                      item={item}
                      key={item.href}
                      renderLink={renderLink}
                    />
                  ))}
                </div>
              ) : null}
              {hasUser && user ? (
                <ShellHeaderUser
                  renderUserTrigger={renderUserTrigger}
                  slotClassNames={slotClassNames}
                  user={user}
                />
              ) : null}
              {primaryAction}
              {endContent ? (
                <div
                  className="flex items-center gap-2"
                  data-slot="end-content"
                >
                  {endContent}
                </div>
              ) : null}
            </div>
          ) : null}
          {hasMobilePanelContent ? (
            <Sheet open={isMobilePanelOpen} onOpenChange={setIsMobilePanelOpen}>
              <div className="ml-auto lg:hidden" data-slot="mobile-trigger">
                <SheetTrigger asChild>
                  <Button
                    aria-label="Open navigation menu"
                    className={cn(
                      "rounded-[var(--theme-radius-sm)] border-transparent bg-transparent text-[color:var(--theme-shell-nav-icon-foreground)] shadow-none hover:bg-[color:var(--theme-shell-nav-icon-hover-background)] hover:text-[color:var(--theme-shell-nav-icon-hover-foreground)]",
                      slotClassNames.mobileTrigger,
                    )}
                    size="icon"
                    variant="ghost"
                  >
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
              </div>
              <SheetContent
                aria-describedby={undefined}
                className={cn(
                  "w-[min(90vw,24rem)] gap-0 border-[color:var(--theme-shell-mobile-surface-border)]",
                  slotClassNames.mobilePanel,
                )}
              >
                <SheetHeader className="border-b border-[color:var(--theme-shell-mobile-surface-border)] px-5 pt-5 pb-4">
                  <SheetTitle>{mobileTitle}</SheetTitle>
                </SheetHeader>
                <div
                  className="flex min-h-0 flex-1 flex-col gap-6 px-4 pb-5"
                  data-slot="mobile-panel"
                >
                  {hasNavItems ? (
                    <nav
                      aria-label="Mobile navigation"
                      className="grid gap-1.5"
                    >
                      {navItems.map((item) => (
                        <HeaderLink
                          closeOnActivate
                          item={item}
                          key={item.href}
                          layout="sheet"
                          onActivate={() => setIsMobilePanelOpen(false)}
                          renderLink={renderLink}
                        />
                      ))}
                    </nav>
                  ) : null}
                  {endContent ? (
                    <div className="grid gap-3" data-slot="end-content">
                      {endContent}
                    </div>
                  ) : null}
                  {hasUser && user ? (
                    <div className="grid gap-3 rounded-[var(--theme-radius-lg)] border border-[color:var(--theme-shell-mobile-surface-border)] bg-[color:var(--theme-shell-mobile-surface-background)] p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <ShellHeaderUserAvatar user={user} />
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
                            <Button
                              className="w-full justify-start"
                              key={item.id}
                              onClick={() => {
                                item.onSelect?.();
                                setIsMobilePanelOpen(false);
                              }}
                              variant={item.destructive ? "ghost" : "secondary"}
                            >
                              {item.icon}
                              {item.label}
                            </Button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="mt-auto grid gap-3">
                    {hasUtilityItems ? (
                      <div
                        className={cn(
                          "grid grid-cols-2 gap-2",
                          slotClassNames.utility,
                        )}
                        data-slot="utility"
                      >
                        {utilityItems.map((item) => (
                          <HeaderLink
                            closeOnActivate
                            item={item}
                            key={item.href}
                            layout="sheet"
                            onActivate={() => setIsMobilePanelOpen(false)}
                            renderLink={renderLink}
                          />
                        ))}
                      </div>
                    ) : null}
                    {sheetPrimaryAction ? (
                      <div>{sheetPrimaryAction}</div>
                    ) : null}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : null}
        </div>
      </ThemeFrame>
    </header>
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

export interface HeaderProps extends Omit<NavbarProps, "navItems"> {
  currentPath?: string;
  navItems?: ShellNavItem[];
}

export function Header({
  brand,
  className,
  currentPath,
  endContent,
  mobileTitle,
  navItems = [],
  primaryAction,
  renderLink,
  renderUserTrigger,
  slotClassNames,
  startContent,
  socialItems = [],
  user,
  utilityItems,
}: HeaderProps) {
  return (
    <ShellHeader
      brand={brand}
      className={className}
      endContent={endContent}
      navItems={navItems.map((item) => ({
        ...item,
        active:
          item.active ?? (currentPath ? currentPath === item.href : false),
      }))}
      mobileTitle={mobileTitle}
      primaryAction={primaryAction}
      renderLink={renderLink}
      renderUserTrigger={renderUserTrigger}
      slotClassNames={slotClassNames}
      startContent={startContent}
      socialItems={socialItems}
      user={user}
      utilityItems={utilityItems}
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
