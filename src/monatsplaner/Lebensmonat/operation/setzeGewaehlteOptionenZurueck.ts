import { type Elternteil, isElternteil } from "@/monatsplaner/Elternteil";
import type { Lebensmonat } from "@/monatsplaner/Lebensmonat";
import { type Monat, waehleOption } from "@/monatsplaner/Monat";
import { mapRecordEntriesWithStringKeys } from "@/monatsplaner/common/type-safe-records";

export function setzeGewaehlteOptionenZurueck<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
): Lebensmonat<E> {
  return mapLebensmonat(lebensmonat, (monat) => waehleOption(monat, undefined));
}

function mapLebensmonat<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  transfom: (monat: Monat, elternteil: E) => Monat,
): Lebensmonat<E> {
  return mapRecordEntriesWithStringKeys(lebensmonat, isElternteil, transfom);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("setzte Option in Lebensmonat zurück", async () => {
    const { erstelleInitialenLebensmonat } = await import(
      "./erstelleInitialenLebensmonat"
    );
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");

    it("keeps an ungeplanten Lebensmonat as is", () => {
      const ungeplanterLebensmonat = erstelleInitialenLebensmonat(
        ANY_AUSGANGSLAGE,
        ANY_LEBENSMONATSZAHL,
      );

      const lebensmonat = setzeGewaehlteOptionenZurueck(ungeplanterLebensmonat);

      expect(lebensmonat).toEqual(ungeplanterLebensmonat);
    });

    it("turns any Lebensmonat into an ungeplanten Lebensmonat again", () => {
      const ungeplanterLebensmonat = erstelleInitialenLebensmonat(
        ANY_AUSGANGSLAGE,
        ANY_LEBENSMONATSZAHL,
      );

      const lebensmonat = setzeGewaehlteOptionenZurueck({
        [Elternteil.Eins]: {
          gewaehlteOption: Variante.Basis,
          elterngeldbezug: 10,
          imMutterschutz: false as const,
        },
        [Elternteil.Zwei]: {
          gewaehlteOption: Variante.Plus,
          elterngeldbezug: 5,
          imMutterschutz: false as const,
        },
      });

      expect(lebensmonat).toEqual(ungeplanterLebensmonat);
    });

    const ANY_AUSGANGSLAGE = {
      anzahlElternteile: 2 as const,
      pseudonymeDerElternteile: {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      },
      geburtsdatumDesKindes: new Date(),
    };
    const ANY_LEBENSMONATSZAHL = 3;
  });
}
