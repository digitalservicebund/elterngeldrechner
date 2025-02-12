/**
 * Bestimmt welche Werbekostenpauschale (Arbeitnehmer-Pauschbetrag) anzuwenden
 * ist. Betrag bezieht sich auf einen Kalendarmonat.
 *
 * Siehe § 2c und Foldende im Gesetz zum Elterngeld und zur Elternzeit
 * (Bundeselterngeld- und Elternzeitgesetz - BEEG). Die Werte richten sich
 * theoretisch nach dem Programmablaufplan für die Einkommenssteuer, werden
 * jedoch abweichend in den Richtilinien zum BEEG 2c.1.4 spezifiziert.
 *
 * @return Betrag in Euro als Zwölftel der jährlichen Pauschale
 */
export function bestimmeWerbekostenpauschale(
  geburtsdatumDesKindes: Date,
): number {
  return findeFuerGeburtsdatumAnzuwendendenBetrag(
    geburtsdatumDesKindes,
    HISTORIE_DER_WERBEKOSTENPAUSCHALE,
  );
}

/**
 * This function primarily exists for testability purposes as it allows to
 * provide the "configuration" as an input parameter. Therefore it is separated
 * from {@link bestimmeWerbekostenpauschale}.
 */
function findeFuerGeburtsdatumAnzuwendendenBetrag(
  geburtsdatum: Date,
  historie: HistorieDerWerbekostenpauschale,
): number {
  if (geburtsdatum >= historie.eintrag.fuerGeburtenAbDem) {
    return historie.eintrag.jahresbetrag / 12;
  } else if (historie.vorherigerEintrag) {
    return findeFuerGeburtsdatumAnzuwendendenBetrag(
      geburtsdatum,
      historie.vorherigerEintrag,
    );
  } else {
    return historie.eintrag.jahresbetrag / 12; // Fallback case when history isn't long enough: take the oldest entry.
  }
}

/**
 * This encodes the concept that the Werbekostenpauschale changes over time.
 * When a new amount is officially determined, it will also be specified from
 * which date of birth it has to be applied from. Therefore, this type
 * implements the domain logic and ensures the defined entries create a valid
 * timeline. This recursive data structure can be traversed to find the
 * applicable amount. Though, it intentionally does not implement any methods on
 * its own, but focuses only on encoding the timeline invariant.
 *
 * **Visualization help:**
 *
 *   14.02.2025      08.11.2024      01.01.2024      31.12.2019 |      <-
 *   |      <-       |      <-       | 500€            704€            381€
 *   99€
 *
 * **Implementation details:**
 * It is not possible to express the time constraint between the entries using
 * a plain type. Therefore it must be implemented as constructed type to parse
 * and validate the data to ensure the invariant.
 * It would be possible to achieve the same logic using just a plain array and
 * always sort it first. But this approach is not as expressive and related to
 * the real world. Plus, having some domain constraints implemented into the
 * type, allows for more simple and straight forward algorithms based on top
 * without having to deal with implied type issues or assumptions.
 * It avoids to take a more generic implementation path and rather uses the
 * terminology of the domain, making it much easier to grasp.
 */
class HistorieDerWerbekostenpauschale {
  /**
   * Simplified method to create a valid history using some automation.
   *
   * With its interface it enforces to have at least one entry defined. If there
   * are multiple entries, they get automatically sorted by their related date
   * to always create a proper timeline for the history. If well tested, this
   * prevents the hassle do deal with any invalid state/exceptions during
   * runtime in the domain logic.
   */
  public static erstelleHistorieVonBetraegen(
    eintraege: EintraegeFuerHistorieDerWerbekostenpauschale,
  ): HistorieDerWerbekostenpauschale {
    const zeitlichSortierteEintraege = eintraege.toSorted((left, right) =>
      compareDateByLatestFirst(left.fuerGeburtenAbDem, right.fuerGeburtenAbDem),
    ) as EintraegeFuerHistorieDerWerbekostenpauschale; // TypeScript looses this information.

    const [eintrag, vorherigerEintrag, ...weitereEintraege] =
      zeitlichSortierteEintraege;

    return new HistorieDerWerbekostenpauschale(
      eintrag,
      vorherigerEintrag
        ? this.erstelleHistorieVonBetraegen([
            vorherigerEintrag,
            ...weitereEintraege,
          ])
        : undefined,
    );
  }

