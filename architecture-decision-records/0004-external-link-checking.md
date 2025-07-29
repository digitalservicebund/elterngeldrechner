# 1. External Link Checking

Date: 2025-07-25

## Status

Accepted by Engineering (Dennis, Jakob)

## Context

The project currently includes a simple github action that identifies all links within
the repository and uses `curl` to verify whether they are still valid and accessible.

This action, however, has some limitations. It detects many links from code comments
that we do not intend to validate, while missing some introduced through a new feature.

We initially made a minimal change to the grep pattern used in the github action to include
links from the new feature. A few days later, the action began to fail because one of the
domains found in the code blocks requests originating from github infrastructure.

For instance, the domain `lvwa.sachsen-anhalt.de` is reachable from localhost but not from
within a github action. It's also inaccessible from github codespaces, yet reachable when
the action is run on a custom runner hosted on a developers local machine.

Beyond the domains that block github requests, the updated pattern still picks up links that
we don’t want to validate — such as xml namespaces in svgs or mocked matomo domains used in
unit tests.

## Decision

We decided to introduce an ignorelist that includes both domains which actively block github
infrastructure as well as those which should not be checked despite being matched by the
grep pattern — like xml namespaces.

This solution strikes a reasonable balance between accuracy and effort. The link checker is a
nice-to-have feature, and we do not intend to invest significant time into it. Therefore, we
opted against more sophisticated approaches such as ast-based link extraction or
externalizing all links into a separate configuration.

We also chose not to introduce additional infrastructure such as a http proxy or custom github
runner, as that would introduce unnecessary complexity to this otherwise lightweight project.

## Consequences

There is a risk of future false positives if external systems change their behavior — for example
by starting to block github requests. It’s also possible that some valid links might not be
detected if they don’t match the current grep pattern.

## Closing

We plan to revisit this solution in a few weeks to evaluate whether we want to
keep it as-is, refine it, or remove it altogether.
