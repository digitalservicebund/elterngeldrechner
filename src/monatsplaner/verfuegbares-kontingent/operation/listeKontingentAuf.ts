import {
  Variante,
  compareVarianten,
  isVariante,
} from "@/monatsplaner/Variante";
import { getRecordEntriesWithStringKeys } from "@/monatsplaner/common/type-safe-records";
import type { VerfuegbaresKontingent } from "@/monatsplaner/verfuegbares-kontingent/VerfuegbaresKontingent";

export function listeKontingentAuf(
  kontingent: VerfuegbaresKontingent,
  sortByVariante = false,
): [Variante, number][] {
  const unsorted = getRecordEntriesWithStringKeys(kontingent, isVariante);

  return sortByVariante
    ? unsorted.sort(([left], [right]) => compareVarianten(left, right))
    : unsorted;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("liste verfügbares Kontingent auf", () => {
    it("lists Varianten with matching maximum value as entry pairs in correct order", () => {
      const kontingent = {
        [Variante.Plus]: 2,
        [Variante.Basis]: 1,
        [Variante.Bonus]: 3,
      };

      const entries = listeKontingentAuf(kontingent, true);

      expect(entries).toStrictEqual([
        [Variante.Basis, 1],
        [Variante.Plus, 2],
        [Variante.Bonus, 3],
      ]);
    });
  });
}
