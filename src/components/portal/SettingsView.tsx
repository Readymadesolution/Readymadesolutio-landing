"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Link from "@mui/material/Link";
import type { SvgIconComponent } from "@mui/icons-material";
import FlagOutlined from "@mui/icons-material/FlagOutlined";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import { authClient } from "@/lib/auth/client";
import { saveGoals, type GoalValues } from "@/app/portal/goals-actions";

const ORG_NAME = "ReadyMade Solution";

type FieldKey = keyof GoalValues;

const GOAL_FIELDS: { key: FieldKey; label: string; max: number }[] = [
  { key: "leadsTarget", label: "Leads target", max: 100000 },
  { key: "meetingsTarget", label: "Meetings booked target", max: 100000 },
  { key: "wonTarget", label: "Deals won target", max: 100000 },
  { key: "winRateTarget", label: "Win rate target (%)", max: 100 },
];

function SectionCard({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: SvgIconComponent;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 4, overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 2.5,
          py: 1.75,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: 32,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            bgcolor: "primary.light",
            color: "primary.dark",
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 700, flex: 1 }}>{title}</Typography>
        {action}
      </Box>
      <Divider />
      <Box sx={{ px: 2.5, py: 2.5 }}>{children}</Box>
    </Paper>
  );
}

function ReadOnlyRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 11.5,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ mt: 0.5, fontSize: 14, fontWeight: 600 }}>{children}</Box>
    </Box>
  );
}

export default function SettingsView({
  goals,
  calEventId,
  calUser,
}: {
  goals: GoalValues;
  calEventId: string | null;
  calUser: string | null;
}) {
  const { data: session } = authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const orgName = activeOrg?.name || ORG_NAME;
  const email = session?.user?.email ?? "—";

  const [values, setValues] = useState<Record<FieldKey, string>>({
    leadsTarget: String(goals.leadsTarget),
    meetingsTarget: String(goals.meetingsTarget),
    wonTarget: String(goals.wonTarget),
    winRateTarget: String(goals.winRateTarget),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const calConnected = Boolean(calEventId);

  function setField(key: FieldKey, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function onSave() {
    setError(null);
    setSaving(true);
    const input: GoalValues = {
      leadsTarget: Number(values.leadsTarget) || 0,
      meetingsTarget: Number(values.meetingsTarget) || 0,
      wonTarget: Number(values.wonTarget) || 0,
      winRateTarget: Number(values.winRateTarget) || 0,
    };
    const res = await saveGoals(input);
    setSaving(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setSaved(true);
  }

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 2.5 }}>
      {/* Performance goals */}
      <SectionCard icon={FlagOutlined} title="Performance goals">
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.25 }}>Monthly goals</Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2.5 }}>
          These targets drive the progress bars on your dashboard.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {GOAL_FIELDS.map((f) => (
            <Grid key={f.key} size={{ xs: 12, sm: 6 }}>
              <TextField
                label={f.label}
                type="number"
                value={values[f.key]}
                onChange={(e) => setField(f.key, e.target.value)}
                fullWidth
                size="small"
                helperText="Your target for a calendar month"
                slotProps={{ htmlInput: { min: 0, max: f.max, step: 1 } }}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 2.5 }}>
          <Button variant="contained" onClick={() => void onSave()} loading={saving}>
            Save goals
          </Button>
        </Box>
      </SectionCard>

      {/* Workspace */}
      <SectionCard icon={BusinessOutlined} title="Workspace">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <ReadOnlyRow label="Workspace">{orgName}</ReadOnlyRow>
          <ReadOnlyRow label="Signed in as">{email}</ReadOnlyRow>
        </Box>
      </SectionCard>

      {/* Cal.com */}
      <SectionCard
        icon={EventAvailableOutlined}
        title="Cal.com"
        action={
          calConnected ? (
            <Chip
              size="small"
              color="success"
              icon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
              label="Connected"
              sx={{ fontWeight: 600 }}
            />
          ) : (
            <Chip size="small" label="Not configured" sx={{ bgcolor: "grey.100", fontWeight: 600 }} />
          )
        }
      >
        {calConnected ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <ReadOnlyRow label="Event type ID">
              <Box component="span" sx={{ fontFamily: (t) => t.typography.caption.fontFamily }}>
                {calEventId}
              </Box>
            </ReadOnlyRow>
            {calUser && (
              <ReadOnlyRow label="Booking page">
                <Link href={`https://cal.com/${calUser}`} target="_blank" rel="noopener" underline="hover">
                  cal.com/{calUser}
                </Link>
              </ReadOnlyRow>
            )}
          </Box>
        ) : (
          <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>
            Cal.com is not connected. Set the event type to sync bookings.
          </Typography>
        )}
      </SectionCard>

      {/* Notifications */}
      <SectionCard icon={NotificationsNoneOutlined} title="Notifications">
        <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>
          New-lead email alerts are coming soon.
        </Typography>
      </SectionCard>

      <Snackbar
        open={saved}
        autoHideDuration={4000}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSaved(false)} sx={{ width: "100%" }}>
          Goals saved.
        </Alert>
      </Snackbar>
    </Box>
  );
}
