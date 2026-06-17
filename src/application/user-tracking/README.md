# PostHog User Tracking

The information in this file is meant as a guide
for the way we work with PostHog in our application.
It serves both onboarding and the implementation of
metrics.
For the decisions behind it please consult ADR 0012.

## Onboarding

1. Request access to the PostHog project from a team member.
2. Add the required environment variables to your `.env.development.local`:
   - `VITE_FEATURE_FLAG_POSTHOG` and set it to true
   - `VITE_PUBLIC_POSTHOG_HOST`
   - `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`
3. Check if events are actually sent. (Deactivate tracking blocker if necessary.)
4. Create API Key under "Settings" -> "Account" -> "Personal API keys"
   - Use "PostHog CLI" as a label.
   - Save in 1Password vault with name "PostHog API-Key"
5. Add the required PostHog CLI environment variables:
   - `POSTHOG_CLI_PROJECT_ID`
   - `POSTHOG_CLI_HOST`
   - `POSTHOG_CLI_API_KEY`
6. Run `op run --env-file=./.env.development.local -- npm run posthog:schema:pull` to pull the current event schema locally.

## Implementing a metric

1. Create an event definition under "Data" -> "Event definitions".
   a. As a convention we want to use snake_case here.
   b. A description is useful.
2. Add a property group here under "Schema".
   a. If relevant property group doesn't exist, please add a new one.
   (As a convention we start the naming with a capital letter and add a description.)
3. Add a concrete property to the property group.
   a. If relevant property group doesn't exist, please add a new one.
   (As a convention we start the naming with a lowercase letter.)
   b. Check "required" as a default.
4. Add the necessary `posthog.capture` part to the code.
   a. Use the exact event and property names.
5. Check locally if events arrive.
6. Run `op run --env-file=./.env.development.local -- npm run posthog:schema:pull`
7. Commit and push changes.
8. Add metric to dashboard.
