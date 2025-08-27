import {
  type Ausgangslage,
  type AusgangslageFuerEinElternteil,
  KeinElterngeld,
  Plan,
  listeElternteileFuerAusgangslageAuf,
  listeLebensmonateAuf,
} from "@/monatsplaner";

export function bestimmeLetztenGeplantenLebensmonat<A extends Ausgangslage>(
  plan: Plan<A>,
) {
  const elternteile = listeElternteileFuerAusgangslageAuf(plan.ausgangslage);

  const lebensmonate = listeLebensmonateAuf(plan.lebensmonate).filter(
    ([_, monat]) => {
      return elternteile.some((elternteil) => {
        return (
          monat[elternteil].gewaehlteOption !== undefined &&
          monat[elternteil].gewaehlteOption !== KeinElterngeld
        );
      });
    },
  );

  // The cleaner way would be to tell typescript that a Plan within
  // a Beispiel will always have at least one item in Lebensmonate.
  const [lebensmonatszahl] = lebensmonate[lebensmonate.length - 1]!;

  return lebensmonatszahl;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("bestimmeLetztenGeplantenLebensmonat", async () => {
    const { Elternteil, Variante, KeinElterngeld } = await import(
      "@/monatsplaner"
    );

    it("bestimmt den letzten lebensmonat der eine option hat", () => {
      const plan: Plan<AusgangslageFuerEinElternteil> = {
        ausgangslage: {
          anzahlElternteile: 1,
          geburtsdatumDesKindes: new Date(),
        },
        lebensmonate: {
          1: {
            [Elternteil.Eins]: {
              gewaehlteOption: Variante.Basis,
              imMutterschutz: false as const,
              elterngeldbezug: 100,
            },
          },
          2: {
            [Elternteil.Eins]: {
              gewaehlteOption: Variante.Basis,
              imMutterschutz: false as const,
              elterngeldbezug: 200,
            },
          },
          3: {
            [Elternteil.Eins]: {
              gewaehlteOption: KeinElterngeld,
              imMutterschutz: false as const,
            },
          },
        },
      };

      expect(bestimmeLetztenGeplantenLebensmonat(plan)).toEqual(2);
    });
  });
}
