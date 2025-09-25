import { ermittelFFaktor } from "./FFaktor";
import { ermittelGeringfuegigkeitsgrenze } from "./Geringfuegigkeitsgrenze";
import { ermittelObergrenzeDesUebergangsbereichs } from "./ObergrenzeDesUebergangsbereichs";
import {
  aufDenCentRunden,
  shiftNumberByDecimalsPrecisely,
} from "@/elterngeldrechner/common/math-util";

/**
 * Bestimmt ob besonderes Recht für den Übergangsbereich (Midi-Jobs) anzuwenden
 * ist. Basierend auf der Summe *aller* Einkünfte in einem Kalendermonat.
 *
 * Definiert durch § 20 Absatz 2 des Vierten Buches Sozialgesetzbuch (SGB IV) in
 * Verbindung mit § 8 Absatz 1 Nummer 1 des SGB IV.
 */
export function istArbeitsentgeldImUebergangsbereich(
  arbeitsentgeld: number,
  zeitpunkt: Date,
): boolean {
  const geringfuegigkeitsgrenze = ermittelGeringfuegigkeitsgrenze(zeitpunkt);
  const obergrenze = ermittelObergrenzeDesUebergangsbereichs(zeitpunkt);
  return (
    arbeitsentgeld > geringfuegigkeitsgrenze && arbeitsentgeld <= obergrenze
  );
}

/**
 * Berechnet den Anteil des Arbeitsentgelds der im Übergangsbereich (Midi-Jobs)
 * beitragspflichtig für Sozialabgaben ist.
 *
 * Bestimmung nach § 2f Absatz 2 des Gesetz zum Elterngeld und zur Elternzeit
 * (Bundeselterngeld- und Elternzeitgesetz - BEEG) in Verbindung mit dem § 20
 * Absatz 2a des Vierten Buches Sozialgesetzbuch (SGB IV).
 *
 * Ein Arbeitsentgeld über der Obergrennze des Übergangsbereichs wird auf die
 * Höhe des Arbeitsentgelds selbst gedeckelt, da sonst das Übergangszonenentgeld
 * das Arbeitsentgeld übersteigt. Arbeitsentgelder unter der
 * Geringfügigkeitsgrenze werden nicht gesondert behandelt.
 *
 * @returns Betrag in Euro auf den Cent gerundet
 */
/*
 * The variable names are strictly copied from the law text.
 *
 * This function seriously suffers from arithmetic inaccuracies of JavaScript
 * it's floating point numbers. However, for the relevant real-world input
 * space, this is still correct. Especially after rounding to full cents. For
 * the sake of pure simplicity the function is still using just native
 * JavaScript operations. This needs to be accounted for in test properties.
 */
export function berechneUebergangszonenentgeld(
  arbeitsentgeld: number,
  zeitpunkt: Date,
): number {
  const AE = arbeitsentgeld;
  const F = ermittelFFaktor(zeitpunkt);
  const G = ermittelGeringfuegigkeitsgrenze(zeitpunkt);
  const OG = ermittelObergrenzeDesUebergangsbereichs(zeitpunkt);

  if (arbeitsentgeld > OG) {
    return arbeitsentgeld;
  } else {
    const uebergangszonenentgeld = aufDenCentRunden(
      F * G + (OG / (OG - G) - (G / (OG - G)) * F) * (AE - G),
    );
    return Math.max(uebergangszonenentgeld, 0);
  }
}

