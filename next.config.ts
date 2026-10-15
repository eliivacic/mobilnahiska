import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

// No SENTRY_AUTH_TOKEN is configured, so source map upload is intentionally
// left off (it would silently no-op or fail without one) — this still gives
// working error monitoring, just with minified (less readable) stack traces
// until an auth token is added later.
export default withSentryConfig(nextConfig, {
  silent: true,
  // No SENTRY_AUTH_TOKEN configured — explicitly disable every build-time
  // feature that would otherwise try to talk to Sentry's API (source map
  // upload, release creation) and either fail or silently retry/slow down
  // every dev-server boot and build. Runtime error capture (what this
  // integration is actually for) doesn't need any of this. This project
  // builds with Turbopack, where Sentry's webpack-only auto-instrumentation
  // doesn't apply anyway (see @sentry/nextjs's own SentryBuildWebpackOptions
  // docs) — only the sourcemaps/release options below are relevant here.
  sourcemaps: { disable: true },
  release: { create: false, finalize: false },
});
