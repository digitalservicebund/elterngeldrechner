import { isAuswahloption } from "@/monatsplaner/Auswahloption";
import { mapRecordEntriesWithStringKeys } from "@/monatsplaner/common/type-safe-records";
import {
  LEERES_VERPLANTES_KONTINGENT,
  VerplantesKontingent,
} from "@/monatsplaner/verplantes-kontingent/VerplantesKontingent";

export function addiere(
  ...kontingente: VerplantesKontingent[]
): VerplantesKontingent {
  return kontingente.reduce(addiereZwei, LEERES_VERPLANTES_KONTINGENT);
}

function addiereZwei(
  left: VerplantesKontingent,
  right: VerplantesKontingent,
): VerplantesKontingent {
  return mapRecordEntriesWithStringKeys(
    left,
    isAuswahloption,
    (anzahl, option) => anzahl + right[option],
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("addiere verplante kontingente", async () => {
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");

    it("adds up the Kontingent per Variante", () => {
      const first = {
        [Variante.Basis]: 1,
        [Variante.Plus]: 2,
        [Variante.Bonus]: 3,
        [KeinElterngeld]: 4,
      };
      const second = {
        [Variante.Basis]: 0,
        [Variante.Plus]: 3,
        [Variante.Bonus]: 0,
        [KeinElterngeld]: 5,
      };
      const third = {
        [Variante.Basis]: 2,
        [Variante.Plus]: 0,
        [Variante.Bonus]: 4,
        [KeinElterngeld]: 0,
      };

      const sum = addiere(first, second, third);

      expect(sum[Variante.Basis]).toBe(3);
      expect(sum[Variante.Plus]).toBe(5);
      expect(sum[Variante.Bonus]).toBe(7);
      expect(sum[KeinElterngeld]).toBe(9);
    });
  });
}
