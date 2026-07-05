"use client";

import { useMemo, useState } from "react";
import StatusChip, { LEAD_STATUSES, type LeadStatus } from "./StatusChip";
import { SearchIcon, PlusIcon } from "./icons";

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
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const h = Math.round(diff / 3.6e6);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const FILTERS: (LeadStatus | "all")[] = ["all", ...LEAD_STATUSES];

export default function LeadsView({ leads }: { leads: LeadRow[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");

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
    <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-[10px] border border-hairline bg-white px-3 sm:w-[320px]">
          <SearchIcon className="size-[18px] text-secondary-300" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search leads"
            className="h-[42px] w-full bg-transparent font-sans text-[14px] text-secondary-900 outline-none placeholder:text-secondary-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-[7px] font-sans text-[13px] font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-secondary-900 text-secondary-0"
                  : "border border-hairline text-secondary-600 hover:bg-secondary-100/70"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="pressable ml-auto flex h-[42px] items-center gap-2 rounded-full bg-secondary-900 px-4 font-sans text-[14px] font-semibold text-secondary-0"
        >
          <PlusIcon className="size-[18px]" />
          Add lead
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[16px] border border-hairline bg-white">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-[14px]">
          <span className="font-sans text-[14px] font-semibold text-secondary-900">
            All leads
          </span>
          <span className="font-mono text-[12px] text-secondary-500">
            {rows.length} of {leads.length}
          </span>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <p className="font-sans text-[15px] font-semibold text-secondary-900">
              No leads to show
            </p>
            <p className="max-w-[320px] font-sans text-[13.5px] text-secondary-500">
              {leads.length === 0
                ? "Leads from the consultation form will land here automatically."
                : "No leads match your search and filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-hairline text-left font-sans text-[12px] font-medium uppercase tracking-[0.04em] text-secondary-500">
                  <th className="px-5 py-[11px] font-medium">Lead</th>
                  <th className="px-5 py-[11px] font-medium">Focus</th>
                  <th className="px-5 py-[11px] font-medium">Status</th>
                  <th className="px-5 py-[11px] font-medium">Meeting</th>
                  <th className="px-5 py-[11px] font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((l) => (
                  <tr
                    key={l.id}
                    className="cursor-pointer border-b border-hairline/70 last:border-0 transition-colors hover:bg-secondary-0"
                  >
                    <td className="px-5 py-[14px]">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 font-sans text-[13px] font-semibold text-secondary-900">
                          {l.name.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate font-sans text-[14px] font-semibold text-secondary-900">
                            {l.name}
                          </span>
                          <span className="truncate font-sans text-[12.5px] text-secondary-500">
                            {l.email}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-[14px]">
                      <span className="font-sans text-[13.5px] text-secondary-600">
                        {l.focus ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-[14px]">
                      <StatusChip status={l.status} />
                    </td>
                    <td className="px-5 py-[14px]">
                      <span className="font-sans text-[13.5px] text-secondary-600">
                        {l.calStart
                          ? new Date(l.calStart).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-[14px]">
                      <span className="font-mono text-[12.5px] text-secondary-500">
                        {relative(l.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
