import { listeLebensmonateAuf } from "./listeLebensmonateAuf";
import type {
  Elternteil,
  Lebensmonate,
  Lebensmonatszahl,
} from "@/features/planer/domain";

export function erstelleVorschlaegeFuerAngabeDesEinkommens<
  E extends Elternteil,
>(
  lebensmonate: Lebensmonate<E>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: E,
): number[] {
  const bruttoeinkommen = listeLebensmonateAuf(lebensmonate)
    .filter(([zahl]) => zahl !== lebensmonatszahl)
    .map(([, lebensmonat]) => lebensmonat[elternteil])
    .map((monat) => monat.bruttoeinkommen)
    .filter(
      (bruttoeinkommen) =>
        bruttoeinkommen !== undefined && bruttoeinkommen !== null,
    );

  return Array.from(new Set(bruttoeinkommen));
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelle Vorschläge für Angabe des Einkommens", async () => {
    const { Elternteil } = await import("@/features/planer/domain");

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

      expect(vorschlaege).toStrictEqual([2, 4, 6]);
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

      expect(vorschlaege).toStrictEqual([1, 3]);
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

      expect(vorschlaege).toStrictEqual([1, 2]);
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

      expect(vorschlaege).toStrictEqual([2]);
    });

    function monat(bruttoeinkommen: number | null | undefined) {
      return { bruttoeinkommen, imMutterschutz: false as const };
    }
  });
}
