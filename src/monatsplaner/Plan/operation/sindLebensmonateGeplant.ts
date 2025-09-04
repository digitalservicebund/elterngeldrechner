import type {
  Ausgangslage,
  AusgangslageFuerZweiElternteile,
  ElternteileByAusgangslage,
  Lebensmonat,
  Monat,
  Plan,
} from "@/monatsplaner";
import {
  erstelleInitialeLebensmonate,
  listeLebensmonateAuf,
} from "@/monatsplaner";
import { isElternteil } from "@/monatsplaner/Elternteil";
import { getRecordEntriesWithStringKeys } from "@/monatsplaner/common/type-safe-records";

export function sindLebensmonateGeplant<A extends Ausgangslage>(plan: Plan<A>) {
  const lebensmonateAusgangslage = erstelleInitialeLebensmonate(
    plan.ausgangslage,
  );

  const lebensmonateInitial = listeLebensmonateAuf(lebensmonateAusgangslage)
    .flatMap(([_, lebensmonat]) => getMonateFromLebensmonat(lebensmonat))
    .filter((lebensmonat) => lebensmonat.gewaehlteOption).length;

  const lebensmonateGeplant = listeLebensmonateAuf(plan.lebensmonate)
    .flatMap(([_, lebensmonat]) => getMonateFromLebensmonat(lebensmonat))
    .filter((lebensmonat) => lebensmonat.gewaehlteOption).length;

  return lebensmonateGeplant > lebensmonateInitial;
}

function getMonateFromLebensmonat<A extends Ausgangslage>(
  lebensmonat: Lebensmonat<ElternteileByAusgangslage<A>>,
): Monat[] {
  const monateByElternteile = getRecordEntriesWithStringKeys(
    lebensmonat,
    isElternteil,
  );

  return monateByElternteile.map(([_, monat]) => monat);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("sindLebensmonateGeplant", async () => {
    const { Elternteil, Variante, erstelleInitialeLebensmonate } = await import(
      "@/monatsplaner"
    );

    it("false if the plan is empty", () => {
      const plan = {
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

      expect(sindLebensmonateGeplant(plan)).toBeFalsy();
    });

    it("false if the plan contains only Mutterschutz", () => {
      const ausgangslage: AusgangslageFuerZweiElternteile = {
        anzahlElternteile: 2 as const,
        geburtsdatumDesKindes: new Date(),
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
        informationenZumMutterschutz: {
          empfaenger: Elternteil.Eins,
          letzterLebensmonatMitSchutz: 2,
        },
      };

      const plan = {
        ausgangslage: ausgangslage,
        lebensmonate: erstelleInitialeLebensmonate(ausgangslage),
      };

      expect(sindLebensmonateGeplant(plan)).toBeFalsy();
    });

    it("true if the plan contains a monat with basis", () => {
      const plan: Plan<AusgangslageFuerZweiElternteile> = {
        ausgangslage: {
          anzahlElternteile: 2 as const,
          geburtsdatumDesKindes: new Date(),
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "John",
          },
        },
        lebensmonate: {
          1: {
            [Elternteil.Eins]: {
              gewaehlteOption: Variante.Basis,
              imMutterschutz: true as const,
              elterngeldbezug: null,
              bruttoeinkommen: null,
            },
            [Elternteil.Zwei]: {
              imMutterschutz: false as const,
            },
          },
        },
      };

      expect(sindLebensmonateGeplant(plan)).toBeTruthy();
    });
  });
}
