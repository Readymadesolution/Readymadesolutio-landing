import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { HeroEnter, Reveal, Stagger, StaggerItem } from "@/components/motion";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: "700" });

export const metadata: Metadata = {
  title: "About Us — ReadyMade Solution",
  description:
    "An enterprise software development company helping businesses unlock growth through intelligent software, AI automation and reliable infrastructure.",
};

const values = [
  {
    icon: "/assets/about/icon-intelligence.svg",
    number: "01",
    numberColor: "#777777",
    bordered: false,
    title: "Intelligence first",
    body: "Every solution we build is designed to learn, automate, and get smarter over time.",
  },
  {
    icon: "/assets/about/icon-delivery.svg",
    number: "02",
    numberColor: "#868685",
    bordered: true,
    title: "Bias for delivery",
    body: "We ship fast and iterate - momentum compounds, and shipped beats perfect.",
  },
  {
    icon: "/assets/about/icon-trust.svg",
    number: "03",
    numberColor: "#868685",
    bordered: true,
    title: "Enterprise trust",
    body: "Security, compliance and reliability are built in - not bolted on at the end.",
  },
  {
    icon: "/assets/about/icon-partnership.svg",
    number: "04",
    numberColor: "#868685",
    bordered: true,
    title: "Partnership",
    body: "We act as an extension of your team, invested in outcomes - not deliverables.",
  },
];

