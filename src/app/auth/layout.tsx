import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import MuiProvider from "@/components/portal/MuiProvider";

export const metadata: Metadata = {
  title: "Sign in — ReadyMade Console",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <MuiProvider>
      <Box
        sx={{
          minHeight: "100dvh",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
        }}
      >
        {/* Brand lockup above the card */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            component="img"
            src="/assets/logo-mark.png"
            alt="ReadyMade"
            sx={{ width: 36, height: 33, objectFit: "contain" }}
          />
          <Box sx={{ lineHeight: 1 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 700, color: "text.primary", lineHeight: 1 }}>
              READYMADE
            </Typography>
            <Typography sx={{ fontSize: 10.5, letterSpacing: "0.14em", color: "primary.dark", mt: 0.4 }}>
              CONSOLE
            </Typography>
          </Box>
        </Box>

        <Card variant="outlined" sx={{ width: "100%", maxWidth: 420, p: 4 }}>
          {children}
        </Card>
      </Box>
    </MuiProvider>
  );
}
