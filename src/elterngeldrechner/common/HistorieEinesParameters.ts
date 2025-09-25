export function findeAnzuwendendenWertZumZeitpunkt<Wert>(
  historie: HistorieEinesParameters<Wert>,
  zeitpunkt: Date,
): Wert {
  if (zeitpunkt >= historie.eintrag.anzuwendenAbDem) {
    return historie.eintrag.wert;
  } else if (historie.vorherigerEintrag) {
    return findeAnzuwendendenWertZumZeitpunkt(
      historie.vorherigerEintrag,
      zeitpunkt,
    );
  } else {
    return historie.eintrag.wert; // Fallback case when history isn't long enough: take the oldest entry.
  }
}

/**
 * This encodes the concept that a calculation parameter changes over time.
 * When a new value is officially determined, it will also be specified from
 * which moment on it has to be applied from. Therefore, this type implements
 * the domain logic and ensures the defined entries create a valid timeline.
 * This recursive data structure can be traversed to find the applicable value.
 * Though, it intentionally does not implement any methods on its own, but
 * focuses only on encoding the timeline invariant.
 *
 * **Visualization help:**
 *
 *   14.02.2025   <-  08.11.2024  <-  01.01.2024  <-  31.12.2019
 *       99              500             704             381
 */
/*
 * Implementation details:
 * It is not possible to express the time constraint between the entries using
 * a plain type. Therefore it must be implemented as a constructed type to parse
 * and validate the data to ensure the invariant.
 * It would be possible to achieve the same logic using just a plain array and
 * always sort it first. But this approach is not as expressive and related to
 * the real world. Plus, having some domain constraints implemented into the
 * type, allows for more simple and straight forward algorithms based on top
 * without having to deal with implied type issues or assumptions.
 * It avoids to take a more generic implementation path and rather uses the
 * terminology of the domain, making it much easier to grasp.
 */
export class HistorieEinesParameters<Wert> {
  /**
   * Simplified method to create a valid history using some automation.
   *
   * With its interface it enforces to have at least one entry defined. If there
   * are multiple entries, they get automatically sorted by their related
   * date to always create a proper timeline for the history. If well tested,
   * this prevents the hassle do deal with any invalid state/exceptions during
   * runtime in the domain logic.
   */
  public static erstelleHistorieVonWerten<Wert>(
    eintraege: EintraegeFuerHistorieEinesParameters<Wert>,
  ): HistorieEinesParameters<Wert> {
    const zeitlichSortierteEintraege = eintraege.toSorted((left, right) =>
      compareDateByLatestFirst(left.anzuwendenAbDem, right.anzuwendenAbDem),
    ) as EintraegeFuerHistorieEinesParameters<Wert>; // TypeScript looses this information.

    const [eintrag, vorherigerEintrag, ...weitereEintraege] =
      zeitlichSortierteEintraege;

    return new HistorieEinesParameters(
      eintrag,
      vorherigerEintrag
        ? this.erstelleHistorieVonWerten([
            vorherigerEintrag,
            ...weitereEintraege,
          ])
        : undefined,
    );
  }

  private constructor(
    public readonly eintrag: EintragFuerHistorieEinesParameters<Wert>,
    public readonly vorherigerEintrag?: HistorieEinesParameters<Wert>,
  ) {
    const istInDerVergangenheit =
      vorherigerEintrag !== undefined &&
      vorherigerEintrag.eintrag.anzuwendenAbDem > eintrag.anzuwendenAbDem;

    if (istInDerVergangenheit) {
      throw new Error(
        "Eintrag muss zeitlich nach dem vorherigen eingeordnet werden",
      );
    }
  }
}

function compareDateByLatestFirst(left: Date, right: Date): number {
  return right.getTime() - left.getTime();
}

type EintraegeFuerHistorieEinesParameters<Wert> = [
  EintragFuerHistorieEinesParameters<Wert>,
  ...EintragFuerHistorieEinesParameters<Wert>[],
];

