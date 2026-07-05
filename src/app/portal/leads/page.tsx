import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import LeadsView, { type LeadRow } from "@/components/portal/LeadsView";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));

  const data: LeadRow[] = rows.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    focus: l.focus,
    branch: l.branch,
    status: l.status,
    assignedTo: l.assignedTo,
    calStart: l.calStart ? l.calStart.toISOString() : null,
    createdAt: l.createdAt.toISOString(),
  }));

  return <LeadsView leads={data} />;
}
