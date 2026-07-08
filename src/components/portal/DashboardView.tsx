"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useTheme, alpha } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import StatusChip from "./StatusChip";
import type { LeadStatus } from "./leadStatus";

export type GoalProgress = {
  label: string;
  actual: number;
  target: number;
  percent: number;
  onTrack: boolean;
  isRate: boolean;
};

export type DashboardData = {
  goals: GoalProgress[];
  trend: { month: string; leads: number; meetings: number }[];
  funnel: { label: string; count: number }[];
  conversion: number;
  totalLeads: number;
  needsAttention: { id: string; name: string; sub: string; status: LeadStatus }[];
  upcoming: { id: string; name: string; focus: string | null; calStart: string }[];
};

const MONO = (t: import("@mui/material/styles").Theme) =>
  t.typography.caption.fontFamily;

function GoalCard({ g }: { g: GoalProgress }) {
  const fmt = (n: number) => (g.isRate ? `${n}%` : `${n}`);
  return (
    <Card sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography
          sx={{
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          {g.label}
        </Typography>
        <Chip
          size="small"
          icon={
            g.onTrack ? (
              <CheckCircleOutlined sx={{ fontSize: 14, ml: 0.75 }} />
            ) : (
              <WarningAmberOutlined sx={{ fontSize: 14, ml: 0.75 }} />
            )
          }
          label={g.onTrack ? "On track" : "Behind"}
          sx={{
            fontWeight: 600,
            fontSize: 11,
            height: 22,
            bgcolor: (t) =>
              alpha(g.onTrack ? t.palette.success.main : t.palette.text.primary, 0.1),
            color: g.onTrack ? "success.main" : "text.primary",
            "& .MuiChip-icon": { color: "inherit" },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
        <Typography sx={{ fontFamily: MONO, fontSize: 30, fontWeight: 700, lineHeight: 1, color: "text.primary" }}>
          {fmt(g.actual)}
        </Typography>
        <Typography sx={{ fontFamily: MONO, fontSize: 15, fontWeight: 600, color: "text.secondary" }}>
          / {fmt(g.target)}
        </Typography>
      </Box>

      <Box sx={{ mt: "auto" }}>
        <LinearProgress
          variant="determinate"
          value={g.percent}
          sx={{
            height: 8,
            borderRadius: 5,
            bgcolor: (t) => alpha(t.palette.text.primary, 0.08),
            "& .MuiLinearProgress-bar": {
              borderRadius: 5,
              bgcolor: (t) => (g.onTrack ? t.palette.success.main : t.palette.secondary.main),
            },
          }}
        />
        <Typography sx={{ mt: 0.75, fontSize: 11.5, color: "text.secondary" }}>
          {g.percent}% of goal
        </Typography>
      </Box>
    </Card>
  );
}

export default function DashboardView({ data }: { data: DashboardData }) {
  const theme = useTheme();
  const { goals, trend, funnel, conversion, totalLeads, needsAttention, upcoming } = data;

  const funnelColors = [
    theme.palette.primary.main,
    theme.palette.grey[500],
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
  ];
  const funnelMax = Math.max(1, ...funnel.map((f) => f.count));

  return (
    <Grid container spacing={2.5}>
      {/* Goal progress row */}
      {goals.map((g) => (
        <Grid key={g.label} size={{ xs: 6, md: 3 }}>
          <GoalCard g={g} />
        </Grid>
      ))}

      {/* Trend chart */}
      <Grid size={{ xs: 12, md: 7 }}>
        <Card sx={{ p: 2.5, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <TrendingUpOutlined sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 700 }}>
              Leads &amp; meetings — last 6 months
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
            New leads created vs. meetings booked
          </Typography>
          <LineChart
            height={300}
            margin={{ top: 16, right: 12, bottom: 24, left: 8 }}
            xAxis={[
              {
                data: trend.map((t) => t.month),
                scaleType: "point",
                tickLabelStyle: { fontSize: 12, fill: theme.palette.text.secondary },
              },
            ]}
            yAxis={[
              {
                tickMinStep: 1,
                width: 32,
                tickLabelStyle: { fontSize: 12, fill: theme.palette.text.secondary },
              },
            ]}
            series={[
              {
                data: trend.map((t) => t.leads),
                label: "Leads",
                color: theme.palette.primary.main,
                curve: "monotoneX",
                area: true,
              },
              {
                data: trend.map((t) => t.meetings),
                label: "Meetings",
                color: theme.palette.secondary.main,
                curve: "monotoneX",
              },
            ]}
            grid={{ horizontal: true }}
            sx={{
              "& .MuiAreaElement-series-Leads": {
                fill: alpha(theme.palette.primary.main, 0.12),
              },
            }}
            slotProps={{
              legend: {
                sx: { fontSize: 12 },
              },
            }}
          />
        </Card>
      </Grid>

      {/* Pipeline funnel */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Card sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 700 }}>
                Pipeline funnel
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                {totalLeads} total leads
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, lineHeight: 1, color: "success.main" }}>
                {conversion}%
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.secondary" }}>conversion</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {funnel.map((f, i) => (
              <Box key={f.label}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>{f.label}</Typography>
                  <Typography sx={{ fontFamily: MONO, fontSize: 13, fontWeight: 700 }}>
                    {f.count}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: (t) => alpha(t.palette.text.primary, 0.06),
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${Math.max(f.count ? 6 : 0, (f.count / funnelMax) * 100)}%`,
                      borderRadius: 5,
                      bgcolor: funnelColors[i],
                      transition: "width .3s ease",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      </Grid>

      {/* Needs attention */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ borderRadius: 4, height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.75 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Needs attention</Typography>
            <Button component={NextLink} href="/portal/leads" size="small" sx={{ color: "text.secondary", minWidth: 0 }}>
              View all
            </Button>
          </Box>
          <Divider />
          {needsAttention.length === 0 ? (
            <Box sx={{ px: 2.5, py: 5, textAlign: "center" }}>
              <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>
                You&apos;re all caught up — no open leads.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {needsAttention.map((l, i) => (
                <ListItem
                  key={l.id}
                  divider={i < needsAttention.length - 1}
                  secondaryAction={<StatusChip status={l.status} />}
                  sx={{ px: 2.5, py: 1.25 }}
                >
                  <ListItemAvatar sx={{ minWidth: 46 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.light", color: "primary.dark", fontSize: 14, fontWeight: 700 }}>
                      {l.name.slice(0, 1).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={l.name}
                    secondary={l.sub}
                    slotProps={{
                      primary: { noWrap: true, sx: { fontSize: 14, fontWeight: 600 } },
                      secondary: { noWrap: true, sx: { fontSize: 12.5 } },
                    }}
                    sx={{ pr: 6 }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Grid>

      {/* Upcoming meetings */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ borderRadius: 4, height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.75 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Upcoming meetings</Typography>
            <Button component={NextLink} href="/portal/calendar" size="small" sx={{ color: "text.secondary", minWidth: 0 }}>
              Calendar
            </Button>
          </Box>
          <Divider />
          {upcoming.length === 0 ? (
            <Box sx={{ px: 2.5, py: 5, textAlign: "center" }}>
              <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>
                No meetings booked yet.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {upcoming.map((l, i) => {
                const d = new Date(l.calStart);
                return (
                  <ListItem key={l.id} divider={i < upcoming.length - 1} sx={{ px: 2.5, py: 1.25 }}>
                    <ListItemAvatar sx={{ minWidth: 52 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: "secondary.main",
                          color: "secondary.contrastText",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: 1,
                        }}
                      >
                        <Typography sx={{ fontFamily: MONO, fontSize: 15, fontWeight: 700 }}>
                          {d.getDate()}
                        </Typography>
                        <Typography sx={{ fontSize: 9, textTransform: "uppercase", opacity: 0.8 }}>
                          {d.toLocaleDateString("en-US", { month: "short" })}
                        </Typography>
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={l.name}
                      secondary={d.toLocaleDateString("en-US", {
                        weekday: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      slotProps={{
                        primary: { noWrap: true, sx: { fontSize: 14, fontWeight: 600 } },
                        secondary: { noWrap: true, sx: { fontSize: 12.5 } },
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
