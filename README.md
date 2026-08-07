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

## Requirements

- **[mise](https://mise.jdx.dev)**: manages the development toolchain, provides the required environment variables, and exposes
  the tasks described below. Install it with `brew install mise`, then activate it in your shell (see the
  [mise docs](https://mise.jdx.dev/getting-started.html)).
- **1 Password CLI + Vault Access**: To trigger deployments from your development machine the integration between the 1password
  app and the cli must be anabled and you must have access to the **Elterngeld Engineering** vault.

## Setup

```sh
mise trust           # one-time, confirms you trust this repo's mise.toml
mise install         # installs the tools pinned in mise.toml
mise exec -- npm ci  # mise exec, so the install runs under the pinned node
hk install --global  # one-time per machine, see "Git hooks" below
```

## Development

```sh
mise run start                        # serve the widget in the host page snapshot
mise run check                        # format, type-check, lint, stylelint and test
mise run test                         # just the vitest suite
mise run audit                        # licences, vulnerabilities and secrets
mise run link-check                   # external links in sources and documentation
```

## Git hooks

[hk](https://hk.jdx.dev) formats and lints the staged files before each commit, and validates the commit subject
against [conventional commits](https://www.conventionalcommits.org). Every step calls the same npm script as
`mise run check`, so the hook cannot drift from the pipeline. See [hk.pkl](hk.pkl) for the current set.

`hk install --global` is per machine rather than per clone, so run it once, from inside this repository. Use
`hk check` to lint on demand, `hk fix` to apply the fixes and `HK=0 git commit …` to bypass the hooks.

## Deployment

The Elterngeldrechner can be deployed in two ways. Either just the widget, a single javascript file with the
css inlined, together with its documents and images to staging or production, or the full build including the
Familienportal wrapper as a preview in the staging bucket.

On every push to `main` the application is deployed into the staging Familienportal for integration testing. That
portal is only accessible via a virtual private network, so the same push also publishes the `main` preview, which
the team can reach without one. The production deployment happens on every release, see [Release](#release).

If you'd like to make a branch or feature flag variant of the application available for the team, please use the preview
deployment with a specified name. Please remember to delete the deployment again once unused and be aware of the usual
caveats when working on long-living branches.

If you're interested in more details on the deployment process please read
[ADR 0009](architecture-decision-records/0009-deployment-strategy-s3.md), otherwise just use one of the following
commands.

```sh
mise run deploy --preview --name <name>                     # publish a standalone page under preview/<name>/
mise run deploy --preview --name <name> --delete            # empty that preview again
mise run deploy --staging                                   # build and upload to the staging bucket root
mise run deploy --production                                # build and upload to the production bucket root
mise run deploy --production --rollback --ref <tag-or-sha>  # rebuild a past ref and publish it to production
```

## Release

We usually try to release as often as possible and sensible. Please use the `mise run release` task for this. It
shows you the changes about to be released and, after your confirmation, pushes a new tag that triggers the release
and thus the production deployment.

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

## Use of AI in Development

To maximize our engineering focus on code quality and the delivery of production-ready enhancements and new features, this project
utilizes AI assistance for repetitive tasks, boilerplate code generation, discoveries, and prototyping.
To maintain our high standards, all AI-generated output is strictly reviewed, refined and validated by our engineers. We treat AI as
a tool to increase productivity, while the final responsibility for logic and security remains entirely with the human team.
