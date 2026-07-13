import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProjectCard, { type Project } from "@/components/projects/ProjectCard";
import { HeroEnter, Reveal, Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "Projects — ReadyMade Solution",
  description:
    "Six builds from across our portfolio - fintech, e-commerce, telecom and beyond. Real systems, delivered end to end, with measurable outcomes.",
};

const stats: [string, string][] = [
  ["6+", "Projects delivered"],
  ["6", "Core products"],
  ["12+", "Happy clients"],
  ["96%", "On-time delivery"],
];

const projects: Project[] = [
  {
    title: "Ajopro 3.0 - Fintech App",
    description:
      "A full redesign of the Ajopro fintech contribution & planning platform - smoother onboarding, clearer wallets and automated payouts.",
    tags: ["Fintech", "Mobile App", "Redesign"],
    image: "/assets/projects/ajopro-fintech-app.png",
    href: "https://ajopro.ca",
    palette: "lightA",
    marginH: 322,
    imgH: 308,
    imgW: 622,
    imgRadius: 0,
    descMaxW: 432,
  },
  {
    title: "BO AI - Sales Assistant",
    description:
      "An AI assistant that wrote product copy and live upsell prompts across a large, unoptimized catalog.",
    tags: ["AI", "Web App"],
    image: "/assets/projects/bo-ai-sales-assistant.png",
    palette: "dark",
    marginH: 318,
    imgH: 304,
    imgW: 533,
    descMaxW: 450,
  },
  {
    title: "Helix Call - Cloud Telephony",
    description:
      "Inbound and outbound routing, live analytics and QA unified into one cloud platform.",
    tags: ["SaaS", "Telephony"],
    image: "/assets/projects/helix-call-cloud-telephony.png",
    href: "https://helixcall.com",
    palette: "dark",
    borderColor: "#EDECEC",
    arrowColor: "#B9B9B9",
    marginH: 338,
    imgH: 316,
    imgW: 533,
    descMaxW: 420,
  },
  {
    title: "Botaplace - E-Commerce Platform",
    description:
      "A full migration to hosted storefronts, integrated payments and unified inventory and orders for a multi-brand retailer.",
    tags: ["E-Commerce", "Payments", "Web"],
    image: "/assets/projects/botaplace-ecommerce-platform-v2.png",
    href: "https://botaplace.com",
    palette: "lightA",
    marginH: 338,
    imgH: 307,
    imgW: 602,
    imgRadius: 10,
    descMaxW: 440,
  },
  {
    title: "YourSend - Lead Engagement",
    description:
      "Unifies customer conversations from every channel into one shared inbox, with smart routing and follow-up.",
    tags: ["SaaS", "Inbox"],
    image: "/assets/projects/yoursend-lead-engagement.png",
    href: "https://yoursend.dev",
    palette: "lightB",
    marginH: 294,
    imgH: 280,
    imgW: 533,
    descMaxW: 460,
  },
  {
    title: "Security Validation - Pen Testing",
    description:
      "A full audit, penetration test and infrastructure validation engagement to harden a fintech platform ahead of a compliance review.",
    tags: ["Security", "Audit", "Compliance"],
    image: "/assets/projects/security-validation-pen-testing.png",
    palette: "lightB",
    marginH: 308,
    imgH: 294,
    imgW: 632,
    descMaxW: 460,
  },
];

