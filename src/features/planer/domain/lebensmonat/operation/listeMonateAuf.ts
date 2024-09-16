import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Monat } from "@/features/planer/domain/monat";
import { getRecordEntriesWithStringKeys } from "@/features/planer/domain/common/type-safe-records";
import {
  compareElternteile,
  type Elternteil,
  isElternteil,
} from "@/features/planer/domain/Elternteil";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat/Lebensmonat";

export function listeMonateAuf<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  sortByElternteil = false,
): [E, Monat][] {
  const unsorted = getRecordEntriesWithStringKeys(lebensmonat, isElternteil);

  return sortByElternteil
    ? unsorted.sort(([left], [right]) => compareElternteile(left, right))
    : unsorted;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("liste Monate auf", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");

    it("lists Elternteile with matching Monat as entry pair in correct order", () => {
      const lebensmonat = {
        [Elternteil.Zwei]: monat(Variante.Basis),
        [Elternteil.Eins]: monat(Variante.Plus),
      };

      const entries = listeMonateAuf(lebensmonat, true);

      expect(entries).toStrictEqual([
        [Elternteil.Eins, monat(Variante.Plus)],
        [Elternteil.Zwei, monat(Variante.Basis)],
      ]);
    });

    function monat(gewaehlteOption?: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }
  });
}
