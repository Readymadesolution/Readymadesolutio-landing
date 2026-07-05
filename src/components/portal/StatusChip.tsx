"use client";

import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { alpha, type Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";
import type { LeadStatus } from "./leadStatus";

export type { LeadStatus } from "./leadStatus";
export { LEAD_STATUSES } from "./leadStatus";

/** Chip styling per status — all derived from the brand theme tokens. */
const META: Record<
  LeadStatus,
  { label: string; sx: SxProps<Theme>; dot: (t: Theme) => string }
> = {
  new: {
    label: "New",
    sx: { bgcolor: "primary.light", color: "primary.dark" },
    dot: (t) => t.palette.primary.main,
  },
  contacted: {
    label: "Contacted",
    sx: { bgcolor: "grey.200", color: "text.secondary" },
    dot: (t) => t.palette.grey[500],
  },
  scheduled: {
    label: "Scheduled",
    sx: { bgcolor: "secondary.main", color: "secondary.contrastText" },
    dot: (t) => t.palette.primary.main,
  },
  won: {
    label: "Won",
    sx: {
      bgcolor: (t: Theme) => alpha(t.palette.success.main, 0.14),
      color: "success.main",
    },
    dot: (t) => t.palette.success.main,
  },
  lost: {
    label: "Lost",
    sx: {
      bgcolor: (t: Theme) => alpha(t.palette.error.main, 0.1),
      color: "error.main",
    },
    dot: (t) => t.palette.error.main,
  },
};

export default function StatusChip({ status }: { status: LeadStatus }) {
  const m = META[status] ?? META.new;
  return (
    <Chip
      size="small"
      label={m.label}
      icon={
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: m.dot,
            ml: 1,
          }}
        />
      }
      sx={{ fontWeight: 600, fontSize: 12, ...m.sx }}
    />
  );
}
