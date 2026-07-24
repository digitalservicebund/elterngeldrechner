# 1. External Link Checking

Date: 2025-07-25

## Status

Accepted by Engineering (Dennis, Jakob)

## Context

The repository included a github action to identify all links and check their availability
using `curl`. It helped surface broken links early and integrated well into the existing ci setup.

Over time, a few limitations became apparent. Some links were missed after adding features outside
the main application directory. Others were picked up unintentionally, such as xml namespaces from
svgs. Certain domains also began blocking requests from githubs infrastructure, which led to
occasional false positives.

We confirmed the blocking behavior by testing access to the domain `lvwa.sachsen-anhalt.de`. It
worked from localhost, failed from github codespaces and github actions, and worked again when
routed through a developer machine used as a github runner.

## Iteration

To improve reliability without increasing complexity, we added an ignore list. It filters out
domains that block github traffic and excludes patterns like xml namespaces that aren’t
meaningful to validate.

The solution offered a good balance between effort and impact. We decided not to invest in
more complex parsing or set up extra infrastructure like a custom github runner to work
around blocked requests.

## Change

Despite improvements, the action still triggered false positives often enough to become
distracting. It created noise in slack and added small, repetitive tasks to engineers
daily work.

We shifted the check to a pre-commit hook using lychee. It runs in a few seconds, is easy
to configure, and significantly reduces false positives by making requests from local
machines instead of githubs infrastructure.

## Consequences

Link checks no longer run automatically when no one is committing code. This is acceptable,
since broken links can’t be fixed if developers are away from their keyboards anyway.

The pre-commit hook adds a small bump to the developer workflow when it fails. Fixing
a link might require stashing changes and restoring them after.
