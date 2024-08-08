import { Variante } from "@/features/planer/domain/Variante";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { Elternteil } from "@/features/planer/domain/Elternteil";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat/Lebensmonat";
import { waehleOption as waehleOptionInMonat } from "@/features/planer/domain/monat/operation";

export function waehleOption<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  elternteil: E,
  option: Auswahloption,
): Lebensmonat<E> {
  const monat = lebensmonat[elternteil];
  const gewaehlterMonat = waehleOptionInMonat(monat, option);
  return { ...lebensmonat, [elternteil]: gewaehlterMonat };
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("sets the gewählte option of the correct Elternteil", () => {
    const lebensmonatVorher = {
      [Elternteil.Eins]: {
        gewaehlteOption: undefined,
        imMutterschutz: false as const,
      },
      [Elternteil.Zwei]: {
        gewaehlteOption: undefined,
        imMutterschutz: false as const,
      },
    };

    const lebensmonat = waehleOption<Elternteil>(
      lebensmonatVorher,
      Elternteil.Zwei,
      Variante.Plus,
    );

    expect(lebensmonat[Elternteil.Eins].gewaehlteOption).toBeUndefined();
    expect(lebensmonat[Elternteil.Zwei].gewaehlteOption).toBe(Variante.Plus);
  });
}
