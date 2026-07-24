# 1. Bundle Architecture

Date: 2025-07-31

## Status

Accepted by Engineering (Dennis, Jakob)

## Context

The elterngeldrechner is a module within the familienportal, which is built using a
content management system. After publishing a new release and sending the artifact to
the hosting provider, the files previously bundled are bundled again as part of the
entire familienportal. This process does not support dynamic imports of code chunks
or static assets.

This limitation has caused deployment issues on two occasions: first, when we
introduced code splitting, and second, when we added the antrag feature and
thus delivered png and pdf files alongside the code.

## Decision

We decided, together with the hosting provider, to serve static assets through
their resource api. This change means assets are no longer directly imported
in our codebase and are not processed by the vite bundler. Link generation
now requires awareness of different environments.

Furthermore, to comply with the hosting providers requirements, we will only
deliver artifacts consisting of exactly one css file and one js file. To enforce
this constraint, we added a github action step that checks the build output for
this exact artifact structure before allowing deployment.

## Consequences

The current setup allows us to release the feature, but it introduces several
limitations. Every update or addition to static assets now requires coordination
with the hosting provider. Dynamic imports of assets no longer receive support
from the compiler. Vites built-in cache busting via hashed filenames is no
longer applied, although the familienportal resource api seems to have
its own cache busting in place.

The code now also needs to explicitly handle different environments and resource
paths, as asset links are no longer generated automatically through the bundler.
This adds complexity to development and requires additional testing to ensure
that asset urls resolve correctly in each environment.

## Closing

We stay in touch with the hosting provider and aim to meet another time, together
with one dev ops engineer, to further optimize the deployment pipeline.
