import * as React from "react";
import { Menu, LogOut, UserRound, ExternalLink } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { type NavItem, cn } from "@/lib/utils";

interface LinkItem extends NavItem {
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface HeaderUserMenuItem {
  destructive?: boolean;
  id: string;
  label: string;
  onSelect?: () => void;
}

export interface HeaderUser {
  avatarUrl?: string;
  initials?: string;
  menuItems?: HeaderUserMenuItem[];
  name: string;
  subtitle?: string;
}

export interface HeaderProps {
  brand: React.ReactNode;
  currentPath?: string;
  navItems: LinkItem[];
  primaryAction?: React.ReactNode;
  socialItems?: LinkItem[];
  user?: HeaderUser;
}

function HeaderLink({
  active,
  item
}: {
  active?: boolean;
  item: LinkItem;
}) {
  return (
    <a
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors",
        active
          ? "bg-[color:var(--paper)] text-[color:var(--ink-strong)] shadow-[var(--shadow-soft)]"
          : "text-[color:var(--muted-foreground)] hover:bg-white/45 hover:text-[color:var(--foreground)]"
      )}
      href={item.href}
      onClick={item.onClick}
    >
      {item.icon}
      {item.label}
    </a>
  );
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
    <header className="sticky top-4 z-40 rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:rgba(251,246,237,0.8)] px-4 py-3 shadow-[var(--shadow-paper)] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex-1">{brand}</div>
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <HeaderLink active={currentPath === item.href} item={item} key={item.href} />
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {socialItems.map((item) => (
            <HeaderLink item={item} key={item.href} />
          ))}
          {user ? <HeaderUserMenu user={user} /> : null}
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
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2">
              {navItems.map((item) => (
                <HeaderLink active={currentPath === item.href} item={item} key={item.href} />
              ))}
              {socialItems.map((item) => (
                <HeaderLink item={item} key={item.href} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function HeaderUserMenu({ user }: { user: HeaderUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-white/45 px-2 py-1.5">
          <Avatar size="sm">
            {user.avatarUrl ? <AvatarImage alt={user.name} src={user.avatarUrl} /> : null}
            <AvatarFallback>{user.initials ?? user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm text-[color:var(--ink-strong)] xl:inline">{user.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <UserRound className="size-4" />
          {user.name}
        </DropdownMenuItem>
        {user.subtitle ? (
          <DropdownMenuItem className="pointer-events-none text-[color:var(--muted-foreground)]">
            {user.subtitle}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        {user.menuItems?.map((item) => (
          <DropdownMenuItem key={item.id} onClick={item.onSelect}>
            {item.destructive ? <LogOut className="size-4" /> : <ExternalLink className="size-4" />}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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
    <footer className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:rgba(251,246,237,0.82)] px-5 py-6 shadow-[var(--shadow-paper)]">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="grid gap-2">
          <h2 className="font-[var(--font-heading)] text-3xl text-[color:var(--ink-strong)]">
            {title}
          </h2>
          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{note}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {columns.map((column) => (
            <div className="grid gap-2" key={column.id}>
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                {column.title}
              </p>
              <div className="grid gap-2">
                {column.links.map((link) => (
                  <a className="text-sm hover:underline" href={link.href} key={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
