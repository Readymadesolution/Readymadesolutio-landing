"use client";

import { useActionState } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import { signUpWithEmail, type AuthState } from "./actions";

const initial: AuthState = {};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUpWithEmail, initial);

  return (
    <Box component="form" action={formAction} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ mb: 0.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Create account
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
          Set up access to the ReadyMade console.
        </Typography>
      </Box>

      {state.error && <Alert severity="error">{state.error}</Alert>}

      <TextField name="name" label="Full name" autoComplete="name" required fullWidth autoFocus />
      <TextField
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
        fullWidth
      />
      <TextField
        name="password"
        type="password"
        label="Password"
        autoComplete="new-password"
        required
        fullWidth
      />

      <Button type="submit" variant="contained" fullWidth loading={pending} sx={{ mt: 0.5 }}>
        Create account
      </Button>

      <Typography sx={{ fontSize: 13, color: "text.secondary", textAlign: "center", mt: 0.5 }}>
        Already have an account?{" "}
        <Link component={NextLink} href="/auth/sign-in" sx={{ fontWeight: 600, color: "primary.dark" }}>
          Sign in
        </Link>
      </Typography>
    </Box>
  );
}
