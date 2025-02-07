import {
  type Ausgangslage,
  type Auswahloption,
  type Elternteil,
  type ElternteileByAusgangslage,
  type Lebensmonatszahl,
  type Monat,
  type Plan,
  isVariante,
  mapLebensmonateProElternteil,
  teileLebensmonateBeiElternteileAuf,
} from "@/features/planer/domain";

export function berechneGesamtsumme<A extends Ausgangslage>(
  plan: Plan<A>,
): Gesamtsumme<ElternteileByAusgangslage<A>> {
  const lebensmonateProElternteil = teileLebensmonateBeiElternteileAuf(plan);

  const proElternteil = mapLebensmonateProElternteil(
    lebensmonateProElternteil,
    berrechneSummeFuerElternteil,
  );

  const elterngeldbezug = Object.values<SummeFuerElternteil>(
    proElternteil,
  ).reduce(
    (summe, summeFuerElternteil) => summe + summeFuerElternteil.elterngeldbezug,
    0,
  );

  return { elterngeldbezug, proElternteil };
}

function berrechneSummeFuerElternteil(
  lebensmonate: Partial<Record<Lebensmonatszahl, Monat>>,
): SummeFuerElternteil {
  const anzahlMonateMitBezug = Object.values(lebensmonate)
    .map((monat) => monat.gewaehlteOption)
    .filter(isVariante).length;

  const elterngeldbezug = Object.values(lebensmonate)
    .map((monat) => monat.elterngeldbezug ?? 0)
    .reduce((sum, elterngeldbezug) => sum + elterngeldbezug, 0);

  const bruttoeinkommen = Object.values(lebensmonate)
    .map((monat) => monat.bruttoeinkommen ?? 0)
    .reduce((sum, bruttoeinkommen) => sum + bruttoeinkommen, 0);

  return {
    anzahlMonateMitBezug,
    elterngeldbezug,
    bruttoeinkommen,
  };
}

type Gesamtsumme<E extends Elternteil> = {
  readonly elterngeldbezug: number;
  readonly proElternteil: Record<E, SummeFuerElternteil>;
};

export type SummeFuerElternteil = {
  readonly anzahlMonateMitBezug: number;
  readonly elterngeldbezug: number;
  readonly bruttoeinkommen: number;
};

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

      const gesamtsumme = berechneGesamtsumme(plan);

      expect(gesamtsumme.elterngeldbezug).toBe(0);

      expect(Object.keys(gesamtsumme.proElternteil).length).toBeGreaterThan(0);

      Object.values(gesamtsumme.proElternteil).forEach((summe) => {
        expect(summe.anzahlMonateMitBezug).toBe(0);
        expect(summe.elterngeldbezug).toBe(0);
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

      const gesamtsumme = berechneGesamtsumme(plan);

      expect(
        gesamtsumme.proElternteil[Elternteil.Eins].anzahlMonateMitBezug,
      ).toBe(2);

      expect(
        gesamtsumme.proElternteil[Elternteil.Zwei].anzahlMonateMitBezug,
      ).toBe(4);
    });

    it("sums up the Elterngeldbezug of all Monate per Elternteil", () => {
      const lebensmonate = {
        2: {
          [Elternteil.Eins]: monat(Variante.Basis, 1),
          [Elternteil.Zwei]: monat(Variante.Basis, 2),
        },
        3: {
          [Elternteil.Eins]: monat(undefined, undefined),
          [Elternteil.Zwei]: monat(KeinElterngeld, null),
        },
        8: {
          [Elternteil.Eins]: monat(Variante.Plus, 5),
          [Elternteil.Zwei]: monat(Variante.Basis, 6),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      const gesamtsumme = berechneGesamtsumme(plan);

      expect(gesamtsumme.proElternteil[Elternteil.Eins].elterngeldbezug).toBe(
        6,
      );

      expect(gesamtsumme.proElternteil[Elternteil.Zwei].elterngeldbezug).toBe(
        8,
      );
    });

    it("sums up all Bruttoeinkommen of all Monate per Elternteil", () => {
      const lebensmonate = {
        2: {
          [Elternteil.Eins]: monat(Variante.Basis, undefined, 1),
          [Elternteil.Zwei]: monat(Variante.Basis, undefined, undefined),
        },
        3: {
          [Elternteil.Eins]: monat(undefined, undefined, undefined),
          [Elternteil.Zwei]: monat(KeinElterngeld, null, 4),
        },
        8: {
          [Elternteil.Eins]: monat(Variante.Plus, undefined, 5),
          [Elternteil.Zwei]: monat(Variante.Bonus, undefined, 6),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      const gesamtsumme = berechneGesamtsumme(plan);

      expect(gesamtsumme.proElternteil[Elternteil.Eins].bruttoeinkommen).toBe(
        6,
      );

      expect(gesamtsumme.proElternteil[Elternteil.Zwei].bruttoeinkommen).toBe(
        10,
      );
    });

    it("sums up the Elterngeldbezüge (but the Bruttoeinkommen) of all Elternteile for the overall sum", () => {
      const lebensmonate = {
        2: {
          [Elternteil.Eins]: monat(Variante.Basis, 1, 2),
          [Elternteil.Zwei]: monat(Variante.Basis, 3, 4),
        },
        3: {
          [Elternteil.Eins]: monat(KeinElterngeld, null, 6),
          [Elternteil.Zwei]: monat(Variante.Basis, 7, undefined),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      const gesamtsumme = berechneGesamtsumme(plan);

      expect(gesamtsumme.elterngeldbezug).toBe(11);
    });

    it("just works for single Elternteile too", () => {
      const ausgangslage = {
        anzahlElternteile: 1 as const,
        geburtsdatumDesKindes: new Date(),
      };
      const lebensmonate = {
        1: { [Elternteil.Eins]: monat(Variante.Basis, 1, 4) },
        2: { [Elternteil.Eins]: monat(Variante.Plus, 2, undefined) },
        8: { [Elternteil.Eins]: monat(Variante.Bonus, 3, 6) },
      };
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      const gesamtsumme = berechneGesamtsumme(plan);

      expect(gesamtsumme.elterngeldbezug).toBe(6);
      expect(
        gesamtsumme.proElternteil[Elternteil.Eins].anzahlMonateMitBezug,
      ).toBe(3);
      expect(gesamtsumme.proElternteil[Elternteil.Eins].elterngeldbezug).toBe(
        6,
      );
      expect(gesamtsumme.proElternteil[Elternteil.Eins].bruttoeinkommen).toBe(
        10,
      );
    });

    function monat(
      gewaehlteOption?: Auswahloption,
      elterngeldbezug: number | null | undefined = undefined,
      bruttoeinkommen?: number,
    ) {
      return {
        gewaehlteOption,
        elterngeldbezug,
        imMutterschutz: false as const,
        bruttoeinkommen,
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
      errechneteElterngeldbezuege: {} as never,
      lebensmonate: {},
    };
  });
}
