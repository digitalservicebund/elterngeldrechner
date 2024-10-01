import type { Monat } from "@/features/planer/domain/monat";
import {
  isElternteil,
  type Elternteil,
} from "@/features/planer/domain/Elternteil";
import { mapRecordEntriesWithStringKeys } from "@/features/planer/domain/common/type-safe-records";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat";
import { setzeOptionZurueck as setzeOptionZurueckInMonat } from "@/features/planer/domain/monat";

export function setzeOptionZurueck<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
): Lebensmonat<E> {
  return mapLebensmonat(lebensmonat, (monat) =>
    setzeOptionZurueckInMonat(monat),
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

  describe("setzte Option in Lebensmonat zurück", async () => {
    const { erstelleInitialenLebensmonat } = await import(
      "./erstelleInitialenLebensmonat"
    );
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { MONAT_MIT_MUTTERSCHUTZ } = await import(
      "@/features/planer/domain/monat"
    );
    const { Variante } = await import("@/features/planer/domain/Variante");

    it("keeps an ungeplanten Lebensmonat as is", () => {
      const ungeplanterLebensmonat = erstelleInitialenLebensmonat(
        ANY_AUSGANGSLAGE,
        ANY_LEBENSMONATSZAHL,
      );

      const lebensmonat = setzeOptionZurueck(ungeplanterLebensmonat);

      expect(lebensmonat).toEqual(ungeplanterLebensmonat);
    });

    it("turns any Lebensmonat into an ungeplanten Lebensmonat again", () => {
      const ungeplanterLebensmonat = erstelleInitialenLebensmonat(
        ANY_AUSGANGSLAGE,
        ANY_LEBENSMONATSZAHL,
      );

      const lebensmonat = setzeOptionZurueck({
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

    it("respects Monate mit Mutterschutz", () => {
      const lebensmonat = setzeOptionZurueck({
        [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
      });

      expect(lebensmonat[Elternteil.Eins]).toBe(MONAT_MIT_MUTTERSCHUTZ);
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
