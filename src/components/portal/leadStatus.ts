// Plain (non-client) module so both server and client components can import
// these values. Constants exported from a "use client" module become client
// reference stubs when imported by a server component.
export type LeadStatus = "new" | "contacted" | "scheduled" | "won" | "lost";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "won",
  "lost",
];
