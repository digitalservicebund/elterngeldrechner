// Feature flags are defined in a dedicated file to allow flexibility in choosing
// a provider. For local development, environment variables are the simplest option,
// but we can also integrate with posthog, sentry, gitlab, or an internally hosted
// service. Centralizing all feature flags in one place improves cohesion and makes
// future refactoring easier.

function isPosthogEnabled() {
  return import.meta.env.VITE_FEATURE_FLAG_POSTHOG === "true";
}

// Kept separate from isPosthogEnabled so that letting testers identify themselves
// stays confined to the preview environment even once posthog is enabled in production.
function isTesterIdentificationEnabled() {
  return import.meta.env.VITE_FEATURE_FLAG_TESTER_IDENTIFICATION === "true";
}

export { isPosthogEnabled, isTesterIdentificationEnabled };
