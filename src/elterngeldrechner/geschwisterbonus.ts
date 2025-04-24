import { utc } from "@date-fns/utc";
import { differenceInYears } from "date-fns";
import type { Arbitrary, DateConstraints } from "fast-check";
import { aufDenCentRunden } from "./common/math-util";
import { Geburtstag, type Kind } from "./model";

/**
 * Die Höhe des Geschwisterbonus nach § 2a Absatz 1 Satz 1 des Gesetz zum
 * Elterngeld und zur Elternzeit (Bundeselterngeld- und Elternzeitgesetz - BEEG)
 *
 * @return Betrag in Euro auf den Cent gerundet
 */
export function berechneDenGeschwisterbonusFuerBasiselterngeld(
  basiselterngeld: number,
): number {
  return aufDenCentRunden(Math.max(basiselterngeld * 0.1, 75));
}

/**
 * Special case of {@link berechneDenGeschwisterbonusFuerBasiselterngeld} that
 * takes into account § 2a Absatz 2 des Gesetz zum Elterngeld und zur Elternzeit
 * (Bundeselterngeld- und Elternzeitgesetz - BEEG).
 *
 * @return Betrag in Euro auf den Cent gerundet
 */
export function berechneDenGeschwisterbonusFuerElterngeldPlus(
  elterngeldplus: number,
): number {
  return aufDenCentRunden(Math.max(elterngeldplus * 0.1, 37.5));
}

/**
 * Bestimmt ob zu einem bestimmten Zeitpunkt (noch) Anspruch auf den
 * Geschwisterbonus besteht. Sprich ob er für einen Lebensmonat im
 * Bezugszeitraum ausgezahlt wird oder nicht. Ausschlaggebend hierfür ist das
 * Anfangsdatum eines jeweiligen Lebensmonats als Zeitpunkt.
 *
 * Die Bedingungen des Geschwisterbonus werden im § 2a im Gesetz zum Elterngeld
 * und zur Elternzeit (Bundeselterngeld- und Elternzeitgesetz - BEEG) bestimmt.
 * Beachte dass das Gesetz das Kind, für welches Elterngeld ausgezahlt wird,
 * beim Zählen mit einbezieht.
 */
/*
 * Der gewählte Implementierungsansatz erlaubt eine sehr direkte und
 * verständliche Umsetzung des Gesetzestexts.
 * Alternativ kann das Datum errechnet werden, bis zu welchem der Bonus
 * ausgezahlt wird. Dieser Ansatz hat den Vorteil das der Wert nur einmal
 * bestimmt werden muss und kontextunabhängig (vom relativen Zeitpunkt)
 * betrachtet werden kann. Allerdings ist dieser Ansatz deutlich komplexer.
 * Sowohl für die Verständlichkeit vom Gesetz kommend, dem Design des Interface,
 * der Implementierungslogik, als auch der Tests.
 */
export function bestehtAnspruchAufGeschwisterbonus(
  geschwister: readonly Kind[],
  zeitpunkt: Date,
): boolean {
  const istJuengerAls = istJuengerAlsZumZeitpunkt.bind(null, zeitpunkt);

  return (
    mindestens(1, geschwister, istJuengerAls(3)) ||
    mindestens(2, geschwister, istJuengerAls(6)) ||
    mindestens(1, geschwister, istBehindert, istJuengerAls(14))
  );
}

function mindestens<Instance>(
  minimum: number,
  instances: Iterable<Instance>,
  ...predicates: Array<(instance: Instance) => boolean>
): boolean {
  return (
    Array.from(instances).filter((instance) =>
      predicates.reduce(
        (isMatching, predicate) => isMatching && predicate(instance),
        true,
      ),
    ).length >= minimum
  );
}

function istJuengerAlsZumZeitpunkt(
  zeitpunkt: Date,
  jahre: number,
): (kind: Kind) => boolean {
  return (kind: Kind) =>
    differenceInYears(zeitpunkt, kind.geburtstag, { in: utc }) < jahre;
}