/** Hairline section divider (Figma: 40px band, 1px #EDECEC line, 32px margins). */
function Divider() {
  return (
    <div aria-hidden="true" className="mx-4 my-8 flex h-10 items-center lg:mx-20">
      <div className="w-full border-t border-[#EDECEC]" />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="px-4 py-10 lg:px-20 lg:pb-10 lg:pt-[96px]">
        <div className="flex min-h-[374px] flex-col items-center justify-center gap-9 text-center">
          <HeroEnter index={0}>
            <h1 className="max-w-[876px] text-[44px] font-bold leading-[1.05] text-secondary-900 lg:text-[76px] lg:leading-[73px]">
              Projects that
              <br />
              delivered real impact.
            </h1>
          </HeroEnter>
          <HeroEnter index={1}>
            <p className="max-w-[1022px] text-[18px] leading-7 text-[#454745] lg:py-3 lg:text-[24px] lg:leading-8">
              Six builds from across our portfolio - fintech, e-commerce, telecom and beyond.{" "}
              <br className="hidden lg:block" />
              Real systems, delivered end to end, with measurable outcomes.
            </p>
          </HeroEnter>
        </div>
      </section>

      {/* "Outcomes, not output" stats band */}
      <section className="relative mt-8 overflow-hidden bg-secondary-900 px-6 py-[84px] lg:px-[170px]">
        {/* Real Figma export: #171717 base + masked chartreuse grid texture */}
        <Image
          src="/assets/projects/stats-band-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <Reveal className="relative mx-auto flex w-full max-w-[1100px] flex-col items-center gap-[14px] pt-[5px]">
          <p className="text-center text-[14px] font-bold uppercase leading-[18px] text-[#67dabe]">
            The throughline
          </p>
          <div className="flex w-full flex-col gap-3">
            <h2 className="text-center text-[40px] font-bold leading-tight text-secondary-0 lg:text-[58px] lg:leading-[87px]">
              Outcomes, not output
            </h2>
            <div className="flex w-full flex-col gap-10 pt-[30px] sm:flex-row sm:gap-6">
              {stats.map(([value, label]) => (
                <div key={label} className="flex flex-1 flex-col items-center gap-[10px]">
                  <div className="text-center text-[44px] font-bold leading-[66px] text-secondary-0">
                    {value}
                  </div>
                  <div className="text-center text-[16px] leading-6 text-[#bbbbbb]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Project cards grid */}
      <section className="mt-[104px] px-4 py-10 sm:px-8 lg:px-20">
        <div className="mx-auto max-w-[1280px]">
          {/* Row 1: Ajopro (664) + BO AI (563) */}
          <Stagger className="flex flex-col items-start gap-6 lg:flex-row lg:gap-12">
            <StaggerItem className="w-full lg:w-[664px]">
              <ProjectCard project={projects[0]} className="lg:h-[536px]" />
            </StaggerItem>
            <StaggerItem className="w-full lg:mt-px lg:w-[563px]">
              <ProjectCard project={projects[1]} className="lg:h-[534px]" />
            </StaggerItem>
          </Stagger>
          {/* Row 2: Helix (563) + Botaplace (664) */}
          <Stagger className="mt-6 flex flex-col items-start gap-6 lg:mt-[55px] lg:flex-row lg:gap-12">
            <StaggerItem className="w-full lg:w-[563px]">
              <ProjectCard project={projects[2]} className="lg:h-[534px]" />
            </StaggerItem>
            <StaggerItem className="w-full lg:w-[664px]">
              <ProjectCard project={projects[3]} className="lg:h-[534px]" />
            </StaggerItem>
          </Stagger>
          {/* Row 3: YourSend (563) + Security (662) */}
          <Stagger className="mt-6 flex flex-col items-start gap-6 lg:mt-[55px] lg:flex-row lg:gap-[54px]">
            <StaggerItem className="w-full lg:w-[563px]">
              <ProjectCard project={projects[4]} className="lg:h-[534px]" />
            </StaggerItem>
            <StaggerItem className="w-full lg:w-[662px]">
              <ProjectCard project={projects[5]} className="lg:h-[534px]" />
            </StaggerItem>
          </Stagger>

          {/* Development Services */}
          <Reveal className="mt-6 lg:mt-8">
            <div className="liftable flex h-auto w-full flex-col items-center overflow-hidden rounded-[24px] border border-[#EDECEC] bg-[#FCFCFC] lg:h-[300px] lg:w-[726px] lg:flex-row">
              <div className="flex w-full flex-col px-6 pb-6 pt-5 lg:w-[371px] lg:shrink-0">
                <h3 className="pb-[7px] text-[32px] font-bold leading-10 text-secondary-900 lg:whitespace-nowrap">
                  Development Services
                </h3>
                <p className="max-w-[302px] pb-[18px] text-[15px] leading-[19px] text-[#777777]">
                  We manage development services, helping organizations build fintech and
                  other digital solutions.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Fintech", "Web App", "Digital Solutions"].map((tag) => (
                    <span
                      key={tag}
                      className="whitespace-nowrap rounded-full bg-[#ededed] px-[13px] py-[6px] text-[13px] leading-4 text-[#777777]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full px-[14px] pb-[14px] lg:h-[258px] lg:w-[378px] lg:shrink-0 lg:pb-0 lg:pt-[14px]">
                <div className="relative h-[230px] w-full overflow-hidden rounded-[16px] lg:w-[350px]">
                  <Image
                    src="/assets/projects/development-services-hero-v2.png"
                    alt="Development Services"
                    fill
                    sizes="350px"
                    className="rounded-[16px] object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* CTA band */}
      <section className="px-4 py-8 lg:px-20">
        <div className="relative overflow-hidden rounded-[28px] bg-black px-6 pb-[78px] pt-[77px] lg:px-10">
          {/* Real Figma export: masked chartreuse grid + green radial glows */}
          <Image
            src="/assets/projects/cta-band-bg.png"
            alt=""
            fill
            sizes="1280px"
            className="object-cover"
            aria-hidden="true"
          />
          <Reveal className="relative flex w-full flex-col items-center gap-[17px]">
            <h2 className="text-center text-[38px] font-bold leading-[1.1] text-secondary-0 lg:text-[58px] lg:leading-[56px]">
              Your project could be next
            </h2>
            <p className="max-w-[520px] text-center font-sans text-[18px] leading-[28.8px] text-neutral-300 lg:whitespace-nowrap">
              Tell us what you&apos;re building and we&apos;ll show you how we&apos;d ship
              it.
            </p>
            <div className="pt-[17px]">
              <Link
                href="/consultation"
                className="pressable flex h-[51px] items-center gap-[9px] rounded-full bg-secondary-0 px-[30px] font-sans text-[16px] font-bold leading-normal text-secondary-900"
              >
                Start a project
                <svg viewBox="0 0 18 18" fill="none" className="size-[18px]" aria-hidden="true">
                  <path
                    d="M3.75 9H14.25M9.75 13.5L14.25 9L9.75 4.5"
                    stroke="#171717"
                    strokeWidth="1.65"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />
    </div>
  );
}
