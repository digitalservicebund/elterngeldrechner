import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import { Variante } from "@/monatsplaner/Variante";
import {
  type Ausgangslage,
  type AusgangslageFuerEinElternteil,
  listeElternteileFuerAusgangslageAuf,
} from "@/monatsplaner/ausgangslage";
import { Specification } from "@/monatsplaner/common/specification";
import { zaehleVerplantesKontingent } from "@/monatsplaner/lebensmonate";
import type { Plan } from "@/monatsplaner/plan/Plan";

export function LimitsProElternteilWurdenEingehalten<A extends Ausgangslage>() {
  return Specification.fromPredicate<Plan<A>>(
    "Die verfügbaren Monate für diesen Elternteil sind aufgebraucht.",
    (plan) => {
      const istAusnahme = plan.ausgangslage.anzahlElternteile === 1;

      if (istAusnahme) {
        return true;
      } else {
        return listeElternteileFuerAusgangslageAuf(plan.ausgangslage).every(
          (elternteil) => {
            const verplant = zaehleVerplantesKontingent(
              plan.lebensmonate,
              elternteil,
            );

            return verplant[Variante.Basis] <= LIMIT_BASIS_PER_ELTERNTEIL;
          },
        );
      }
    },
  );
}

/**
 * Acts as limit for Basiselterngeld and ElterngeldPlus because of the way both
 * Varianten interact with each other in counting the Kontingent.
 */
