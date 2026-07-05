import { NextResponse } from "next/server";
import type { BookResponse } from "@/lib/cal";
import { db } from "@/db";
import { leads, leadEvents } from "@/db/schema";

export const dynamic = "force-dynamic";

/**
 * Persist the inbound lead. Never throws — lead capture must not break the
 * user's booking confirmation. Returns silently if the DB/env isn't configured.
 */
async function persistLead(
  parsed: ValidatedBody,
  opts: { status: "new" | "scheduled"; calBookingUid?: string; calStart?: string },
) {
  const teamId = process.env.DEFAULT_TEAM_ID;
  if (!teamId) return;
  try {
    const [lead] = await db
      .insert(leads)
      .values({
        teamId,
        name: parsed.name,
        email: parsed.email,
        branch: parsed.branch,
        focus: parsed.focus || null,
        notes: parsed.notes || null,
        timezone: parsed.timeZone,
        status: opts.status,
        calBookingUid: opts.calBookingUid ?? null,
        calStart: opts.calStart ? new Date(opts.calStart) : null,
      })
      .returning({ id: leads.id });
    if (lead) {
      await db.insert(leadEvents).values({
        leadId: lead.id,
        actor: null,
        type: "created",
        body: `Lead captured from the consultation form (${parsed.branch})`,
      });
    }
  } catch (err) {
    console.error("cal/book: persistLead failed (booking unaffected):", err);
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ValidatedBody {
  name: string;
  email: string;
  timeZone: string;
  start: string;
  notes: string;
  focus: string;
  branch: "build" | "product";
}

function validate(body: unknown): ValidatedBody | string {
  if (!body || typeof body !== "object") return "Request body must be JSON";
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name || name.length > 200) return "A valid name is required";

  const email = typeof b.email === "string" ? b.email.trim() : "";
  if (!EMAIL_RE.test(email) || email.length > 320)
    return "A valid email is required";

  const start = typeof b.start === "string" ? b.start : "";
  if (!start || Number.isNaN(Date.parse(start)))
    return "A valid start time is required";

  const timeZone =
    typeof b.timeZone === "string" && b.timeZone.length <= 100 && b.timeZone
      ? b.timeZone
      : "UTC";

  const notes =
    typeof b.notes === "string" ? b.notes.trim().slice(0, 2000) : "";
  const focus =
    typeof b.focus === "string" ? b.focus.trim().slice(0, 200) : "";
  const branch = b.branch === "product" ? "product" : "build";

  return { name, email, timeZone, start, notes, focus, branch };
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = validate(raw);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  const apiKey = process.env.CAL_API_KEY;
  const eventTypeId = process.env.CAL_EVENT_TYPE_ID;

  if (!apiKey || !eventTypeId) {
    await persistLead(parsed, { status: "new" });
    const body: BookResponse = { success: true, simulated: true };
    return NextResponse.json(body);
  }

  try {
    const res = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": "2024-08-13",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: new Date(parsed.start).toISOString(),
        eventTypeId: Number(eventTypeId),
        attendee: {
          name: parsed.name,
          email: parsed.email,
          timeZone: parsed.timeZone,
        },
        metadata: {
          branch: parsed.branch,
          focus: parsed.focus,
          notes: parsed.notes,
        },
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Cal.com bookings API responded ${res.status}: ${text}`);
    }
    const json = (await res.json().catch(() => null)) as {
      data?: { uid?: string; start?: string };
    } | null;
    await persistLead(parsed, {
      status: "scheduled",
      calBookingUid: json?.data?.uid,
      calStart: json?.data?.start ?? parsed.start,
    });
    const body: BookResponse = { success: true };
    return NextResponse.json(body);
  } catch (err) {
    // ponytail: per spec, a Cal API failure still resolves as a simulated success
    console.error("cal/book: Cal API error, returning simulated success:", err);
    await persistLead(parsed, { status: "new" });
    const body: BookResponse = { success: true, simulated: true };
    return NextResponse.json(body);
  }
}
