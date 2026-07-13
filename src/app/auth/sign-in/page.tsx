"use client";

import { useActionState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { signInWithEmail, type AuthState } from "./actions";

const initial: AuthState = {};

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(signInWithEmail, initial);

  return (
    <Box component="form" action={formAction} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ mb: 0.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Sign in
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
          Welcome back to the ReadyMade console.
        </Typography>
      </Box>

      {state.error && <Alert severity="error">{state.error}</Alert>}

      <TextField
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
        fullWidth
        autoFocus
      />
      <TextField
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        required
        fullWidth
      />

      <Button type="submit" variant="contained" fullWidth loading={pending} sx={{ mt: 0.5 }}>
        Sign in
      </Button>

      <Typography sx={{ fontSize: 13, color: "text.secondary", textAlign: "center", mt: 0.5 }}>
        Access is invite-only. Ask a workspace admin for an invite.
      </Typography>
    </Box>
  );
}
