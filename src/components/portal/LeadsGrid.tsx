"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, type GridColDef, type GridRowParams } from "@mui/x-data-grid";
import StatusChip from "./StatusChip";
import { LEAD_STATUSES, type LeadStatus } from "./leadStatus";
import LeadDetailDrawer from "./LeadDetailDrawer";
import AddLeadDialog from "./AddLeadDialog";

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  focus: string | null;
  branch: "build" | "product" | null;
  status: LeadStatus;
  assignedTo: string | null;
  calStart: string | null;
  createdAt: string;
};

function relative(iso: string) {
  const h = Math.round((Date.now() - new Date(iso).getTime()) / 3.6e6);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtMeeting(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const columns: GridColDef<LeadRow>[] = [
  {
    field: "name",
    headerName: "Lead",
    flex: 1.6,
    minWidth: 240,
    sortable: true,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, height: "100%" }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.light", color: "primary.dark", fontSize: 14, fontWeight: 700 }}>
          {params.row.name.slice(0, 1).toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0, lineHeight: 1.3 }}>
          <Typography noWrap sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
            {params.row.name}
          </Typography>
          <Typography noWrap sx={{ fontSize: 12.5, color: "text.secondary" }}>
            {params.row.email}
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    field: "focus",
    headerName: "Focus",
    flex: 1.1,
    minWidth: 160,
    valueGetter: (_v, row) => row.focus ?? "—",
    renderCell: (params) => (
      <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>{params.value}</Typography>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => <StatusChip status={params.row.status} />,
  },
  {
    field: "calStart",
    headerName: "Meeting",
    width: 190,
    valueGetter: (_v, row) => (row.calStart ? new Date(row.calStart).getTime() : 0),
    renderCell: (params) => (
      <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>
        {fmtMeeting(params.row.calStart)}
      </Typography>
    ),
  },
  {
    field: "createdAt",
    headerName: "Added",
    width: 130,
    valueGetter: (_v, row) => new Date(row.createdAt).getTime(),
    renderCell: (params) => (
      <Typography variant="caption" sx={{ fontSize: 12.5, color: "text.secondary" }}>
        {relative(params.row.createdAt)}
      </Typography>
    ),
  },
];

const FILTERS: (LeadStatus | "all")[] = ["all", ...LEAD_STATUSES];

export default function LeadsGrid({ leads }: { leads: LeadRow[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (!needle) return true;
      return (
        l.name.toLowerCase().includes(needle) ||
        l.email.toLowerCase().includes(needle) ||
        (l.focus ?? "").toLowerCase().includes(needle)
      );
    });
  }, [leads, q, filter]);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 4, overflow: "hidden" }}>
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <TextField
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search leads"
          sx={{ width: { xs: "100%", sm: 300 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <ToggleButtonGroup
          exclusive
          size="small"
          value={filter}
          onChange={(_e, v) => v && setFilter(v)}
          sx={{
            "& .MuiToggleButton-root": {
              textTransform: "capitalize",
              border: 1,
              borderColor: "divider",
              px: 1.5,
              py: 0.5,
              fontSize: 13,
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
          {FILTERS.map((f) => (
            <ToggleButton key={f} value={f}>
              {f}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          sx={{ ml: "auto" }}
          onClick={() => setAddOpen(true)}
        >
          Add lead
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        density="standard"
        autoHeight
        disableRowSelectionOnClick
        onRowClick={(params: GridRowParams<LeadRow>) => setSelectedId(params.row.id)}
        hideFooterSelectedRowCount
        pageSizeOptions={[10, 25]}
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        sx={{
          border: 0,
          "--DataGrid-rowBorderColor": (t) => t.palette.divider,
          // Vertically center every cell so all columns share one baseline.
          "& .MuiDataGrid-cell": { display: "flex", alignItems: "center" },
          "& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader": { bgcolor: "grey.100" },
          "& .MuiDataGrid-columnHeader": { bgcolor: "grey.100" },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "text.secondary",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
            outline: "none",
          },
          "& .MuiDataGrid-row": { cursor: "pointer" },
          "& .MuiDataGrid-row:hover": { bgcolor: "background.default" },
          "& .MuiDataGrid-footerContainer": { borderColor: "divider" },
        }}
      />

      <LeadDetailDrawer
        open={selectedId !== null}
        leadId={selectedId}
        onClose={() => setSelectedId(null)}
      />
      <AddLeadDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </Paper>
  );
}
