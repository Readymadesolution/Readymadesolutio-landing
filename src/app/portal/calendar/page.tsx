import { db } from "@/db";
import { leads } from "@/db/schema";
import { getBookings } from "@/lib/cal-bookings";
import CalendarView, { type MeetingRow } from "@/components/portal/CalendarView";
import type { LeadStatus } from "@/components/portal/leadStatus";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const { bookings, error } = await getBookings();

  // Cross-reference leads so each meeting can show the lead's focus + status.
  let leadRows: {
    id: string;
    email: string;
    focus: string | null;
    status: LeadStatus;
    calBookingUid: string | null;
  }[] = [];
  try {
    leadRows = await db
      .select({
        id: leads.id,
        email: leads.email,
        focus: leads.focus,
        status: leads.status,
        calBookingUid: leads.calBookingUid,
      })
      .from(leads);
  } catch (err) {
    console.error("calendar: lead lookup failed:", err);
  }

  const byUid = new Map(
    leadRows.filter((l) => l.calBookingUid).map((l) => [l.calBookingUid!, l]),
  );
  const byEmail = new Map(leadRows.map((l) => [l.email.toLowerCase(), l]));

  const rows: MeetingRow[] = bookings.map((b) => {
    const lead = byUid.get(b.uid) ?? byEmail.get(b.attendeeEmail.toLowerCase()) ?? null;
    return {
      ...b,
      lead: lead ? { id: lead.id, focus: lead.focus, status: lead.status } : null,
    };
  });

  return <CalendarView rows={rows} error={error} />;
}
