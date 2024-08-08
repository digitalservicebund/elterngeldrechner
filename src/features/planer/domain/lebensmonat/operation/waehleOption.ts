import type { ElterngeldbezeugeProElternteil } from "@/features/planer/domain/Elterngeldbezuege";
import { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { Elternteil } from "@/features/planer/domain/Elternteil";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat/Lebensmonat";
import { waehleOption as waehleOptionInMonat } from "@/features/planer/domain/monat/operation";

export function waehleOption<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  elternteil: E,
  option: Auswahloption,
  elterngeldbezuege: ElterngeldbezeugeProElternteil<E>,
): Lebensmonat<E> {
  const monat = lebensmonat[elternteil];
  const bezuege = elterngeldbezuege[elternteil];
  const gewaehlterMonat = waehleOptionInMonat(monat, option, bezuege);
  return { ...lebensmonat, [elternteil]: gewaehlterMonat };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wähle Option in Lebensmona", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");

    it("sets the gewählte Option of the correct Elternteil with matching Elterngeldbezug", () => {
      const elterngeldbezuege = {
        [Elternteil.Eins]: bezuege(11, 12, 13),
        [Elternteil.Zwei]: bezuege(21, 22, 23),
      };

      const lebensmonatVorher = {
        [Elternteil.Eins]: {
          gewaehlteOption: undefined,
          elterngeldbezug: undefined,
          imMutterschutz: false as const,
        },
        [Elternteil.Zwei]: {
          gewaehlteOption: undefined,
          elterngeldbezug: undefined,
          imMutterschutz: false as const,
        },
      };

      const lebensmonat = waehleOption<Elternteil>(
        lebensmonatVorher,
        Elternteil.Zwei,
        Variante.Plus,
        elterngeldbezuege,
      );

      expect(lebensmonat[Elternteil.Eins].gewaehlteOption).toBeUndefined();
      expect(lebensmonat[Elternteil.Eins].elterngeldbezug).toBeUndefined();
      expect(lebensmonat[Elternteil.Zwei].gewaehlteOption).toBe(Variante.Plus);
      expect(lebensmonat[Elternteil.Zwei].elterngeldbezug).toBe(22);
    });

    const bezuege = function (basis: number, plus: number, bonus: number) {
      return {
        [Variante.Basis]: basis,
        [Variante.Plus]: plus,
        [Variante.Bonus]: bonus,
      };
    };
  });
}
