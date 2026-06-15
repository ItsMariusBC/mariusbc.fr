import { PostHog } from 'posthog-node';

// Minimal capture surface used by the API routes.
type Capturer = { capture: (payload: Parameters<PostHog['capture']>[0]) => void };

let posthogClient: PostHog | null = null;

// Only emit server-side events in production with a token configured. In dev we
// return a no-op so blocked PostHog domains never cause errors or hangs.
const enabled =
  process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

const noop: Capturer = { capture: () => {} };

export function getPostHogClient(): Capturer {
  if (!enabled) return noop;
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}
