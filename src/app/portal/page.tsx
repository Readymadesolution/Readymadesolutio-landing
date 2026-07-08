import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { getGoals } from "@/app/portal/goals-actions";
import DashboardView, {
  type DashboardData,
} from "@/components/portal/DashboardView";
import { LEAD_STATUSES } from "@/components/portal/leadStatus";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [rows, goals] = await Promise.all([
    db.select().from(leads).orderBy(desc(leads.createdAt)),
    getGoals(),
  ]);

  // ponytail: force-dynamic server render; wall-clock time is intentional.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const nowDate = new Date(now);
  const y = nowDate.getFullYear();
  const m = nowDate.getMonth();
  const monthStart = new Date(y, m, 1).getTime();
  const nextMonthStart = new Date(y, m + 1, 1).getTime();

  const inThisMonth = (d: Date | null) =>
    !!d && d.getTime() >= monthStart && d.getTime() < nextMonthStart;

  // This-month actuals
  const leadsThisMonth = rows.filter((l) => inThisMonth(l.createdAt)).length;
  const meetingsThisMonth = rows.filter((l) => inThisMonth(l.calStart)).length;
  const wonThisMonth = rows.filter(
    (l) => l.status === "won" && inThisMonth(l.updatedAt),
  ).length;

  // Funnel + all-time win/conversion rates
  const statusCounts = LEAD_STATUSES.map(
    (s) => rows.filter((l) => l.status === s).length,
  );
  const won = rows.filter((l) => l.status === "won").length;
  const lost = rows.filter((l) => l.status === "lost").length;
  const winRate = won + lost ? Math.round((won / (won + lost)) * 100) : 0;
  const conversion = rows.length ? Math.round((won / rows.length) * 100) : 0;

  // Goal progress: percent of target reached (capped at 100), behind if < 60%.
  const prog = (
    label: string,
    actual: number,
    target: number,
    isRate = false,
  ) => {
    const ratio = target > 0 ? actual / target : actual > 0 ? 1 : 0;
    return {
      label,
      actual,
      target,
      percent: Math.min(100, Math.round(ratio * 100)),
      onTrack: ratio >= 0.6,
      isRate,
    };
  };

  // Trend: leads + meetings per month, last 6 calendar months.
  const trend = Array.from({ length: 6 }, (_, i) => {
    const idx = 5 - i;
    const s = new Date(y, m - idx, 1).getTime();
    const e = new Date(y, m - idx + 1, 1).getTime();
    const inRange = (d: Date | null) =>
      !!d && d.getTime() >= s && d.getTime() < e;
    return {
      month: new Date(y, m - idx, 1).toLocaleDateString("en-US", {
        month: "short",
      }),
      leads: rows.filter((l) => inRange(l.createdAt)).length,
      meetings: rows.filter((l) => inRange(l.calStart)).length,
    };
  });

  const upcomingRows = rows
    .filter((l) => l.calStart && l.calStart.getTime() > now)
    .sort((a, b) => a.calStart!.getTime() - b.calStart!.getTime());

  const data: DashboardData = {
    goals: [
      prog("Leads this month", leadsThisMonth, goals.leadsTarget),
      prog("Meetings this month", meetingsThisMonth, goals.meetingsTarget),
      prog("Won this month", wonThisMonth, goals.wonTarget),
      prog("Win rate", winRate, goals.winRateTarget, true),
    ],
    trend,
    funnel: LEAD_STATUSES.map((s, i) => ({
      label: s[0].toUpperCase() + s.slice(1),
      count: statusCounts[i],
    })),
    conversion,
    totalLeads: rows.length,
    needsAttention: rows
      .filter((l) => l.status === "new" || l.status === "contacted")
      .slice(0, 6)
      .map((l) => ({
        id: l.id,
        name: l.name,
        sub: l.focus ?? l.email,
        status: l.status,
      })),
    upcoming: upcomingRows.slice(0, 6).map((l) => ({
      id: l.id,
      name: l.name,
      focus: l.focus,
      calStart: l.calStart!.toISOString(),
    })),
  };

  return <DashboardView data={data} />;
}