function istBehindert(kind: Kind): boolean {
  return kind.istBehindert === true;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Geschwisterbonus", async () => {
    const { addYears, subDays, isBefore, isAfter, isLeapYear } = await import(
      "date-fns"
    );
    const {
      assert,
      property,
      constant,
      option,
      tuple,
      boolean: arbitraryBoolean,
      float: arbitraryFloat,
      date: arbitraryDate,
      record: arbitraryRecord,
    } = await import("fast-check");

    describe("berechne den Geschwisterbonus für Basiselterngeld", () => {
      it("is always at least 75€", () =>
        assertProperty(
          arbitraryFloat({ noNaN: true, noDefaultInfinity: true }),
          (basiselterngeld) => {
            expect(
              berechneDenGeschwisterbonusFuerBasiselterngeld(basiselterngeld),
            ).toBeGreaterThanOrEqual(75);
          },
        ));

      it("is 10% from the Basiselterngeld rounded to the Cent up on 750€ Basiselterngeld", () =>
        assertProperty(
          arbitraryFloat({
            min: 750,
            max: 100_000,
            noNaN: true,
            noDefaultInfinity: true,
          }),
          (basiselterngeld) => {
            expect(
              berechneDenGeschwisterbonusFuerBasiselterngeld(basiselterngeld),
            ).toBeCloseTo(basiselterngeld * 0.1, 1);
          },
        ));
    });

    describe("berechne den Geschwisterbonus für ElterngeldPls", () => {
      it("is always at least 37.50€", () =>
        assertProperty(
          arbitraryFloat({ noNaN: true, noDefaultInfinity: true }),
          (elterngeldplus) => {
            expect(
              berechneDenGeschwisterbonusFuerElterngeldPlus(elterngeldplus),
            ).toBeGreaterThanOrEqual(37.5);
          },
        ));

      it("is 10% from the ElterngedlPlus rounded to the Cent up on 375€ ElterngeldPlus", () =>
        assertProperty(
          arbitraryFloat({ min: 375, max: 100_000, noNaN: true }),
          (elterngeldplus) => {
            expect(
              berechneDenGeschwisterbonusFuerElterngeldPlus(elterngeldplus),
            ).toBeCloseTo(elterngeldplus * 0.1, 1);
          },
        ));
    });

    describe("besteht Anspruch auf Geschwisterbonus", () => {
      describe("keine Geschwister", () => {
        it("has never Anspruch", () =>
          assertProperty(arbitraryGeburtstag(), (zeitpunkt) => {
            expect(bestehtAnspruchAufGeschwisterbonus([], zeitpunkt)).toBe(
              false,
            );
          }));
      });

      describe("ein Geschwisterkind", () => {
        describe("ist nicht behindert", () => {
          const geschwister = arbitraryGeschwister({ istBehindert: false });

          it("has Anspruch till the day before the Geschwisterkind turns 3 years old", () =>
            assertProperty(
              arbitraryParameters(
                geschwister,
                arbitraryZeitpunkt(([geschwisterkind]) => ({
                  max: tagVor(altersgrenze(geschwisterkind, 3)),
                })),
              ),
              expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(true),
            ));

          it("has no Anspruch from the day on the Geschwisterkind turns 3 years old", () =>
            assertProperty(
              arbitraryParameters(
                geschwister,
                arbitraryZeitpunkt(([geschwisterkind]) => ({
                  min: altersgrenze(geschwisterkind, 3),
                })),
              ),
              expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(false),
            ));
        });

        describe("ist behindert", () => {
          const geschwister = arbitraryGeschwister({ istBehindert: true });

          it("has Anspruch till the day before the Geschwisterkind turns 14 years old", () =>
            assertProperty(
              arbitraryParameters(
                geschwister,
                arbitraryZeitpunkt(([geschwisterkind]) => ({
                  max: tagVor(altersgrenze(geschwisterkind, 14)),
                })),
              ),
              expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(true),
            ));

          it("has no Anspruch from the day on the Geschwisterkind turns 14 years old", () =>
            assertProperty(
              arbitraryParameters(
                geschwister,
                arbitraryZeitpunkt(([geschwisterkind]) => ({
                  min: altersgrenze(geschwisterkind, 14),
                })),
              ),
              expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(false),
            ));
        });
      });

      describe("zwei Geschwister", () => {
        describe("beide ohne Behinderung", () => {
          describe("less than 3 years apart", () => {
            const geschwister = arbitraryGeschwister(
              { istBehindert: false },
              ([juengeresGeschwisterkind]) => ({
                istBehindert: false,
                geburtstag: {
                  min: altersgrenze(juengeresGeschwisterkind, -3),
                  max: juengeresGeschwisterkind.geburtstag,
                },
              }),
            );

            it("has Anspruch till the day before the older Geschwisterkind turns 6 years old", () =>
              assertProperty(
                arbitraryParameters(
                  geschwister,
                  arbitraryZeitpunkt(([_, aelteresGeschwisterkind]) => ({
                    max: tagVor(altersgrenze(aelteresGeschwisterkind!, 6)),
                  })),
                ),
                expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(true),
              ));

            it("has no Anspruch from the day on the older Geschwisterkind turns 6 years old", () =>
              assertProperty(
                arbitraryParameters(
                  geschwister,
                  arbitraryZeitpunkt(([_, aelteresGeschwisterkind]) => ({
                    min: altersgrenze(aelteresGeschwisterkind!, 6),
                  })),
                ),
                expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(false),
              ));
          });

          describe("more than 3 years apart", () => {
            const geschwister = arbitraryGeschwister(
              { istBehindert: false },
              ([juengeresGeschwisterkind]) => ({
                istBehindert: false,
                geburtstag: { max: altersgrenze(juengeresGeschwisterkind, -3) },
              }),
            );

            it("has Anspruch till the day the younger Geschwisterkind turns 3 years old", () =>
              assertProperty(
                arbitraryParameters(
                  geschwister,
                  arbitraryZeitpunkt(([juengeresGeschwisterkind]) => ({
                    max: tagVor(altersgrenze(juengeresGeschwisterkind, 3)),
                  })),
                ),
                expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(true),
              ));

            it("has no Anspruch from the day on the younger Geschwisterkind turns 3 years old", () =>
              assertProperty(
                arbitraryParameters(
                  geschwister,
                  arbitraryZeitpunkt(([juengeresGeschwisterkind]) => ({
                    min: altersgrenze(juengeresGeschwisterkind, 3),
                  })),
                ),
                expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(false),
              ));
          });
        });

        describe("beide mit Behinderung", () => {
          const geschwister = arbitraryGeschwister(
            { istBehindert: true },
            ([juengeresGeschwisterkind]) => ({
              istBehindert: true,
              geburtstag: { max: juengeresGeschwisterkind.geburtstag },
            }),
          );

          it("has Anspruch till the day before the youngest Geschwisterkind turns 14 years old", () =>
            assertProperty(
              arbitraryParameters(
                geschwister,
                arbitraryZeitpunkt(([juengeresGeschwisterkind]) => ({
                  max: tagVor(altersgrenze(juengeresGeschwisterkind, 14)),
                })),
              ),
              expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(true),
            ));

          it("has no Anspruch from the day on the youngest Geschwisterkind turns 14 years old", () =>
            assertProperty(
              arbitraryParameters(
                geschwister,
                arbitraryZeitpunkt(([juengeresGeschwisterkind]) => ({
                  min: altersgrenze(juengeresGeschwisterkind, 14),
                })),
              ),
              expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(false),
            ));
        });

        describe("ein Geschwisterkind mit Behinderung, eines ohne", () => {
          describe("behindertest Geschwisterkind is the younger one", () => {
            const geschwister = arbitraryGeschwister(
              { istBehindert: true },
              ([behindertesGeschwisterkind]) => ({
                istBehindert: false,
                geburtstag: { max: behindertesGeschwisterkind.geburtstag },
              }),
            );

            it("has Anspruch till the day before the behindertes Geschwisterkind turns 14 years old", () =>
              assertProperty(
                arbitraryParameters(
                  geschwister,
                  arbitraryZeitpunkt(([behindertesGeschwisterkind]) => ({
                    max: tagVor(altersgrenze(behindertesGeschwisterkind, 14)),
                  })),
                ),
                expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(true),
              ));

            it("has no Anspruch from the day on the behindertes Geschwisterkind turns 14 years old", () =>
              assertProperty(
                arbitraryParameters(
                  geschwister,
                  arbitraryZeitpunkt(([behindertesGeschwisterkind]) => ({
                    min: altersgrenze(behindertesGeschwisterkind, 14),
                  })),
                ),
                expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(false),
              ));
          });

          describe("behindertes Geschwisterkind is the older one", () => {
            describe("more than 11 years older", () => {
              const geschwister = arbitraryGeschwister(
                { istBehindert: false },
                ([juengeresGeschwisterkind]) => ({
                  istBehindert: true,
                  geburtstag: {
                    max: altersgrenze(juengeresGeschwisterkind, -11),
                  },
                }),
              );

              it("has Anspruch till the day the younger Geschwisterkind turns 3 years old", () =>
                assertProperty(
                  arbitraryParameters(
                    geschwister,
                    arbitraryZeitpunkt(([juengeresGeschwisterkind]) => ({
                      max: tagVor(altersgrenze(juengeresGeschwisterkind, 3)),
                    })),
                  ),
                  expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(true),
                ));

              it("has no Anspruch from the day on the younger Geschwisterkind turns 3 years old", () =>
                assertProperty(
                  arbitraryParameters(
                    geschwister,
                    arbitraryZeitpunkt(([juengeresGeschwisterkind]) => ({
                      min: altersgrenze(juengeresGeschwisterkind, 3),
                    })),
                  ),
                  expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(false),
                ));
            });

            describe("less than 11 years older", () => {
              const geschwister = arbitraryGeschwister(
                { istBehindert: false },
                ([juengeresGeschwisterkind]) => ({
                  istBehindert: true,
                  geburtstag: {
                    min: altersgrenze(juengeresGeschwisterkind, -11),
                    max: juengeresGeschwisterkind.geburtstag,
                  },
                }),
              );

              it("foo", () => {
                const geburtstag = new Geburtstag("1977-06-05T00:00:00.000Z");
                const grenze = altersgrenze({ geburtstag }, 3);

                expect(grenze).toEqual(new Date("1980-06-05"));
              });

              it("has Anspruch till the day the behindertes Geschwisterkind turns 14 years old", () =>
                assertProperty(
                  arbitraryParameters(
                    geschwister,
                    arbitraryZeitpunkt(([_, behindertesGeschwisterkind]) => ({
                      max: tagVor(
                        altersgrenze(behindertesGeschwisterkind!, 14),
                      ),
                    })),
                  ),
                  expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(true),
                ));

              it("has no Anspruch from the day on the behindertes Geschwisterkind turns 14 years old", () =>
                assertProperty(
                  arbitraryParameters(
                    geschwister,
                    arbitraryZeitpunkt(([_, behindertesGeschwisterkind]) => ({
                      min: altersgrenze(behindertesGeschwisterkind!, 14),
                    })),
                  ),
                  expectPredicate(hatAnspruchAufGeschwisterbonus).toBe(false),
                ));
            });
          });
        });
      });

      /*
       * There are currently no further test cases with three or more children
       * that would be of interest. The rules are full out tested with the above
       * scenarios. More children make the property parameters continuously more
       * complicated, without gaining further certainty.
       */

      /**
       * A property test helper to create readable, but terse test case scenario
       * parameters. That's because the logic around the Geschwisterbonus is
       * about the birthdays of the Geschwister in relation/context to some
       * Zeitpunkt. Therefore, it connects the sample generation of the
       * Zeitpunkt with some beforehand generated Geschwister. This allows to
       * produce meaningful test scenarios in much simpler/expressive fashion.
       * Strongly related to the {@link hatAnspruchAufGeschwisterbonus} predicate.
       */
      function arbitraryParameters(
        geschwister: Arbitrary<AtLeastOne<Kind>>,
        zeitpunkt: (geschwister: AtLeastOne<Kind>) => Arbitrary<Date>,
      ): Arbitrary<Parameters<typeof hatAnspruchAufGeschwisterbonus>[0]> {
        return geschwister.chain((geschwister) =>
          tuple(constant(geschwister), zeitpunkt(geschwister)),
        );
      }

      function arbitraryGeschwister(
        ...constraints: [
          KindConstraints,
          ...Array<
            | KindConstraints
            | ((geschwister: AtLeastOne<Kind>) => KindConstraints)
          >,
        ]
      ): Arbitrary<AtLeastOne<Kind>> {
        return constraints
          .slice(1)
          .reduce(
            (geschwister: Arbitrary<AtLeastOne<Kind>>, constraints) =>
              geschwister.chain((geschwister) =>
                arbitraryKind(
                  typeof constraints === "function"
                    ? constraints(geschwister)
                    : constraints,
                ).map((kind) => [...geschwister, kind]),
              ),
            tuple(arbitraryKind(constraints[0])),
          );
      }

      function arbitraryZeitpunkt(
        constraints: (geschwister: AtLeastOne<Kind>) => DateConstraints,
      ) {
        return (geschwister: AtLeastOne<Kind>) =>
          arbitraryDate(constraints(geschwister));
      }

      function arbitraryKind(constraints?: KindConstraints): Arbitrary<Kind> {
        const { istBehindert } = constraints ?? {};

        return arbitraryRecord({
          geburtstag: arbitraryGeburtstag(constraints?.geburtstag),
          istBehindert:
            istBehindert !== undefined
              ? constant(istBehindert)
              : option(arbitraryBoolean(), { nil: undefined }),
        });
      }

      type KindConstraints = {
        istBehindert?: boolean;
        geburtstag?: DateConstraints;
      };

      function arbitraryGeburtstag(
        constraints?: DateConstraints,
      ): Arbitrary<Geburtstag> {
        let { min, max } = {
          min: new Date("1900-01-01"), // Leave room/time for arithmetic operations. Like adding a...
          max: new Date("3000-01-01"), // ...day to the latest possible date would make it become invalid.
          ...constraints,
        };

        min = isBefore(min, max) ? min : max;
        max = isAfter(max, min) ? max : min;

        return arbitraryDate({
          ...constraints,
          min,
          max,
          noInvalidDate: true,
        }).map((date) => new Geburtstag(date));
      }

      /**
       * Altersgrenze is a domain term used in the law and related documents. It
       * basically describes the day a child turns a specific age. The
       * Altersgrenze is basically midnight between the day before and the
       * respective birthday. Notice that kids born on 29th or February require
       * special handling.
       */
      function altersgrenze(kind: Kind, alter: number): Date {
        const { geburtstag } = kind;
        const hasBirthdayOn29thOfFebrurary =
          geburtstag.getUTCMonth() === 1 && geburtstag.getUTCDate() === 29;
        const altersgrenze = addYears(geburtstag, alter, { in: utc });
        const isAltersgrenzeInLeapYear = isLeapYear(altersgrenze);
        const mustShiftAltersgrenzeToFirstOfMarch =
          hasBirthdayOn29thOfFebrurary && !isAltersgrenzeInLeapYear;

        if (mustShiftAltersgrenzeToFirstOfMarch) {
          altersgrenze.setUTCMonth(2, 1);
        }

        return altersgrenze;
      }

      function tagVor(date: Date): Date {
        return subDays(date, 1, { in: utc });
      }

      /**
       * Property test helper to avoid repetitive code that usually would hamper
       * the readability of test cases. It allows to provide a re-usable and
       * well named predicate function to evaluate the parameters of the
       * property test case scenario.
       */
      function expectPredicate<Parameters extends unknown[]>(
        predicate: (...parameters: Parameters) => boolean,
      ) {
        return {
          toBe:
            (expected: boolean) =>
            (...parameters: Parameters) => {
              expect(predicate(...parameters)).toBe(expected);
            },
        };
      }

      function hatAnspruchAufGeschwisterbonus([geschwister, zeitpunkt]: [
        Kind[],
        Date,
      ]): boolean {
        return bestehtAnspruchAufGeschwisterbonus(geschwister, zeitpunkt);
      }
    });

    /**
     * Shortcut that helps to avoid nesting these function calls for a property
     * test case (see {@link assert}, {@link property}):
     * ```
     * assert(
     *   property(
     *      // ...
     *   )
     * )
     * ```
     *
     * The idea is that the nested two function calls usually end up being
     * formatted on four separate lines. Joining them into a single call saves
     * two lines of code per test case and one indentation level. In the context
     * of having plenty of deeply nested test cases, these savings are
     * a valuable contribution to keep the test suite readable.
     */
    function assertProperty<PropertyParameters extends AtLeastOne<unknown>>(
      ...parameters: Parameters<typeof property<PropertyParameters>>
    ): void {
      return assert(property(...parameters), { numRuns: 10_000 });
    }

    type AtLeastOne<Elements> = [Elements, ...Elements[]];
  });
}
