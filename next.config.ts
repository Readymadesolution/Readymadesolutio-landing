import type { NextConfig } from "next";

// Delegate microphone/camera to the HelixCall widget iframe so its voice
// feature works. Without a Permissions-Policy the browser default is
// microphone=self, which blocks the cross-origin iframe even though it
// requests allow="microphone".
const HELIX = "https://app.helixcall.com";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: `microphone=(self "${HELIX}"), camera=(self "${HELIX}"), autoplay=(self "${HELIX}")`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
