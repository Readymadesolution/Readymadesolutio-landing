"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LockOutlined from "@mui/icons-material/LockOutlined";
import { authClient } from "@/lib/auth/client";

export default function NoAccessPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await authClient.signOut().catch(() => {});
    router.push("/auth/sign-in");
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          width: 52,
          height: 52,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          bgcolor: "primary.light",
          color: "primary.dark",
        }}
      >
        <LockOutlined />
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        You don&apos;t have access
      </Typography>
      <Typography sx={{ fontSize: 14, color: "text.secondary", maxWidth: 340 }}>
        The ReadyMade console is invite-only. Ask a workspace admin to invite
        your email address, then open the invite link they send you.
      </Typography>
      <Button variant="outlined" color="secondary" onClick={signOut} loading={pending} sx={{ mt: 1 }}>
        Sign out
      </Button>
    </Box>
  );
}
