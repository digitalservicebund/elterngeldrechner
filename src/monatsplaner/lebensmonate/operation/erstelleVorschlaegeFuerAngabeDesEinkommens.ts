import { listeLebensmonateAuf } from "./listeLebensmonateAuf";
import type {
  Elternteil,
  Lebensmonate,
  Lebensmonatszahl,
} from "@/monatsplaner";

export function erstelleVorschlaegeFuerAngabeDesEinkommens<
  E extends Elternteil,
>(
  lebensmonate: Lebensmonate<E>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: E,
): number[] {
  return listeLebensmonateAuf(lebensmonate)
    .filter(([zahl]) => zahl !== lebensmonatszahl)
    .sort(compareEntriesByClosestToLebensmonat.bind({ lebensmonatszahl }))
    .map(([, lebensmonat]) => lebensmonat[elternteil])
    .map((monat) => monat.bruttoeinkommen)
    .filter(
      (bruttoeinkommen) =>
        bruttoeinkommen !== undefined && bruttoeinkommen !== null,
    )
    .reduce(uniqueListReducer<number>, []);
}

/**
 * Sorts entries based on their Lebensmonatszahl key. For each entry the
 * distance to the target Lebensmonatszahl is calculated. The entry with the
 * smaller distance gets higher ranked.
 *
 * Example:
 * ```typescript
 * const compareFn = compareEntriesByClosestToLebensmonat.bind({ lebensmonatszahl: 5 });
 *
 * assertEqual(
 *  [[2, null], [10, null], [6, null]].sort(compareFn),
 *  [[6, null], [2, null], [10, null]]
 * );
 * ```
 */
function compareEntriesByClosestToLebensmonat(
  this: { lebensmonatszahl: Lebensmonatszahl },
  left: [Lebensmonatszahl, unknown],
  right: [Lebensmonatszahl, unknown],
): number {
  const leftDistance = Math.abs(left[0] - this.lebensmonatszahl);
  const rightDistance = Math.abs(right[0] - this.lebensmonatszahl);
  return leftDistance - rightDistance;
}

/**
 * Function to be used in a {@link Array.prototype.reduce} call. Helps to create
 * a set of unique values in a list. But it keeps the data type an {@link Array}
 * instead of a {@link Set}. Thereby it maintains the original order of the
 * list, removing duplicates which come later in the order.
 */
function uniqueListReducer<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list : [...list, value];
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelle Vorschläge für Angabe des Einkommens", async () => {
    const { Elternteil } = await import("@/monatsplaner");

    it("creates a list with all Bruttoeinkommen of the correct Elternteil", () => {
      const vorschlaege =
        erstelleVorschlaegeFuerAngabeDesEinkommens<Elternteil>(
          {
            1: {
              [Elternteil.Eins]: monat(1),
              [Elternteil.Zwei]: monat(2),
            },
            2: {
              [Elternteil.Eins]: monat(3),
              [Elternteil.Zwei]: monat(4),
            },
            8: {
              [Elternteil.Eins]: monat(5),
              [Elternteil.Zwei]: monat(6),
            },
          },
          32,
          Elternteil.Zwei,
        );

      expectToStrictEqualIgnoringOrder(vorschlaege, [2, 4, 6]);
    });

    it("filters non numeric Bruttoeinkommen values", () => {
      const vorschlaege = erstelleVorschlaegeFuerAngabeDesEinkommens(
        {
          1: { [Elternteil.Eins]: monat(1) },
          2: { [Elternteil.Eins]: monat(undefined) },
          8: { [Elternteil.Eins]: monat(3) },
          9: { [Elternteil.Eins]: monat(null) },
        },
        32,
        Elternteil.Eins,
      );

      expectToStrictEqualIgnoringOrder(vorschlaege, [1, 3]);
    });

    it("filters duplicate Bruttoeinkommen values", () => {
      const vorschlaege = erstelleVorschlaegeFuerAngabeDesEinkommens(
        {
          1: { [Elternteil.Eins]: monat(1) },
          2: { [Elternteil.Eins]: monat(2) },
          8: { [Elternteil.Eins]: monat(1) },
        },
        32,
        Elternteil.Eins,
      );

      expectToStrictEqualIgnoringOrder(vorschlaege, [1, 2]);
    });

    it("filters the Bruttoeinkommen value of the matching Lebensmonat itself", () => {
      const vorschlaege = erstelleVorschlaegeFuerAngabeDesEinkommens(
        {
          1: { [Elternteil.Eins]: monat(1) },
          2: { [Elternteil.Eins]: monat(2) },
        },
        1,
        Elternteil.Eins,
      );

      expectToStrictEqualIgnoringOrder(vorschlaege, [2]);
    });

    it("sorts entries based on closest to target Lebensmonat, handling duplicates correctly", () => {
      const vorschlaege = erstelleVorschlaegeFuerAngabeDesEinkommens(
        {
          1: { [Elternteil.Eins]: monat(1) },
          3: { [Elternteil.Eins]: monat(2) },
          5: { [Elternteil.Eins]: monat(3) },
          6: { [Elternteil.Eins]: monat(4) },
          10: { [Elternteil.Eins]: monat(2) },
        },
        4,
        Elternteil.Eins,
      );

      expect(vorschlaege).toStrictEqual([2, 3, 4, 1]);
    });

    function monat(bruttoeinkommen: number | null | undefined) {
      return { bruttoeinkommen, imMutterschutz: false as const };
    }

    function expectToStrictEqualIgnoringOrder(
      left: number[],
      right: number[],
    ): void {
      const sortFunc = (a: number, b: number) => a - b;

      expect(left.sort(sortFunc)).toStrictEqual(right.sort(sortFunc));
    }
  });
}
