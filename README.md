# Elterngeldrechner und Planer

Elterngeldrechner mit Planer im [Familienportal des BMFSFJ](https://familienportal.de/familienportal/meta/egr). For
detailed information about the project and its components, the following sources are available.

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