type EintragFuerHistorieEinesParameters<Wert> = {
  anzuwendenAbDem: Date;
  wert: Wert;
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Historie eines Parameters", async () => {
    const {
      assert,
      property,
      record: arbitraryRecord,
      date: arbitraryDate,
      float: arbitraryFloat,
      array: arbitraryArray,
    } = await import("fast-check");

    describe("finde anzuwendenden Wert zum Zeitpunkt", () => {
      it("gibt den Wert zurück wo der Zeitpunkt nach dem Eintrag ist, aber noch vor dem nächsten Eintrag liegt", () => {
        const historie = HistorieEinesParameters.erstelleHistorieVonWerten([
          { anzuwendenAbDem: new Date("2025-01-01"), wert: 1 },
          { anzuwendenAbDem: new Date("2024-11-24"), wert: 2 },
          { anzuwendenAbDem: new Date("2024-03-31"), wert: 3 },
        ]);

        const wert = findeAnzuwendendenWertZumZeitpunkt(
          historie,
          new Date("2024-12-01"),
        );

        expect(wert).toBe(2);
      });

      it("gibt den Wert zurück wo der Zeitpunkt exakt mit dem Eintrag übereinstimmt und nicht den Eintrag davor", () => {
        const historie = HistorieEinesParameters.erstelleHistorieVonWerten([
          { anzuwendenAbDem: new Date("2025-01-01"), wert: 1 },
          { anzuwendenAbDem: new Date("2024-11-24"), wert: 2 },
          { anzuwendenAbDem: new Date("2024-03-31"), wert: 3 },
        ]);

        const wert = findeAnzuwendendenWertZumZeitpunkt(
          historie,
          new Date("2024-11-24"),
        );

        expect(wert).toBe(2);
      });

      it("gibt den Wert des neusten Eintrags zurück wenn der Zeitpunkt noch davor liegt", () => {
        const historie = HistorieEinesParameters.erstelleHistorieVonWerten([
          { anzuwendenAbDem: new Date("2025-01-01"), wert: 1 },
          { anzuwendenAbDem: new Date("2024-11-24"), wert: 2 },
        ]);

        const wert = findeAnzuwendendenWertZumZeitpunkt(
          historie,
          new Date("2025-01-02"),
        );

        expect(wert).toBe(1);
      });

      it("gibt den Wert des ältesten Eintrags zurück wenn der Zeitpunkt noch später zurückliegt", () => {
        const historie = HistorieEinesParameters.erstelleHistorieVonWerten([
          { anzuwendenAbDem: new Date("2025-01-01"), wert: 1 },
          { anzuwendenAbDem: new Date("2024-11-24"), wert: 2 },
        ]);

        const wert = findeAnzuwendendenWertZumZeitpunkt(
          historie,
          new Date("2024-11-23"),
        );

        expect(wert).toBe(2);
      });
    });

    describe("erstelle Historie der Werbekostenpauschale", () => {
      it("sortiert die Einträge zeitlich korrekt", () => {
        const historie = HistorieEinesParameters.erstelleHistorieVonWerten([
          { anzuwendenAbDem: new Date("2024-11-24"), wert: 1 },
          { anzuwendenAbDem: new Date("2025-01-01"), wert: 2 },
          { anzuwendenAbDem: new Date("2024-03-31"), wert: 3 },
        ]);

        expect(historie.eintrag.anzuwendenAbDem).toEqual(
          new Date("2025-01-01"),
        );
        expect(historie.vorherigerEintrag?.eintrag.anzuwendenAbDem).toEqual(
          new Date("2024-11-24"),
        );
        expect(
          historie.vorherigerEintrag?.vorherigerEintrag?.eintrag
            .anzuwendenAbDem,
        ).toEqual(new Date("2024-03-31"));
      });

      it("schlägt nie fehl eine Historie zu erstellen", () => {
        assert(
          property(
            arbitraryEintragFuerHistorieEinesParameters(),
            arbitraryArray(arbitraryEintragFuerHistorieEinesParameters()),
            (eintrag, weitereEintraege) => {
              expect(() =>
                HistorieEinesParameters.erstelleHistorieVonWerten([
                  eintrag,
                  ...weitereEintraege,
                ]),
              ).not.toThrow();
            },
          ),
        );
      });

      function arbitraryEintragFuerHistorieEinesParameters() {
        return arbitraryRecord({
          anzuwendenAbDem: arbitraryDate({ noInvalidDate: true }),
          wert: arbitraryFloat(),
        });
      }
    });
  });
}
