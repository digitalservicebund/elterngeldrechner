# Elterngeldrechner und Planer

Elterngeldrechner mit Planer im [Familienportal des BMFSFJ](https://familienportal.de/familienportal/meta/egr). For
detailed information about the project and its components, the following sources are available.

> ℹ️ Quick Note about this Repository
>
> We are planning to migrate our codebase to Open CoDE. At the moment, Open CoDE hosts a mirror of this repository,
> but it will become the single source of truth going forward. This decision is motivated by our commitment to digital
> sovereignty — since the platform is hosted by Zendis — as well as to open source principles, as Open CoDE is based on GitLab.
>
> Gitlab Repository: https://gitlab.opencode.de/digitalservicebund/elterngeldrechner

## Markdown in Packages

The packages, such as the monatsplaner or application, contain its own documentation with specific information
and usage guidelines

## Architecture Decision Records

Architecture Decision Records (ADRs) document significant architectural decisions made in the project, including
the rationale and considered alternatives.

## Git Hygiene

We strive to follow good git practices, particularly writing clear and detailed commit messages to ensure changes
are traceable and understandable. When in doubt, please refer to the respective commit and its description.

## Domain

The Elterngeldrechner is based on the Bundeselterngeld- und Elternzeitgesetz (BEEG) and its related
Richtlinien. Additional relevant legal sources include the Einkommensteuergesetz (EStG), which is reflected
in our application through the Lohnsteuerrechner, as well as the Sozialgesetzbuch IV (SGB IV). The
Regelungskompetenz lies at the federal level, while the Vollzugskompetenz lies at the municipal
level. Legal amendments are published in the Bundesanzeiger, for example the annually updated
Programmablaufplan. Project partners are obligated to inform us of relevant changes.

## Code Language Conventions

This project uses a hybrid approach to language in code, mixing English and German. While technical implementation
uses English (`function validate()`), domain-specific terms can be kept in German (`function istArbeitsentgeldImUebergangsbereich()`).
This is crucial because many German administrative terms lack precise English equivalents, leading to inconsistencies and communication
overhead when translated. This hybrid approach ensures clear communication with domain experts and maintains code readability within our
specific context. While we acknowledge this might pose a barrier for non-German speaking contributors, we believe it's the most effective
solution for our project. We encourage contributors to ask questions about any unfamiliar German terms.

## Environment Variables

All environment variables are declared in `vite-env.d.ts`. That file is
the single source of truth for what the application can be configured with.

The app runs without any of them set — unset variables simply disable the
corresponding feature (tracking, feature flags, state). To enable specific
integrations locally, create a `.env.development.local` in the project root.

Sensitive values should be stored in a password manager, not in plain text
files. For example, a `.env.development.local` entry can reference a
1Password secret via the CLI: `MY_SECRET=op://vault/item/field`.

## Use of AI in Development

To maximize our engineering focus on code quality and the delivery of production-ready enhancements and new features, this project
utilizes AI assistance for repetitive tasks, boilerplate code generation, discoveries, and prototyping.
To maintain our high standards, all AI-generated output is strictly reviewed, refined and validated by our engineers. We treat AI as
a tool to increase productivity, while the final responsibility for logic and security remains entirely with the human team.
