import posthog from 'posthog-js';

// Enable PostHog only in production. In development we skip init entirely so the
// dev server makes no analytics requests — this also avoids the "Failed to
// fetch" / proxy errors when PostHog domains are blocked locally (adblocker or
// DNS sinkhole resolving *.posthog.com to 0.0.0.0).
if (
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
  });
}
