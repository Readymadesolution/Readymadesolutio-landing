"use server";

import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { leads, leadEvents } from "@/db/schema";
import { LEAD_STATUSES, type LeadStatus } from "@/components/portal/leadStatus";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Result = { ok: true } | { error: string };

function revalidateLeads() {
  revalidatePath("/portal/leads");
  revalidatePath("/portal");
}

export type CreateLeadInput = {
  name: string;
  email: string;
  branch?: "build" | "product" | null;
  focus?: string | null;
  notes?: string | null;
  status?: LeadStatus;
};

export async function createLead(input: CreateLeadInput): Promise<Result> {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  if (!name || name.length >= 200) return { error: "Name is required (under 200 characters)." };
  if (!email || email.length >= 320 || !EMAIL_RE.test(email))
    return { error: "A valid email is required." };
  const status: LeadStatus =
    input.status && LEAD_STATUSES.includes(input.status) ? input.status : "new";

  const teamId = process.env.DEFAULT_TEAM_ID;
  if (!teamId) return { error: "Team is not configured." };

  try {
    const [lead] = await db
      .insert(leads)
      .values({
        teamId,
        name,
        email,
        branch: input.branch ?? null,
        focus: input.focus?.trim() || null,
        notes: input.notes?.trim() || null,
        status,
        source: "manual",
      })
      .returning({ id: leads.id });
    if (lead) {
      await db.insert(leadEvents).values({
        leadId: lead.id,
        actor: null,
        type: "created",
        body: "Lead added manually",
      });
    }
    revalidateLeads();
    return { ok: true };
  } catch (err) {
    console.error("createLead failed:", err);
    return { error: "Could not create the lead. Please try again." };
  }
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Result> {
  if (!LEAD_STATUSES.includes(status)) return { error: "Invalid status." };
  try {
    await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, id));
    await db.insert(leadEvents).values({
      leadId: id,
      actor: null,
      type: "status_changed",
      body: `Status → ${status}`,
    });
    revalidateLeads();
    return { ok: true };
  } catch (err) {
    console.error("updateLeadStatus failed:", err);
    return { error: "Could not update the status." };
  }
}

export async function addLeadNote(id: string, note: string): Promise<Result> {
  const body = note?.trim() ?? "";
  if (!body || body.length >= 2000) return { error: "Note must be 1–2000 characters." };
  try {
    await db.insert(leadEvents).values({ leadId: id, actor: null, type: "note", body });
    revalidateLeads();
    return { ok: true };
  } catch (err) {
    console.error("addLeadNote failed:", err);
    return { error: "Could not add the note." };
  }
}

export type LeadDetail = {
  id: string;
  name: string;
  email: string;
  branch: "build" | "product" | null;
  focus: string | null;
  notes: string | null;
  timezone: string | null;
  status: LeadStatus;
  source: string;
  calStart: string | null;
  createdAt: string;
  updatedAt: string;
  events: {
    id: string;
    actor: string | null;
    type: string;
    body: string | null;
    createdAt: string;
  }[];
};

export async function getLeadDetail(
  id: string,
): Promise<{ lead: LeadDetail } | { error: string }> {
  try {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    if (!lead) return { error: "Lead not found." };
    const events = await db
      .select()
      .from(leadEvents)
      .where(eq(leadEvents.leadId, id))
      .orderBy(desc(leadEvents.createdAt));
    return {
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        branch: lead.branch,
        focus: lead.focus,
        notes: lead.notes,
        timezone: lead.timezone,
        status: lead.status,
        source: lead.source,
        calStart: lead.calStart ? lead.calStart.toISOString() : null,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
        events: events.map((e) => ({
          id: e.id,
          actor: e.actor,
          type: e.type,
          body: e.body,
          createdAt: e.createdAt.toISOString(),
        })),
      },
    };
  } catch (err) {
    console.error("getLeadDetail failed:", err);
    return { error: "Could not load the lead." };
  }
}
