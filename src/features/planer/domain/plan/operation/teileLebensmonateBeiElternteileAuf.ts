import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";
import { listeLebensmonateAuf } from "@/features/planer/domain/lebensmonate";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { listeMonateAuf } from "@/features/planer/domain/lebensmonat";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";
import { Elternteil } from "@/features/planer/domain/Elternteil";
import type { Monat } from "@/features/planer/domain/monat";
import type { Plan } from "@/features/planer/domain/plan/Plan";

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

type LebensmonateProElternteil<E extends Elternteil> = Record<
  E,
  Partial<Record<Lebensmonatszahl, Monat>>
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("teile lebensmonate bei Elternteile auf", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    it("creates an empty mapping if nothing was planned yet", () => {
      const plan = {
        ausgangslage: AUSGANGSLAGE_MIT_ZWEI_ELTERNTEILE,
        errechneteElterngeldbezuege: ANY_ERRECHNETE_ELTERNGELDBEZUEGE,
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
        errechneteElterngeldbezuege: ANY_ERRECHNETE_ELTERNGELDBEZUEGE,
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

    // related to test-generators
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ANY_ERRECHNETE_ELTERNGELDBEZUEGE = {} as any;

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
