# 13. Tracking Tooling

Date: 2026-07-24

## Status

Accepted by the Team, Project Partners & Data Protection Officer

## History

- [Matomo API Access from 20.01.2025](0002-matomo-api-access.md)

## Context

Analytics on this project started with Matomo. It is open source and was
available to us as a service from our hosting provider, so we introduced
it after taking over the project. Matomo gave us our first quantitative
insight.

To make it more accessible we layered a pipeline on top. A nightly sync
wrote into a Noco database that Metabase queried for dashboards. At the
time this was a reasonable trade off. We improved the status quo without
a disruptive switch. That mattered because the contract then ran only
until end of year.

However over time the established system has grown slow and brittle:

- Metric touched three systems and took days from code to visualisation
- Metabase saw only daily aggregates, never the raw datapoints
- Data arrived a day late, after the nightly sync
- Matomo settings could not be expressed as infrastructure as code
- Testing metrics before shipping them was complicated and slow

Additionally Matomo itself held us back:

- Multiple bugs in Matomo eroded our trust in the numbers
- It runs major versions behind on a host we don't control
- A/B testing sits behind a premium plugin we cannot install

Facing limited resources to facilitate qualitative user research
sessions, a slow process for quantitative research _and_ a longer
running upcoming contract, we decided to move on to a product
analytics tool.

## Decision

Such a tool was already established elsewhere in Digital Service, which
gave us a proven path and shared knowledge. Our technology radar
categorised PostHog under Adopt and Matomo under Hold. It fits our need
for product analytics and improves on Matomo's privacy.

We therefore replace Matomo, Noco and Metabase with PostHog and run it
on its EU cloud behind our own reverse proxy.

PostHog also opens up capabilities we lacked. Experiments give us
quantitative research on small increments. Surveys gather freetext
feedback and add context to reported problems. Error tracking helps
us improve technical quality.

## Data Security

Our use of PostHog complies with the GDPR and is covered by our own data
processing agreement. Beyond this legal basis, we added the following
technical safeguards:

- Requests are tunneled through a reverse proxy hosted by Digital
  Service that drops the IP address so it never reaches PostHog. The
  reverse proxy is deployed right next to the widget itself which the
  user queried anyway.
- We do not build user profiles and the only identifiers on a session
  are the `session_id` and `device_id`. Both are required for
  experiments and surveys.
- We capture only categorical data such as _Nutzergruppe_ and visualise
  it in aggregate. We never capture sensitive data such as a name or an
  income.

## Consequences

- Migrating every metric from Matomo to PostHog.
- Running both tools in parallel until Matomo is sunset.
- Adapting the consent banner together with the Familienportal.
- Depending on a commercial vendor and its hosted offering.
- Learning a new tool and new delivery techniques.

* Metrics are tested and reviewed before going to production.
* Time from implementation to first data is hours, not days.
* Infrastructure shrinks from three tools to one.
* Data is available right after deployment.
