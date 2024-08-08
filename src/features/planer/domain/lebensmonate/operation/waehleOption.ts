import { Variante } from "@/features/planer/domain/Variante";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { Elternteil } from "@/features/planer/domain/Elternteil";
import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";
import type { Lebensmonate } from "@/features/planer/domain/lebensmonate";
import {
  waehleOption as waehleOptionInLebensmonat,
  type Lebensmonat,
} from "@/features/planer/domain/lebensmonat";

export function waehleOption<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: E,
  option: Auswahloption,
  ungeplanterLebensmonat: Lebensmonat<E>,
): Lebensmonate<E> {
  const lebensmonat = lebensmonate[lebensmonatszahl] ?? ungeplanterLebensmonat;
  const gewaehlterLebensmonat = waehleOptionInLebensmonat(
    lebensmonat,
    elternteil,
    option,
  );

  return { ...lebensmonate, [lebensmonatszahl]: gewaehlterLebensmonat };
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("sets the Auswahloption for the correct Lebensmonat and Elternteil", () => {
    const lebensmonateVorher = {
      1: {
        [Elternteil.Eins]: { imMutterschutz: false as const },
        [Elternteil.Zwei]: { imMutterschutz: false as const },
      },
      2: {
        [Elternteil.Eins]: { imMutterschutz: false as const },
        [Elternteil.Zwei]: { imMutterschutz: false as const },
      },
    };

    const lebensmonate = waehleOption<Elternteil>(
      lebensmonateVorher,
      1,
      Elternteil.Zwei,
      Variante.Plus,
      ANY_UNGEPLANTER_LEBENSMONAT,
    );

    expect(lebensmonate[1]![Elternteil.Eins].gewaehlteOption).toBeUndefined();
    expect(lebensmonate[1]![Elternteil.Zwei].gewaehlteOption).toBe(
      Variante.Plus,
    );
    expect(lebensmonate[2]![Elternteil.Eins].gewaehlteOption).toBeUndefined();
    expect(lebensmonate[2]![Elternteil.Zwei].gewaehlteOption).toBeUndefined();
  });

  it("can set the Auswahloption for a not yet initialized Lebensmonat", () => {
    const ungeplanterLebensmonat = {
      [Elternteil.Eins]: {
        elterngeldbezug: 10,
        imMutterschutz: false as const,
      },
    };

    const lebensmonate = waehleOption<Elternteil.Eins>(
      {},
      1,
      Elternteil.Eins,
      Variante.Basis,
      ungeplanterLebensmonat,
    );

    expect(lebensmonate[1]).toBeDefined();
    expect(lebensmonate[1]![Elternteil.Eins].gewaehlteOption).toBe(
      Variante.Basis,
    );
    expect(lebensmonate[1]![Elternteil.Eins].elterngeldbezug).toBe(10);
  });

  const ANY_UNGEPLANTER_LEBENSMONAT = {
    [Elternteil.Eins]: {
      gewaehlteLebensmonate: undefined,
      imMutterschutz: false as const,
    },
    [Elternteil.Zwei]: {
      gewaehlteLebensmonate: undefined,
      imMutterschutz: false as const,
    },
  };
}
