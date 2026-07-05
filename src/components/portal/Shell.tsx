"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  DashboardIcon,
  LeadsIcon,
  CalendarIcon,
  TeamIcon,
  SettingsIcon,
  BellIcon,
  ChevronDownIcon,
} from "./icons";

const NAV = [
  { label: "Dashboard", href: "/portal", icon: DashboardIcon },
  { label: "Leads", href: "/portal/leads", icon: LeadsIcon },
  { label: "Calendar", href: "/portal/calendar", icon: CalendarIcon },
  { label: "Team", href: "/portal/team", icon: TeamIcon },
  { label: "Settings", href: "/portal/settings", icon: SettingsIcon },
];

function isActive(pathname: string, href: string) {
  return href === "/portal" ? pathname === "/portal" : pathname.startsWith(href);
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-[2px] px-3">
      {NAV.map(({ label, href, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-[10px] px-3 py-[9px] font-sans text-[14.5px] transition-colors duration-150 ${
              active
                ? "bg-primary-100 font-semibold text-secondary-900"
                : "text-secondary-600 hover:bg-secondary-100/70 hover:text-secondary-900"
            }`}
          >
            <Icon className="size-[19px] shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-5 py-[18px]">
      <Image
        src="/assets/logo-mark.png"
        alt="Readymade"
        width={36}
        height={33}
        className="h-[30px] w-[33px] object-contain"
      />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold text-secondary-900">READYMADE</span>
        <span className="text-[9.5px] tracking-[0.14em] text-brand">CONSOLE</span>
      </span>
    </div>
  );
}

function AccountCard() {
  return (
    <div className="mx-3 mb-3 flex items-center gap-2 rounded-[12px] border border-hairline p-2">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary-900 font-sans text-[13px] font-semibold text-secondary-0">
        RS
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-sans text-[13px] font-medium text-secondary-900">
          Readymade Team
        </span>
        <span className="truncate font-sans text-[11px] text-secondary-500">
          hello@readymade.io
        </span>
      </span>
      <ChevronDownIcon className="ml-auto size-4 text-secondary-300" />
    </div>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const title =
    [...NAV].reverse().find((n) => isActive(pathname, n.href))?.label ?? "Portal";

  return (
    <div className="min-h-dvh bg-secondary-0 text-secondary-900">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-hairline bg-white lg:flex">
        <Brand />
        <div className="mt-2 flex-1 overflow-y-auto">
          <NavList pathname={pathname} />
        </div>
        <AccountCard />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-[264px] flex-col border-r border-hairline bg-white">
            <Brand />
            <div className="mt-2 flex-1 overflow-y-auto">
              <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
            <AccountCard />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-[248px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-[64px] items-center gap-3 border-b border-hairline bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="flex size-9 flex-col items-center justify-center gap-[5px] rounded-lg lg:hidden"
          >
            <span className="h-[2px] w-5 bg-secondary-900" />
            <span className="h-[2px] w-5 bg-secondary-900" />
            <span className="h-[2px] w-5 bg-secondary-900" />
          </button>
          <h1 className="text-[20px] font-bold tracking-[-0.01em] text-secondary-900">
            {title}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="flex size-9 items-center justify-center rounded-[10px] border border-hairline text-secondary-600 hover:bg-secondary-100/70"
            >
              <BellIcon className="size-[18px]" />
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
