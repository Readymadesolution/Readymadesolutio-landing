import type { ReactNode } from "react";

export type LegalSection = { heading: string; body: ReactNode };

/** Shared chrome for prose legal documents (Privacy, Terms). */
export default function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <div className="bg-white">
      <article className="mx-auto w-full max-w-[1040px] px-5 pb-24 pt-16 lg:pt-24">
        <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#777777]">
          Legal
        </p>
        <h1 className="mt-3 text-[40px] font-bold leading-[1.08] text-secondary-900 lg:text-[56px]">
          {title}
        </h1>
        <p className="mt-4 text-[14px] text-[#868685]">Last updated: {updated}</p>
        <div className="mt-8 text-[17px] leading-[28px] text-[#454745]">{intro}</div>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((s, i) => (
            <section key={i} className="flex flex-col gap-3">
              <h2 className="text-[22px] font-bold leading-[28px] text-secondary-900">
                {s.heading}
              </h2>
              <div className="flex flex-col gap-3 text-[15.5px] leading-[26px] text-[#454745] [&_a]:text-secondary-900 [&_a]:underline [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
