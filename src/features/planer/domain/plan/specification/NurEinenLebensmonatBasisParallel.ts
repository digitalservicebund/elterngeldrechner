import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type {
  Ausgangslage,
  AusgangslageFuerEinElternteil,
} from "@/features/planer/domain/ausgangslage";
import { Specification } from "@/features/planer/domain/common/specification";
import { AlleElternteileHabenBasisGewaehlt } from "@/features/planer/domain/lebensmonat";
import { listeLebensmonateAuf } from "@/features/planer/domain/lebensmonate";
import type { Plan } from "@/features/planer/domain/plan/Plan";

export function NurEinLebensmonatBasisParallel<A extends Ausgangslage>() {
  return Specification.fromPredicate<Plan<A>>(
    "Basiselterngeld können Sie nur für einen Lebensmonat in den ersten 12 Lebensmonaten gleichzeitig bekommen. Diese Einschränkung gilt nicht für besonders früh geborene Kinder, Mehrlinge und Neugeborene mit Behinderung und Geschwisterkinder mit Behinderung.",
    (plan) => {
      const {
        anzahlElternteile,
        hatBehindertesGeschwisterkind,
        sindMehrlinge,
      } = plan.ausgangslage;

      const canNotBeApplied = anzahlElternteile === 1;
      const istAusnahme = hatBehindertesGeschwisterkind || sindMehrlinge;

      if (canNotBeApplied || istAusnahme) {
        return true;
      } else {
        const lebensmonatszahlenMitParallelbezug = listeLebensmonateAuf(
          plan.lebensmonate,
        )
          .filter(([, lebensmonat]) =>
            AlleElternteileHabenBasisGewaehlt.asPredicate(lebensmonat),
          )
          .map(([lebensmonatszahl]) => lebensmonatszahl);

        return (
          lebensmonatszahlenMitParallelbezug.length <= 1 &&
          lebensmonatszahlenMitParallelbezug.every(
            (lebensmonatszahl) => lebensmonatszahl <= 12,
          )
        );
      }
    },
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Nur ein Lebensmonat Basiselterngeld parallel", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { MONAT_MIT_MUTTERSCHUTZ } = await import(
      "@/features/planer/domain/monat"
    );

    it("is satisfied if all Elternteile took only a single Lebensmonat Basiselterngeld in parallel within the first 12th", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        12: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        13: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      expect(NurEinLebensmonatBasisParallel().asPredicate(plan)).toBe(true);
    });

    it("is not satisfied if all Elternteile took more than a single Lebensmonat Basiselterngeld in parallel", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      expect(NurEinLebensmonatBasisParallel().asPredicate(plan)).toBe(false);
    });

    it("is not satsified if Elternteile took a parallel Lebensmonat Basiselterngeld after the 12th", () => {
      const lebensmonate = {
        13: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      expect(NurEinLebensmonatBasisParallel().asPredicate(plan)).toBe(false);
    });

    it("can never be unsatisfied if there is only a single Elternteil", () => {
      const ausgangslage = {
        anzahlElternteile: 1 as const,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };
      const lebensmonate = {
        1: { [Elternteil.Eins]: monat(Variante.Basis) },
        2: { [Elternteil.Eins]: monat(Variante.Basis) },
      };
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      expect(
        NurEinLebensmonatBasisParallel<AusgangslageFuerEinElternteil>().asPredicate(
          plan,
        ),
      ).toBe(true);
    });

    it("is always satisfied if there is a behindertes Geschwisterkind", () => {
      const ausgangslage = {
        hatBehindertesGeschwisterkind: true,
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: ANY_PSEUDONYME_TWO_ELTERNTEILE,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };
      const lebensmonate = LEBENSMONATE_WITH_MULITPLE_PARALLEL_BASIS;
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      expect(NurEinLebensmonatBasisParallel().asPredicate(plan)).toBe(true);
    });

    it("is always satisfied if there are Mehrline", () => {
      const ausgangslage = {
        sindMehrlinge: true,
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: ANY_PSEUDONYME_TWO_ELTERNTEILE,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };
      const lebensmonate = LEBENSMONATE_WITH_MULITPLE_PARALLEL_BASIS;
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      expect(NurEinLebensmonatBasisParallel().asPredicate(plan)).toBe(true);
    });

    it("is unsatisfied if taken Basiselterngeld in parallel to Mutterschutz more than once", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        2: {
          [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      expect(NurEinLebensmonatBasisParallel().asPredicate(plan)).toBe(false);
    });

    function monat(gewaehlteOption: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }

    const ANY_PSEUDONYME_TWO_ELTERNTEILE = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };

    const ANY_GEBURTSDATUM_DES_KINDES = new Date();

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: ANY_PSEUDONYME_TWO_ELTERNTEILE,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      },
      lebensmonate: {},
    };

    const LEBENSMONATE_WITH_MULITPLE_PARALLEL_BASIS = {
      1: {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(Variante.Basis),
      },
      2: {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(Variante.Basis),
      },
    };
  });
}