if (import.meta.vitest) {
  const { describe, beforeEach, vi, it, expect } = import.meta.vitest;

  describe("Einkommen im Übergangsbereich", async () => {
    const {
      assert,
      property,
      date: arbitraryDate,
      integer: arbitraryInteger,
    } = await import("fast-check");

    beforeEach(async () => {
      vi.spyOn(
        await import("./Geringfuegigkeitsgrenze"),
        "ermittelGeringfuegigkeitsgrenze",
      );

      vi.spyOn(
        await import("./ObergrenzeDesUebergangsbereichs"),
        "ermittelObergrenzeDesUebergangsbereichs",
      );
    });

    describe("ist Arbeitsentgeld im Übergangsbereich", () => {
      it("is always false if Arbeitsentgeld is below or equal to the Geringfügigkeitsgrenze", () =>
        assert(
          property(
            arbitraryDate({ noInvalidDate: true }),
            arbitraryRealtisticBetragInEuro().chain((geringfuegigkeitsgrenze) =>
              arbitraryRealtisticBetragInEuro({
                max: geringfuegigkeitsgrenze,
              }).map((arbeitsentgeld) => ({
                geringfuegigkeitsgrenze,
                arbeitsentgeld,
              })),
            ),
            (zeitpunkt, { geringfuegigkeitsgrenze, arbeitsentgeld }) => {
              vi.mocked(ermittelGeringfuegigkeitsgrenze).mockReturnValue(
                geringfuegigkeitsgrenze,
              );

              expect(
                istArbeitsentgeldImUebergangsbereich(arbeitsentgeld, zeitpunkt),
              ).toBe(false);
            },
          ),
        ));

      it("is always false if Arbeitsentgeld is above the Obergrenze des Übergangsbereichs", () =>
        assert(
          property(
            arbitraryDate({ noInvalidDate: true }),
            arbitraryRealtisticBetragInEuro().chain((obergrenze) =>
              arbitraryRealtisticBetragInEuro({
                min: obergrenze,
                minExcluded: true,
              }).map((arbeitsentgeld) => ({ obergrenze, arbeitsentgeld })),
            ),
            (zeitpunkt, { obergrenze, arbeitsentgeld }) => {
              vi.mocked(
                ermittelObergrenzeDesUebergangsbereichs,
              ).mockReturnValue(obergrenze);

              expect(
                istArbeitsentgeldImUebergangsbereich(arbeitsentgeld, zeitpunkt),
              ).toBe(false);
            },
          ),
        ));

      it("is true if Arbeitsentgeld is above Geringfuegigkeitsgrenze and below or equal Obergrenze des Übergangsbereichs", () =>
        assert(
          property(
            arbitraryDate({ noInvalidDate: true }),
            arbitraryRealtisticBetragInEuro()
              .chain((geringfuegigkeitsgrenze) =>
                arbitraryRealtisticBetragInEuro({
                  min: geringfuegigkeitsgrenze,
                  minExcluded: true,
                }).map((obergrenze) => ({
                  geringfuegigkeitsgrenze,
                  obergrenze,
                })),
              )
              .chain(({ geringfuegigkeitsgrenze, obergrenze }) =>
                arbitraryRealtisticBetragInEuro({
                  min: geringfuegigkeitsgrenze,
                  minExcluded: true,
                  max: obergrenze,
                }).map((arbeitsentgeld) => ({
                  geringfuegigkeitsgrenze,
                  obergrenze,
                  arbeitsentgeld,
                })),
              ),
            (
              zeitpunkt,
              { geringfuegigkeitsgrenze, obergrenze, arbeitsentgeld },
            ) => {
              vi.mocked(ermittelGeringfuegigkeitsgrenze).mockReturnValue(
                geringfuegigkeitsgrenze,
              );
              vi.mocked(
                ermittelObergrenzeDesUebergangsbereichs,
              ).mockReturnValue(obergrenze);

              expect(
                istArbeitsentgeldImUebergangsbereich(arbeitsentgeld, zeitpunkt),
              ).toBe(true);
            },
          ),
        ));
    });

    describe("berechne beitragspflichtige Einnahme im Übergangsbereich", () => {
      it("is always greater than or equal zero", () =>
        assert(
          property(
            arbitraryRealtisticBetragInEuro(),
            arbitraryDate({ noInvalidDate: true }),
            (arbeitsentgeld, zeitpunkt) => {
              expect(
                berechneUebergangszonenentgeld(arbeitsentgeld, zeitpunkt),
              ).toBeGreaterThanOrEqual(0);
            },
          ),
        ));

      it("is equal to the Arbeitsentgeld if Arbeitsentgeld equals the Obergrenze", () =>
        assert(
          property(
            arbitraryDate({ noInvalidDate: true }),
            arbitraryRealtisticBetragInEuro().chain((geringfuegigkeitsgrenze) =>
              arbitraryRealtisticBetragInEuro({
                min: geringfuegigkeitsgrenze,
                minExcluded: true,
              }).map((obergrenze) => ({
                geringfuegigkeitsgrenze,
                obergrenze,
              })),
            ),
            (zeitpunkt, { geringfuegigkeitsgrenze, obergrenze }) => {
              vi.mocked(ermittelGeringfuegigkeitsgrenze).mockReturnValue(
                geringfuegigkeitsgrenze,
              );
              vi.mocked(
                ermittelObergrenzeDesUebergangsbereichs,
              ).mockReturnValue(obergrenze);

              expect(
                berechneUebergangszonenentgeld(obergrenze, zeitpunkt),
              ).toEqual(obergrenze);
            },
          ),
        ));

      it("is always less then than or equal for a positive Arbeitsentgeld", () =>
        assert(
          property(
            arbitraryRealtisticBetragInEuro(),
            arbitraryDate({ noInvalidDate: true }),
            (arbeitsentgeld, zeitpunkt) => {
              const uebergangszonenentgelt = berechneUebergangszonenentgeld(
                arbeitsentgeld,
                zeitpunkt,
              );

              expect(uebergangszonenentgelt).toBeLessThanOrEqual(
                arbeitsentgeld,
              );
            },
          ),
        ));

      /*
       * There are no know sources for further test cases like reference tables.
       * Any test cases that try to evaluate derived properties like 'it is an
       * affine ("linear") function' do not really add testing value here.
       */
    });

    /**
     * Property test helper to produce somewhat realistic numbers. This helps to
     * focus the arbitrary sample range. But more importantly it addresses the
     * accuracy issues/constraints described at {@link berechneUebergangszonenentgeld}.
     * In fact it only produces positive numbers, not too big numbers and only
     * two significant fractional digits ("cents"). Custom constraints can
     * weaken this.
     */
    function arbitraryRealtisticBetragInEuro(constraints?: {
      min?: number;
      minExcluded?: boolean;
      max?: number;
    }) {
      let { min, max } = { min: 0, max: 10_000, ...constraints };
      min = Math.ceil(shiftNumberByDecimalsPrecisely(min, 2));
      max = Math.ceil(shiftNumberByDecimalsPrecisely(max, 2));
      min = min < max ? min : max;
      min += constraints?.minExcluded ? 1 : 0;
      max = max > min ? max : min;

      return arbitraryInteger({ min, max }).map((value) =>
        shiftNumberByDecimalsPrecisely(value, -2),
      );
    }
  });
}
