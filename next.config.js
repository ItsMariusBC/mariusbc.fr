/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the proxied dev host (e.g. accessing the dev server via a domain).
  allowedDevOrigins: ['dev.mariusbc.fr'],
  serverExternalPackages: ['bcryptjs'],
  turbopack: {},
  output: 'standalone',
  // Turbopack's on-disk dev cache (.next/dev SST files) corrupts on abrupt kills
  // or when another process touches .next — causing "Unable to write SST file" /
  // "compaction already active" / missing-chunk 500s. Disabling it trades a bit of
  // restart speed for a stable dev server.
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];

    // CSP only in production. Dev (Turbopack + React) needs eval() and HMR
    // websockets that a strict CSP blocks; in prod React never uses eval().
    if (process.env.NODE_ENV === 'production') {
      securityHeaders.push({
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "img-src 'self' data: https:",
          "style-src 'self' 'unsafe-inline'",
          "script-src 'self' 'unsafe-inline'",
          "font-src 'self' data:",
          "connect-src 'self'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
      });
    }

    return [{ source: '/(.*)', headers: securityHeaders }];
  },
}

module.exports = nextConfig;
