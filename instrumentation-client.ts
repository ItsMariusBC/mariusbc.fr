import posthog from 'posthog-js';

// Production only — skip init in dev so no analytics requests fire locally.
if (
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-01-30',
    // Explicit so $pageview fires on load + client-side route changes (App Router
    // is a SPA — a plain `true` would only count the first hard load).
    capture_pageview: 'history_change',
    capture_pageleave: true,
    capture_exceptions: true,
  });
}
