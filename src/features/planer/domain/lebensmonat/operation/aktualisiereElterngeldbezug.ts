import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Elterngeldbezug } from "@/features/planer/domain/Elterngeldbezug";
import { type Elternteil } from "@/features/planer/domain/Elternteil";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat/Lebensmonat";
import { aktualisiereElterngeldbezug as aktualisiereElterngeldbezugImMonat } from "@/features/planer/domain/monat";

export function aktualisiereElterngeldbezug<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  elternteil: E,
  elterngeldbezug: Elterngeldbezug | undefined,
): Lebensmonat<E> {
  return {
    ...lebensmonat,
    [elternteil]: aktualisiereElterngeldbezugImMonat(
      lebensmonat[elternteil],
      elterngeldbezug,
    ),
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("aktualisiere Elterngeldbezüge im Lebensmonat", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");

    it("updates the Elterngeldbezug for the correct Elternteil", () => {
      const lebensmonatVorher = {
        [Elternteil.Eins]: monat(Variante.Basis, 10),
        [Elternteil.Zwei]: monat(Variante.Plus, 20),
      };

      const lebensmonat = aktualisiereElterngeldbezug(
        lebensmonatVorher,
        Elternteil.Zwei,
        999,
      );

      expect(lebensmonat).toStrictEqual({
        [Elternteil.Eins]: monat(Variante.Basis, 10),
        [Elternteil.Zwei]: monat(Variante.Plus, 999),
      });
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
  });
}
