import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat/Lebensmonat";
import {
  isLebensmonatszahl,
  type Lebensmonatszahl,
} from "@/features/planer/domain/Lebensmonatszahl";
import type { Elternteil } from "@/features/planer/domain/Elternteil";
import { aktualisiereElterngeldbezuege as aktualisiereElterngeldbezuegeImLebensmonat } from "@/features/planer/domain/lebensmonat/operation";
import type { Elterngeldbezuege } from "@/features/planer/domain/Elterngeldbezuege";
import { mapRecordEntriesWithIntegerKeys } from "@/features/planer/domain/common/type-safe-records";
import type { Lebensmonate } from "@/features/planer/domain/lebensmonate/Lebensmonate";
import type { Elterngeldbezug } from "@/features/planer/domain/Elterngeldbezug";

export function aktualisiereElterngeldbezuege<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  elterngeldbezuege: Elterngeldbezuege<E>,
): Lebensmonate<E> {
  return mapLebensmonate(lebensmonate, (lebensmonat, lebensmonatszahl) =>
    aktualisiereElterngeldbezuegeImLebensmonat(
      lebensmonat,
      elterngeldbezuege[lebensmonatszahl],
    ),
  );
}

function mapLebensmonate<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  transfom: (
    lebensmonat: Lebensmonat<E>,
    lebensmonatszahl: Lebensmonatszahl,
  ) => Lebensmonat<E>,
): Lebensmonate<E> {
  return mapRecordEntriesWithIntegerKeys(
    lebensmonate,
    isLebensmonatszahl,
    transfom,
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("aktualisiere Elterngeldbezüge im Lebensmonat", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    it("updates the Elterngeldbezüge for both Elternteile in every Lebensmonat", () => {
      const lebensmonateVorher = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis, 10),
          [Elternteil.Zwei]: monat(Variante.Plus, 20),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Bonus, 30),
          [Elternteil.Zwei]: monat(KeinElterngeld, null),
        },
      };

      const elterngeldbezuege = {
        1: {
          [Elternteil.Eins]: bezuege(111, 112, 113),
          [Elternteil.Zwei]: bezuege(121, 122, 123),
        },
        2: {
          [Elternteil.Eins]: bezuege(211, 212, 213),
          [Elternteil.Zwei]: bezuege(221, 222, 223),
        },
      } as any;

      const lebensmonate = aktualisiereElterngeldbezuege(
        lebensmonateVorher,
        elterngeldbezuege,
      );

      expect(lebensmonate[1]![Elternteil.Eins].elterngeldbezug).toBe(111);
      expect(lebensmonate[1]![Elternteil.Zwei].elterngeldbezug).toBe(122);
      expect(lebensmonate[2]![Elternteil.Eins].elterngeldbezug).toBe(213);
      expect(lebensmonate[2]![Elternteil.Zwei].elterngeldbezug).toBeNull();
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
