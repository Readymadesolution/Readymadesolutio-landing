import { JetBrains_Mono } from "next/font/google";
import { Stagger, StaggerItem } from "@/components/motion";

/* Step numbers use JetBrains Mono ExtraBold in the design */
const jetbrainsMono = JetBrains_Mono({
  weight: "800",
  subsets: ["latin"],
  display: "swap",
});

const STEPS: {
  num: string;
  title: string;
  desc: string;
  descW?: string;
}[] = [
  {
    num: "01",
    title: "Discovery",
    desc: "We dig into your business needs, constraints and goals.",
  },
  {
    num: "02",
    title: "Strategy",
    desc: "We define the roadmap and the right solution architecture.",
  },
  {
    num: "03",
    title: "Build",
    desc: "Design and engineering execution with tight feedback loops.",
    descW: "max-w-[300px]",
  },
  {
    num: "04",
    title: "Launch & support",
    desc: "Deployment, monitoring and continuous optimization.",
    descW: "max-w-[260px]",
  },
];

export default function Process() {
  return (
    <section className="mx-auto w-full max-w-[1440px] bg-white px-[80px] py-[60px] max-lg:px-6">
      <div className="flex flex-col gap-[32px]">
        <div className="flex max-w-[560px] flex-col gap-[14px] pt-[5px]">
          <div className="flex items-center justify-center self-start rounded-full bg-primary-100 px-[24px] py-[10px]">
            <span className="font-sans text-[16px] font-medium italic uppercase leading-[24px] text-secondary-900">
              How we work
            </span>
          </div>
          <h2 className="whitespace-nowrap text-[44px] font-bold leading-[66px] text-secondary-900 max-lg:whitespace-normal max-lg:text-[34px] max-lg:leading-[1.2]">
            From idea to shipped
          </h2>
        </div>
        <Stagger className="relative grid grid-cols-4 max-lg:grid-cols-1 max-lg:gap-8">
          {STEPS.map((step) => (
            <StaggerItem
              key={step.num}
              className="relative flex flex-col gap-[10px]"
            >
              <div className="flex size-[56px] items-center justify-center rounded-full border-4 border-secondary-0 bg-[#2ebe9b] shadow-[0px_0px_0px_1px_#45d2af]">
                <span
                  className={`${jetbrainsMono.className} text-[18px] font-extrabold text-secondary-0`}
                >
                  {step.num}
                </span>
              </div>
              <h3 className="pt-[13px] font-sans text-[19px] font-extrabold leading-[23px] tracking-[-0.4px] text-secondary-900">
                {step.title}
              </h3>
              <p
                className={`text-[16px] leading-[24px] text-[#777777] ${step.descW ?? ""}`}
              >
                {step.desc}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
