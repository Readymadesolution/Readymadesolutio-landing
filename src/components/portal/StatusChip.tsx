export type LeadStatus = "new" | "contacted" | "scheduled" | "won" | "lost";

/* All colors from the Figma token set. Dot conveys real semantic state. */
const STYLES: Record<LeadStatus, { wrap: string; dot: string; label: string }> = {
  new: { wrap: "bg-primary-100 text-secondary-900", dot: "bg-primary-500", label: "New" },
  contacted: {
    wrap: "bg-secondary-100 text-secondary-600",
    dot: "bg-secondary-300",
    label: "Contacted",
  },
  scheduled: {
    wrap: "bg-primary-200 text-[#0e0f0c]",
    dot: "bg-secondary-700",
    label: "Scheduled",
  },
  won: {
    wrap: "bg-[#26a564]/12 text-secondary-700",
    dot: "bg-[#1fc16b]",
    label: "Won",
  },
  lost: {
    wrap: "bg-[#d00416]/10 text-[#d00416]",
    dot: "bg-[#d00416]",
    label: "Lost",
  },
};

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "won",
  "lost",
];

export default function StatusChip({ status }: { status: LeadStatus }) {
  const s = STYLES[status] ?? STYLES.new;
  return (
    <span
      className={`inline-flex items-center gap-[6px] rounded-full px-[10px] py-[4px] font-sans text-[12px] font-medium leading-[16px] ${s.wrap}`}
    >
      <span className={`size-[6px] rounded-full ${s.dot}`} aria-hidden />
      {s.label}
    </span>
  );
}
