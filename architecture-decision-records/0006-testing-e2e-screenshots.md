# 1. E2E Tests Refactoring: Visual Regression Test Replacement

Date: 2025-08-04

## Status

Accepted by Engineering (Dennis, Jakob)
with Approval from Joschka

## Context

The e2e tests used to include visual regression tests to check for unwanted changes. Those
visual regression tests were included for two reasons:

1. detecting visual changes at the component level
2. verifying correct calculation outputs

However, those tests proved to be unreliable if not even unusable when running
on different OS and/or browsers as the different environments created screenshots that would
differ too much to use them for visual regression checks.

Several workarounds were tested, e.g. using devcontainers running on GitHub or running the
tests exclusively on the CI like in this commit
b6d8d6a889384616aa3ea163e9a7c669bd7e798f, that all had their limitations and downfalls.

## Decision

The bugs identified and the time invested in potentially fixing those bugs played
a significant role in this decision. We spent considerable effort diagnosing the root
cause and implementing workarounds, while most major bugs ultimately stemmed from the
domain logic rather than the visual or structural components.

Therefore we decided to delete and not use visual regression tests altogether. This change
means that visual regression checks to detect visual changes at the component level have
to be made manually. Verifying the correct calculation outputs, however, is still a major
part of the e2e tests, resulting in the test suite still being a valuable source for the
quality of the codebase.

## Consequences

To ensure a high quality of the codebase it is important that checks that were made by the
visual regression tests before need to happen elsewhere from now on. This means that to improve the
test quality of the e2e tests refactorings are necessary.

While detecting visual changes at the component level will no longer be a part of the e2e tests,
the necessary refactorings do help to gradually rebuild trust in the test suite and to hopefully
benefit from a faster and more reliable feedback loop.

## Closing

We stick with Playwright for now but keep ours eyes open for other testsuites, that
might be more lightweight and meet all the needed criteria for the e2e tests as visual regression
tests are no longer included.
