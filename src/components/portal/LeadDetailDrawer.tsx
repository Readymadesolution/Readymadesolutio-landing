"use client";

import { useCallback, useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import StatusChip from "./StatusChip";
import { LEAD_STATUSES, type LeadStatus } from "./leadStatus";
import { getLeadDetail, updateLeadStatus, addLeadNote, type LeadDetail } from "@/app/portal/leads/actions";

const WIDTH = 440;

function relative(iso: string) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 6e4);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtFull(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const EVENT_LABEL: Record<string, string> = {
  created: "Created",
  status_changed: "Status changed",
  note: "Note",
  assigned: "Assigned",
  booking_synced: "Booking synced",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 1 }}>
      <Typography sx={{ fontSize: 13, color: "text.secondary", flexShrink: 0 }}>{label}</Typography>
      <Typography sx={{ fontSize: 13.5, fontWeight: 500, color: "text.primary", textAlign: "right" }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function LeadDetailDrawer({
  open,
  leadId,
  onClose,
}: {
  open: boolean;
  leadId: string | null;
  onClose: () => void;
}) {
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [note, setNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    const res = await getLeadDetail(id);
    if ("error" in res) {
      setError(res.error);
      setLead(null);
    } else {
      setLead(res.lead);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open && leadId) {
      setNote("");
      load(leadId);
    }
  }, [open, leadId, load]);

  const onStatus = async (_e: React.MouseEvent<HTMLElement>, next: LeadStatus | null) => {
    if (!next || !lead || next === lead.status) return;
    setSavingStatus(true);
    setLead({ ...lead, status: next }); // optimistic
    const res = await updateLeadStatus(lead.id, next);
    if ("error" in res) {
      setError(res.error);
    } else {
      await load(lead.id); // refresh timeline
    }
    setSavingStatus(false);
  };

  const onAddNote = async () => {
    if (!lead || !note.trim()) return;
    setAddingNote(true);
    const res = await addLeadNote(lead.id, note);
    if ("error" in res) {
      setError(res.error);
    } else {
      setNote("");
      await load(lead.id);
    }
    setAddingNote(false);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: WIDTH }, borderRadius: 0 } } }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        {loading || !lead ? (
          <>
            <Skeleton variant="circular" width={44} height={44} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="60%" height={24} />
              <Skeleton width="80%" height={18} />
            </Box>
          </>
        ) : (
          <>
            <Avatar
              sx={{ width: 44, height: 44, bgcolor: "primary.light", color: "primary.dark", fontWeight: 700 }}
            >
              {lead.name.slice(0, 1).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" noWrap sx={{ fontSize: 18, fontWeight: 700 }}>
                {lead.name}
              </Typography>
              <Typography noWrap sx={{ fontSize: 13.5, color: "text.secondary" }}>
                {lead.email}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <StatusChip status={lead.status} />
              </Box>
            </Box>
          </>
        )}
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      {error && !loading && !lead ? (
        <Box sx={{ p: 3 }}>
          <Typography sx={{ color: "error.main", fontSize: 14 }}>{error}</Typography>
          {leadId && (
            <Button onClick={() => load(leadId)} sx={{ mt: 2 }} variant="outlined" color="secondary">
              Retry
            </Button>
          )}
        </Box>
      ) : loading || !lead ? (
        <Box sx={{ p: 2.5 }}>
          <Skeleton height={40} sx={{ mb: 2 }} />
          <Skeleton height={120} sx={{ mb: 2 }} />
          <Skeleton height={100} />
        </Box>
      ) : (
        <Box sx={{ p: 2.5, overflowY: "auto" }}>
          {error && (
            <Typography sx={{ color: "error.main", fontSize: 13, mb: 1.5 }}>{error}</Typography>
          )}

          {/* Status changer */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={lead.status}
              onChange={onStatus}
              disabled={savingStatus}
              sx={{
                flexWrap: "wrap",
                "& .MuiToggleButton-root": {
                  textTransform: "capitalize",
                  border: 1,
                  borderColor: "divider",
                  px: 1.25,
                  py: 0.4,
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: "text.secondary",
                  "&.Mui-selected": {
                    bgcolor: "secondary.main",
                    color: "secondary.contrastText",
                    "&:hover": { bgcolor: "secondary.light" },
                  },
                },
              }}
            >
              {LEAD_STATUSES.map((s) => (
                <ToggleButton key={s} value={s}>
                  {s}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {savingStatus && <CircularProgress size={16} />}
          </Box>

          {/* Details */}
          <Box sx={{ mb: 1 }}>
            <Row label="Focus" value={lead.focus || "—"} />
            <Divider />
            <Row label="Branch" value={lead.branch ? lead.branch : "—"} />
            <Divider />
            <Row label="Timezone" value={lead.timezone || "—"} />
            <Divider />
            <Row label="Source" value={lead.source} />
            <Divider />
            <Row label="Created" value={fmtFull(lead.createdAt)} />
            <Divider />
            <Row label="Meeting" value={fmtFull(lead.calStart)} />
          </Box>

          {/* Notes / original message */}
          {lead.notes && (
            <Paper
              variant="outlined"
              sx={{ mt: 2, p: 1.75, borderRadius: 3, bgcolor: "background.default" }}
            >
              <Typography sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "text.secondary", mb: 0.5 }}>
                Message
              </Typography>
              <Typography sx={{ fontSize: 13.5, color: "text.primary", whiteSpace: "pre-wrap" }}>
                {lead.notes}
              </Typography>
            </Paper>
          )}

          {/* Add note */}
          <Box sx={{ mt: 3 }}>
            <TextField
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note…"
              multiline
              minRows={2}
              fullWidth
              size="small"
            />
            <Button
              onClick={onAddNote}
              variant="contained"
              color="secondary"
              disabled={!note.trim() || addingNote}
              startIcon={addingNote ? <CircularProgress size={14} color="inherit" /> : null}
              sx={{ mt: 1 }}
            >
              Add note
            </Button>
          </Box>

          {/* Activity timeline */}
          <Typography
            sx={{ mt: 3.5, mb: 1.5, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "text.secondary" }}
          >
            Activity
          </Typography>
          {lead.events.length === 0 ? (
            <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>No activity yet.</Typography>
          ) : (
            <Box>
              {lead.events.map((ev, i) => (
                <Box key={ev.id} sx={{ display: "flex", gap: 1.5 }}>
                  {/* dot + connecting line */}
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 0.5 }}>
                    <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "primary.main", flexShrink: 0 }} />
                    {i < lead.events.length - 1 && (
                      <Box sx={{ width: "2px", flex: 1, bgcolor: "divider", mt: 0.5 }} />
                    )}
                  </Box>
                  <Box sx={{ pb: 2, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "text.primary" }}>
                      {EVENT_LABEL[ev.type] ?? ev.type}
                    </Typography>
                    {ev.body && (
                      <Typography sx={{ fontSize: 13, color: "text.secondary", whiteSpace: "pre-wrap" }}>
                        {ev.body}
                      </Typography>
                    )}
                    <Typography sx={{ fontSize: 12, color: "text.disabled", mt: 0.25 }}>
                      {relative(ev.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Drawer>
  );
}
