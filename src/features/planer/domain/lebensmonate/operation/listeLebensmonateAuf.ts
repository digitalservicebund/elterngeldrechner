import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat/Lebensmonat";
import type { Elternteil } from "@/features/planer/domain/Elternteil";
import type { Lebensmonate } from "@/features/planer/domain/lebensmonate/Lebensmonate";
import { getRecordEntriesWithIntegerKeys } from "@/features/planer/domain/common/type-safe-records";
import {
  compareLebensmonatszahlen,
  isLebensmonatszahl,
  type Lebensmonatszahl,
} from "@/features/planer/domain/Lebensmonatszahl";

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
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

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
