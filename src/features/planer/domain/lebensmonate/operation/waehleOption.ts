import type { Elterngeldbezuege } from "@/features/planer/domain/Elterngeldbezuege";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Elternteil } from "@/features/planer/domain/Elternteil";
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
  elterngeldbezuege: Elterngeldbezuege<E>,
  ungeplanterLebensmonat: Lebensmonat<E>,
): Lebensmonate<E> {
  const lebensmonat = lebensmonate[lebensmonatszahl] ?? ungeplanterLebensmonat;
  const bezuege = elterngeldbezuege[lebensmonatszahl];

  const gewaehlterLebensmonat = waehleOptionInLebensmonat(
    lebensmonat,
    elternteil,
    option,
    bezuege,
  );

  return { ...lebensmonate, [lebensmonatszahl]: gewaehlterLebensmonat };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wähle Option in Lebensmonaten", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { Lebensmonatszahlen } = await import(
      "@/features/planer/domain/Lebensmonatszahl"
    );

    it("sets the Auswahloption and Elterngeldbezug for the correct Lebensmonat and Elternteil", () => {
      const lebensmonateVorher = {
        1: {
          [Elternteil.Eins]: monat(undefined, undefined),
          [Elternteil.Zwei]: monat(undefined, undefined),
        },
        2: {
          [Elternteil.Eins]: monat(undefined, undefined),
          [Elternteil.Zwei]: monat(undefined, undefined),
        },
      };

      const elterngeldbezuege = {
        ...ANY_ELTERNGELDBEZUEGE,
        1: {
          [Elternteil.Eins]: bezuege(111, 112, 113),
          [Elternteil.Zwei]: bezuege(121, 122, 123),
        },
        2: {
          [Elternteil.Eins]: bezuege(211, 212, 213),
          [Elternteil.Zwei]: bezuege(221, 222, 223),
        },
      };

      const lebensmonate = waehleOption<Elternteil>(
        lebensmonateVorher,
        1,
        Elternteil.Zwei,
        Variante.Plus,
        elterngeldbezuege,
        ANY_UNGEPLANTER_LEBENSMONAT,
      );

      expect(lebensmonate[1]![Elternteil.Eins].gewaehlteOption).toBeUndefined();
      expect(lebensmonate[1]![Elternteil.Eins].elterngeldbezug).toBeUndefined();
      expect(lebensmonate[1]![Elternteil.Zwei].gewaehlteOption).toBe(
        Variante.Plus,
      );
      expect(lebensmonate[1]![Elternteil.Zwei].elterngeldbezug).toBe(122);
      expect(lebensmonate[2]![Elternteil.Eins].gewaehlteOption).toBeUndefined();
      expect(lebensmonate[2]![Elternteil.Eins].elterngeldbezug).toBeUndefined();
      expect(lebensmonate[2]![Elternteil.Zwei].gewaehlteOption).toBeUndefined();
      expect(lebensmonate[2]![Elternteil.Zwei].elterngeldbezug).toBeUndefined();
    });

    it("can set the Auswahloption for a not yet initialized Lebensmonat", () => {
      const ungeplanterLebensmonat = {
        [Elternteil.Eins]: monat(undefined, undefined),
      };

      const lebensmonate = waehleOption<Elternteil.Eins>(
        {},
        1,
        Elternteil.Eins,
        Variante.Basis,
        ANY_ELTERNGELDBEZUEGE,
        ungeplanterLebensmonat,
      );

      expect(lebensmonate[1]).toBeDefined();
      expect(lebensmonate[1]![Elternteil.Eins].gewaehlteOption).toBe(
        Variante.Basis,
      );
      expect(lebensmonate[1]![Elternteil.Eins].elterngeldbezug).toBeDefined();
    });

    const monat = function (
      gewaehlteOption: undefined,
      elterngeldbezug: undefined,
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

    const ANY_UNGEPLANTER_LEBENSMONAT = {
      [Elternteil.Eins]: monat(undefined, undefined),
      [Elternteil.Zwei]: monat(undefined, undefined),
    };

    const ANY_ELTERNGELDBEZUEGE_PRO_ELTERNTEIL = {
      [Elternteil.Eins]: bezuege(0, 0, 0),
      [Elternteil.Zwei]: bezuege(0, 0, 0),
    };

    const ANY_ELTERNGELDBEZUEGE = Object.fromEntries(
      Lebensmonatszahlen.map((lebensmonatszahl) => [
        lebensmonatszahl,
        ANY_ELTERNGELDBEZUEGE_PRO_ELTERNTEIL,
      ]),
    ) as Elterngeldbezuege<Elternteil>;
  });
}