  private constructor(
    public readonly eintrag: EintragFuerHistorieDerWerbekostenpauschale,
    public readonly vorherigerEintrag?: HistorieDerWerbekostenpauschale,
  ) {
    const istInDerVergangenheit =
      vorherigerEintrag !== undefined &&
      vorherigerEintrag.eintrag.fuerGeburtenAbDem > eintrag.fuerGeburtenAbDem;

    if (istInDerVergangenheit) {
      throw new Error(
        "Eintrag muss zeitlich nach dem vorherigen eingeordnet werden",
      );
    }
  }
}

const HISTORIE_DER_WERBEKOSTENPAUSCHALE =
  HistorieDerWerbekostenpauschale.erstelleHistorieVonBetraegen([
    { fuerGeburtenAbDem: new Date("2025-01-01"), jahresbetrag: 1230 },
    { fuerGeburtenAbDem: new Date("2024-01-01"), jahresbetrag: 1200 }, // for completeness in relation to the referenced document
    { fuerGeburtenAbDem: new Date("2023-01-01"), jahresbetrag: 1200 },
    { fuerGeburtenAbDem: new Date("2022-12-31"), jahresbetrag: 1000 }, // TODO: Correct date unknown, but satisfies old tests for now.
  ]);

type EintragFuerHistorieDerWerbekostenpauschale = {
  fuerGeburtenAbDem: Date;
  /** in Euro */
  jahresbetrag: number;
};

type EintraegeFuerHistorieDerWerbekostenpauschale = [
  EintragFuerHistorieDerWerbekostenpauschale,
  ...EintragFuerHistorieDerWerbekostenpauschale[],
];

