import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";
import { listeMonateAuf } from "@/features/planer/domain/lebensmonat";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type {
  Gesamtsumme,
  SummeFuerElternteil,
} from "@/features/planer/domain/Gesamtsumme";
import { isVariante } from "@/features/planer/domain/Variante";
import { Elternteil, isElternteil } from "@/features/planer/domain/Elternteil";
import type { Monat } from "@/features/planer/domain/monat";
import { mapRecordEntriesWithStringKeys } from "@/features/planer/domain/common/type-safe-records";
import type { Plan } from "@/features/planer/domain/plan/Plan";

export function berrechneGesamtsumme<A extends Ausgangslage>(
  plan: Plan<A>,
): Gesamtsumme<ElternteileByAusgangslage<A>> {
  const monateProElternteil = splitLebensmonateByElternteil(plan);

  const summeProElternteil = mapRecordEntriesWithStringKeys(
    monateProElternteil,
    isElternteil,
    berrechneSummeFuerElternteil,
  );

  const summe = Object.values(summeProElternteil).reduce(
    (summe, { totalerElterngeldbezug }) => summe + totalerElterngeldbezug,
    0,
  );

  return { summe, summeProElternteil };
}

function splitLebensmonateByElternteil<A extends Ausgangslage>(
  plan: Plan<A>,
): Record<ElternteileByAusgangslage<A>, Monat[]> {
  const initialValue = getEmptyObjectWithElternteileAsKeys<A, Monat>(
    plan.ausgangslage,
  );

  return Object.values(plan.lebensmonate)
    .flatMap(listeMonateAuf)
    .reduce(
      (monateProElternteil, [elternteil, monat]) => ({
        ...monateProElternteil,
        [elternteil]: [...(monateProElternteil[elternteil] ?? []), monat],
      }),
      initialValue,
    );
}

function getEmptyObjectWithElternteileAsKeys<A extends Ausgangslage, V>(
  ausgangslage: A,
): Record<ElternteileByAusgangslage<A>, V[]> {
  switch (ausgangslage.anzahlElternteile) {
    case 1:
      return { [Elternteil.Eins]: [] } as Record<
        ElternteileByAusgangslage<A>,
        V[]
      >;

    case 2:
      return { [Elternteil.Eins]: [], [Elternteil.Zwei]: [] } as Record<
        ElternteileByAusgangslage<A>,
        V[]
      >;
  }
}

function berrechneSummeFuerElternteil(monate: Monat[]): SummeFuerElternteil {
  const anzahlMonateMitBezug = monate
    .map((monat) => monat.gewaehlteOption)
    .filter(isVariante).length;

  const totalerElterngeldbezug = monate
    .map((monat) => monat.elterngeldbezug ?? 0)
    .reduce((sum, elterngeldbezug) => sum + elterngeldbezug, 0);

  return {
    anzahlMonateMitBezug,
    totalerElterngeldbezug,
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("berrechne Gesamtsumme", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    it("can calculate a zero Gesamtsumme when nothing is planned yet", () => {
      const plan = { ...ANY_PLAN, lebensmonate: {} };

      const gesamtsumme = berrechneGesamtsumme(plan);

      expect(gesamtsumme.summe).toBe(0);

      expect(
        Object.keys(gesamtsumme.summeProElternteil).length,
      ).toBeGreaterThan(0);

      Object.values(gesamtsumme.summeProElternteil).forEach((summe) => {
        expect(summe.anzahlMonateMitBezug).toBe(0);
        expect(summe.totalerElterngeldbezug).toBe(0);
      });
    });

    it("counts only Monate with a Variante as Monate mit Bezug", () => {
      const lebensmonate = {
        2: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        3: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        5: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        8: {
          [Elternteil.Eins]: monat(KeinElterngeld),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      const gesamtsumme = berrechneGesamtsumme(plan);

      expect(
        gesamtsumme.summeProElternteil[Elternteil.Eins].anzahlMonateMitBezug,
      ).toBe(2);

      expect(
        gesamtsumme.summeProElternteil[Elternteil.Zwei].anzahlMonateMitBezug,
      ).toBe(4);
    });

    it("sums up the Elterngeldbezug of all Monate", () => {
      const lebensmonate = {
        2: {
          [Elternteil.Eins]: monat(Variante.Basis, 1),
          [Elternteil.Zwei]: monat(Variante.Basis, 2),
        },
        3: {
          [Elternteil.Eins]: monat(undefined, undefined),
          [Elternteil.Zwei]: monat(Variante.Basis, 4),
        },
        8: {
          [Elternteil.Eins]: monat(Variante.Plus, 5),
          [Elternteil.Zwei]: monat(Variante.Basis, 6),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      const gesamtsumme = berrechneGesamtsumme(plan);

      expect(
        gesamtsumme.summeProElternteil[Elternteil.Eins].totalerElterngeldbezug,
      ).toBe(6);

      expect(
        gesamtsumme.summeProElternteil[Elternteil.Zwei].totalerElterngeldbezug,
      ).toBe(12);
    });

    it("sums up the Elterngeldbezüge of all Elternteile for the overall sum", () => {
      const lebensmonate = {
        2: {
          [Elternteil.Eins]: monat(Variante.Basis, 1),
          [Elternteil.Zwei]: monat(Variante.Basis, 2),
        },
        3: {
          [Elternteil.Eins]: monat(undefined, undefined),
          [Elternteil.Zwei]: monat(Variante.Basis, 4),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      const gesamtsumme = berrechneGesamtsumme(plan);

      expect(gesamtsumme.summe).toBe(7);
    });

    it("just works for single Elternteile too", () => {
      const ausgangslage = {
        anzahlElternteile: 1 as const,
        pseudonymeDerElternteile: { [Elternteil.Eins]: "Jane" },
        geburtsdatumDesKindes: new Date(),
      };
      const lebensmonate = {
        1: { [Elternteil.Eins]: monat(Variante.Basis, 1) },
        2: { [Elternteil.Eins]: monat(Variante.Plus, 2) },
        8: { [Elternteil.Eins]: monat(Variante.Bonus, 3) },
      };
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      const gesamtsumme = berrechneGesamtsumme(plan);

      expect(gesamtsumme.summe).toBe(6);
      expect(
        gesamtsumme.summeProElternteil[Elternteil.Eins].anzahlMonateMitBezug,
      ).toBe(3);

      expect(
        gesamtsumme.summeProElternteil[Elternteil.Eins].totalerElterngeldbezug,
      ).toBe(6);
    });

    function monat(
      gewaehlteOption?: Auswahloption,
      elterngeldbezug: number | undefined = undefined,
    ) {
      return {
        gewaehlteOption,
        elterngeldbezug,
        imMutterschutz: false as const,
      };
    }

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
        geburtsdatumDesKindes: new Date(),
      },
      errechneteElterngeldbezuege: {} as any,
      lebensmonate: {},
    };
  });
}
