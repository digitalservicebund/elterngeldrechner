# Original Rechner

> [!CAUTION]
> This code MUST NOT being touched! Else it would loose its value. CI hooks
> might be established to help preventing this.

An archived version of the original Elterngeld calculation implementation. Used for property testing during refactorings.

The here archived state represents is taken from the commit
`a6fba2534c7fd2c94197b63e9f45dc057ed521af` from the 16.12.2024. The actual
implementation dates back basically since the creation of the repository about
a year before that. Except the tax calculation, only minor house keeping changes
have been performed. Anyhow, during the act of extracting the code, changes have
been made. Such are for example adapted import paths or removed (in-source)
tests.

It has been exported as its fully own project, instead of a project reference
with composite compiler configuration. That is for the ability to isolate it
properly, including its external dependencies.

There are purposefully no further code quality measurements. That includes
formatting, linting, testing, or anything else.

## Usage

```bash
npm install
npm run build
```
