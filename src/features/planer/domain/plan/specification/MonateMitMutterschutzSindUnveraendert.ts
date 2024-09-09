import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";
import type { Plan } from "@/features/planer/domain/plan/Plan";
import { listeLebensmonateAuf } from "@/features/planer/domain/lebensmonate";
import { IstGueltigerMonatMitMutterschutz } from "@/features/planer/domain/monat";
import { Specification } from "@/features/planer/domain/common/specification";

export function MonateMitMutterschutzSindUnveraendert<
  A extends Ausgangslage,
>(): Specification<Plan<A>> {
  return Specification.fromPredicate(
    "Im Mutterschutz wird automatisch Basiselterngeld bezogen.",
    (plan) => {
      const { informationenZumMutterschutz } = plan.ausgangslage;
      const hatKeinMutterschutz = informationenZumMutterschutz === undefined;

      if (hatKeinMutterschutz) {
        return true;
      } else {
        const { letzterLebensmonatMitSchutz, empfaenger } =
          informationenZumMutterschutz;

        return listeLebensmonateAuf(plan.lebensmonate)
          .filter(
            ([lebensmonatszahl]) =>
              lebensmonatszahl <= letzterLebensmonatMitSchutz,
          )
          .map(
            ([, lebensmonat]) =>
              lebensmonat[empfaenger as ElternteileByAusgangslage<A>],
          )
          .every(IstGueltigerMonatMitMutterschutz.asPredicate);
      }
    },
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Monate mit Mutterschutz sind unverändert", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { MONAT_MIT_MUTTERSCHUTZ } = await import(
      "@/features/planer/domain/monat"
    );

    it("is always satisfied when no Mutterschutz is configured", () => {
      const ausgangslage = {
        informationenZumMutterschutz: undefined,
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: ANY_PSEUDONYME_TWO_ELTERNTEILE,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };

      const lebensmonate = {
        1: {
          [Elternteil.Eins]: { imMutterschutz: false as const },
          [Elternteil.Zwei]: MONAT_MIT_MUTTERSCHUTZ,
        },
      };

      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      const isSatisfied =
        MonateMitMutterschutzSindUnveraendert().asPredicate(plan);

      expect(isSatisfied).toBe(true);
    });

    it("is satisfied when all configured Lebensmonate for the correct Elternteil are im Mutterschutz", () => {
      const ausgangslage: Ausgangslage = {
        anzahlElternteile: 2,
        informationenZumMutterschutz: {
          empfaenger: Elternteil.Zwei,
          letzterLebensmonatMitSchutz: 2,
        },
        pseudonymeDerElternteile: ANY_PSEUDONYME_TWO_ELTERNTEILE,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };

      const lebensmonate = {
        1: {
          [Elternteil.Eins]: { imMutterschutz: false as const },
          [Elternteil.Zwei]: MONAT_MIT_MUTTERSCHUTZ,
        },
        2: {
          [Elternteil.Eins]: { imMutterschutz: false as const },
          [Elternteil.Zwei]: MONAT_MIT_MUTTERSCHUTZ,
        },
        3: {
          [Elternteil.Eins]: { imMutterschutz: false as const },
          [Elternteil.Zwei]: { imMutterschutz: false as const },
        },
      };

      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      const isSatisfied =
        MonateMitMutterschutzSindUnveraendert().asPredicate(plan);

      expect(isSatisfied).toBe(true);
    });

    it("is unsatisfied when a Monat mit Mutterschutz is missing", () => {
      const ausgangslage: Ausgangslage = {
        anzahlElternteile: 2,
        informationenZumMutterschutz: {
          empfaenger: Elternteil.Zwei,
          letzterLebensmonatMitSchutz: 2,
        },
        pseudonymeDerElternteile: ANY_PSEUDONYME_TWO_ELTERNTEILE,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };

      const lebensmonate = {
        1: {
          [Elternteil.Eins]: { imMutterschutz: false as const },
          [Elternteil.Zwei]: MONAT_MIT_MUTTERSCHUTZ,
        },
        2: {
          [Elternteil.Eins]: { imMutterschutz: false as const },
          [Elternteil.Zwei]: { imMutterschutz: false as const },
        },
      };

      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      const isSatisfied =
        MonateMitMutterschutzSindUnveraendert().asPredicate(plan);

      expect(isSatisfied).toBe(false);
    });

    it("is unsatisfied when a the wrong Elternteil has Monate im Mutterschutz", () => {
      const ausgangslage: Ausgangslage = {
        anzahlElternteile: 2,
        informationenZumMutterschutz: {
          empfaenger: Elternteil.Zwei,
          letzterLebensmonatMitSchutz: 2,
        },
        pseudonymeDerElternteile: ANY_PSEUDONYME_TWO_ELTERNTEILE,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };

      const lebensmonate = {
        1: {
          [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
          [Elternteil.Zwei]: { imMutterschutz: false as const },
        },
        2: {
          [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
          [Elternteil.Zwei]: { imMutterschutz: false as const },
        },
      };

      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      const isSatisfied =
        MonateMitMutterschutzSindUnveraendert().asPredicate(plan);

      expect(isSatisfied).toBe(false);
    });

    const ANY_PSEUDONYME_ONE_ELTERNTEIL = {
      [Elternteil.Eins]: "Jane",
    };

    const ANY_PSEUDONYME_TWO_ELTERNTEILE = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };

    const ANY_GEBURTSDATUM_DES_KINDES = new Date();

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 1,
        pseudonymeDerElternteile: ANY_PSEUDONYME_ONE_ELTERNTEIL,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      },
      lebensmonate: {},
      errechneteElterngeldbezuege: {} as any,
    };
  });
}
