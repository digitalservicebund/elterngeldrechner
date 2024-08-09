import { erstelleInitialenLebensmonat } from "@/features/planer/domain/lebensmonat";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/Ausgangslage";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";
import type { Plan } from "@/features/planer/domain/plan/Plan";
import { waehleOption as waehleOptionInLebensmonaten } from "@/features/planer/domain/lebensmonate";

export function waehleOption<A extends Ausgangslage>(
  plan: Plan<A>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: ElternteileByAusgangslage<A>,
  option: Auswahloption,
): Plan<A> {
  const ungeplanterLebensmonat = erstelleInitialenLebensmonat(
    plan.ausgangslage,
    lebensmonatszahl,
  );

  const gewaehlteLebensmonate = waehleOptionInLebensmonaten(
    plan.lebensmonate,
    lebensmonatszahl,
    elternteil,
    option,
    plan.errechneteElterngeldbezuege,
    ungeplanterLebensmonat,
  );

  return { ...plan, lebensmonate: gewaehlteLebensmonate };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wähle Option für Plan", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { Lebensmonatszahlen } = await import(
      "@/features/planer/domain/Lebensmonatszahl"
    );

    it("sets the Auswahloption for the correct Lebensmonat and Elternteil", () => {
      const ausgangslage = { anzahlElternteile: 2 as const };
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(undefined, undefined),
          [Elternteil.Zwei]: monat(undefined, undefined),
        },
        2: {
          [Elternteil.Eins]: monat(undefined, undefined),
          [Elternteil.Zwei]: monat(undefined, undefined),
        },
      };

      const errechneteElterngeldbezuege = {
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

      const plan = waehleOption(
        { ausgangslage, lebensmonate, errechneteElterngeldbezuege },
        1,
        Elternteil.Zwei,
        Variante.Plus,
      );

      const lebensmonatEins = plan.lebensmonate[1]!;
      const lebensmonatZwei = plan.lebensmonate[2]!;

      expect(lebensmonatEins[Elternteil.Eins].gewaehlteOption).toBeUndefined();
      expect(lebensmonatEins[Elternteil.Eins].elterngeldbezug).toBeUndefined();
      expect(lebensmonatEins[Elternteil.Zwei].gewaehlteOption).toBe(
        Variante.Plus,
      );
      expect(lebensmonatEins[Elternteil.Zwei].elterngeldbezug).toBe(122);
      expect(lebensmonatZwei[Elternteil.Eins].gewaehlteOption).toBeUndefined();
      expect(lebensmonatZwei[Elternteil.Eins].elterngeldbezug).toBeUndefined();
      expect(lebensmonatZwei[Elternteil.Zwei].gewaehlteOption).toBeUndefined();
      expect(lebensmonatZwei[Elternteil.Zwei].elterngeldbezug).toBeUndefined();
    });

    it("can set the Auswahloption even for an empty plan", () => {
      const ausgangslage = { anzahlElternteile: 1 as const };
      const lebensmonate = {};
      const errechneteElterngeldbezuege = ANY_ELTERNGELDBEZUEGE;

      const plan = waehleOption(
        { ausgangslage, lebensmonate, errechneteElterngeldbezuege },
        1,
        Elternteil.Eins,
        Variante.Basis,
      );

      const lebensmonatEins = plan.lebensmonate[1]!;

      expect(lebensmonatEins).toBeDefined();
      expect(lebensmonatEins[Elternteil.Eins].gewaehlteOption).toBe(
        Variante.Basis,
      );
      expect(lebensmonatEins[Elternteil.Eins].elterngeldbezug).toBeDefined();
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

    const ANY_ELTERNGELDBEZUEGE_PRO_ELTERNTEIL = {
      [Elternteil.Eins]: bezuege(0, 0, 0),
      [Elternteil.Zwei]: bezuege(0, 0, 0),
    };

    const ANY_ELTERNGELDBEZUEGE = Object.fromEntries(
      Lebensmonatszahlen.map((lebensmonatszahl) => [
        lebensmonatszahl,
        ANY_ELTERNGELDBEZUEGE_PRO_ELTERNTEIL,
      ]),
    ) as any;
  });
}
