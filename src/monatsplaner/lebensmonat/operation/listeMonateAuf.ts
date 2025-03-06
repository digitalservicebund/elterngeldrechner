import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import {
  type Elternteil,
  compareElternteile,
  isElternteil,
} from "@/monatsplaner/Elternteil";
import { getRecordEntriesWithStringKeys } from "@/monatsplaner/common/type-safe-records";
import type { Lebensmonat } from "@/monatsplaner/lebensmonat/Lebensmonat";
import type { Monat } from "@/monatsplaner/monat";

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
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");

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
