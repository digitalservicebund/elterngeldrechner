# 9. Deployment Strategy

Date: 2026-01-14

## Status

- Accepted by: Dennis & Jakob

## History

- [Deployment Strategy from 24.09.2025](architecture-decision-records/0007-deployment-strategy-cms.md)

## Context

The previously implemented change in the deployment strategy worked as expected, reduced
our overhead per release and thus led to an increased amount of smaller releases.

However, at the end of last year, as part of the contract negotiations with our project
partners, the discussion around the hosting topic came up once again. In cooperation with the
legal, platform and strategy team we were able to propose a sensible solution that addresses
the challenges mentioned in the initial architecture decision record.

The goal of the architecture change is to eradicate the manual steps necessary for a deployment,
enabling the team to shift the working method more towards trunk-based development and thus
further increase deployment frequency.

## Architecture

In order to host the Elterngeldrechner ourselves we set up object storage on STACKIT separated
by environment. The assets (and shell for the preview) are pushed to the object storage by our
GitHub Actions. Instead of serving the index.js and index.css directly, the CMS now returns
the URI pointing to our bucket.

```

                                              ┌─────────────────┐
                                              │  GitHub Actions │
                                              └────────┬────────┘
                                                       │
                 ┌─────────────────────────────────────────────────────────────────┐
                 │                              │                                  │
                 ▼                              ▼                                  ▼
         ┌────────────────┐            ┌────────────────┐                  ┌────────────────┐
         │ Preview Build  │            │ Staging Build  │                  │Production Build│
         │  (on trigger)  │            │   (on main)    │                  │   (on tag)     │
         └───────┬────────┘            └───────┬────────┘                  └───────┬────────┘
                 │                             │                                   │
                 └────────────────┬────────────┘                                   │
                                  │                                                │
                                  ▼                                                ▼
         ┌──────────────────────────────────────────────┐   ┌──────────────────────────────────────────────┐
         │         egr-assets-staging (STACKIT)         │   │        egr-assets-production (STACKIT)       │
         ├──────────────────────────────────────────────┤   ├──────────────────────────────────────────────┤
         │  /index.js                                   │   │  /index.js                                   │
         │  /index.css                                  │   │  /index.css                                  │
         │  /documents/*.pdf                            │   │  /documents/*.pdf                            │
         │  /images/*.png                               │   │  /images/*.png                               │
         ├──────────────────────────────────────────────┤   └──────────────────────┬───────────────────────┘
         │  /preview/main/index.html                    │                          │
         │  /preview/{prototype}/index.html             │                          │
         └──────────────────────┬───────────────────────┘                          │
                                │                                                  │
                                ▼                                                  ▼
         ┌──────────────────────────────────────────────┐   ┌──────────────────────────────────────────────┐
         │  CDN:    .dev.tech.digitalservice.dev *      │   │  CDN:    .prod.tech.digitalservice.dev *     │
         └──────────────────────┬───────────────────────┘   └──────────────────────┬───────────────────────┘
                                │                                                  │
                                ▼                                                  ▼
         ┌──────────────────────────────────────────────┐   ┌──────────────────────────────────────────────┐
         │         preview-stage.bmbfsfj.bund.de        │   │              familienportal.de               │
         ├──────────────────────────────────────────────┤   ├──────────────────────────────────────────────┤
         │  Embedded Widget:                            │   │  Embedded Widget:                            │
         │  <script src=".../index.js">                 │   │  <script src=".../index.js">                 │
         │  <link href=".../index.css">                 │   │  <link href=".../index.css">                 │
         │                                              │   │                                              │
         │  ┌────────────────────────────────────────┐  │   │  ┌────────────────────────────────────────┐  │
         │  │         Elterngeldrechner Widget       │  │   │  │         Elterngeldrechner Widget       │  │
         │  └────────────────────────────────────────┘  │   │  └────────────────────────────────────────┘  │
         └──────────────────────────────────────────────┘   └──────────────────────────────────────────────┘
```

_\* After setting up uptime monitoring we observed that CDN response times were roughly double those of the
direct bucket URLs. For this reason the CMS currently references bucket URLs directly, bypassing the CDN._

## Benefits

- We are now able to roll out releases on each pushed commit and tag without manual steps necessary.
- We were able to sunset GitHub Pages and replace it with our own platform, reducing our dependency on GitHub.
- Since we host the files ourselves and do so as well for the images and documents, we could drop generate-link.ts.
- Since every commit to main is now automatically reflected in the staging cms, integration testing has been simplified.

## Consequences

### Asset Caching

The build assets originally were emitted with a content hash appended by the Vite build. Unfortunately we had to drop the feature
because the content management system is now configured to redirect users to our bucket on /index.js and /index.css. Keeping the
content hash would mean that we have to adjust the redirect URL on every release, eliminating the benefits of this change.

Since browsers, if no explicit cache headers are set, do apply heuristic caching, we disable the caching for the JavaScript and
CSS file explicitly on upload. The documents and images will still be cached heuristically by the browser. We do not expect a
noticeable difference in performance for the users.

### File Expiration

Because we are not fully in control of the client, we have to keep resources like the documents and images after a release. If
the main JavaScript is changed and the reference to a specific document dissolved, even after deployment clients could still have
the previous version open, pointing to a legacy file. Therefore we decided to _not delete_ but only copy documents and images upon
release. The downside of this is that over time the content in the object storage will grow but will not hit any limits anytime soon.

### Uptime Monitoring

The assets are hosted within a managed secure storage service. While we estimate the downtime risk as relatively low, the cloud
provider has experienced incidents in the past. In order to ensure visibility and measure our availability, we have implemented
proactive monitoring for both staging and production environments.
