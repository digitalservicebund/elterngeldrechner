# 12. Subcutaneous End-to-End Tests

Date: 2026-07-23

## Status

Proposed by Engineering (Dennis & Jakob)

## History

- [Refactoring of the Test Suite from 04.08.2025](0006-testing-e2e-screenshots.md)
- [Testing Strategy for Elterngeld Calculation from 04.03.2025](0003-testing-strategy-calculation.md)

## Context

The Elterngeldrechner has a solid base of automated tests. These include
unit and integration tests, all leveraging different strategies such as
example-based, property-based and characterization testing, to make sure
development has good safeguards.

The end-to-end tests, however, have not been in good shape. They were
reduced in scope and eventually dropped after we launched a new feature
that would have required refactoring them.

The legacy implementation had two known problems. One
was the runtime, which was quite slow because a real browser was run
through `playwright`. The other, and heavier one, was that they used
visual comparison to assert the results of `berechneElterngeldbezuege`.
That was not only a theoretical flaw but also produced flaky results,
because the screenshot differed from one machine to the next even given
the exact same outputs.

## Decision

We rebuild the test suite in a similar shape, exercising the application
through simulated inputs and making assertions on the result of the
calculation, but run them at a different level. Inspired by the term
"subcutaneous tests" coined by Martin Fowler, the tests run just under
the layer of the browser.

They render the components in `jsdom`, simulate user input and make
their assertions against the `berechneElterngeldbezuege` hook directly.

This new scope matches the history of bugs better, as it pins down the
bridge between all collected inputs and `berechneElterngeldbezuege` on
which the following pages build.

## Consequences

- Increased reliability, because we assert the calculation result rather
  than visuals.
- Decreased complexity, as the tests become part of the existing vitest
  suite.
- Faster runtime, since they no longer need to start a browser and take
  screenshots.

* Accessibility tests do not yet catch every issue `axe-core` could
  potentially surface.
* We have no visual comparison tests, so unwanted visual changes could
  slip through.
* We assert at the hook rather than the rendered page, so the rendering
  of the calculation stays unverified.
