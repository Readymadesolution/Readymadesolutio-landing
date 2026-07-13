"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import { authClient } from "@/lib/auth/client";
import { getInviteEmail } from "./actions";

type Phase = "loading" | "form" | "otp" | "working" | "done" | "error";

function needsVerification(msg?: string) {
  return /verif/i.test(msg ?? "");
}

function AcceptInvitation() {
  const params = useSearchParams();
  const router = useRouter();
  const invitationId = params.get("invitationId");
  const { data: session, isPending } = authClient.useSession();

  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState<string | null>(null);
  const [invitedEmail, setInvitedEmail] = useState("");
  const [emailLocked, setEmailLocked] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const startedRef = useRef(false);

  const finish = useCallback(() => {
    setPhase("done");
    setTimeout(() => router.push("/portal"), 900);
  }, [router]);

  // Try to accept. Returns "ok" | "verify" | throws for other errors.
  const tryAccept = useCallback(async (): Promise<"ok" | "verify"> => {
    if (!invitationId) throw new Error("Missing invitation id.");
    try {
      const { error: err } = await authClient.organization.acceptInvitation({
        invitationId,
      });
      if (err) {
        if (needsVerification(err.message)) return "verify";
        throw new Error(err.message ?? "This invitation is no longer valid.");
      }
      return "ok";
    } catch (e) {
      // The SDK throws (rejects) on 403 rather than returning { error }.
      const msg = e instanceof Error ? e.message : String(e);
      if (needsVerification(msg)) return "verify";
      throw e instanceof Error ? e : new Error(msg);
    }
  }, [invitationId]);

  // Send the email verification code, then show the OTP step.
  const startVerification = useCallback(async (email: string) => {
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
    } catch {
      /* the code may already be sent; the OTP step still lets them proceed */
    }
    setPhase("otp");
  }, []);

  // Look up the invited email for prefill.
  useEffect(() => {
    if (!invitationId) {
      setPhase("error");
      setError("This invite link is missing its invitation id.");
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await getInviteEmail(invitationId);
      if (cancelled) return;
      if ("email" in res && res.email) {
        setInvitedEmail(res.email);
        setEmailLocked(true);
      } else if ("error" in res) {
        setError(res.error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [invitationId]);

  // If already signed in, accept directly (or route to verification).
  useEffect(() => {
    if (isPending || startedRef.current) return;
    if (session?.user) {
      startedRef.current = true;
      (async () => {
        setPhase("working");
        try {
          const r = await tryAccept();
          if (r === "ok") finish();
          else await startVerification(session.user.email ?? invitedEmail);
        } catch (e) {
          setPhase("error");
          setError(e instanceof Error ? e.message : "Something went wrong.");
        }
      })();
    } else if (phase === "loading") {
      setPhase("form");
    }
  }, [session, isPending, phase, tryAccept, startVerification, finish, invitedEmail]);

  // Signed-out: create the account (or sign in), then accept / verify.
  async function onSubmitCredentials(e: React.FormEvent) {
    e.preventDefault();
    const email = invitedEmail.trim();
    if (!email || !password) return;
    setBusy(true);
    setError(null);
    try {
      const signUp = await authClient.signUp.email({
        email,
        name: name.trim() || email.split("@")[0],
        password,
      });
      if (signUp.error) {
        const signIn = await authClient.signIn.email({ email, password });
        if (signIn.error) {
          throw new Error(
            signUp.error.message ??
              "Couldn't set up your account. If you already have one, use its password.",
          );
        }
      }
      const r = await tryAccept();
      if (r === "ok") finish();
      else await startVerification(email);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  // OTP step: verify the emailed code, then accept.
  async function onSubmitOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const { error: vErr } = await authClient.emailOtp.verifyEmail({
        email: invitedEmail.trim(),
        otp: otp.trim(),
      });
      if (vErr) throw new Error(vErr.message ?? "That code didn't work. Try again.");
      const r = await tryAccept();
      if (r === "ok") finish();
      else throw new Error("Email verified, but the invite couldn't be accepted.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    setError(null);
    await authClient.emailOtp
      .sendVerificationOtp({ email: invitedEmail.trim(), type: "email-verification" })
      .catch(() => {});
  }

  if (phase === "loading" || phase === "working" || isPending) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 2 }}>
        <CircularProgress size={28} />
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          {phase === "working" ? "Joining the workspace…" : "Loading your invite…"}
        </Typography>
      </Box>
    );
  }

  if (phase === "done") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 1 }}>
        <CheckCircleOutlined sx={{ fontSize: 44, color: "success.main" }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>You&apos;re in</Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", textAlign: "center" }}>
          Taking you to the console…
        </Typography>
      </Box>
    );
  }

  if (phase === "error") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Invitation problem</Typography>
        <Alert severity="error">{error}</Alert>
        <Button href="/auth/sign-in" variant="contained" fullWidth>
          Go to sign in
        </Button>
      </Box>
    );
  }

  if (phase === "otp") {
    return (
      <Box component="form" onSubmit={onSubmitOtp} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Verify your email</Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
            We sent a 6-digit code to <b>{invitedEmail}</b>. Enter it to finish joining.
          </Typography>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Verification code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          autoFocus
          fullWidth
          slotProps={{ htmlInput: { inputMode: "numeric", style: { letterSpacing: "0.3em" } } }}
        />
        <Button type="submit" variant="contained" fullWidth loading={busy} disabled={otp.length < 4}>
          Verify &amp; join
        </Button>
        <Typography sx={{ fontSize: 13, color: "text.secondary", textAlign: "center" }}>
          Didn&apos;t get it?{" "}
          <Link component="button" type="button" onClick={resendCode} sx={{ fontWeight: 600, color: "primary.dark" }}>
            Resend code
          </Link>
        </Typography>
      </Box>
    );
  }

  // Set-password form for the invited (new) user.
  return (
    <Box component="form" onSubmit={onSubmitCredentials} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Join ReadyMade Solution</Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
          Set a password to accept your invite and access the console.
        </Typography>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Work email"
        type="email"
        value={invitedEmail}
        onChange={(e) => setInvitedEmail(e.target.value)}
        disabled={emailLocked}
        required
        fullWidth
      />
      <TextField label="Your name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
      <TextField
        label="Set a password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
        fullWidth
      />
      <Button type="submit" variant="contained" fullWidth loading={busy} disabled={!password || !invitedEmail}>
        Continue
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
