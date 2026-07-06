"use client";

import { useMemo, useState, useTransition } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import EventBusyOutlined from "@mui/icons-material/EventBusyOutlined";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import VideocamOutlined from "@mui/icons-material/VideocamOutlined";
import ExpandMoreOutlined from "@mui/icons-material/ExpandMoreOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import StatusChip from "./StatusChip";
import type { LeadStatus } from "./leadStatus";
import { cancelBooking, rescheduleBooking } from "@/app/portal/calendar/actions";

export type MeetingRow = {
  uid: string;
  title: string;
  start: string;
  end: string;
  status: string;
  attendeeName: string;
  attendeeEmail: string;
  meetingUrl: string | null;
  lead: { id: string; focus: string | null; status: LeadStatus } | null;
};

const isCancelled = (s: string) => s.toLowerCase().includes("cancel");

function fmtTimeRange(startISO: string, endISO: string) {
  const opts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  const start = new Date(startISO).toLocaleTimeString("en-US", opts);
  const end = new Date(endISO).toLocaleTimeString("en-US", opts);
  return `${start} – ${end}`;
}

function dayKey(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

/** Value for a <input type="datetime-local">, in the viewer's local time. */
function toLocalInput(iso: string) {
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

function DateBadge({ iso, muted }: { iso: string; muted?: boolean }) {
  const d = new Date(iso);
  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: 2.5,
        flexShrink: 0,
        bgcolor: muted ? "grey.200" : "secondary.main",
        color: muted ? "text.secondary" : "secondary.contrastText",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
      }}
    >
      <Typography sx={{ fontFamily: (t) => t.typography.caption.fontFamily, fontSize: 16, fontWeight: 700 }}>
        {d.getDate()}
      </Typography>
      <Typography sx={{ fontSize: 9, textTransform: "uppercase", opacity: 0.8 }}>
        {d.toLocaleDateString("en-US", { month: "short" })}
      </Typography>
    </Box>
  );
}

function MeetingItem({
  m,
  past,
  onReschedule,
  onCancel,
}: {
  m: MeetingRow;
  past: boolean;
  onReschedule: (m: MeetingRow) => void;
  onCancel: (m: MeetingRow) => void;
}) {
  const cancelled = isCancelled(m.status);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 2.5, py: 1.75 }}>
      <DateBadge iso={m.start} muted={past || cancelled} />

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
            {fmtTimeRange(m.start, m.end)}
          </Typography>
          {cancelled && (
            <Chip size="small" label="Cancelled" sx={{ fontWeight: 600, fontSize: 11, bgcolor: "grey.200", color: "text.secondary" }} />
          )}
          {m.lead?.status && <StatusChip status={m.lead.status} />}
        </Box>
        <Typography noWrap sx={{ fontSize: 13.5, color: "text.primary", mt: 0.25 }}>
          {m.attendeeName || m.attendeeEmail || "Guest"}
          {m.attendeeName && m.attendeeEmail && (
            <Box component="span" sx={{ color: "text.secondary", fontWeight: 400 }}>
              {"  ·  "}
              {m.attendeeEmail}
            </Box>
          )}
        </Typography>
        {(m.lead?.focus || m.meetingUrl) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5, flexWrap: "wrap" }}>
            {m.lead?.focus && (
              <Typography noWrap sx={{ fontSize: 12.5, color: "text.secondary" }}>
                {m.lead.focus}
              </Typography>
            )}
            {m.lead && (
              <Link component={NextLink} href={`/portal/leads?lead=${m.lead.id}`} sx={{ fontSize: 12.5, fontWeight: 600 }}>
                View lead
              </Link>
            )}
            {m.meetingUrl && !cancelled && (
              <Link href={m.meetingUrl} target="_blank" rel="noreferrer" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: 12.5, fontWeight: 600 }}>
                <VideocamOutlined sx={{ fontSize: 15 }} /> Join
              </Link>
            )}
          </Box>
        )}
      </Box>

      {!past && !cancelled && (
        <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
          <Tooltip title="Reschedule">
            <IconButton size="small" onClick={() => onReschedule(m)} aria-label="Reschedule meeting">
              <ScheduleOutlined sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton size="small" onClick={() => onCancel(m)} aria-label="Cancel meeting" sx={{ color: "error.main" }}>
              <CloseOutlined sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2.5, py: 1.75 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{label}</Typography>
      <Chip size="small" label={count} sx={{ height: 20, fontSize: 11.5, fontWeight: 700, bgcolor: "grey.200", color: "text.secondary" }} />
    </Box>
  );
}

