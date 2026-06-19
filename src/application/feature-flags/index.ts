// Feature flags are defined in a dedicated file to allow flexibility in choosing
// a provider. For local development, environment variables are the simplest option,
// but we can also integrate with posthog, sentry, gitlab, or an internally hosted
// service. Centralizing all feature flags in one place improves cohesion and makes
// future refactoring easier.

// Lets the team exercise posthog on the preview deploy while the new banner is
// still rolling out. Confines two behaviors to preview that must never reach real
// users: testers identifying themselves, and tracking every session regardless of
// the cookie banner (the current banner predates posthog and never asks about it).
function isPosthogTestingEnabled() {
  return import.meta.env.VITE_FEATURE_FLAG_POSTHOG_TESTING === "true";
}

export { isPosthogTestingEnabled };
