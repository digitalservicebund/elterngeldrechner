import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type {
  Elterngeldbezuege,
  Elterngeldbezug,
} from "@/monatsplaner/Elterngeldbezug";
import type { Elternteil } from "@/monatsplaner/Elternteil";
import {
  type Lebensmonat,
  aktualisiereElterngeldbezug as aktualisiereElterngeldbezugImLebensmonat,
} from "@/monatsplaner/Lebensmonat";
import type { Lebensmonate } from "@/monatsplaner/Lebensmonate";
import {
  type Lebensmonatszahl,
  isLebensmonatszahl,
} from "@/monatsplaner/Lebensmonatszahl";
import { mapRecordEntriesWithIntegerKeys } from "@/monatsplaner/common/type-safe-records";

export function aktualisiereElterngeldbezuege<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  elternteil: E,
  elterngeldbezuege: Elterngeldbezuege,
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
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");

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