export default function CalendarView({ rows, error }: { rows: MeetingRow[]; error: string | null }) {
  const [isPending, startTransition] = useTransition();
  const [cancelTarget, setCancelTarget] = useState<MeetingRow | null>(null);
  const [reason, setReason] = useState("");
  const [rescheduleTarget, setRescheduleTarget] = useState<MeetingRow | null>(null);
  const [newStart, setNewStart] = useState("");
  const [showPast, setShowPast] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: "success" | "error" } | null>(null);

  const { upcomingByDay, past } = useMemo(() => {
    const now = Date.now();
    const upcoming = rows
      .filter((m) => new Date(m.start).getTime() >= now && !isCancelled(m.status))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const pastRows = rows
      .filter((m) => new Date(m.start).getTime() < now || isCancelled(m.status))
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

    const groups: { key: string; items: MeetingRow[] }[] = [];
    for (const m of upcoming) {
      const key = dayKey(m.start);
      const g = groups.find((x) => x.key === key);
      if (g) g.items.push(m);
      else groups.push({ key, items: [m] });
    }
    return { upcomingByDay: groups, past: pastRows };
  }, [rows]);

  function confirmCancel() {
    if (!cancelTarget) return;
    const uid = cancelTarget.uid;
    const r = reason;
    startTransition(async () => {
      const res = await cancelBooking(uid, r);
      if ("error" in res) setToast({ msg: res.error, kind: "error" });
      else setToast({ msg: "Meeting cancelled.", kind: "success" });
      setCancelTarget(null);
      setReason("");
    });
  }

  function confirmReschedule() {
    if (!rescheduleTarget) return;
    const value = newStart || toLocalInput(rescheduleTarget.start);
    const uid = rescheduleTarget.uid;
    const iso = new Date(value).toISOString();
    startTransition(async () => {
      const res = await rescheduleBooking(uid, iso);
      if ("error" in res) setToast({ msg: res.error, kind: "error" });
      else setToast({ msg: "Meeting rescheduled.", kind: "success" });
      setRescheduleTarget(null);
      setNewStart("");
    });
  }

  const hasAny = rows.length > 0;

  return (
    <Box sx={{ maxWidth: 860 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {/* Empty state */}
      {!hasAny && !error && (
        <Paper variant="outlined" sx={{ borderRadius: 4, px: 3, py: 8, textAlign: "center" }}>
          <CalendarMonthOutlined sx={{ fontSize: 40, color: "text.disabled" }} />
          <Typography sx={{ fontSize: 15, fontWeight: 600, mt: 1.5 }}>No meetings booked yet.</Typography>
          <Typography sx={{ fontSize: 13.5, color: "text.secondary", mt: 0.5 }}>
            New consultation bookings from Cal.com will appear here.
          </Typography>
        </Paper>
      )}

      {hasAny && (
        <>
          {/* Upcoming */}
          <Paper variant="outlined" sx={{ borderRadius: 4, overflow: "hidden" }}>
            <SectionHeader label="Upcoming meetings" count={upcomingByDay.reduce((n, g) => n + g.items.length, 0)} />
            <Divider />
            {upcomingByDay.length === 0 ? (
              <Box sx={{ px: 2.5, py: 5, textAlign: "center" }}>
                <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>No upcoming meetings.</Typography>
              </Box>
            ) : (
              upcomingByDay.map((g, gi) => (
                <Box key={g.key}>
                  <Typography
                    sx={{
                      px: 2.5,
                      pt: gi === 0 ? 1.75 : 2,
                      pb: 0.5,
                      fontSize: 11.5,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "text.secondary",
                      bgcolor: "grey.100",
                    }}
                  >
                    {g.key}
                  </Typography>
                  {g.items.map((m, i) => (
                    <Box key={m.uid}>
                      {i > 0 && <Divider />}
                      <MeetingItem m={m} past={false} onReschedule={setRescheduleTarget} onCancel={setCancelTarget} />
                    </Box>
                  ))}
                </Box>
              ))
            )}
          </Paper>

          {/* Past */}
          {past.length > 0 && (
            <Box sx={{ mt: 2.5 }}>
              <Button
                onClick={() => setShowPast((v) => !v)}
                endIcon={
                  <ExpandMoreOutlined
                    sx={{ transition: "transform .15s", transform: showPast ? "rotate(180deg)" : "none" }}
                  />
                }
                startIcon={<EventBusyOutlined />}
                sx={{ color: "text.secondary", px: 1 }}
              >
                Past &amp; cancelled ({past.length})
              </Button>
              <Collapse in={showPast}>
                <Paper variant="outlined" sx={{ borderRadius: 4, overflow: "hidden", mt: 1 }}>
                  {past.map((m, i) => (
                    <Box key={m.uid}>
                      {i > 0 && <Divider />}
                      <MeetingItem m={m} past onReschedule={setRescheduleTarget} onCancel={setCancelTarget} />
                    </Box>
                  ))}
                </Paper>
              </Collapse>
            </Box>
          )}
        </>
      )}

      {/* Cancel dialog */}
      <Dialog open={Boolean(cancelTarget)} onClose={() => !isPending && setCancelTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Cancel this meeting?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 14, mb: 2 }}>
            {cancelTarget && (
              <>
                {cancelTarget.attendeeName || cancelTarget.attendeeEmail} ·{" "}
                {new Date(cancelTarget.start).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </>
            )}
          </DialogContentText>
          <TextField
            label="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelTarget(null)} disabled={isPending} sx={{ color: "text.secondary" }}>
            Keep it
          </Button>
          <Button
            onClick={confirmCancel}
            disabled={isPending}
            variant="contained"
            color="error"
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Cancel meeting
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reschedule dialog */}
      <Dialog
        open={Boolean(rescheduleTarget)}
        onClose={() => !isPending && setRescheduleTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Reschedule meeting</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 14, mb: 2 }}>
            Currently{" "}
            {rescheduleTarget &&
              new Date(rescheduleTarget.start).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            . Pick a new time.
          </DialogContentText>
          <TextField
            type="datetime-local"
            label="New start"
            value={newStart || (rescheduleTarget ? toLocalInput(rescheduleTarget.start) : "")}
            onChange={(e) => setNewStart(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          {rescheduleTarget?.meetingUrl && (
            <Typography sx={{ fontSize: 12.5, color: "text.secondary", mt: 1.5 }}>
              Prefer Cal.com?{" "}
              <Link href={rescheduleTarget.meetingUrl} target="_blank" rel="noreferrer" sx={{ fontWeight: 600 }}>
                Manage on Cal
              </Link>
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRescheduleTarget(null)} disabled={isPending} sx={{ color: "text.secondary" }}>
            Back
          </Button>
          <Button
            onClick={confirmReschedule}
            disabled={isPending}
            variant="contained"
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Reschedule
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {toast ? (
          <Alert severity={toast.kind} onClose={() => setToast(null)} sx={{ borderRadius: 3 }}>
            {toast.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
