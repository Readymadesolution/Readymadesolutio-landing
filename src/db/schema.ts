import {
  pgTable,
  pgSchema,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

/* ---- Neon Auth (read-only): organization membership, for the portal gate ---- */
const neonAuth = pgSchema("neon_auth");
export const authMember = neonAuth.table("member", {
  id: uuid("id").primaryKey(),
  organizationId: uuid("organizationId"),
  userId: uuid("userId"),
  role: text("role"),
  createdAt: timestamp("createdAt", { withTimezone: true }),
});
export const authInvitation = neonAuth.table("invitation", {
  id: uuid("id").primaryKey(),
  organizationId: uuid("organizationId"),
  email: text("email"),
  role: text("role"),
  status: text("status"),
  expiresAt: timestamp("expiresAt", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }),
  inviterId: uuid("inviterId"),
});

/* ---- enums ---- */
export const roleEnum = pgEnum("member_role", ["admin", "member"]);
export const inviteStatusEnum = pgEnum("invite_status", [
  "pending",
  "accepted",
  "revoked",
]);
export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "scheduled",
  "won",
  "lost",
]);
export const leadBranchEnum = pgEnum("lead_branch", ["build", "product"]);

/* ---- teams ---- */
export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdBy: text("created_by").notNull(), // Neon Auth user id
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* ---- team members (user <-> team) ---- */
export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(), // Neon Auth user id
    email: text("email").notNull(),
    name: text("name"),
    role: roleEnum("role").notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("team_members_team_idx").on(t.teamId),
    index("team_members_user_idx").on(t.userId),
  ],
);

/* ---- invites ---- */
export const invites = pgTable(
  "invites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: roleEnum("role").notNull().default("member"),
    token: text("token").notNull().unique(),
    status: inviteStatusEnum("status").notNull().default("pending"),
    invitedBy: text("invited_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("invites_team_idx").on(t.teamId)],
);

/* ---- leads (from the consultation form) ---- */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    branch: leadBranchEnum("branch"),
    focus: text("focus"), // category ("AI & Automation project") or product ("BO AI Product")
    notes: text("notes"),
    timezone: text("timezone"),
    status: leadStatusEnum("status").notNull().default("new"),
    source: text("source").notNull().default("consultation-form"),
    assignedTo: text("assigned_to"), // Neon Auth user id
    // Cal.com linkage
    calBookingUid: text("cal_booking_uid"),
    calStart: timestamp("cal_start", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("leads_team_idx").on(t.teamId),
    index("leads_status_idx").on(t.status),
    index("leads_cal_uid_idx").on(t.calBookingUid),
  ],
);

/* ---- lead activity timeline ---- */
export const leadEvents = pgTable(
  "lead_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    actor: text("actor"), // user id, or null for system
    type: text("type").notNull(), // created | status_changed | note | assigned | booking_synced
    body: text("body"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("lead_events_lead_idx").on(t.leadId)],
);

/* ---- audit log ---- */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id").references(() => teams.id, {
      onDelete: "cascade",
    }),
    actor: text("actor"),
    action: text("action").notNull(),
    target: text("target"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("audit_team_idx").on(t.teamId)],
);

/* ---- monthly performance goals (one row per team) ---- */
export const goals = pgTable("goals", {
  teamId: uuid("team_id").primaryKey(),
  leadsTarget: integer("leads_target").notNull().default(0),
  meetingsTarget: integer("meetings_target").notNull().default(0),
  wonTarget: integer("won_target").notNull().default(0),
  winRateTarget: integer("win_rate_target").notNull().default(0), // percent 0-100
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Goals = typeof goals.$inferSelect;

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Invite = typeof invites.$inferSelect;