function Divider() {
  return (
    <div className="my-8 flex h-10 items-center px-5 lg:px-20" aria-hidden>
      <div className="h-px w-full bg-[#edecec]" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-white pt-14">
      {/* Hero */}
      <section className="px-5 py-10 lg:px-20">
        <div className="flex flex-col items-center justify-center gap-9 py-10 text-center lg:h-[374px] lg:py-0">
          <HeroEnter index={0}>
            <p className="text-[16px] font-bold uppercase leading-6 text-[#269c80]">
              About ReadyMade
            </p>
          </HeroEnter>
          <HeroEnter index={1}>
            <h1 className="max-w-[876px] text-[44px] font-bold leading-[1.05] text-secondary-900 lg:text-[76px] lg:leading-[73px]">
              We engineer the
              <br />
              future of business.
            </h1>
          </HeroEnter>
          <HeroEnter index={2}>
            <p className="flex max-w-[930px] items-center text-[18px] leading-[1.5] text-[#454745] lg:h-[88px] lg:text-[24px] lg:leading-8">
              An enterprise software development company helping businesses,
              unlock growth through intelligent software, AI automation and
              reliable infrastructure.
            </p>
          </HeroEnter>
        </div>
        <HeroEnter index={3}>
          <div className="relative mt-[10px] h-[300px] w-full overflow-hidden rounded-[20px] lg:h-[524px]">
            <Image
              src="/assets/about/office-photo.png"
              alt="The ReadyMade team working together in the office"
              fill
              sizes="(min-width: 1024px) 1280px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </HeroEnter>
      </section>

      {/* Story */}
      <section className="relative mt-8 px-5 py-16 lg:px-20 lg:py-[84px]">
        {/* Grid-mask overlay exported from Figma (node 56:3265) */}
        <Image
          src="/assets/about/story-grid.png"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none select-none object-cover"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6">
          <p className="text-[16px] font-bold uppercase leading-6 text-[#269c80]">
            About ReadyMade
          </p>
          <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-[60px]">
            <Reveal className="min-w-0 flex-1 pt-[5px]">
              <div className="flex max-w-[598px] flex-col gap-[14px]">
                <h2 className="text-[44px] font-bold leading-[1.05] text-secondary-900 lg:text-[72px] lg:leading-[72px]">
                  Software that solves real problems
                </h2>
                <div className="pt-[5.7px] text-[16px] leading-6 text-[#464646]">
                  <p>
                    We started ReadyMade with a simple belief: powerful
                    software shouldn&apos;t take years to ship. From customer
                    acquisition and lead management to automation and
                    operational efficiency, we build digital products that
                    move the needle.
                  </p>
                  <p className="mt-6">
                    Today we operate as an enterprise software development
                    company - pairing senior engineers with our own product
                    platform to deliver intelligent solutions at enterprise
                    scale, across three countries and counting.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal className="relative w-full max-w-[570px] shrink-0 lg:w-[570px]">
              <div className="absolute -bottom-[18px] -right-[18px] left-[18px] top-[18px] rounded-[24px] bg-[#b3eddf]" />
              <div className="relative overflow-hidden rounded-[24px] border border-[#e8ebe6] bg-white/[0.08] p-px shadow-[0px_30px_60px_-34px_rgba(14,15,12,0.34)]">
                <div className="relative h-[300px] w-full lg:h-[400px]">
                  <Image
                    src="/assets/about/team-photo.png"
                    alt="The ReadyMade team gathered around a laptop"
                    fill
                    sizes="(min-width: 1024px) 570px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mt-16 bg-[#f4f6f2] px-5 py-16 lg:mt-[104px] lg:px-[120px] lg:py-[90px]">
        <div className="flex max-w-[1200px] flex-col gap-11">
          <div className="flex flex-col gap-[14px] pt-[5px]">
            <p className="text-[16px] font-bold uppercase leading-6 text-[#269c80]">
              What drives us
            </p>
            <h2 className="text-[44px] font-bold leading-[1.05] text-secondary-900 lg:text-[72px] lg:leading-[72px]">
              Our values
            </h2>
          </div>
          <Stagger className="flex flex-col gap-[18px] lg:flex-row">
            {values.map((value) => (
              <StaggerItem
                key={value.number}
                className={`liftable flex flex-1 flex-col gap-2 rounded-[20px] bg-white p-[28px]${
                  value.bordered ? " border border-[#e8ebe6]" : ""
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="flex size-[46px] items-center justify-center rounded-[13px] bg-primary-100">
                    <Image
                      src={value.icon}
                      alt=""
                      width={21}
                      height={21}
                    />
                  </span>
                  <span
                    className={`${jetbrainsMono.className} text-[10px] font-bold`}
                    style={{ color: value.numberColor }}
                  >
                    {value.number}
                  </span>
                </div>
                <h3 className="pt-2 text-[20px] font-bold leading-6 text-secondary-900">
                  {value.title}
                </h3>
                <p className="text-[16px] leading-6 text-[#777777]">
                  {value.body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Divider />

      {/* CTA */}
      <section className="px-5 py-8 lg:px-20">
        <Reveal>
          <div className="relative w-full overflow-hidden rounded-[28px] bg-black px-10 pb-[78px] pt-[77px]">
            {/* Real Figma background layers: grid-mask (56:3141) + blurred glows (56:3145, 57:3563) */}
            <Image
              src="/assets/about/cta-grid.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 1280px, 100vw"
              className="pointer-events-none select-none object-cover"
              aria-hidden
            />
            <Image
              src="/assets/about/cta-glow-tl.png"
              alt=""
              width={855}
              height={630}
              className="pointer-events-none absolute left-0 top-0 h-[315px] w-[427.5px] max-w-none select-none mix-blend-screen"
              aria-hidden
            />
            <div className="relative flex flex-col items-center gap-[17px]">
              <h2 className="text-center text-[34px] font-bold leading-[1.05] text-secondary-0 lg:text-[58px] lg:leading-[56px]">
                Let&apos;s build something great
              </h2>
              <p className="max-w-[504px] text-center font-sans text-[18px] leading-[28.8px] text-neutral-300">
                Tell us about your business and we&apos;ll show you what&apos;s
                possible.
              </p>
              <div className="pt-[17px]">
                <Link
                  href="/consultation"
                  className="pressable flex h-[51px] items-center gap-[9px] rounded-full bg-secondary-0 px-[30px] font-sans text-[16px] font-bold text-secondary-900"
                >
                  Book consultation
                  <Image
                    src="/assets/about/icon-arrow-right.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                </Link>
              </div>
            </div>
            <Image
              src="/assets/about/cta-glow-br.png"
              alt=""
              width={827}
              height={671}
              className="pointer-events-none absolute bottom-0 right-0 h-[335.5px] w-[413.5px] max-w-none select-none mix-blend-screen"
              aria-hidden
            />
          </div>
        </Reveal>
      </section>

      <Divider />
    </div>
  );
}
