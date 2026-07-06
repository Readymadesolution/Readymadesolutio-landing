"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import MailOutline from "@mui/icons-material/MailOutlineOutlined";
import { authClient } from "@/lib/auth/client";

function AcceptInvitation() {
  const params = useSearchParams();
  const router = useRouter();
  const invitationId = params.get("invitationId");
  const { data: session, isPending } = authClient.useSession();

  const [status, setStatus] = useState<"idle" | "accepting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const attempted = useRef(false);

  useEffect(() => {
    if (isPending || attempted.current) return;
    if (!invitationId) {
      setStatus("error");
      setError("This invite link is missing its invitation id.");
      attempted.current = true;
      return;
    }
    if (!session) return; // not signed in — show the sign-in prompt below

    attempted.current = true;
    setStatus("accepting");
    void (async () => {
      const { error: err } = await authClient.organization.acceptInvitation({ invitationId });
      if (err) {
        setStatus("error");
        setError(err.message ?? "This invitation is no longer valid.");
        return;
      }
      setStatus("done");
      setTimeout(() => router.push("/portal"), 1200);
    })();
  }, [invitationId, session, isPending, router]);

  // Loading the session, or accepting.
  if (isPending || status === "accepting") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 2 }}>
        <CircularProgress size={28} />
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          {status === "accepting" ? "Accepting your invitation…" : "Loading…"}
        </Typography>
      </Box>
    );
  }

  if (status === "done") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 1 }}>
        <CheckCircleOutlined sx={{ fontSize: 44, color: "success.main" }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>You&apos;re in</Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", textAlign: "center" }}>
          Invitation accepted. Taking you to the console…
        </Typography>
      </Box>
    );
  }

  if (status === "error") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Invitation problem</Typography>
        <Alert severity="error">{error}</Alert>
        <Button component={NextLink} href="/portal" variant="contained" fullWidth>
          Go to the console
        </Button>
      </Box>
    );
  }

  // Not signed in — prompt to sign in / sign up.
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            display: "flex",
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            bgcolor: "primary.light",
            color: "primary.dark",
          }}
        >
          <MailOutline />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center" }}>
          You&apos;ve been invited
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", textAlign: "center" }}>
          You&apos;ve been invited to join the Readymade Solutions team. Sign in or create an account,
          then reopen this invite link to accept.
        </Typography>
      </Box>
      <Button component={NextLink} href="/auth/sign-in" variant="contained" fullWidth>
        Sign in
      </Button>
      <Button component={NextLink} href="/auth/sign-up" variant="outlined" fullWidth>
        Create an account
      </Button>
    </Box>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={28} />
        </Box>
      }
    >
      <AcceptInvitation />
    </Suspense>
  );
}
