import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      {/* HelixCall chat widget — loaded at end of body (per HelixCall's install
          note), publishable key (public, domain-locked/revocable). */}
      <Script
        src="https://app.helixcall.com/widget/embed.js"
        data-helix-key="pk_live_e-4p2KjQIrw2ZjQUL2Z4Pzr5MbNFTy3R"
        strategy="lazyOnload"
      />
    </>
  );
}
