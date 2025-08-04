# 1. E2E Tests Refactoring

Date: 2025-08-04

## Status

Accepted by Engineering (Dennis, Jakob)
with Approval from Joschka

## Context

The e2e tests used to include visual regression tests to check for unwanted changes.
However, those tests proved to be unreliable if not even unusable when running
on different OS and/or browsers.

## Decision

We decided to delete and not use visual regression tests altogether. This change
means that visual regression checks have to be made manually.

## Consequences

To ensure a high quality of the codebase checks that were made by the visual regression
tests before need to happen elsewhere. This means that to improve the test quality of
the e2e tests refactorings are necessary.

## Closing

We stick with Playwright for now but keep ours eyes open for other testsuites, that
might be more lightweight and meet all the needed criteria for the e2e tests.
