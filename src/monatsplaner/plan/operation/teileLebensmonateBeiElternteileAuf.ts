import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import { Elternteil, isElternteil } from "@/monatsplaner/Elternteil";
import type { Lebensmonatszahl } from "@/monatsplaner/Lebensmonatszahl";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/monatsplaner/ausgangslage";
import { mapRecordEntriesWithStringKeys } from "@/monatsplaner/common/type-safe-records";
import { listeMonateAuf } from "@/monatsplaner/lebensmonat";
import { listeLebensmonateAuf } from "@/monatsplaner/lebensmonate";
import type { Monat } from "@/monatsplaner/monat";
import type { Plan } from "@/monatsplaner/plan/Plan";

/**
 * Restructures Lebensmonate by swapping the Lebensmonatszahlen and Elternteile.
 * That means instead of having for each Lebensmonate a mapping of each
 * Elternteil to a Monat, it maps from each Elternteil to Lebensmonatszahlen and
 * then Monate.
 * While all use-cases work on the first data structure, some data views have
 * a swapped perspective.
 */
export function teileLebensmonateBeiElternteileAuf<A extends Ausgangslage>(
  plan: Plan<A>,
): LebensmonateProElternteil<ElternteileByAusgangslage<A>> {
  const initialValue = getInitialValue(plan.ausgangslage);

  return listeLebensmonateAuf(plan.lebensmonate)
    .flatMap(([lebensmonatszahl, lebensmonat]) =>
      listeMonateAuf(lebensmonat).map<
        [ElternteileByAusgangslage<A>, Lebensmonatszahl, Monat]
      >(([elternteil, monat]) => [elternteil, lebensmonatszahl, monat]),
    )
    .reduce(
      (monateProElternteil, [elternteil, lebensmonatszahl, monat]) => ({
        ...monateProElternteil,
        [elternteil]: {
          ...monateProElternteil[elternteil],
          [lebensmonatszahl]: monat,
        },
      }),
      initialValue,
    );
}

function getInitialValue<A extends Ausgangslage>(
  ausgangslage: A,
): LebensmonateProElternteil<ElternteileByAusgangslage<A>> {
  switch (ausgangslage.anzahlElternteile) {
    case 1:
      return { [Elternteil.Eins]: [] } as LebensmonateProElternteil<
        ElternteileByAusgangslage<A>
      >;

    case 2:
      return {
        [Elternteil.Eins]: {},
        [Elternteil.Zwei]: {},
      } as LebensmonateProElternteil<ElternteileByAusgangslage<A>>;
  }
}

export function mapLebensmonateProElternteil<E extends Elternteil, Value>(
  lebensmonate: LebensmonateProElternteil<E>,
  transform: (value: Partial<Record<Lebensmonatszahl, Monat>>, key: E) => Value,
): Record<E, Value> {
  return mapRecordEntriesWithStringKeys(lebensmonate, isElternteil, transform);
}

type LebensmonateProElternteil<E extends Elternteil> = Record<
  E,
  Partial<Record<Lebensmonatszahl, Monat>>
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("teile lebensmonate bei Elternteile auf", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");

    it("creates an empty mapping if nothing was planned yet", () => {
      const plan = {
        ausgangslage: AUSGANGSLAGE_MIT_ZWEI_ELTERNTEILE,
        lebensmonate: {},
      };

      const lebensmonateProElternteil =
        teileLebensmonateBeiElternteileAuf(plan);

      expect(lebensmonateProElternteil[Elternteil.Eins]).toStrictEqual({});
      expect(lebensmonateProElternteil[Elternteil.Zwei]).toStrictEqual({});
    });

    it("splits the Monate for each Lebensmonat and maps them to their Elternteil", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis, 1),
          [Elternteil.Zwei]: monat(Variante.Plus, 2),
        },
        2: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(Variante.Bonus, 3),
        },
        5: {
          [Elternteil.Eins]: monat(Variante.Plus, 4),
          [Elternteil.Zwei]: monat(KeinElterngeld, null),
        },
      };

      const plan = {
        ausgangslage: AUSGANGSLAGE_MIT_ZWEI_ELTERNTEILE,
        lebensmonate,
      };

      const lebensmonateProElternteil =
        teileLebensmonateBeiElternteileAuf(plan);

      expect(lebensmonateProElternteil[Elternteil.Eins]).toStrictEqual({
        1: monat(Variante.Basis, 1),
        2: monat(undefined),
        5: monat(Variante.Plus, 4),
      });

      expect(lebensmonateProElternteil[Elternteil.Zwei]).toStrictEqual({
        1: monat(Variante.Plus, 2),
        2: monat(Variante.Bonus, 3),
        5: monat(KeinElterngeld, null),
      });
    });

    function monat(
      gewaehlteOption: Auswahloption | undefined,
      elterngeldbezug?: number | null,
    ) {
      return {
        gewaehlteOption,
        elterngeldbezug,
        imMutterschutz: false as const,
      };
    }

    const AUSGANGSLAGE_MIT_ZWEI_ELTERNTEILE = {
      anzahlElternteile: 2 as const,
      pseudonymeDerElternteile: {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      },
      geburtsdatumDesKindes: new Date(),
    };
  });
}
