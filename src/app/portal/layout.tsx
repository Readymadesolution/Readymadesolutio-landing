import type { Metadata } from "next";
import MuiProvider from "@/components/portal/MuiProvider";
import Shell from "@/components/portal/Shell";

export const metadata: Metadata = {
  title: "Console — Readymade Solutions",
};

// ponytail: auth gate added in the Neon Auth phase; shell only for now.
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MuiProvider>
      <Shell>{children}</Shell>
    </MuiProvider>
  );
}
