import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import StatusChip from "@/components/portal/StatusChip";

export const dynamic = "force-dynamic";

function fmtWhen(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));

  const needsAttention = rows
    .filter((l) => l.status === "new" || l.status === "contacted")
    .slice(0, 6);
  const now = Date.now();
  const upcoming = rows
    .filter((l) => l.calStart && l.calStart.getTime() > now)
    .sort((a, b) => a.calStart!.getTime() - b.calStart!.getTime())
    .slice(0, 6);

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Needs attention */}
      <section className="flex flex-col rounded-[16px] border border-hairline bg-white">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-[14px]">
          <span className="font-sans text-[14px] font-semibold text-secondary-900">
            Needs attention
          </span>
          <Link
            href="/portal/leads"
            className="font-sans text-[12.5px] font-medium text-secondary-500 hover:text-secondary-900"
          >
            View all
          </Link>
        </div>
        {needsAttention.length === 0 ? (
          <p className="px-5 py-10 text-center font-sans text-[13.5px] text-secondary-500">
            You&apos;re all caught up — no open leads.
          </p>
        ) : (
          <ul className="divide-y divide-hairline/70">
            {needsAttention.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-5 py-[13px]">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 font-sans text-[13px] font-semibold text-secondary-900">
                  {l.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-sans text-[14px] font-semibold text-secondary-900">
                    {l.name}
                  </span>
                  <span className="truncate font-sans text-[12.5px] text-secondary-500">
                    {l.focus ?? l.email}
                  </span>
                </span>
                <span className="ml-auto">
                  <StatusChip status={l.status} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Upcoming meetings */}
      <section className="flex flex-col rounded-[16px] border border-hairline bg-white">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-[14px]">
          <span className="font-sans text-[14px] font-semibold text-secondary-900">
            Upcoming meetings
          </span>
          <Link
            href="/portal/calendar"
            className="font-sans text-[12.5px] font-medium text-secondary-500 hover:text-secondary-900"
          >
            Calendar
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="px-5 py-10 text-center font-sans text-[13.5px] text-secondary-500">
            No meetings booked yet.
          </p>
        ) : (
          <ul className="divide-y divide-hairline/70">
            {upcoming.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-5 py-[13px]">
                <span className="flex size-9 shrink-0 flex-col items-center justify-center rounded-[10px] bg-secondary-900 text-secondary-0">
                  <span className="font-mono text-[13px] font-bold leading-none">
                    {l.calStart!.getDate()}
                  </span>
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-sans text-[14px] font-semibold text-secondary-900">
                    {l.name}
                  </span>
                  <span className="truncate font-sans text-[12.5px] text-secondary-500">
                    {fmtWhen(l.calStart!)}
                  </span>
                </span>
                <span className="ml-auto font-sans text-[12.5px] text-secondary-500">
                  {l.focus ?? ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
