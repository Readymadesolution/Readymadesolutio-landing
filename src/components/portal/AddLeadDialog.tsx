"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { createLead } from "@/app/portal/leads/actions";
import { LEAD_STATUSES, type LeadStatus } from "./leadStatus";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  won: "Won",
  lost: "Lost",
};

export default function AddLeadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState<"" | "build" | "product">("");
  const [focus, setFocus] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<LeadStatus>("new");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = name.trim().length > 0 && name.trim().length < 200 && EMAIL_RE.test(email.trim());

  const reset = () => {
    setName("");
    setEmail("");
    setBranch("");
    setFocus("");
    setNotes("");
    setStatus("new");
    setError(null);
  };

  const handleClose = () => {
    if (pending) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!valid) return;
    setPending(true);
    setError(null);
    const res = await createLead({
      name,
      email,
      branch: branch || null,
      focus,
      notes,
      status,
    });
    setPending(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    reset();
    onClose();
    router.refresh();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { borderRadius: 4 } } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Add lead</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {error && <Typography sx={{ color: "error.main", fontSize: 13.5 }}>{error}</Typography>}
          <TextField
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            error={email.length > 0 && !EMAIL_RE.test(email.trim())}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Branch"
              select
              value={branch}
              onChange={(e) => setBranch(e.target.value as "" | "build" | "product")}
              fullWidth
            >
              <MenuItem value="">—</MenuItem>
              <MenuItem value="build">Build</MenuItem>
              <MenuItem value="product">Product</MenuItem>
            </TextField>
            <TextField
              label="Status"
              select
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
              fullWidth
            >
              {LEAD_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {STATUS_LABEL[s]}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <TextField
            label="Focus"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            fullWidth
          />
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} color="secondary" disabled={pending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          disabled={!valid || pending}
          startIcon={pending ? <CircularProgress size={14} color="inherit" /> : null}
        >
          Add lead
        </Button>
      </DialogActions>
    </Dialog>
  );
}
