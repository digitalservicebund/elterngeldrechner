# 8. Architecture Refactoring

Date: 2025-10-24

## Status

Work in Progress by Engineering (Dennis and Jakob)

## Context

Motivated by the upcoming major changes to the application forms, we want to take some
time to improve the consistency of the application architecture.

Over the past few weeks of development, we’ve identified several inconsistencies that
we’d like to address before releasing the next features. These include, on one hand,
the state management, which is currently a mix of Redux and navigateWithState, and
on the other hand, the distribution of related feature code across the state,
pages, and features directories.

The goal of this refactoring is to improve consistency within the repository and to
clarify responsibilities and dependencies.

## Decisions

### State Management Responsibility

Currently, form components manage their own state, leaving the corresponding page
components with little responsibility beyond navigation. We plan to move state
management from the forms to the pages, allowing the forms to focus solely on
their primary function while the pages handle integration with the rest of
the react application.

### Schema Validation in Forms

To strengthen type safety in the forms section of the application, we plan to adopt
Zod. As a first step, we’ll create schemas that match the current data structures
exactly, and then iteratively refine them to improve type safety as the
application evolves.

### Location of the Playwright Tests

The playwright tests currently reside next to the source directory. Since their
purpose is to verify that the application functions correctly in integration,
we’ve agreed to move them into the src/application directory and rename them
to integration-test.

### Persistence of the Test Results

The test-results/ directory is no longer needed and should not be retained after
running the tests.

### Preconditions in React Router

The preconditions defined in the routing layer were originally designed to prevent
users from navigating directly to a page via url without the necessary state.

However, the current implementation only checks part of the state, making it
unreliable. Additionally, defining page-specific preconditions in the router
violates the Single Responsibility Principle, since the router should not
hold knowledge about what each page requires to function properly.

### Layout of the Application Structure

The application should follow a consistent set of structural patterns to improve
readability and reduce the distance between related pieces of code.

#### Defined Rules

- Pages and components are grouped under one feature
- Each level can have its own set of shared components
- Each form should have its own state slice and schema
- Supporting functions are grouped under services

```
- src/
  - application/
    - App.tsx
    - index.tsx
    - README.md
    - redux/
    - routing/
    - styles/
    - features/
      - components/
        - user-feedback/
        - Alert.tsx
        - Button.tsx
        - Page.tsx
        - Sidebar.tsx
      - datenabfrage/
        - components/
        - allgemeine-angaben/
          - components/
          - AllgemeineAngabenPage.tsx
          - AllgemeineAngabenForm.tsx
          - allgemeineAngabenSchema.ts
          - allgemeineAngabenSlice.ts
      - planer/
        - components/
          - Anleitung/
          - Erklaerung/
        - planungshilfen/
          - components/
          - services/beispielGenerator/
          - PlanungshilfePage.tsx
        - planer/
          - components/
          - layouts/
          - hooks/
          - PlanerPage.tsx
        - hooks/
          - useBerechneElterngeldbezuege.tsx
      - datenuebernahme/
        - services/pdfGenerator/
        - DatenuebernahmePage.tsx
    - tests/
      - integration/
      - utilities/
        - setupTests.ts
        - test-utils.tsx
    - type-declarations/
    - user-tracking/
    - utilities/
      - type-safe-records/
    - hooks/
      - useEffectWithSignal.tsx
  - elterngeldrechner
  - lebensmonatrechner
  - lohnsteuerrechner
  - monatsplaner
  - bemessungszeitraumrechner
```
