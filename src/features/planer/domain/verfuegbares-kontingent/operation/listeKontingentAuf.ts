import { getRecordEntriesWithStringKeys } from "@/features/planer/domain/common/type-safe-records";
import { isVariante, Variante } from "@/features/planer/domain/Variante";
import type { VerfuegbaresKontingent } from "@/features/planer/domain/verfuegbares-kontingent/VerfuegbaresKontingent";

export function listeKontingentAuf(
  kontingent: VerfuegbaresKontingent,
): [Variante, number][] {
  return getRecordEntriesWithStringKeys(kontingent, isVariante);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("liste verfügbares Kontingent auf", () => {
    it("lists Varianten mit respective maximum as entry pairs", () => {
      const entries = listeKontingentAuf({
        [Variante.Basis]: 1,
        [Variante.Plus]: 2,
        [Variante.Bonus]: 3,
      });

      expect(entries).toHaveLength(3);
      expect(entries).toStrictEqual([
        [Variante.Basis, 1],
        [Variante.Plus, 2],
        [Variante.Bonus, 3],
      ]);
    });
  });
}
