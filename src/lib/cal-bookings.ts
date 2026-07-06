import "server-only";

/**
 * Server-only Cal.com bookings reader. Fetches this event type's bookings and
 * normalizes them to a lean shape for the calendar view. Never throws — on a
 * missing env var or an API error it returns an empty list plus an `error`
 * string so the page can render an error/empty state.
 */

export type CalBooking = {
  uid: string;
  title: string;
  start: string; // ISO
  end: string; // ISO
  status: string;
  attendeeName: string;
  attendeeEmail: string;
  meetingUrl: string | null;
};

export type CalBookingsResult = { bookings: CalBooking[]; error: string | null };

type RawBooking = {
  uid?: string;
  title?: string;
  start?: string;
  end?: string;
  status?: string;
  meetingUrl?: string;
  location?: string;
  attendees?: { name?: string; email?: string; timeZone?: string }[];
};

export async function getBookings(): Promise<CalBookingsResult> {
  const apiKey = process.env.CAL_API_KEY;
  const eventTypeId = process.env.CAL_EVENT_TYPE_ID;
  if (!apiKey || !eventTypeId) {
    return { bookings: [], error: "Cal.com is not configured." };
  }

  try {
    const res = await fetch(
      `https://api.cal.com/v2/bookings?eventTypeId=${encodeURIComponent(eventTypeId)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "cal-api-version": "2024-08-13",
        },
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        bookings: [],
        error: `Cal.com responded ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`,
      };
    }
    const json = (await res.json().catch(() => null)) as {
      data?: RawBooking[];
    } | null;
    const raw = Array.isArray(json?.data) ? json!.data : [];

    const bookings: CalBooking[] = raw
      .filter((b): b is RawBooking & { uid: string; start: string } => Boolean(b?.uid && b?.start))
      .map((b) => {
        const a = b.attendees?.[0];
        return {
          uid: b.uid!,
          title: b.title ?? "Meeting",
          start: b.start!,
          end: b.end ?? b.start!,
          status: b.status ?? "accepted",
          attendeeName: a?.name ?? "",
          attendeeEmail: a?.email ?? "",
          meetingUrl: b.meetingUrl ?? b.location ?? null,
        };
      });

    return { bookings, error: null };
  } catch (err) {
    console.error("getBookings failed:", err);
    return { bookings: [], error: "Could not reach Cal.com. Please try again." };
  }
}
