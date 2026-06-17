# 12. PostHog Tracking

Date: 2026-06-17

## Status

Proposed

## Context

To gather insights into the way users interact with
the Elterngeldrechner and helping us further improve
the product in a user centric way, we track certain metrics
in our application. For a while this was done with Matomo.
After many discussions with stakeholders concerning data
safety, we finally settled on a solution that serves both
data security concerns and immediate product insights by
implementing a new user tracking with PostHog that replaces
the old tracking with Matomo.

## Decision

For the implementation we decided to go in the direction
of insight to code, meaning that we first implement the events
and properties in our PostHog Project and then secondly
apply the necessary changes to the code. This helps us
to only track what we really need and keeping the dashboard
and the code as much in sync as possible.
For the concrete steps that are necessary, please consult the
README.md in the user-tracking folder.
