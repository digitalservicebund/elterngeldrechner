import { describe, it, expect } from "vitest";

import * as fc from "fast-check";

import { Temporal } from "@js-temporal/polyfill";

import { berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung as refactoredFn } from "./berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerungNew";
import { berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung as legacyFn } from "./berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung";

import type { AusklammerungMitGeschwisterindex } from "./findeAusklammerungen";

describe("berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung", () => {
  it("stays correct during refactoring", () => {
    fc.assert(
      fc.property(allArguments, (args) => {
        const geschwisterIndexLegacy = legacyFn(
          args.geburtsdatum,
          args.geschwisterkinder,
          args.ausklammerungen,
          args.geschwisterIndex,
          args.istMutterschutz,
        );

        const geschwisterIndexRefactored = refactoredFn(
          args.geburtsdatum,
          args.geschwisterkinder,
          args.ausklammerungen,
          args.geschwisterIndex,
          args.istMutterschutz,
        );

        expect(geschwisterIndexLegacy).toEqual(geschwisterIndexRefactored);
      }),
      { numRuns: 10_000 },
    );
  });
});

const geburtsdatum = fc
  .date({
    min: new Date("1990-01-01"),
    max: new Date("2035-12-31"),
    noInvalidDate: true,
  })
  .map((date) => Temporal.PlainDate.from(date.toISOString().slice(0, 10)));

const geschwisterkindOffset = fc.record({
  // Die Relevanzgrenze kippt je nach Geburtsmonat bei 15–26 Monaten (12-Wochen-
  // Regel) bzw. 26–37 Monaten (14-Monats-Regel); jede Ausklammerung verschiebt
  // sie um +12. 0–72 deckt beide Kanten plus zwei Jahre Verschiebung ab.
  monateVorGeburt: fc.integer({ min: 0, max: 72 }),
  name: fc.constant("Geschwisterkind"),
  hatBehinderung: fc.constant(false),
});

const geschwisterkindOffsets = fc.array(geschwisterkindOffset, {
  maxLength: 4,
});

const allArguments = fc
  .record({ geburtsdatum, geschwisterkindOffsets })
  .chain(({ geburtsdatum, geschwisterkindOffsets }) => {
    return fc.record({
      geburtsdatum: fc.constant(geburtsdatum),
      istMutterschutz: fc.boolean(),

      geschwisterkinder: fc.constant(
        geschwisterkindOffsets.map(({ monateVorGeburt, ...rest }) => ({
          ...rest,
          geburtsdatum: geburtsdatum.subtract({ months: monateVorGeburt }),
        })),
      ),

      ausklammerungen: fc.array(
        ausklammerung(geburtsdatum, geschwisterkindOffsets.length),
        {
          maxLength: 3,
        },
      ),

      geschwisterIndex: geschwisterIndexFuer(geschwisterkindOffsets.length),
    });
  });

function ausklammerung(
  geburtsdatum: Temporal.PlainDate,
  anzahlGeschwister: number,
) {
  return fc
    .record({
      jahreVorGeburt: fc.integer({ min: 0, max: 4 }),
      startTagImJahr: fc.integer({ min: 0, max: 364 }),
      dauerInTagen: fc.integer({ min: 0, max: 200 }),
      geschwisterIndex: fc.option(
        fc.nat({ max: Math.max(0, anzahlGeschwister - 1) }),
        { nil: undefined },
      ),
    })
    .map((vorlage) => {
      const von = Temporal.PlainDate.from({
        year: geburtsdatum.year - vorlage.jahreVorGeburt,
        month: 1,
        day: 1,
      }).add({ days: vorlage.startTagImJahr });

      const bis = von.add({
        days: vorlage.dauerInTagen,
      });

      return {
        von,
        bis,
        grund: "Ausklammerung",
        geschwisterIndex: vorlage.geschwisterIndex,
      } satisfies AusklammerungMitGeschwisterindex;
    });
}

// Liefert in den meisten Fällen einen existierenden Index aber manchmal
// einen außerhalb um currentPosition === -1 zu treffen.
function geschwisterIndexFuer(anzahlGeschwister: number) {
  return fc.option(
    fc.oneof(
      {
        weight: 9,
        arbitrary: fc.nat({ max: Math.max(0, anzahlGeschwister - 1) }),
      },
      { weight: 1, arbitrary: fc.integer({ min: -2, max: 6 }) },
    ),
    { nil: undefined },
  );
}
