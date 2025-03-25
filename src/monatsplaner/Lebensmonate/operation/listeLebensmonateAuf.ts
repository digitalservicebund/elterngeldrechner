import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type { Elternteil } from "@/monatsplaner/Elternteil";
import type { Lebensmonat } from "@/monatsplaner/Lebensmonat";
import type { Lebensmonate } from "@/monatsplaner/Lebensmonate";
import {
  type Lebensmonatszahl,
  compareLebensmonatszahlen,
  isLebensmonatszahl,
} from "@/monatsplaner/Lebensmonatszahl";
import { getRecordEntriesWithIntegerKeys } from "@/monatsplaner/common/type-safe-records";

export function listeLebensmonateAuf<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  sortByLebensmonatszahl = false,
): [Lebensmonatszahl, Lebensmonat<E>][] {
  const unsorted = getRecordEntriesWithIntegerKeys(
    lebensmonate,
    isLebensmonatszahl,
  );

  return sortByLebensmonatszahl
    ? unsorted.sort(([left], [right]) => compareLebensmonatszahlen(left, right))
    : unsorted;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("liste Lebensmonate auf", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");

    it("lists Lebensmonatszahlen with matching Lebensmonat as entry pairs in correct order", () => {
      const lebensmonate = {
        5: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
      };

      const entries = listeLebensmonateAuf(lebensmonate, true);

      expect(entries).toStrictEqual([
        [
          1,
          {
            [Elternteil.Eins]: monat(Variante.Basis),
            [Elternteil.Zwei]: monat(Variante.Plus),
          },
        ],
        [
          5,
          {
            [Elternteil.Eins]: monat(Variante.Bonus),
            [Elternteil.Zwei]: monat(KeinElterngeld),
          },
        ],
      ]);
    });

    const monat = function (gewaehlteOption: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    };
  });
}
