"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import FiberNewOutlined from "@mui/icons-material/FiberNewOutlined";
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined";
import EmojiEventsOutlined from "@mui/icons-material/EmojiEventsOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import StatusChip from "./StatusChip";
import { LEAD_STATUSES, type LeadStatus } from "./leadStatus";

export type DashboardData = {
  kpis: { total: number; newThisWeek: number; scheduled: number; winRate: number };
  statusCounts: number[];
  needsAttention: { id: string; name: string; sub: string; status: LeadStatus }[];
  upcoming: { id: string; name: string; focus: string | null; calStart: string }[];
};

const KPI_META: { key: keyof DashboardData["kpis"]; label: string; icon: SvgIconComponent; suffix?: string }[] = [
  { key: "total", label: "Total leads", icon: PeopleAltOutlined },
  { key: "newThisWeek", label: "New this week", icon: FiberNewOutlined },
  { key: "scheduled", label: "Scheduled meetings", icon: EventAvailableOutlined },
  { key: "winRate", label: "Win rate", icon: EmojiEventsOutlined, suffix: "%" },
];

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: SvgIconComponent;
}) {
  return (
    <Card sx={{ p: 2.5, height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
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
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
      <Typography sx={{ mt: 1.5, fontFamily: (t) => t.typography.caption.fontFamily, fontSize: 34, fontWeight: 700, lineHeight: 1, color: "text.primary" }}>
        {value}
      </Typography>
    </Card>
  );
}

export default function DashboardView({ data }: { data: DashboardData }) {
  const theme = useTheme();
  const { kpis, statusCounts, needsAttention, upcoming } = data;

  const labels = LEAD_STATUSES.map((s) => s[0].toUpperCase() + s.slice(1));
  const barColors = [
    theme.palette.primary.main,
    theme.palette.grey[500],
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
  ];

  return (
    <Grid container spacing={2.5}>
      {/* KPI row */}
      {KPI_META.map((k) => (
        <Grid key={k.key} size={{ xs: 6, md: 3 }}>
          <StatCard
            label={k.label}
            value={`${kpis[k.key]}${k.suffix ?? ""}`}
            icon={k.icon}
          />
        </Grid>
      ))}

      {/* Pipeline chart */}
      <Grid size={{ xs: 12, md: 12 }}>
        <Card sx={{ p: 2.5, height: "100%" }}>
          <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 700 }}>
            Pipeline
          </Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
            Leads by status
          </Typography>
          <BarChart
            height={288}
            borderRadius={8}
            margin={{ top: 16, right: 8, bottom: 24, left: 8 }}
            xAxis={[
              {
                data: labels,
                scaleType: "band",
                colorMap: { type: "ordinal", values: labels, colors: barColors },
                tickLabelStyle: { fontSize: 12, fill: theme.palette.text.secondary },
              },
            ]}
            yAxis={[
              {
                tickMinStep: 1,
                tickLabelStyle: { fontSize: 12, fill: theme.palette.text.secondary },
              },
            ]}
            series={[{ data: statusCounts, label: "Leads" }]}
            grid={{ horizontal: true }}
            hideLegend
          />
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
                        <Typography sx={{ fontFamily: (t) => t.typography.caption.fontFamily, fontSize: 15, fontWeight: 700 }}>
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
