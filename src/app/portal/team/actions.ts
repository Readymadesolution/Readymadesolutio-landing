"use server";

import { db } from "@/db";
import { auditLog } from "@/db/schema";
import { auth } from "@/lib/auth/server";

/** Record a team-management action to the audit log. Guarded server-side. */
export async function logAudit(action: string, target: string): Promise<void> {
  const { data } = await auth.getSession();
  const actor = data?.user?.id;
  if (!actor) return; // not signed in — nothing to log

  const teamId = process.env.DEFAULT_TEAM_ID || null;

  try {
    await db.insert(auditLog).values({ teamId, actor, action, target });
  } catch (err) {
    // ponytail: audit failures never block the user-facing action
    console.error("logAudit failed:", err);
  }
}
