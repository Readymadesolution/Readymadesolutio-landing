import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import DashboardView, {
  type DashboardData,
} from "@/components/portal/DashboardView";
import { LEAD_STATUSES } from "@/components/portal/leadStatus";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));

  // ponytail: force-dynamic server render; wall-clock time is intentional.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 3.6e6;

  const statusCounts = LEAD_STATUSES.map(
    (s) => rows.filter((l) => l.status === s).length,
  );

  const won = rows.filter((l) => l.status === "won").length;
  const lost = rows.filter((l) => l.status === "lost").length;
  const closed = won + lost;

  const upcomingRows = rows
    .filter((l) => l.calStart && l.calStart.getTime() > now)
    .sort((a, b) => a.calStart!.getTime() - b.calStart!.getTime());

  const data: DashboardData = {
    kpis: {
      total: rows.length,
      newThisWeek: rows.filter((l) => l.createdAt.getTime() >= weekAgo).length,
      scheduled: upcomingRows.length,
      winRate: closed ? Math.round((won / closed) * 100) : 0,
    },
    statusCounts,
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
