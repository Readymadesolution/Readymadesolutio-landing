"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About Us", href: "/about" },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center justify-center gap-2">
      <Image
        src={dark ? "/assets/logo-footer.svg" : "/assets/logo-mark.png"}
        alt="ReadyMade Solution"
        width={60}
        height={55}
        className="h-[44px] w-[48px] object-contain lg:h-[55px] lg:w-[60px]"
      />
      <span className="flex flex-col items-center">
        <span
          className={`text-[17px] font-bold leading-[24px] lg:text-[20px] lg:leading-[30px] ${dark ? "text-white" : "text-black"}`}
        >
          READYMADE
        </span>
        <span className="w-full text-center text-[11px] leading-[16px] text-brand lg:text-[12px] lg:leading-[18px]">
          SOLUTION INC
        </span>
      </span>
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-[135px] lg:px-[80px]">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center rounded-[4px] px-4 py-2 text-[20px] leading-[30px] text-secondary-900 transition-colors duration-200 ${
                isActive(pathname, item.href)
                  ? "bg-primary-100 font-bold"
                  : "hover:bg-primary-100/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/consultation"
          className="pressable hidden items-center justify-center rounded-[99px] bg-secondary-900 px-5 py-3 text-[20px] leading-[30px] text-secondary-0 hover:bg-black lg:flex"
        >
          Book Consultation
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative flex size-11 flex-col items-center justify-center gap-[5px] rounded-lg lg:hidden"
        >
          <span
            className={`h-[2px] w-6 bg-secondary-900 transition-transform duration-200 ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`h-[2px] w-6 bg-secondary-900 transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-[2px] w-6 bg-secondary-900 transition-transform duration-200 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`overflow-hidden border-secondary-100 bg-white transition-[max-height] duration-300 ease-out lg:hidden ${
          open ? "max-h-96 border-b" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 pb-4 pt-1 sm:px-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-4 py-3 text-[18px] leading-[26px] text-secondary-900 ${
                isActive(pathname, item.href) ? "bg-primary-100 font-bold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/consultation"
            className="mt-2 flex items-center justify-center rounded-full bg-secondary-900 px-5 py-3 text-[17px] font-semibold text-secondary-0"
          >
            Book Consultation
          </Link>
        </nav>
      </div>
    </header>
  );
}
