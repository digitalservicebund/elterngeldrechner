import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Plan } from "@/features/planer/domain/plan/Plan";
import type { Elterngeldbezuege } from "@/features/planer/domain/Elterngeldbezuege";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";
import { aktualisiereElterngeldbezuege } from "@/features/planer/domain/lebensmonate";
import type { Elterngeldbezug } from "@/features/planer/domain/Elterngeldbezug";

export function aktualisiereErrechneteElterngelbezuege<A extends Ausgangslage>(
  plan: Plan<A>,
  errechneteElterngeldbezuege: Elterngeldbezuege<ElternteileByAusgangslage<A>>,
): Plan<A> {
  const lebensmonate = aktualisiereElterngeldbezuege(
    plan.lebensmonate,
    errechneteElterngeldbezuege,
  );

  return { ...plan, errechneteElterngeldbezuege, lebensmonate };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wähle Option für Plan", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );
    const { Lebensmonatszahlen } = await import(
      "@/features/planer/domain/Lebensmonatszahl"
    );
    const { Top } = await import(
      "@/features/planer/domain/common/specification"
    );

    it("sets the Auswahloption for the correct Lebensmonat and Elternteil", () => {
      const ausgangslage = { anzahlElternteile: 2 as const };
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

      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis, 10),
          [Elternteil.Zwei]: monat(Variante.Plus, 20),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Bonus, 30),
          [Elternteil.Zwei]: monat(KeinElterngeld, null),
        },
      };

      const plan = aktualisiereErrechneteElterngelbezuege(
        {
          ausgangslage,
          errechneteElterngeldbezuege: ANY_ELTERNGELDBEZUEGE,
          lebensmonate,
          gueltigerPlan: Top,
        },
        errechneteElterngeldbezuege,
      );

      const lebensmonatEins = plan.lebensmonate[1]!;
      const lebensmonatZwei = plan.lebensmonate[2]!;

      expect(lebensmonatEins[Elternteil.Eins].elterngeldbezug).toBe(111);
      expect(lebensmonatEins[Elternteil.Zwei].elterngeldbezug).toBe(122);
      expect(lebensmonatZwei[Elternteil.Eins].elterngeldbezug).toBe(213);
      expect(lebensmonatZwei[Elternteil.Zwei].elterngeldbezug).toBeNull();
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
