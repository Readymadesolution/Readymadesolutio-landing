import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";
import { HeroEnter } from "@/components/motion";

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-[80px] py-[40px] max-lg:px-6">
      <div className="flex items-center gap-[46px] max-lg:flex-col max-lg:items-start">
        <div className="flex w-[633px] max-w-full flex-col gap-[32px]">
          <div className="flex flex-col gap-[20px]">
            <HeroEnter index={0}>
              <h1 className="text-[70px] font-bold leading-[73px] text-[#171717] max-lg:text-[44px] max-lg:leading-[1.1]">
                We build software that scales with you.
              </h1>
            </HeroEnter>
            <HeroEnter index={1}>
              <p className="max-w-[615px] text-[24px] leading-[28px] text-[#454745]">
                From fintech apps to AI platforms, we design, build and ship
                the software ambitious companies depend on - engineered to
                perform today and built to grow with you tomorrow.
              </p>
            </HeroEnter>
          </div>
          <HeroEnter
            index={2}
            className="flex flex-wrap items-start gap-[16px] lg:h-[52px] lg:gap-x-[20px]"
          >
            <Link
              href="/consultation"
              className="pressable flex items-center gap-[9px] rounded-full bg-secondary-900 px-[26px] py-[15px] font-sans text-[15.5px] font-bold text-primary-100 lg:h-full"
            >
              Book a free consultation
              <ArrowRight className="size-[17px]" />
            </Link>
            <Link
              href="/projects"
              className="pressable flex items-center rounded-full border border-secondary-900 bg-secondary-0 px-[27px] py-[16px] font-sans text-[15.5px] font-semibold text-secondary-900 lg:h-full"
            >
              Explore our work
            </Link>
          </HeroEnter>
        </div>
        <HeroEnter index={3} className="shrink-0 max-lg:w-full max-lg:shrink">
          <Image
            src="/assets/home/hero-collage.png"
            alt="ReadyMade product collage"
            width={602}
            height={484}
            priority
            className="h-[484px] w-[602px] object-contain max-lg:h-auto max-lg:w-full"
          />
        </HeroEnter>
      </div>
    </section>
  );
}
