import { teileLebensmonateBeiElternteileAuf } from "./teileLebensmonateBeiElternteileAuf";
import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type {
  BerechneElterngeldbezuegeCallback,
  Elterngeldbezug,
} from "@/monatsplaner/Elterngeldbezug";
import type { Elternteil } from "@/monatsplaner/Elternteil";
import {
  type Ausgangslage,
  type ElternteileByAusgangslage,
  listeElternteileFuerAusgangslageAuf,
} from "@/monatsplaner/ausgangslage";
import { aktualisiereElterngeldbezuege as aktualisiereElterngeldbezuegeInLebensmonaten } from "@/monatsplaner/lebensmonate";
import type { Plan } from "@/monatsplaner/plan/Plan";

/**
 * @param elternteil - if undefined, updates for all Elternteile
 */
export function aktualisiereElterngeldbezuege<A extends Ausgangslage>(
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
  plan: Plan<A>,
  elternteil?: ElternteileByAusgangslage<A>,
): Plan<A> {
  const elternteile = elternteil
    ? [elternteil]
    : listeElternteileFuerAusgangslageAuf(plan.ausgangslage);

  return elternteile.reduce((plan, elternteil) => {
    const monate = teileLebensmonateBeiElternteileAuf(plan)[elternteil];
    const elterngeldbezuege = berechneElterngeldbezuege(elternteil, monate);
    const lebensmonate = aktualisiereElterngeldbezuegeInLebensmonaten(
      plan.lebensmonate,
      elternteil,
      elterngeldbezuege,
    );

    return { ...plan, lebensmonate };
  }, plan);
}

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("wähle Option für Plan", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");

    describe("with filter for single Elternteil", () => {
      it("determines the Bezüge and updates them for the given Elternteil", () => {
        const berechneElterngeldbezuege = vi
          .fn()
          .mockReturnValue({ 1: 100, 2: 200, 3: 300 });

        const planVorher = {
          ausgangslage: {
            anzahlElternteile: 2 as const,
            pseudonymeDerElternteile: ANY_PSEUDONYME,
            geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: monat(Variante.Basis, 11),
              [Elternteil.Zwei]: monat(Variante.Plus, 12),
            },
            3: {
              [Elternteil.Eins]: monat(Variante.Bonus, 31),
              [Elternteil.Zwei]: monat(Variante.Bonus, 32),
            },
          },
        };

        const plan = aktualisiereElterngeldbezuege(
          berechneElterngeldbezuege,
          planVorher,
          Elternteil.Eins,
        );

        expect(berechneElterngeldbezuege).toHaveBeenCalledOnce();
        expect(berechneElterngeldbezuege).toHaveBeenCalledWith(
          Elternteil.Eins,
          {
            1: monat(Variante.Basis, 11),
            3: monat(Variante.Bonus, 31),
          },
        );
        expect(plan.lebensmonate).toStrictEqual({
          1: {
            [Elternteil.Eins]: monat(Variante.Basis, 100),
            [Elternteil.Zwei]: monat(Variante.Plus, 12),
          },
          3: {
            [Elternteil.Eins]: monat(Variante.Bonus, 300),
            [Elternteil.Zwei]: monat(Variante.Bonus, 32),
          },
        });
      });

      describe("with no filter for all Elternteile", () => {
        it("determines the Bezüge and updates them for a single Elternteil", () => {
          const berechneElterngeldbezuege = vi
            .fn()
            .mockReturnValue({ 1: 10, 2: 20, 3: 30 });

          const ausgangslage = {
            anzahlElternteile: 1 as const,
            geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
          };

          const lebensmonate = {
            1: { [Elternteil.Eins]: monat(Variante.Basis, 1) },
            3: { [Elternteil.Eins]: monat(Variante.Bonus, 3) },
          };

          const planVorher = { ausgangslage, lebensmonate };

          const plan = aktualisiereElterngeldbezuege(
            berechneElterngeldbezuege,
            planVorher,
          );

          expect(berechneElterngeldbezuege).toHaveBeenCalledOnce();
          expect(berechneElterngeldbezuege).toHaveBeenCalledWith(
            Elternteil.Eins,
            {
              1: monat(Variante.Basis, 1),
              3: monat(Variante.Bonus, 3),
            },
          );
          expect(plan.lebensmonate).toStrictEqual({
            1: { [Elternteil.Eins]: monat(Variante.Basis, 10) },
            3: { [Elternteil.Eins]: monat(Variante.Bonus, 30) },
          });
        });

        it("determines the Bezüge and updates them for each Elternteil when there are more", () => {
          const berechneElterngeldbezuege = vi.fn((elternteil: Elternteil) => {
            switch (elternteil) {
              case Elternteil.Eins:
                return { 1: 110, 2: 0, 3: 0, 4: 410 };
              case Elternteil.Zwei:
                return { 1: 120, 2: 220, 3: 0, 4: 0 };
            }
          });

          const ausgangslage = {
            anzahlElternteile: 2 as const,
            pseudonymeDerElternteile: ANY_PSEUDONYME,
            geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
          };

          const lebensmonate = {
            1: {
              [Elternteil.Eins]: monat(Variante.Basis, 11),
              [Elternteil.Zwei]: monat(Variante.Plus, 12),
            },
            2: {
              [Elternteil.Eins]: monat(undefined),
              [Elternteil.Zwei]: monat(Variante.Basis, 22),
            },
            4: {
              [Elternteil.Eins]: monat(Variante.Bonus, 41),
              [Elternteil.Zwei]: monat(undefined),
            },
          };

          const planVorher = { ausgangslage, lebensmonate };

          const plan = aktualisiereElterngeldbezuege(
            berechneElterngeldbezuege,
            planVorher,
          );

          expect(berechneElterngeldbezuege).toHaveBeenCalledTimes(2);
          expect(berechneElterngeldbezuege).toHaveBeenCalledWith(
            Elternteil.Eins,
            {
              1: monat(Variante.Basis, 11),
              2: monat(undefined),
              4: monat(Variante.Bonus, 41),
            },
          );
          expect(berechneElterngeldbezuege).toHaveBeenCalledWith(
            Elternteil.Zwei,
            {
              1: monat(Variante.Plus, 12),
              2: monat(Variante.Basis, 22),
              4: monat(undefined),
            },
          );
          expect(plan.lebensmonate).toStrictEqual({
            1: {
              [Elternteil.Eins]: monat(Variante.Basis, 110),
              [Elternteil.Zwei]: monat(Variante.Plus, 120),
            },
            2: {
              [Elternteil.Eins]: monat(undefined),
              [Elternteil.Zwei]: monat(Variante.Basis, 220),
            },
            4: {
              [Elternteil.Eins]: monat(Variante.Bonus, 410),
              [Elternteil.Zwei]: monat(undefined),
            },
          });
        });
      });
    });

    function monat(
      gewaehlteOption: Auswahloption | undefined,
      elterngeldbezug?: Elterngeldbezug,
    ) {
      return {
        gewaehlteOption,
        elterngeldbezug,
        imMutterschutz: false as const,
      };
    }

    const ANY_PSEUDONYME = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };

    const ANY_GEBURTSDATUM_DES_KINDES = new Date();
  });
}
