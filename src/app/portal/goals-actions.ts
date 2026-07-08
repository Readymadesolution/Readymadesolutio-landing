"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { goals } from "@/db/schema";
import { auth } from "@/lib/auth/server";

export type GoalValues = {
  leadsTarget: number;
  meetingsTarget: number;
  wonTarget: number;
  winRateTarget: number;
};

const DEFAULTS: GoalValues = {
  leadsTarget: 0,
  meetingsTarget: 0,
  wonTarget: 0,
  winRateTarget: 0,
};

function teamId() {
  return process.env.DEFAULT_TEAM_ID ?? "";
}

/** Current monthly targets for the workspace (defaults to zeros if unset). */
export async function getGoals(): Promise<GoalValues> {
  const id = teamId();
  if (!id) return DEFAULTS;
  try {
    const [row] = await db.select().from(goals).where(eq(goals.teamId, id)).limit(1);
    if (!row) return DEFAULTS;
    return {
      leadsTarget: row.leadsTarget,
      meetingsTarget: row.meetingsTarget,
      wonTarget: row.wonTarget,
      winRateTarget: row.winRateTarget,
    };
  } catch {
    return DEFAULTS;
  }
}

const clampInt = (v: unknown, max: number) => {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
};

/** Upsert the workspace targets. Session-guarded. */
export async function saveGoals(
  input: GoalValues,
): Promise<{ ok: true } | { error: string }> {
  const { data } = await auth.getSession();
  if (!data?.user) return { error: "Not authorized." };
  const id = teamId();
  if (!id) return { error: "Workspace is not configured." };

  const values = {
    leadsTarget: clampInt(input.leadsTarget, 100000),
    meetingsTarget: clampInt(input.meetingsTarget, 100000),
    wonTarget: clampInt(input.wonTarget, 100000),
    winRateTarget: clampInt(input.winRateTarget, 100),
  };

  try {
    await db
      .insert(goals)
      .values({ teamId: id, ...values, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: goals.teamId,
        set: { ...values, updatedAt: new Date() },
      });
    revalidatePath("/portal");
    revalidatePath("/portal/settings");
    return { ok: true };
  } catch {
    return { error: "Could not save your goals." };
  }
}
