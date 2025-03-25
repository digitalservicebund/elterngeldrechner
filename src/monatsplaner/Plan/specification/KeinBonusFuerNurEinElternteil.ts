import {
  Ausgangslage,
  type AusgangslageFuerEinElternteil,
} from "@/monatsplaner/Ausgangslage";
import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import { IrgendeinElternteilHatBonusGewaehlt } from "@/monatsplaner/Lebensmonat";
import type { Plan } from "@/monatsplaner/Plan";
import { Specification } from "@/monatsplaner/common/specification";

export function KeinBonusFuerNurEinElternteil<A extends Ausgangslage>() {
  return Specification.fromPredicate<Plan<A>>(
    "Partnerschaftsbonus können sie nur nutzen, wenn sie mit einem anderen Elternteil zusammen Elterngeld planen oder alleinerziehend sind.",
    (plan) => {
      const { anzahlElternteile, istAlleinerziehend } = plan.ausgangslage;
      const istEinElternteil = anzahlElternteile === 1;
      const bonusWurdeGewaehlt = Object.values(plan.lebensmonate).some(
        IrgendeinElternteilHatBonusGewaehlt.asPredicate,
      );
      return istAlleinerziehend || !(istEinElternteil && bonusWurdeGewaehlt);
    },
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("kein Partnerschaftsbonus für nur ein Elternteil", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");

    it("is satisfied for single Elternteil, not alleinerziehend and nothing planned yet", () => {
      const ausgangslage = {
        anzahlElternteile: 1 as const,
        istAlleinerziehend: false,
        geburtsdatumDesKindes: new Date(),
      };
      const lebensmonate = {};
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      expect(KeinBonusFuerNurEinElternteil().asPredicate(plan)).toBe(true);
    });

    it("is satisfied for single Elternteil, not alleinerziehend and only none Bonus Options are chosen", () => {
      const ausgangslage = {
        anzahlElternteile: 1 as const,
        istAlleinerziehend: false,
        geburtsdatumDesKindes: new Date(),
      };
      const lebensmonate = {
        1: { [Elternteil.Eins]: monat(Variante.Basis) },
        5: { [Elternteil.Eins]: monat(Variante.Plus) },
        6: { [Elternteil.Eins]: monat(undefined) },
        7: { [Elternteil.Eins]: monat(KeinElterngeld) },
      };
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      expect(
        KeinBonusFuerNurEinElternteil<AusgangslageFuerEinElternteil>().asPredicate(
          plan,
        ),
      ).toBe(true);
    });

    it("is unsatisfied for single Elternteil, not alleinerziehend and Bonus was chosen", () => {
      const ausgangslage = {
        anzahlElternteile: 1 as const,
        istAlleinerziehend: false,
        geburtsdatumDesKindes: new Date(),
      };
      const lebensmonate = {
        1: { [Elternteil.Eins]: monat(Variante.Bonus) },
      };
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      expect(
        KeinBonusFuerNurEinElternteil<AusgangslageFuerEinElternteil>().asPredicate(
          plan,
        ),
      ).toBe(false);
    });

    it("is satisfied for single Elternteil, alleinerziehend and Bonus was chosen", () => {
      const ausgangslage = {
        anzahlElternteile: 1 as const,
        istAlleinerziehend: true,
        geburtsdatumDesKindes: new Date(),
      };
      const lebensmonate = {
        1: { [Elternteil.Eins]: monat(Variante.Bonus) },
      };
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      expect(
        KeinBonusFuerNurEinElternteil<AusgangslageFuerEinElternteil>().asPredicate(
          plan,
        ),
      ).toBe(true);
    });

    it("is satisfied for two Elternteile when Bonus is chosen", () => {
      const ausgangslage = {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "",
          [Elternteil.Zwei]: "",
        },
        geburtsdatumDesKindes: new Date(),
      };
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
      };
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      expect(KeinBonusFuerNurEinElternteil().asPredicate(plan)).toBe(true);
    });

    function monat(gewaehlteOption?: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 1 as const,
        geburtsdatumDesKindes: new Date(),
      },
      lebensmonate: {},
    };
  });
}
