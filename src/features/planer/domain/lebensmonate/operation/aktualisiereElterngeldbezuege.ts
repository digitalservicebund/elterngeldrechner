import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type {
  ElterngeldbezuegeFuerElternteil,
  Elterngeldbezug,
} from "@/features/planer/domain/Elterngeldbezug";
import type { Elternteil } from "@/features/planer/domain/Elternteil";
import {
  type Lebensmonatszahl,
  isLebensmonatszahl,
} from "@/features/planer/domain/Lebensmonatszahl";
import { mapRecordEntriesWithIntegerKeys } from "@/features/planer/domain/common/type-safe-records";
import { aktualisiereElterngeldbezug as aktualisiereElterngeldbezugImLebensmonat } from "@/features/planer/domain/lebensmonat";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat/Lebensmonat";
import type { Lebensmonate } from "@/features/planer/domain/lebensmonate/Lebensmonate";

export function aktualisiereElterngeldbezuege<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  elternteil: E,
  elterngeldbezuege: ElterngeldbezuegeFuerElternteil,
): Lebensmonate<E> {
  return mapLebensmonate(lebensmonate, (lebensmonat, lebensmonatszahl) =>
    aktualisiereElterngeldbezugImLebensmonat(
      lebensmonat,
      elternteil,
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

    it("updates the Elterngeldbezüge for the correct Elternteile in every Lebensmonat", () => {
      const lebensmonateVorher = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis, 11),
          [Elternteil.Zwei]: monat(Variante.Plus, 12),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Bonus, 31),
          [Elternteil.Zwei]: monat(Variante.Bonus, 32),
        },
        4: {
          [Elternteil.Eins]: monat(Variante.Bonus, 41),
          [Elternteil.Zwei]: monat(Variante.Bonus, 42),
        },
      };

      const elterngeldbezuege = { 1: 100, 2: 200, 3: 300 };

      const lebensmonate = aktualisiereElterngeldbezuege(
        lebensmonateVorher,
        Elternteil.Zwei,
        elterngeldbezuege,
      );

      expect(lebensmonate).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(Variante.Basis, 11),
          [Elternteil.Zwei]: monat(Variante.Plus, 100),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Bonus, 31),
          [Elternteil.Zwei]: monat(Variante.Bonus, 300),
        },
        4: {
          [Elternteil.Eins]: monat(Variante.Bonus, 41),
          [Elternteil.Zwei]: monat(Variante.Bonus, undefined),
        },
      });
    });

    const monat = function (
      gewaehlteOption: Auswahloption,
      elterngeldbezug: Elterngeldbezug | undefined,
    ) {
      return {
        gewaehlteOption,
        elterngeldbezug,
        imMutterschutz: false as const,
      };
    };
  });
}
