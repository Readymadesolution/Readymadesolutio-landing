import type { Metadata } from "next";
import MuiProvider from "@/components/portal/MuiProvider";
import Shell from "@/components/portal/Shell";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/server";
import { db } from "@/db";
import { authMember } from "@/db/schema";

export const metadata: Metadata = {
  title: "Console — ReadyMade Solution",
};

// Uses auth.getSession() → must render dynamically.
export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side gate: the middleware skips server-action POSTs, so this is the
  // real protection for the console (and hydrates the shell with the user).
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

  // Invite-only: a session alone is not enough — the user must belong to the
  // workspace. Signing up does not grant access; only an accepted invite does.
  const membership = await db
    .select({ id: authMember.id })
    .from(authMember)
    .where(eq(authMember.userId, session.user.id))
    .limit(1);
  if (membership.length === 0) redirect("/auth/no-access");

  const user = {
    name: session.user.name ?? "ReadyMade Team",
    email: session.user.email ?? "",
  };

  return (
    <MuiProvider>
      <Shell user={user}>{children}</Shell>
    </MuiProvider>
  );
}
