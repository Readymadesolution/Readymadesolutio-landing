"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HeroEnter } from "@/components/motion";
import type { SlotDay, SlotsResponse } from "@/lib/cal";

/* ------------------------------------------------------------------ */
/* Static content (verbatim from Figma)                                */
/* ------------------------------------------------------------------ */

const BUILD_CATEGORIES = [
  {
    title: "AI & Automation",
    desc: "Streamline workflows with intelligent automation and AI-powered tools.",
  },
  {
    title: "E-commerce",
    desc: "Build and manage online stores with seamless shopping experiences.",
  },
  {
    title: "Call Center",
    desc: "Handle customer support with smart routing and conversation tools.",
  },
  {
    title: "Lead Engagement",
    desc: "Capture, nurture, and convert leads with targeted outreach.",
  },
  {
    title: "Security",
    desc: "Protect your systems with advanced threat detection and access controls.",
  },
  {
    title: "Others",
    desc: "Explore additional use cases beyond the categories above.",
  },
] as const;

const PRODUCTS = [
  { title: "BO AI", desc: "AI assistant for businesses", width: 199 },
  { title: "Botaplace", desc: "Marketplace storefront for businesses", width: 198 },
  { title: "YourSend", desc: "Customer messaging and campaign platform.", width: 199 },
  { title: "Helix Call", desc: "AI-powered customer support automation.", width: 243 },
  {
    title: "Cybersecurity Validation",
    desc: "Audits, Penetration testing and others",
    width: 274,
  },
] as const;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Branch = "build" | "product";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  const h = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12;
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ap = d.getHours() < 12 ? "AM" : "PM";
  return `${day} at ${h}:${mm}${ap}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

function StepHeader({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-[7px] w-full">
      <p className="text-[13.5px] leading-[20px] text-[#747474]">
        STEP {step} OF 4
      </p>
      <h2 className="font-sans font-extrabold text-[27.07px] leading-[33px] tracking-[-0.68px] text-secondary-800">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-[18px] leading-[27px] text-[#868685]">{subtitle}</p>
      ) : null}
    </div>
  );
}

function CardFooter({
  onBack,
  backDisabled,
  onContinue,
  continueDisabled,
  continueLabel = "Continue",
  pending = false,
  error,
}: {
  onBack: () => void;
  backDisabled: boolean;
  onContinue: () => void;
  continueDisabled: boolean;
  continueLabel?: string;
  pending?: boolean;
  error?: string | null;
}) {
  return (
    <div className="w-full border-t border-[#f1f3ef] pt-[27px]">
      {error ? (
        <p className="font-sans text-[13.5px] text-[#d64545] mb-[12px]">{error}</p>
      ) : null}
      <div className="flex items-center justify-between w-full">
        <button
          type="button"
          onClick={onBack}
          disabled={backDisabled}
          className="pressable bg-white border border-secondary-100 rounded-full px-[26px] py-[15.8px] font-sans font-semibold text-[16.36px] leading-[20px] text-[#b9b9b9] disabled:cursor-default cursor-pointer hover:enabled:text-secondary-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={continueDisabled || pending}
          className={`pressable bg-secondary-900 rounded-full px-[29.3px] py-[14.7px] flex items-center gap-[9px] font-sans font-bold text-[16.36px] leading-[20px] text-secondary-0 cursor-pointer ${
            continueDisabled ? "opacity-25 cursor-default" : ""
          } ${pending ? "opacity-70 cursor-wait" : ""}`}
        >
          {pending ? "Booking…" : continueLabel}
          <Image
            src="/assets/consultation/arrow-right.svg"
            alt=""
            width={17}
            height={17}
          />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Left rail                                                           */
/* ------------------------------------------------------------------ */

function StepRail({ branch, step }: { branch: Branch | null; step: number }) {
  const labels = [
    "How can we help",
    branch === "product" ? "Choose product" : "Project details",
    "Time & details",
  ];
  const activeIdx = Math.min(step, 3); // success screen keeps step 3 active

  return (
    <div className="flex flex-col gap-[24px] py-[14px]">
      {labels.map((label, i) => {
        const n = i + 1;
        const status = n < activeIdx ? "done" : n === activeIdx ? "active" : "todo";
        return (
          <div key={label} className="flex items-center gap-[13px]">
            <span
              className={`size-[30px] rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                status === "done"
                  ? "bg-[#269c80]"
                  : status === "active"
                    ? "border border-dashed border-[#269c80]"
                    : "bg-secondary-100"
              }`}
            >
              {status === "done" ? (
                <Image
                  src="/assets/consultation/tick-white.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              ) : (
                <span
                  className={`font-sans font-extrabold text-[13px] transition-colors duration-200 ${
                    status === "active" ? "text-[#269c80]" : "text-[#8e8e8e]"
                  }`}
                >
                  {n}
                </span>
              )}
            </span>
            <span
              className={`font-sans font-semibold text-[14.5px] leading-none transition-colors duration-200 ${
                status === "done"
                  ? "text-[#269c80]"
                  : status === "active"
                    ? "text-[#b3eddf]"
                    : "text-[#8e8e8e]"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wizard                                                              */
/* ------------------------------------------------------------------ */

export default function ConsultationWizard() {
  const reduceMotion = useReducedMotion();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [step, setStep] = useState(1);

  // step 2
  const [category, setCategory] = useState<string | null>(null);
  const [product, setProduct] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [productNotes, setProductNotes] = useState("");

  // step 3
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [slots, setSlots] = useState<SlotDay[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [viewMonth, setViewMonth] = useState<{ y: number; m: number } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // booking
  const [booking, setBooking] = useState<"idle" | "pending" | "error">("idle");
  const [bookingError, setBookingError] = useState<string | null>(null);

  const loadSlots = useCallback(async () => {
    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const res = await fetch("/api/cal/slots");
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json: SlotsResponse = await res.json();
      if (!Array.isArray(json.slots)) throw new Error("Bad response");
      setSlots(json.slots);
      const first = json.slots[0]?.date;
      if (first) {
        const [y, m] = first.split("-").map(Number);
        setViewMonth({ y, m: m - 1 });
      } else {
        const now = new Date();
        setViewMonth({ y: now.getFullYear(), m: now.getMonth() });
      }
    } catch {
      setSlotsError("We couldn't load availability. Please try again.");
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (step === 3 && slots === null && !slotsLoading && !slotsError) {
      void loadSlots();
    }
  }, [step, slots, slotsLoading, slotsError, loadSlots]);

  const availableByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const day of slots ?? []) map.set(day.date, day.times);
    return map;
  }, [slots]);

  const focusLabel =
    branch === "product"
      ? `${(product ?? "").replace(/\s+/g, "")} Product`
      : `${category ?? ""} project`;

  const step2Valid =
    branch === "product"
      ? product !== null && productNotes.trim().length > 0
      : category !== null && notes.trim().length > 0;

  const step3Valid =
    name.trim().length > 0 &&
    EMAIL_RE.test(email.trim()) &&
    selectedDate !== null &&
    selectedTime !== null;

  async function submitBooking() {
    if (!step3Valid || !selectedTime) return;
    setBooking("pending");
    setBookingError(null);
    try {
      const res = await fetch("/api/cal/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          start: selectedTime,
          notes: branch === "product" ? productNotes.trim() : notes.trim(),
          focus: focusLabel,
          branch: branch ?? "build",
        }),
      });
      const json: { error?: string } = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Booking failed");
      setBooking("idle");
      setStep(4);
    } catch (err) {
      setBooking("error");
      setBookingError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "Something went wrong while booking. Please try again."
      );
    }
  }

  function goBack() {
    if (step > 1) setStep(step - 1);
  }

  /* ------------------------------ render ------------------------------ */

  const stepKey = step === 2 ? `2-${branch ?? "build"}` : String(step);

  return (
    <div className="relative w-full overflow-x-clip">
      {/* Section background texture — exported from Figma (node 57:3610) */}
      <Image
        src="/assets/consultation/grid-texture.png"
        alt=""
        aria-hidden
        unoptimized
        width={1440}
        height={745}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1440px] h-[744.75px] max-w-none pointer-events-none select-none"
      />
      <div className="relative max-w-[1440px] mx-auto px-[80px] py-[84px] max-md:px-[20px] max-md:py-[40px]">
        <HeroEnter index={0}>
          <p className="font-bold text-[16px] leading-[24px] uppercase text-[#269c80] mb-[24px]">
            Book a consultation
          </p>
        </HeroEnter>
        <div className="flex gap-[60px] items-start max-lg:flex-col max-lg:gap-[36px]">
          {/* Left column */}
          <div className="w-[524px] shrink-0 pt-[5px] max-lg:w-full">
            <HeroEnter index={1}>
              <h1 className="font-bold text-[64px] leading-[72px] text-secondary-900 max-lg:text-[40px] max-lg:leading-[46px] max-sm:text-[34px] max-sm:leading-[40px]">
                Let&apos;s scope your
                <br />
                project together.
              </h1>
            </HeroEnter>
            <HeroEnter index={2}>
              <p className="text-[16px] leading-[24px] text-[#464646] pt-[20px]">
                A free 30-minute call with our team. Tell us a bit about what you
                need and pick a time that works for you.
              </p>
            </HeroEnter>
            <HeroEnter index={3}>
              <div className="pt-[15px]">
                <StepRail branch={branch} step={step} />
              </div>
            </HeroEnter>
            <HeroEnter index={4}>
              <div className="border-t border-[#e3e7df] mt-[16px] pt-[25px] flex flex-col gap-[13px]">
                {["No commitment, no sales pressure", "Reply within one business day"].map(
                  (t) => (
                    <div key={t} className="flex items-center gap-[10px]">
                      <Image
                        src="/assets/consultation/check-green.svg"
                        alt=""
                        width={17}
                        height={17}
                      />
                      <span className="font-sans font-medium text-[13.5px] leading-none text-secondary-800">
                        {t}
                      </span>
                    </div>
                  )
                )}
              </div>
            </HeroEnter>
          </div>

          {/* Right card */}
          {step === 4 ? (
            <SuccessCard
              name={name}
              email={email}
              focus={focusLabel}
              when={selectedTime ? formatWhen(selectedTime) : ""}
              reduceMotion={reduceMotion ?? false}
            />
          ) : (
            <div
              className={`flex-1 min-w-0 max-lg:w-full bg-white border-[1.128px] border-[#e8ebe6] rounded-[27.07px] shadow-[0px_33.838px_78.955px_-45.117px_rgba(14,15,12,0.36)] overflow-hidden ${
                step === 1 ? "min-h-[529px]" : step === 3 ? "min-h-[819px]" : ""
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stepKey}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="p-[38.35px] flex flex-col gap-[31.6px] items-start max-sm:p-[20px] max-sm:gap-[24px]"
                >
                  {step === 1 && (
                    <>
                      <div className="flex flex-col gap-[7px] w-full">
                        <StepHeader
                          step={1}
                          title="How can we help?"
                          subtitle="Choose the path that fits you best."
                        />
                        <div className="flex gap-[15px] items-stretch pt-[18px] w-full max-sm:flex-col">
                          {(
                            [
                              {
                                key: "build" as Branch,
                                icon: "/assets/consultation/option-build.svg",
                                title: "Build a project",
                                desc: "Have us design & build something for you.",
                              },
                              {
                                key: "product" as Branch,
                                icon: "/assets/consultation/option-product.svg",
                                title: "Use a product",
                                desc: "Get started with one of our products.",
                              },
                            ] as const
                          ).map((opt) => {
                            const selected = branch === opt.key;
                            return (
                              <button
                                key={opt.key}
                                type="button"
                                onClick={() => setBranch(opt.key)}
                                className={`flex-1 min-w-0 flex flex-col items-start gap-[15px] px-[23px] py-[25px] rounded-[18px] text-left cursor-pointer border-2 transition-colors duration-200 ${
                                  selected
                                    ? "bg-[rgba(103,218,190,0.1)] border-[#2ebe9b]"
                                    : "bg-white border-secondary-100 hover:border-neutral-300"
                                }`}
                              >
                                <span className="size-[52px] rounded-[14.7px] bg-secondary-900 flex items-center justify-center">
                                  <Image src={opt.icon} alt="" width={25} height={25} />
                                </span>
                                <span className="flex flex-col gap-[9px]">
                                  <span className="font-bold text-[22.5px] leading-[27px] text-secondary-900">
                                    {opt.title}
                                  </span>
                                  <span className="font-sans text-[15.2px] leading-[22.8px] text-[#8b8b8b]">
                                    {opt.desc}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <CardFooter
                        onBack={goBack}
                        backDisabled
                        onContinue={() => setStep(2)}
                        continueDisabled={branch === null}
                      />
                    </>
                  )}

                  {step === 2 && branch !== "product" && (
                    <>
                      <div className="flex flex-col gap-[7px] w-full">
                        <StepHeader
                          step={2}
                          title="What do you need help with?"
                          subtitle="Pick the closest fit, choose Other to describe it yourself."
                        />
                        <div className="grid grid-cols-3 gap-[11px] w-full max-md:grid-cols-2 max-sm:grid-cols-1">
                          {BUILD_CATEGORIES.map((c) => {
                            const selected = category === c.title;
                            return (
                              <button
                                key={c.title}
                                type="button"
                                onClick={() => setCategory(c.title)}
                                className={`flex flex-col items-start gap-[9.4px] rounded-[10.2px] text-left cursor-pointer border-[1.5px] px-[19.2px] py-[21.1px] transition-colors duration-200 ${
                                  selected
                                    ? "bg-[rgba(103,218,190,0.1)] border-[#2ebe9b]"
                                    : "bg-white border-secondary-100 hover:border-neutral-300"
                                }`}
                              >
                                <span className="font-bold text-[19.2px] leading-[23px] text-secondary-900">
                                  {c.title}
                                </span>
                                <span className="text-[10.2px] leading-[15.3px] text-[#8b8b8b]">
                                  {c.desc}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col gap-[8px] w-full">
                        <label
                          htmlFor="build-notes"
                          className="font-medium text-[14px] leading-none text-[#282828]"
                        >
                          What do you want to build?
                        </label>
                        <textarea
                          id="build-notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Describe the project, the problem you have and what you help us to."
                          className="w-full h-[109px] resize-none border border-secondary-100 rounded-[2px] p-[12px] text-[14px] leading-[24px] text-[#464646] placeholder:text-secondary-300 outline-none focus:border-[#2ebe9b]"
                        />
                      </div>
                      <CardFooter
                        onBack={goBack}
                        backDisabled={false}
                        onContinue={() => setStep(3)}
                        continueDisabled={!step2Valid}
                      />
                    </>
                  )}

                  {step === 2 && branch === "product" && (
                    <>
                      <div className="flex flex-col gap-[7px] w-full">
                        <StepHeader
                          step={2}
                          title="Which product?"
                          subtitle="Select a product and tell us what you'd like to know."
                        />
                        {/* gap-x 10px (Figma 11.1) so the 3 fixed-width cards fit the 617px inner row → 3-then-2 layout, not clipped. h-253 reserves Figma's space before footer. */}
                        <div className="h-[253px] max-sm:h-auto content-start flex flex-wrap gap-x-[10px] gap-y-[10px] pt-[13px] w-full">
                          {PRODUCTS.map((p) => {
                            const selected = product === p.title;
                            return (
                              <button
                                key={p.title}
                                type="button"
                                onClick={() => setProduct(p.title)}
                                style={{ width: p.width }}
                                className={`h-[102px] max-sm:!w-full flex flex-col items-start justify-center gap-[9.4px] rounded-[10.2px] text-left cursor-pointer border-[1.5px] px-[19.2px] transition-colors duration-200 ${
                                  selected
                                    ? "bg-[rgba(103,218,190,0.1)] border-[#2ebe9b]"
                                    : "bg-white border-secondary-100 hover:border-neutral-300"
                                }`}
                              >
                                <span className="font-bold text-[19.2px] leading-[23px] text-secondary-900">
                                  {p.title}
                                </span>
                                <span className="text-[10.2px] leading-[15.3px] text-[#8b8b8b]">
                                  {p.desc}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {product !== null ? (
                        <div className="flex flex-col gap-[8px] w-full">
                          <label
                            htmlFor="product-notes"
                            className="font-medium text-[14px] leading-none text-[#282828]"
                          >
                            {`What would you like to know about ${product}?`}
                          </label>
                          <textarea
                            id="product-notes"
                            value={productNotes}
                            onChange={(e) => setProductNotes(e.target.value)}
                            placeholder="Pricing, integrations, a live demo, a specific use case..."
                            className="w-full h-[109px] resize-none border border-secondary-100 rounded-[2px] p-[12px] text-[14px] leading-[24px] text-[#464646] placeholder:text-secondary-300 outline-none focus:border-[#2ebe9b]"
                          />
                        </div>
                      ) : null}
                      <CardFooter
                        onBack={goBack}
                        backDisabled={false}
                        onContinue={() => setStep(3)}
                        continueDisabled={!step2Valid}
                      />
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div className="flex flex-col gap-[24px] w-full">
                        <StepHeader step={3} title={"Your details &  time"} />
                        <div className="flex gap-[24px] w-full max-sm:flex-col">
                          <div className="flex-1 flex flex-col gap-[8px]">
                            <label
                              htmlFor="full-name"
                              className="font-medium text-[14px] leading-none text-secondary-800"
                            >
                              Full Name
                            </label>
                            <input
                              id="full-name"
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Full name"
                              className="h-[44px] w-full border border-secondary-100 rounded-[2px] p-[12px] text-[14px] text-[#464646] placeholder:text-[#8b8b8b] outline-none focus:border-[#2ebe9b]"
                            />
                          </div>
                          <div className="flex-1 flex flex-col gap-[8px]">
                            <label
                              htmlFor="email"
                              className="font-medium text-[14px] leading-none text-secondary-800"
                            >
                              Email
                            </label>
                            <input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="jane@acme.com"
                              className="h-[44px] w-full border border-secondary-100 rounded-[2px] p-[12px] text-[14px] text-[#464646] placeholder:text-[#8b8b8b] outline-none focus:border-[#2ebe9b]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-[16px] w-full">
                        <p className="font-medium text-[14px] leading-none text-secondary-800">
                          Pick a Preferred Date
                        </p>
                        {slotsLoading ? (
                          <div className="w-full border border-secondary-100 rounded-[20px] h-[386px] flex flex-col items-center justify-center gap-[12px]">
                            <span className="size-[28px] rounded-full border-2 border-secondary-100 border-t-[#269c80] animate-spin" />
                            <span className="font-sans text-[13.5px] text-secondary-500">
                              Loading availability…
                            </span>
                          </div>
                        ) : slotsError ? (
                          <div className="w-full border border-secondary-100 rounded-[20px] h-[386px] flex flex-col items-center justify-center gap-[16px]">
                            <span className="font-sans text-[13.5px] text-secondary-500">
                              {slotsError}
                            </span>
                            <button
                              type="button"
                              onClick={() => void loadSlots()}
                              className="pressable bg-secondary-900 rounded-full px-[24px] py-[12px] font-sans font-bold text-[14px] text-secondary-0 cursor-pointer"
                            >
                              Retry
                            </button>
                          </div>
                        ) : viewMonth ? (
                          <Calendar
                            viewMonth={viewMonth}
                            onNavigate={setViewMonth}
                            availableByDate={availableByDate}
                            selectedDate={selectedDate}
                            onSelectDate={(d) => {
                              setSelectedDate(d);
                              setSelectedTime(null);
                            }}
                            reduceMotion={reduceMotion ?? false}
                          />
                        ) : null}
                      </div>

                      {selectedDate ? (
                        <div className="flex flex-col gap-[16px] w-full">
                          <p className="font-medium text-[14px] leading-none text-secondary-800">
                            Pick a Preferred Date
                          </p>
                          <div className="flex flex-wrap gap-[7px] py-[8px]">
                            {(availableByDate.get(selectedDate) ?? []).map((t) => {
                              const selected = selectedTime === t;
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setSelectedTime(t)}
                                  className={`h-[48px] px-[16px] rounded-[8px] font-sans text-[16px] cursor-pointer transition-colors duration-200 ${
                                    selected
                                      ? "bg-[#269c80] text-secondary-0"
                                      : "bg-secondary-100 text-[#171717] hover:bg-neutral-300"
                                  }`}
                                >
                                  {formatTime(t)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}

                      <CardFooter
                        onBack={goBack}
                        backDisabled={false}
                        onContinue={() => void submitBooking()}
                        continueDisabled={!step3Valid}
                        pending={booking === "pending"}
                        error={booking === "error" ? bookingError : null}
                      />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
        {step === 4 ? (
          /* Confetti layer — exported from Figma (node 91:1709), positioned per frames 91:1368 / 91:2467 */
          <Image
            src="/assets/consultation/confetti.gif"
            alt=""
            aria-hidden
            unoptimized
            width={339}
            height={190}
            className="absolute left-[731px] top-[75px] w-[339px] h-[190px] max-w-none pointer-events-none select-none max-lg:hidden"
          />
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Calendar                                                            */
/* ------------------------------------------------------------------ */

function Calendar({
  viewMonth,
  onNavigate,
  availableByDate,
  selectedDate,
  onSelectDate,
  reduceMotion,
}: {
  viewMonth: { y: number; m: number };
  onNavigate: (v: { y: number; m: number }) => void;
  availableByDate: Map<string, string[]>;
  selectedDate: string | null;
  onSelectDate: (d: string) => void;
  reduceMotion: boolean;
}) {
  const { y, m } = viewMonth;
  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const now = new Date();
  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate());

  function nav(delta: number) {
    const d = new Date(y, m + delta, 1);
    onNavigate({ y: d.getFullYear(), m: d.getMonth() });
  }

  return (
    <div className="w-full bg-white border border-secondary-100 rounded-[20px] px-[20px] pt-[20px] pb-[32px] flex flex-col gap-[16px] max-sm:px-[12px]">
      <div className="flex items-center justify-between px-[4px] py-[10px]">
        <button
          type="button"
          onClick={() => nav(-1)}
          aria-label="Previous month"
          className="size-[32px] rounded-[8px] border border-secondary-100 flex items-center justify-center cursor-pointer hover:bg-secondary-0"
        >
          <Image
            src="/assets/consultation/chevron-left.svg"
            alt=""
            width={16}
            height={16}
          />
        </button>
        <p className="font-sans font-bold text-[16px] text-[#171717]">
          {MONTHS[m]} {y}
        </p>
        <button
          type="button"
          onClick={() => nav(1)}
          aria-label="Next month"
          className="size-[32px] rounded-[8px] border border-secondary-100 flex items-center justify-center cursor-pointer hover:bg-secondary-0"
        >
          <Image
            src="/assets/consultation/chevron-right.svg"
            alt=""
            width={16}
            height={16}
          />
        </button>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${y}-${m}`}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="flex px-[10px] gap-[49px] max-lg:grid max-lg:grid-cols-7 max-lg:gap-[4px] max-lg:px-0">
            {WEEKDAYS.map((d) => (
              <span
                key={d}
                className="w-[36px] shrink-0 font-sans font-semibold text-[12px] text-[#9ca3af] text-center max-lg:w-auto"
              >
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-x-[4px] gap-y-[8px] mt-[19px]">
            {Array.from({ length: firstDow }).map((_, i) => (
              <span key={`pad-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = toDateStr(y, m, day);
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === todayStr && selectedDate === null;
              const isAvailable = availableByDate.has(dateStr);
              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onSelectDate(dateStr)}
                  className={`h-[40px] rounded-[8px] flex items-center justify-center font-sans text-[14px] transition-colors duration-200 ${
                    isSelected
                      ? "bg-[#269c80] text-secondary-0"
                      : isToday
                        ? "bg-secondary-900 text-secondary-0"
                        : isAvailable
                          ? "bg-white border border-[#e5e7ea] text-[#171717] cursor-pointer hover:border-[#269c80]"
                          : "bg-white border border-[#e5e7ea] text-neutral-300 cursor-default"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Success screen                                                      */
/* ------------------------------------------------------------------ */

function SuccessCard({
  name,
  email,
  focus,
  when,
  reduceMotion,
}: {
  name: string;
  email: string;
  focus: string;
  when: string;
  reduceMotion: boolean;
}) {
  const firstName = name.trim().split(/\s+/)[0] ?? "";
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="w-[632px] max-w-full bg-white border-[1.128px] border-[#e8ebe6] rounded-[27.07px] shadow-[0px_33.838px_78.955px_-45.117px_rgba(14,15,12,0.36)] overflow-hidden"
    >
      <div className="border-t-8 border-primary-500 px-[38px] pt-[38px] pb-[38px] max-sm:px-[20px]">
        <div className="flex flex-col gap-[32px] items-center">
          <div className="flex flex-col gap-[20px] items-center">
            <div className="flex flex-col gap-[10px] items-center">
              <div className="size-[87px] rounded-full bg-primary-100 flex items-center justify-center">
                <Image
                  src="/assets/consultation/success-check.svg"
                  alt=""
                  width={40}
                  height={40}
                />
              </div>
              <h2 className="font-bold text-[32px] leading-[51px] text-secondary-800 text-center">
                You&apos;re booked, {firstName}
              </h2>
              <p className="text-[18px] leading-[24px] text-[#5d5d5d] text-center max-w-[484px]">
                We&apos;ve reserved{" "}
                <span className="font-bold text-secondary-800">{when}</span> to
                talk about{" "}
                <span className="font-bold text-secondary-800">{focus}.</span> A
                calendar invite is on its way to {email}
              </p>
            </div>
            <div className="w-[385px] max-w-full bg-secondary-0 border border-secondary-100 rounded-[8px] px-[24px] py-[20px] flex flex-col gap-[16px]">
              {(
                [
                  ["Focus", focus],
                  ["When", when],
                  ["Duration", "30 minutes"],
                ] as const
              ).map(([label, value], i) => (
                <div key={label} className="flex flex-col gap-[16px]">
                  {i > 0 ? <div className="border-t border-secondary-100" /> : null}
                  <div className="flex items-center justify-between text-[18px] leading-[24px]">
                    <span className="text-[#5d5d5d]">{label}</span>
                    <span className="text-secondary-800">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/"
            className="pressable bg-secondary-900 rounded-full px-[29.3px] py-[14.7px] flex items-center gap-[9px] font-sans font-bold text-[16.36px] leading-[20px] text-secondary-0"
          >
            Back to home
            <Image
              src="/assets/consultation/arrow-right.svg"
              alt=""
              width={17}
              height={17}
            />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
