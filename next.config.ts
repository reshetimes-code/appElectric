import type { NextConfig } from "next";

// Content-Security-Policy: scoped to what the app actually loads — no
// external fonts (next/font self-hosts at build time), no external images
// except our own Cloud Storage uploads bucket, no third-party scripts/APIs.
// script-src keeps 'unsafe-inline' (Next.js's own hydration/RSC bootstrap
// scripts need it — a per-request nonce would be the stricter alternative
// but adds real complexity/breakage risk for self-hosted deployments) while
// still blocking the #1 real-world XSS payload pattern: loading a REMOTE
// script from an attacker-controlled host, since only 'self' is allowed as
// a source. style-src allows 'unsafe-inline' for SweetAlert2, which injects
// its stylesheet as an inline <style> tag at runtime.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://storage.googleapis.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  turbopack: {
    root: __dirname,
  },
  agentRules: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "storage.googleapis.com", pathname: "/appelectric-510209-uploads/**" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
