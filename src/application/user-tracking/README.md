# PostHog User Tracking

The information in this file is meant as a guide
for the way we work with PostHog in our application.
It serves both onboarding and the implementation of
metrics.

## General Approach

For the implementation we decided to go in the direction
of insight to code, meaning that we first implement the events
and properties in our PostHog Project and then secondly
apply the necessary changes to the code. This helps us
to only track what we really need and keeping dashboard
and code in sync.
For the concrete steps, see below.

## Module Structure

- `core/` — consent handling, cookie/tag-manager integration, and the
  `data-layer` used to read/write tracking variables.
- `metrics/` — the actual tracked metrics (e.g. `feedback`, `nutzergruppe`,
  `partnerschaftlichkeit`, `planungshilfen`, `conversionGoal`). Each file wraps
  its own `posthog.capture`/`posthog.register` calls behind a small,
  purpose-named function so callers don't touch PostHog directly.
- `posthog/posthog-typed.ts` — **generated file, do not edit by hand**. It is
  overwritten by `npm run posthog:schema:pull` (see step 7 below) and provides
  the typed `capture()`.
- `utilities/` — helpers built on top of the above.

## Onboarding

1. Request access to the PostHog project from a team member.
2. Add the required environment variables to your `.env.development.local`:
   - `VITE_PUBLIC_POSTHOG_HOST`
   - `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`
3. Run the app and click through some of the pages.
4. Check if events are actually sent at "Activity" -> "Events" or "Live". (Deactivate tracking blocker if necessary.)
5. Create API Key under "Settings" -> "Account" -> "Personal API keys"
   - Use "PostHog CLI" as a label.
   - Save in 1Password vault with name "PostHog API-Key"
6. Add the required PostHog CLI environment variables to your `.env.development.local`:
   - `POSTHOG_CLI_PROJECT_ID`
   - `POSTHOG_CLI_HOST`
   - `POSTHOG_CLI_API_KEY=op://<your-vault>/<posthog-item, e.g. "PostHog API-Key">/password`
7. Run `op run --env-file=./.env.development.local -- npm run posthog:schema:pull` to pull the current event schema locally.

## Implementing a metric

1. Create an event definition under "Data" -> "Event definitions".
   a. As a convention we want to use snake_case here.
   b. A description is useful.
2. Add a property group here under "Schema".
   a. If relevant property group doesn't exist, please add a new one.
   (As a convention we start the naming with a capital letter and add a description.)
3. Add a concrete property to the property group.
   a. If relevant property doesn't exist, please add a new one.
   (As a convention we start the naming with a lowercase letter.)
   b. Check "required" as a default.
4. Run `op run --env-file=./.env.development.local -- npm run posthog:schema:pull` to get compiler support.
   a. This regenerates `posthog/posthog-typed.ts` — never edit that file directly.
   b. For the compiler support import from `@/application/user-tracking`.
5. Add the necessary `posthog.capture` part to the code.
   a. Use the exact event and property names, e.g.
   `posthog.capture("info_text_ausgeklappt", { frage: "..." })`.
   b. Use `posthog.register` instead only when needed.
6. Check locally if events arrive at "Activity" -> "Events" or "Live".
7. Commit and push changes.
8. Add metric to dashboard.
