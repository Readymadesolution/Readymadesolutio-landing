"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { leads, leadEvents } from "@/db/schema";
import { auth } from "@/lib/auth/server";

type Result = { ok: true } | { error: string };

async function currentUserId(): Promise<string | null> {
  const { data } = await auth.getSession();
  return data?.user?.id ?? null;
}

function calHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "cal-api-version": "2024-08-13",
    "Content-Type": "application/json",
  };
}

/** Cancel a Cal.com booking, then mirror the webhook's lead sync (contacted, calStart cleared). */
export async function cancelBooking(uid: string, reason?: string): Promise<Result> {
  const actor = await currentUserId();
  if (!actor) return { error: "Not authorized." };
  if (!uid) return { error: "Missing booking id." };
  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) return { error: "Cal.com is not configured." };

  try {
    const res = await fetch(`https://api.cal.com/v2/bookings/${encodeURIComponent(uid)}/cancel`, {
      method: "POST",
      headers: calHeaders(apiKey),
      body: JSON.stringify({ cancellationReason: reason?.trim() || "Cancelled from the portal" }),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { error: `Cal.com could not cancel this booking (${res.status})${text ? `: ${text.slice(0, 160)}` : ""}` };
    }
  } catch (err) {
    console.error("cancelBooking: Cal API error:", err);
    return { error: "Could not reach Cal.com to cancel." };
  }

  // Mirror the webhook: mark the matching lead contacted and clear the meeting.
  try {
    const [lead] = await db.select().from(leads).where(eq(leads.calBookingUid, uid)).limit(1);
    if (lead) {
      await db
        .update(leads)
        .set({ status: "contacted", calStart: null, updatedAt: new Date() })
        .where(eq(leads.id, lead.id));
      await db.insert(leadEvents).values({
        leadId: lead.id,
        actor,
        type: "booking_synced",
        body: "Meeting cancelled from the portal",
      });
    }
  } catch (err) {
    console.error("cancelBooking: lead sync failed (booking already cancelled):", err);
  }

  revalidatePath("/portal/calendar");
  revalidatePath("/portal");
  return { ok: true };
}

/** Reschedule a Cal.com booking to a new start time. Cal issues a new uid; the
 *  BOOKING_RESCHEDULED webhook keeps the lead in sync, so we just revalidate. */
export async function rescheduleBooking(uid: string, newStartISO: string): Promise<Result> {
  const actor = await currentUserId();
  if (!actor) return { error: "Not authorized." };
  if (!uid) return { error: "Missing booking id." };
  if (!newStartISO || Number.isNaN(Date.parse(newStartISO)))
    return { error: "A valid new start time is required." };
  if (new Date(newStartISO).getTime() <= Date.now())
    return { error: "Pick a time in the future." };
  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) return { error: "Cal.com is not configured." };

  try {
    const res = await fetch(`https://api.cal.com/v2/bookings/${encodeURIComponent(uid)}/reschedule`, {
      method: "POST",
      headers: calHeaders(apiKey),
      body: JSON.stringify({
        start: new Date(newStartISO).toISOString(),
        reschedulingReason: "Rescheduled from the portal",
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { error: `Cal.com could not reschedule this booking (${res.status})${text ? `: ${text.slice(0, 160)}` : ""}` };
    }
  } catch (err) {
    console.error("rescheduleBooking: Cal API error:", err);
    return { error: "Could not reach Cal.com to reschedule." };
  }

  revalidatePath("/portal/calendar");
  revalidatePath("/portal");
  return { ok: true };
}
