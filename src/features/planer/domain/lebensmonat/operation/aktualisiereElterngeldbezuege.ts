import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import {
  type Elternteil,
  isElternteil,
} from "@/features/planer/domain/Elternteil";
import {
  type Monat,
  aktualisiereElterngeldbezug as aktualisiereElterngeldbezugImMonat,
} from "@/features/planer/domain/monat";
import { mapRecordEntriesWithStringKeys } from "@/features/planer/domain/common/type-safe-records";
import type { ElterngeldbezeugeProElternteil } from "@/features/planer/domain/Elterngeldbezuege";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat/Lebensmonat";
import type { Elterngeldbezug } from "@/features/planer/domain/Elterngeldbezug";

export function aktualisiereElterngeldbezuege<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  elterngeldbezuege: ElterngeldbezeugeProElternteil<E>,
): Lebensmonat<E> {
  return mapLebensmonat(lebensmonat, (monat, elternteil) =>
    aktualisiereElterngeldbezugImMonat(monat, elterngeldbezuege[elternteil]),
  );
}

function mapLebensmonat<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  transfom: (monat: Monat, elternteil: E) => Monat,
): Lebensmonat<E> {
  return mapRecordEntriesWithStringKeys(lebensmonat, isElternteil, transfom);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("aktualisiere Elterngeldbezüge im Lebensmonat", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");

    it("updates the Elterngeldbezüge for both Elternteile based on their chosen Option", () => {
      const lebensmonatVorher = {
        [Elternteil.Eins]: monat(Variante.Basis, 10),
        [Elternteil.Zwei]: monat(Variante.Plus, 20),
      };

      const elterngeldbezuege = {
        [Elternteil.Eins]: bezuege(11, 12, 13),
        [Elternteil.Zwei]: bezuege(21, 22, 23),
      };

      const lebensmonat = aktualisiereElterngeldbezuege(
        lebensmonatVorher,
        elterngeldbezuege,
      );

      expect(lebensmonat[Elternteil.Eins].elterngeldbezug).toBe(11);
      expect(lebensmonat[Elternteil.Zwei].elterngeldbezug).toBe(22);
    });

    const monat = function (
      gewaehlteOption: Auswahloption,
      elterngeldbezug: Elterngeldbezug,
    ) {
      return {
        gewaehlteOption,
        elterngeldbezug,
        imMutterschutz: false as const,
      };
    };

    const bezuege = function (basis: number, plus: number, bonus: number) {
      return {
        [Variante.Basis]: basis,
        [Variante.Plus]: plus,
        [Variante.Bonus]: bonus,
      };
    };
  });
}