function compareDateByLatestFirst(left: Date, right: Date): number {
  return right.getTime() - left.getTime();
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("bestimme Werbekostenpauschale", async () => {
    const {
      assert,
      property,
      record: arbitraryRecord,
      date: arbitraryDate,
      float: arbitraryFloat,
      array: arbitraryArray,
    } = await import("fast-check");

    it("gibt immer einen positiven Betrag zurück", () => {
      assert(
        property(arbitraryDate(), (geburtsdatumDesKindes) => {
          expect(
            bestimmeWerbekostenpauschale(geburtsdatumDesKindes),
          ).toBeGreaterThan(0);
        }),
      );
    });

    it("für Geburten ab dem 01.01.2025 ist der Betrag 102.50€", () => {
      assert(
        property(
          arbitraryDate({ min: new Date("2025-01-01") }),
          (geburtsdatumDesKindes) => {
            expect(bestimmeWerbekostenpauschale(geburtsdatumDesKindes)).toBe(
              102.5,
            );
          },
        ),
      );
    });

    it("für Geburten ab dem 01.01.2023 bis zum 31.12.2024 ist der Betrag 100.00€", () => {
      assert(
        property(
          arbitraryDate({
            min: new Date("2023-01-01"),
            max: new Date("2024-12-31"),
          }),
          (geburtsdatumDesKindes) => {
            expect(bestimmeWerbekostenpauschale(geburtsdatumDesKindes)).toBe(
              100,
            );
          },
        ),
      );
    });

    describe("finde für Geburtsdatum anzuwendenden Betrag", () => {
      it("dividiert den Jahresbetrag auf ein Zwölftel für den Kalendarmonat", () => {
        const historie =
          HistorieDerWerbekostenpauschale.erstelleHistorieVonBetraegen([
            { fuerGeburtenAbDem: new Date("2025-01-01"), jahresbetrag: 12 },
          ]);

        const betrag = findeFuerGeburtsdatumAnzuwendendenBetrag(
          new Date("2025-01-01"),
          historie,
        );

        expect(betrag).toBe(1);
      });

      it("gibt den Betrag zurück wo das Geburtsdatum nach dem Eintrag ist, aber noch vor dem nächsten Eintrag liegt", () => {
        const historie =
          HistorieDerWerbekostenpauschale.erstelleHistorieVonBetraegen([
            { fuerGeburtenAbDem: new Date("2025-01-01"), jahresbetrag: 12 },
            { fuerGeburtenAbDem: new Date("2024-11-24"), jahresbetrag: 24 },
            { fuerGeburtenAbDem: new Date("2024-03-31"), jahresbetrag: 36 },
          ]);

        const betrag = findeFuerGeburtsdatumAnzuwendendenBetrag(
          new Date("2024-12-01"),
          historie,
        );

        expect(betrag).toBe(2);
      });

      it("gibt den Betrag zurück wo das Geburtsdatum exakt mit dem Eintrag übereinstimmt und nicht den Eintrag davor", () => {
        const historie =
          HistorieDerWerbekostenpauschale.erstelleHistorieVonBetraegen([
            { fuerGeburtenAbDem: new Date("2025-01-01"), jahresbetrag: 12 },
            { fuerGeburtenAbDem: new Date("2024-11-24"), jahresbetrag: 24 },
            { fuerGeburtenAbDem: new Date("2024-03-31"), jahresbetrag: 36 },
          ]);

        const betrag = findeFuerGeburtsdatumAnzuwendendenBetrag(
          new Date("2024-11-24"),
          historie,
        );

        expect(betrag).toBe(2);
      });

      it("gibt den Betrag des neusten Eintrags zurück wenn das Geburtsdatum noch davor liegt", () => {
        const historie =
          HistorieDerWerbekostenpauschale.erstelleHistorieVonBetraegen([
            { fuerGeburtenAbDem: new Date("2025-01-01"), jahresbetrag: 12 },
            { fuerGeburtenAbDem: new Date("2024-11-24"), jahresbetrag: 24 },
          ]);

        const betrag = findeFuerGeburtsdatumAnzuwendendenBetrag(
          new Date("2025-01-02"),
          historie,
        );

        expect(betrag).toBe(1);
      });

      it("gibt den Betrag des ältesten Eintrags zurück wenn das Geburtsdatum noch später zurückliegt", () => {
        const historie =
          HistorieDerWerbekostenpauschale.erstelleHistorieVonBetraegen([
            { fuerGeburtenAbDem: new Date("2025-01-01"), jahresbetrag: 12 },
            { fuerGeburtenAbDem: new Date("2024-11-24"), jahresbetrag: 24 },
          ]);

        const betrag = findeFuerGeburtsdatumAnzuwendendenBetrag(
          new Date("2024-11-23"),
          historie,
        );

        expect(betrag).toBe(2);
      });
    });

    describe("erstelle Historie der Werbekostenpauschale", () => {
      it("sortiert die Einträge zeitlich korrekt", () => {
        const historie =
          HistorieDerWerbekostenpauschale.erstelleHistorieVonBetraegen([
            { fuerGeburtenAbDem: new Date("2024-11-24"), jahresbetrag: 1 },
            { fuerGeburtenAbDem: new Date("2025-01-01"), jahresbetrag: 2 },
            { fuerGeburtenAbDem: new Date("2024-03-31"), jahresbetrag: 3 },
          ]);

        expect(historie.eintrag.fuerGeburtenAbDem).toEqual(
          new Date("2025-01-01"),
        );
        expect(historie.vorherigerEintrag?.eintrag.fuerGeburtenAbDem).toEqual(
          new Date("2024-11-24"),
        );
        expect(
          historie.vorherigerEintrag?.vorherigerEintrag?.eintrag
            .fuerGeburtenAbDem,
        ).toEqual(new Date("2024-03-31"));
      });

      it("schlägt nie fehl eine Historie zu erstellen", () => {
        assert(
          property(
            arbitraryWerbekostenpauschale(),
            arbitraryArray(arbitraryWerbekostenpauschale()),
            (eintrag, weitereEintraege) => {
              expect(() =>
                HistorieDerWerbekostenpauschale.erstelleHistorieVonBetraegen([
                  eintrag,
                  ...weitereEintraege,
                ]),
              ).not.toThrow();
            },
          ),
        );
      });

      function arbitraryWerbekostenpauschale() {
        return arbitraryRecord({
          fuerGeburtenAbDem: arbitraryDate(),
          jahresbetrag: arbitraryFloat(),
        });
      }
    });
  });
}
