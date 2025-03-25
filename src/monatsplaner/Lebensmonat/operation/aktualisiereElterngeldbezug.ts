import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type { Elterngeldbezug } from "@/monatsplaner/Elterngeldbezug";
import type { Elternteil } from "@/monatsplaner/Elternteil";
import type { Lebensmonat } from "@/monatsplaner/Lebensmonat";
import { aktualisiereElterngeldbezug as aktualisiereElterngeldbezugImMonat } from "@/monatsplaner/Monat";

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
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");

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