const LIMIT_BASIS_PER_ELTERNTEIL = 12;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Limits pro Elternteil wurden eignehalten", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");

    it("is satisfied if nothing is planned yet", () => {
      const plan = { ...ANY_PLAN, lebensmonate: {} };

      expect(LimitsProElternteilWurdenEingehalten().asPredicate(plan)).toBe(
        true,
      );
    });

    it("is satisfied if each Elternteil is just at the limit for only Basiselterngeld", () => {
      const lebensmonatMitBasisFuerBeide = {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(Variante.Basis),
      };

      const lebensmonate = {
        1: lebensmonatMitBasisFuerBeide, // 1 | 1
        2: lebensmonatMitBasisFuerBeide, // 2 | 2
        3: lebensmonatMitBasisFuerBeide, // 3 | 3
        4: lebensmonatMitBasisFuerBeide, // ..
        5: lebensmonatMitBasisFuerBeide,
        6: lebensmonatMitBasisFuerBeide,
        7: lebensmonatMitBasisFuerBeide,
        8: lebensmonatMitBasisFuerBeide,
        9: lebensmonatMitBasisFuerBeide,
        10: lebensmonatMitBasisFuerBeide,
        11: lebensmonatMitBasisFuerBeide,
        12: lebensmonatMitBasisFuerBeide, // 12 | 12
      };

      const plan = { ...ANY_PLAN, lebensmonate };

      expect(LimitsProElternteilWurdenEingehalten().asPredicate(plan)).toBe(
        true,
      );
    });

    it("is unsatisfied if an Elternteil has more than 12 Monate Basiselterngeld", () => {
      const lebensmonatMitBasisFuerElternteilZwei = {
        [Elternteil.Eins]: monat(KeinElterngeld),
        [Elternteil.Zwei]: monat(Variante.Basis),
      };

      const lebensmonate = {
        1: lebensmonatMitBasisFuerElternteilZwei,
        2: lebensmonatMitBasisFuerElternteilZwei,
        3: lebensmonatMitBasisFuerElternteilZwei,
        4: lebensmonatMitBasisFuerElternteilZwei,
        5: lebensmonatMitBasisFuerElternteilZwei,
        6: lebensmonatMitBasisFuerElternteilZwei,
        7: lebensmonatMitBasisFuerElternteilZwei,
        8: lebensmonatMitBasisFuerElternteilZwei,
        9: lebensmonatMitBasisFuerElternteilZwei,
        10: lebensmonatMitBasisFuerElternteilZwei,
        11: lebensmonatMitBasisFuerElternteilZwei,
        12: lebensmonatMitBasisFuerElternteilZwei,
        13: lebensmonatMitBasisFuerElternteilZwei,
      };

      const plan = { ...ANY_PLAN, lebensmonate };

      const violationMessages = LimitsProElternteilWurdenEingehalten()
        .evaluate(plan)
        .mapOrElse(
          () => [],
          (violations) => violations.map(({ message }) => message),
        );

      expect(violationMessages).toEqual([
        "Die verfügbaren Monate für diesen Elternteil sind aufgebraucht.",
      ]);
    });

    it("is satisfied if each Elternteil is just at the limit for Basiselterngeld and ElterngeldPlus mixed", () => {
      const lebensmonatMitBasisFuerBeide = {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(Variante.Basis),
      };

      const lebensmonatMitPlusFuerBeide = {
        [Elternteil.Eins]: monat(Variante.Plus),
        [Elternteil.Zwei]: monat(Variante.Plus),
      };

      const lebensmonate = {
        1: lebensmonatMitBasisFuerBeide, // 1 | 1
        2: lebensmonatMitPlusFuerBeide, // 1.5 | 1.5
        3: lebensmonatMitBasisFuerBeide, // 2.5 | 2.5
        4: lebensmonatMitPlusFuerBeide, // 3 | 3
        5: lebensmonatMitBasisFuerBeide, // ...
        6: lebensmonatMitPlusFuerBeide,
        7: lebensmonatMitBasisFuerBeide,
        8: lebensmonatMitPlusFuerBeide,
        9: lebensmonatMitBasisFuerBeide,
        10: lebensmonatMitPlusFuerBeide,
        11: lebensmonatMitBasisFuerBeide,
        12: lebensmonatMitPlusFuerBeide,
        13: lebensmonatMitBasisFuerBeide,
        14: lebensmonatMitPlusFuerBeide,
        15: lebensmonatMitBasisFuerBeide,
        16: lebensmonatMitPlusFuerBeide, // 12 | 12
      };

      const plan = { ...ANY_PLAN, lebensmonate };

      expect(LimitsProElternteilWurdenEingehalten().asPredicate(plan)).toBe(
        true,
      );
    });

    it("is unsatisfied if an Elternteil is above the limit for Basiselterngeld and ElterngeldPlus mixed", () => {
      const lebensmonatMitBasisFuerElternteilEins = {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(KeinElterngeld),
      };

      const lebensmonatMitPlusFuerElternteilEins = {
        [Elternteil.Eins]: monat(Variante.Plus),
        [Elternteil.Zwei]: monat(KeinElterngeld),
      };

      const lebensmonate = {
        1: lebensmonatMitBasisFuerElternteilEins, // 1 | 0
        2: lebensmonatMitPlusFuerElternteilEins, // 1.5 | 0
        3: lebensmonatMitBasisFuerElternteilEins, // 2.5 | 0
        4: lebensmonatMitPlusFuerElternteilEins, // 3 | 0
        5: lebensmonatMitBasisFuerElternteilEins, // ...
        6: lebensmonatMitPlusFuerElternteilEins,
        7: lebensmonatMitBasisFuerElternteilEins,
        8: lebensmonatMitPlusFuerElternteilEins,
        9: lebensmonatMitBasisFuerElternteilEins,
        10: lebensmonatMitPlusFuerElternteilEins,
        11: lebensmonatMitBasisFuerElternteilEins,
        12: lebensmonatMitPlusFuerElternteilEins,
        13: lebensmonatMitBasisFuerElternteilEins,
        14: lebensmonatMitPlusFuerElternteilEins,
        15: lebensmonatMitBasisFuerElternteilEins,
        16: lebensmonatMitPlusFuerElternteilEins,
        17: lebensmonatMitPlusFuerElternteilEins, // 12.5 | 0
      };

      const plan = { ...ANY_PLAN, lebensmonate };

      const violationMessages = LimitsProElternteilWurdenEingehalten()
        .evaluate(plan)
        .mapOrElse(
          () => [],
          (violations) => violations.map(({ message }) => message),
        );

      expect(violationMessages).toEqual([
        "Die verfügbaren Monate für diesen Elternteil sind aufgebraucht.",
      ]);
    });

    it("is always satisfied when ein Elternteile only", () => {
      const ausgangslage = {
        anzahlElternteile: 1 as const,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };

      const lebensmonatMitBasis = {
        [Elternteil.Eins]: monat(Variante.Basis),
      };

      const lebensmonate = {
        1: lebensmonatMitBasis, // 1
        2: lebensmonatMitBasis, // 2
        3: lebensmonatMitBasis, // ...
        4: lebensmonatMitBasis,
        5: lebensmonatMitBasis,
        6: lebensmonatMitBasis,
        7: lebensmonatMitBasis,
        8: lebensmonatMitBasis,
        9: lebensmonatMitBasis,
        10: lebensmonatMitBasis,
        11: lebensmonatMitBasis,
        12: lebensmonatMitBasis,
        13: lebensmonatMitBasis, // 13
      };

      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      expect(
        LimitsProElternteilWurdenEingehalten<AusgangslageFuerEinElternteil>().asPredicate(
          plan,
        ),
      ).toBe(true);
    });

    it("is satisfied if nothing is planned yet", () => {
      const plan = { ...ANY_PLAN, lebensmonate: {} };

      expect(LimitsProElternteilWurdenEingehalten().asPredicate(plan)).toBe(
        true,
      );
    });

    function monat(gewaehlteOption: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }

    const ANY_GEBURTSDATUM_DES_KINDES = new Date();

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
        geburtsdatumDesKindes: new Date(),
      },
      lebensmonate: {},
    };
  });
}
