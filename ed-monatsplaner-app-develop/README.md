# Getting Started

## Basic Setup

It is **_mandatory_** that you have set up authentification for artifacts.init.de. If you have not done so previously, then please follow the steps outlined in https://wim.init.de/display/FT/Setup+and+Configuration+NPM. Make sure that you have also configured the `@init` namespaced registry.

## Additional Prerequisites

1. Latest Node Version (`v16+`)
2. Latest NPM Version (`v8+`)

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

# Usage

## Lebensmonate

`Lebesmonate` are the 32 consecutive months since the birth of the child.

You can create the 32 `Lebensmonate` with

```typescript
const isoDateOfBirth = "2022-03-04";
const lebensmonate = getLebensmonate(isoDateOfBirth);
```

Each element will contain a `from` and a `to` field to represent the range of the `Lebensmonat` which can be displayed
in the Monatsplaner.

## Elternteile

`Elternteile` represents a pair of `ET1` (Elternteil 1) and `ET2` (Elternteil 2). Each `Elternteil` holds 32 months including the
current selection and the number of remaining months for each type of `Elterngeld` (`BEG`, `EG+`, etc).

To create the initial `Elternteile`

```typescript
const elternteile = createElternteile();
```

to respect `Frühchen` months you have to provide a `Geburtstag`:

```typescript
const geburtstag: Geburtstag = {
  errechnet: "2022-03-04",
  geburt: "2022-02-20",
};

const elternteile = createElternteile({ geburtstag });
```

to respect `Partnermonate` months you have to provide the flag `partnerMonate`:

```typescript
const elternteile = createElternteile({ partnerMonate: true });
```

to change a month e.g. to set a month to `BEG` for `ET1`

```typescript
const changedElternteile = changeMonth({
  elternteile: elternteile,
  elternteil: "ET1",
  geburtstag: geburtstag,
  monthIndex: 1,
  type: "BEG",
});
```

**Note**: if you do not provide a `Geburtstag` `Frühchen` months will be ignored.

Upon return the `changedElternteile` will now contain the newly made selection of months (`changedElternteile.ET1.months`)
and the properly calculated amount of remaining months (e.g. `changedElternteile.remainingMonths.basiselterngeld`)

To remove a selection you should change the month to type `None`.

## Validation
A validation can be applied to the `Elternteile` object. The result of the validation will contain the error codes 
which can be used to display error messages.

```typescript
const validationResult = validateElternteile(elternteile);
```

`validationResult.isValid` will be `true` when no validation error has occurred `false` otherwise. If the validation is not valid, 
`validation.errorCodes` does contain a list of all validation errors.
