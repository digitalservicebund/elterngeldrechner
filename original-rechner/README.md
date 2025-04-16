# Original Rechner

> [!CAUTION]
> This code MUST NOT being touched! [\*](#applying-changes) Else it would loose its value.

An archived version of the original Elterngeld calculation implementation. Used
for property testing during refactorings.

The here archived state represents is taken from the commit
`a6fba2534c7fd2c94197b63e9f45dc057ed521af` from the 16.12.2024. The actual
implementation dates back since the creation of the repository about a year
before that. Except the tax calculation, only minor house keeping changes have
been performed. Anyhow, during the act of extracting the code, changes have been
made. Such are for example adapted import paths or removed (in-source) tests.

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

## Applying changes

As already stated, this code should not been touched at all. In the best case.
Any adaption of the algorithm can have an effect on the output. Which would
demote the property testing for refactoring (or make them actually useless).
Anyhow, there are exceptions to actually maintain its purpose of property
testing.

The most important exceptions are bug fixes. When a bug gets reported
and fixed for the production code, the original code must be fixed too. This can
be tough, as both code bases could have deviated from each other over time. It
must be the goal to implement the most minimal fix possible in the original
code. The production code might implement plenty more improvements around the
bug fix.

Another exception is the tax calculation. It used to be an external dependency
doing so, but had to be replaced with a custom implementation. This in itself
was/is already a deviation from the original. However, because of this you can
argue that the tax calculation is not part of the Elterngeld algorithm itself.
In fact it is known that we might have to apply fixes to the tax calculation.
Which will let the refactoring tests fail. So it must be allowed to update this
part of the code with a copy from the applications code.

### List of Bug Fixes

- the deadline for the bonus based on siblings was wrongly calculated
- separation of date of birth and tax year in combination with an obsolete Werbekostenpauschale
- separation of data of birth and tax year in combination with an obsolete
  kassenindividuellen Zusatzbeitrag

## Continuous Integration

The currently defined pipeline ensures that the source directory here remains
unchanged. Anyhow, in case of an exception (see [applying changes](#applying-changes))
use means of the CI runner to skip the run. For example using [`[skip ci]`](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/skipping-workflow-runs)
tags in commit messages for GitHub actions.
