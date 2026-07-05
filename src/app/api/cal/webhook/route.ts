import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { leads, leadEvents } from "@/db/schema";

export const dynamic = "force-dynamic";

/**
 * Cal.com webhook — keeps a lead's meeting state in sync.
 * Handles BOOKING_CREATED / BOOKING_RESCHEDULED / BOOKING_CANCELLED.
 * Verifies the HMAC signature when CAL_WEBHOOK_SECRET is configured.
 */
function verify(raw: string, signature: string | null): boolean {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) return true; // unsigned in dev; set the secret in prod
  if (!signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(digest);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function logEvent(leadId: string, type: string, body: string) {
  await db.insert(leadEvents).values({ leadId, actor: null, type, body });
}

export async function POST(req: Request) {
  const raw = await req.text();
  if (!verify(raw, req.headers.get("x-cal-signature-256"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let evt: { triggerEvent?: string; payload?: Record<string, unknown> };
  try {
    evt = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const trigger = evt.triggerEvent;
  const p = evt.payload ?? {};
  const uid = (p.uid as string) || (p.bookingUid as string) || "";
  const start =
    (p.startTime as string) || (p.start as string) || null;
  const attendees = (p.attendees as { email?: string; name?: string }[]) ?? [];
  const email = attendees[0]?.email?.toLowerCase() ?? "";
  const teamId = process.env.DEFAULT_TEAM_ID;

  try {
    // Find the lead this booking belongs to: by Cal uid, else by attendee email.
    let lead =
      uid
        ? (await db.select().from(leads).where(eq(leads.calBookingUid, uid)).limit(1))[0]
        : undefined;
    if (!lead && email) {
      lead = (
        await db
          .select()
          .from(leads)
          .where(eq(leads.email, email))
          .orderBy(desc(leads.createdAt))
          .limit(1)
      )[0];
    }

    switch (trigger) {
      case "BOOKING_CREATED": {
        if (lead) {
          await db
            .update(leads)
            .set({
              status: "scheduled",
              calBookingUid: uid || lead.calBookingUid,
              calStart: start ? new Date(start) : lead.calStart,
              updatedAt: new Date(),
            })
            .where(eq(leads.id, lead.id));
          await logEvent(lead.id, "booking_synced", "Meeting booked via Cal.com");
        } else if (teamId && email) {
          // Booking made directly on Cal (not through the form) — create the lead.
          const [created] = await db
            .insert(leads)
            .values({
              teamId,
              name: attendees[0]?.name ?? email,
              email,
              status: "scheduled",
              source: "cal.com",
              calBookingUid: uid || null,
              calStart: start ? new Date(start) : null,
            })
            .returning({ id: leads.id });
          if (created)
            await logEvent(created.id, "created", "Created from a direct Cal.com booking");
        }
        break;
      }
      case "BOOKING_RESCHEDULED": {
        if (lead) {
          await db
            .update(leads)
            .set({
              calBookingUid: uid || lead.calBookingUid,
              calStart: start ? new Date(start) : lead.calStart,
              status: "scheduled",
              updatedAt: new Date(),
            })
            .where(eq(leads.id, lead.id));
          await logEvent(
            lead.id,
            "booking_synced",
            start
              ? `Meeting rescheduled to ${new Date(start).toUTCString()}`
              : "Meeting rescheduled",
          );
        }
        break;
      }
      case "BOOKING_CANCELLED": {
        if (lead) {
          await db
            .update(leads)
            .set({ status: "contacted", calStart: null, updatedAt: new Date() })
            .where(eq(leads.id, lead.id));
          await logEvent(lead.id, "booking_synced", "Meeting cancelled");
        }
        break;
      }
      default:
        return NextResponse.json({ ignored: trigger ?? "unknown" });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("cal/webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
