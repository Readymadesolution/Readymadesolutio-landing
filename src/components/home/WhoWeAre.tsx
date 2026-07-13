import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";
import { Reveal } from "@/components/motion";

export default function WhoWeAre() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-[80px] py-[40px] max-lg:px-6">
      <Reveal className="flex items-start gap-[76px] max-lg:flex-col max-lg:gap-12">
        <div className="relative my-[17.5px] w-[556px] max-w-full shrink-0 max-lg:shrink">
          <div className="absolute -bottom-[18px] -right-[18px] left-[18px] top-[18px] rounded-[24px] bg-[#b3eddf]" />
          <div className="relative w-full overflow-hidden rounded-[24px] border border-[#e8ebe6] shadow-[0px_30px_60px_-34px_rgba(14,15,12,0.34)]">
            <Image
              src="/assets/home/team-at-work.jpg"
              alt="Our team at work"
              width={900}
              height={600}
              className="h-[420px] w-full rounded-[23px] object-cover"
            />
          </div>
        </div>
        <div className="flex w-[651px] max-w-full shrink-0 flex-col gap-[16px] pt-[20px] max-lg:shrink">
          <div className="flex items-center justify-center self-start rounded-full bg-primary-100 px-[24px] py-[10px]">
            <span className="font-sans text-[16px] font-medium italic uppercase leading-[24px] text-secondary-900">
              Who we are
            </span>
          </div>
          <div className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[8px]">
              <h2 className="text-[52px] font-bold leading-[62px] text-[#0e0f0c] max-lg:text-[36px] max-lg:leading-[1.2]">
                A senior team, building like partners
              </h2>
              <div className="flex flex-col gap-[8px] text-[16px] leading-[24px] text-[#454745]">
                <p className="pt-[6px]">
                  ReadyMade Solution is an enterprise software development
                  company
                  <br className="max-lg:hidden" />
                  helping businesses unlock growth through intelligent
                  software, AI automation and reliable infrastructure.
                </p>
                <p>
                  We build digital products that solve real problems - from
                  customer acquisition and lead management to automation and
                  operational efficiency - and we act as an extension of your
                  team.
                </p>
              </div>
            </div>
            <Link
              href="/about"
              className="pressable flex h-[52px] items-center gap-[9px] self-start rounded-full bg-secondary-900 px-[26px] py-[15px] font-sans text-[15.5px] font-bold text-primary-100"
            >
              More about us
              <ArrowRight className="size-[17px]" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
