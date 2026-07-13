import Link from "next/link";
import { Logo } from "./Header";

function LinkedInIcon() {
  return (
    <svg width="17" height="17" viewBox="12 14 16 15" fill="none" aria-hidden>
      <path
        d="M14.0274 15.5791C14.4971 15.581 14.9468 15.7694 15.2775 16.1028C15.6083 16.4362 15.7931 16.8874 15.7912 17.357C15.7893 17.8267 15.6009 18.2764 15.2675 18.6071C14.9341 18.9379 14.4829 19.1227 14.0133 19.1208C13.5436 19.1189 13.0939 18.9305 12.7632 18.5971C12.4324 18.2637 12.2476 17.8125 12.2495 17.3429C12.2514 16.8732 12.4398 16.4235 12.7732 16.0928C13.1066 15.762 13.5578 15.5772 14.0274 15.5791ZM12.6249 19.4749H15.4583V27.9749H12.6249V19.4749ZM17.5833 19.4749H20.2749V20.6791H20.3104C20.6858 20.0062 21.6066 19.2979 22.9808 19.2979C25.8354 19.2979 26.3666 21.0687 26.3666 23.3708V27.9749H23.5333V24.4333C23.5333 23.5833 23.5191 22.4924 22.3291 22.4924C21.1249 22.4924 20.9408 23.4133 20.9408 24.3695V27.9749H18.1074L17.5833 19.4749Z"
        fill="#B9B9B9"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="108 14.5 14 14" fill="none" aria-hidden>
      <path
        d="M117.833 15.225H112.167C110.211 15.225 108.625 16.8106 108.625 18.7666V24.4333C108.625 26.3893 110.211 27.975 112.167 27.975H117.833C119.789 27.975 121.375 26.3893 121.375 24.4333V18.7666C121.375 16.8106 119.789 15.225 117.833 15.225Z"
        stroke="#B9B9B9"
        strokeWidth="1.41667"
      />
      <path
        d="M115 24.4333C116.565 24.4333 117.833 23.1647 117.833 21.5999C117.833 20.0351 116.565 18.7666 115 18.7666C113.435 18.7666 112.167 20.0351 112.167 21.5999C112.167 23.1647 113.435 24.4333 115 24.4333Z"
        stroke="#B9B9B9"
        strokeWidth="1.41667"
      />
      <path
        d="M118.896 18.5541C119.365 18.5541 119.746 18.1736 119.746 17.7041C119.746 17.2347 119.365 16.8541 118.896 16.8541C118.426 16.8541 118.046 17.2347 118.046 17.7041C118.046 18.1736 118.426 18.5541 118.896 18.5541Z"
        fill="#B9B9B9"
      />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/ready-made-solution-inc/",
    icon: <LinkedInIcon />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/readymadesolution",
    icon: <InstagramIcon />,
  },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/#products" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/consultation" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-black px-4 pb-[34px] pt-[72px] sm:px-[112px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[54px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-8">
          {/* Brand column */}
          <div className="flex flex-col items-start gap-[17px]">
            <Logo dark />
            <p className="max-w-[280px] font-sans text-[14.5px] leading-[24px] text-neutral-300">
              Engineering intelligent software, AI automation, and enterprise
              infrastructure for ambitious businesses.
            </p>
            <div className="flex gap-[10px] pt-[3px]">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="pressable flex size-[38px] items-center justify-center rounded-[11px] bg-secondary-800 hover:bg-secondary-500"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <p className="text-[16px] font-bold uppercase leading-[24px] text-primary-500">
              Company
            </p>
            <ul className="flex flex-col gap-[11px]">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[16px] leading-[24px] text-neutral-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <p className="text-[16px] font-bold uppercase leading-[24px] text-primary-500">
              Contact
            </p>
            <ul className="flex flex-col gap-[11px] text-[16px] leading-[24px] text-neutral-300">
              <li>
                <a href="mailto:info@readymadesolution.com">info@readymadesolution.com</a>
              </li>
              <li>
                <a href="tel:+12046745873">+1 (204) 674-5873</a>
              </li>
              <li>
                330 5th Avenue SW, Suite 1800,
                <br />
                Calgary, Alberta, T2P 0L4, Canada
              </li>
            </ul>
          </div>

          {/* Get started */}
          <div className="flex flex-col gap-[14px]">
            <p className="text-[16px] font-bold uppercase leading-[24px] text-primary-500">
              Get started
            </p>
            <p className="text-[16px] leading-[24px] text-neutral-300">
              Book a free consultation with our team.
            </p>
            <Link
              href="/consultation"
              className="pressable mt-6 flex h-12 w-full items-center justify-center rounded-full bg-secondary-0 px-5 font-sans text-[16px] font-bold text-secondary-900 md:mt-auto"
            >
              Book a consultation
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-center border-t border-secondary-100/20 pt-6">
          <div className="flex items-center gap-6 font-sans text-[13px] text-secondary-300">
            <span>Copyright © ReadyMade Solution 2026</span>
            <span className="size-1 rounded-full bg-secondary-300" aria-hidden />
            <Link href="/privacy">Privacy</Link>
            <span className="size-1 rounded-full bg-secondary-300" aria-hidden />
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
