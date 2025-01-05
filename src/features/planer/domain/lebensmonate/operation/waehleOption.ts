import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Elternteil } from "@/features/planer/domain/Elternteil";
import {
  Lebensmonatszahl,
  LetzteLebensmonatszahl,
} from "@/features/planer/domain/Lebensmonatszahl";
import { Variante } from "@/features/planer/domain/Variante";
import { compose } from "@/features/planer/domain/common/compose";
import {
  AlleElternteileHabenBonusGewaehlt,
  type Lebensmonat,
  setzeOptionZurueck,
  waehleOption as waehleOptionInLebensmonat,
} from "@/features/planer/domain/lebensmonat";
import {
  type Lebensmonate,
  listeLebensmonateAuf,
  zaehleVerplantesKontingent,
} from "@/features/planer/domain/lebensmonate";

export function waehleOption<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: E,
  option: Auswahloption,
  ungeplanterLebensmonat: Lebensmonat<E>,
): Lebensmonate<E> {
  const moechteBonusWaehlen = option === Variante.Bonus;
  const verplanteBonusLebensmonate =
    zaehleVerplantesKontingent(lebensmonate)[Variante.Bonus];
  const nochKeinBonusWurdeGewaehlt = verplanteBonusLebensmonate === 0;

  const parameters = {
    lebensmonatszahl,
    elternteil,
    option,
    ungeplanterLebensmonat,
  };

  if (moechteBonusWaehlen && nochKeinBonusWurdeGewaehlt) {
    return waehleZweiLebensmonateBonus(lebensmonate, parameters);
  } else if (!moechteBonusWaehlen) {
    return waehleBonusAb(lebensmonate, parameters);
  } else {
    return waehleOptionDirekt(parameters, undefined, lebensmonate);
  }
}

function waehleZweiLebensmonateBonus<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  parameters: BindingParameters<E>,
): Lebensmonate<E> {
  const { lebensmonatszahl: ersteLebensmonatszahl } = parameters;
  const zweiteLebensmonatszahl = nachfolgendeOderVorherigeLebensmonatszahl(
    ersteLebensmonatszahl,
  );

  const bonusParameters = { ...parameters, option: Variante.Bonus };
  const waehleBonus = (waehleOptionDirekt<E>).bind(null, bonusParameters);

  return compose(
    waehleBonus.bind(null, { lebensmonatszahl: ersteLebensmonatszahl }),
    waehleBonus.bind(null, { lebensmonatszahl: zweiteLebensmonatszahl }),
  )(lebensmonate);
}

function waehleBonusAb<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  parameters: BindingParameters<E>,
): Lebensmonate<E> {
  const lebensmonateToFix = waehleOptionDirekt(
    parameters,
    undefined,
    lebensmonate,
  );

  const chunks = chunksOfLebensmonateMitFortlaufendenBonus(
    lebensmonateToFix,
  ).map((chunk) => chunk.map(([lebensmonatszahl]) => lebensmonatszahl));

  const lebensmonatszahlenToKeepBonus = findBiggestChunk(chunks, 2);
  const lebensmonatszahlenZumZuruecksetzen = chunks
    .flat()
    .filter((zahl) => !lebensmonatszahlenToKeepBonus.includes(zahl));

  return compose(
    ...lebensmonatszahlenZumZuruecksetzen.map((zahl) =>
      (setzeOptionZurueckWennDefiniert<E>).bind(null, zahl),
    ),
  )(lebensmonateToFix);
}

function setzeOptionZurueckWennDefiniert<E extends Elternteil>(
  lebensmonatszahl: Lebensmonatszahl,
  lebensmonate: Lebensmonate<E>,
): Lebensmonate<E> {
  const lebensmonat = lebensmonate[lebensmonatszahl];

  if (!lebensmonat) {
    return lebensmonate;
  } else {
    const zurueckgesetzterLebensmonat = setzeOptionZurueck(lebensmonat);
    return {
      ...lebensmonate,
      [lebensmonatszahl]: zurueckgesetzterLebensmonat,
    };
  }
}

function nachfolgendeOderVorherigeLebensmonatszahl(
  lebensmonatszahl: Lebensmonatszahl,
): Lebensmonatszahl {
  return (
    lebensmonatszahl === LetzteLebensmonatszahl
      ? lebensmonatszahl - 1
      : lebensmonatszahl + 1
  ) as Lebensmonatszahl;
}

/**
 * Fulfills the purpose of choosing the option straight without any further
 * logic to do additional things (see main function).
 * Furthermore the signature of this function is written in a way that allows to
 * create bound/curried instances of this function that can be composed to create more
 * advanced behaviors.
 */
function waehleOptionDirekt<E extends Elternteil>(
  parameters: BindingParameters<E>,
  overrideParameters: Partial<BindingParameters<E>> | undefined,
  lebensmonate: Lebensmonate<E>,
): Lebensmonate<E> {
  const { lebensmonatszahl, elternteil, option, ungeplanterLebensmonat } = {
    ...parameters,
    ...overrideParameters,
  };

  const lebensmonat = lebensmonate[lebensmonatszahl] ?? ungeplanterLebensmonat;
  const gewaehlterLebensmonat = waehleOptionInLebensmonat(
    lebensmonat,
    elternteil,
    option,
  );
  return { ...lebensmonate, [lebensmonatszahl]: gewaehlterLebensmonat };
}

type BindingParameters<E extends Elternteil> = {
  lebensmonatszahl: Lebensmonatszahl;
  elternteil: E;
  option: Auswahloption;
  ungeplanterLebensmonat: Lebensmonat<E>;
};

function chunksOfLebensmonateMitFortlaufendenBonus<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
): LebensmonateEntry<E>[][] {
  const entries = listeLebensmonateAuf(lebensmonate);
  const isEntryWithBonus = (entry: LebensmonateEntry<E>) =>
    AlleElternteileHabenBonusGewaehlt.asPredicate(entry[1]);
  return chunksWithMatchingItems(entries, isEntryWithBonus);
}

type LebensmonateEntry<E extends Elternteil> = [
  Lebensmonatszahl,
  Lebensmonat<E>,
];

/**
 * In a list of chunks, finds the one with the most entries.
 * If multiple chunks share the same size, the first one is taken.
 * All chunks are first filtered by a minimal required size. That can be used to
 * find the biggest chunk but only if there is one with more then one entry.
 * For an empty list of chunks, or if none fulfills the requirements of the
 * minimum size, "the" empty chunk is returned.
 *
 * Examples:
 * ```typescript
 * findBiggestChunk([[1, 2], [3], [4, 5, 6], [7, 8]]); // [4, 5, 6]
 * findBiggestChunk([[1, 2], [2], [3, 4]]); // [1, 2];
 * findBiggestChunk([]); // []
 * findBiggestChunk([1], [2, 3], 3); // []
 * ```
 */
function findBiggestChunk<Item>(chunks: Item[][], minimumSize = 0): Item[] {
  return chunks
    .filter((chunk) => chunk.length >= minimumSize)
    .reduce(
      (biggestChunk, chunk) =>
        chunk.length > biggestChunk.length ? chunk : biggestChunk,
      [],
    );
}

/**
 * Chops a list of items into chunks. All items in each chunk fulfill the
 * defined predicate. Each item in the list that does not fulfill the predicates
 * divides two pairs of chunks. In result, each chunk contains a list of items
 * which continuously fulfill the predicate.
 *
 * Examples:
 * ```typescript
 * chunksWithMatchingItems(
 *   [1, 2, 3, 4, 5],
 *   (item) => item % 2 === 0,
 * ) // [[2], [4]]
 *
 * chunksWithMatchingItems(
 *   [2, 4, 5, 7, 8, 9, 10, 12, 20],
 *   (item) => item % 2 === 0,
 * ) // [[2, 4], [8], [10, 12, 20]]
 * ```
 */
function chunksWithMatchingItems<Item>(
  list: Item[],
  predicate: (item: Item) => boolean,
): Item[][] {
  return list
    .reduce((chunks, item) => {
      if (predicate(item)) {
        const lastChunk = chunks.at(-1) ?? [];
        return [...chunks.slice(0, -1), [...lastChunk, item]];
      } else {
        return [...chunks, []];
      }
    }, [] as Item[][])
    .filter((chunk) => chunk.length > 0);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wähle Option in Lebensmonaten", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { LetzteLebensmonatszahl } = await import(
      "@/features/planer/domain/Lebensmonatszahl"
    );

    it("sets the Auswahloption for the correct Lebensmonat and Elternteil", () => {
      const lebensmonateVorher = {
        1: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(undefined),
        },
        2: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(undefined),
        },
      };

      const lebensmonate = waehleOption<Elternteil>(
        lebensmonateVorher,
        1,
        Elternteil.Zwei,
        Variante.Plus,
        ANY_UNGEPLANTER_LEBENSMONAT,
      );

      expectOption(lebensmonate, 1, Elternteil.Eins).toBeUndefined();
      expectOption(lebensmonate, 1, Elternteil.Zwei).toBe(Variante.Plus);
      expectOption(lebensmonate, 2, Elternteil.Eins).toBeUndefined();
      expectOption(lebensmonate, 2, Elternteil.Zwei).toBeUndefined();
    });

    it("can set the Auswahloption for a not yet initialized Lebensmonat", () => {
      const ungeplanterLebensmonat = {
        [Elternteil.Eins]: monat(undefined),
      };

      const lebensmonate = waehleOption<Elternteil.Eins>(
        {},
        1,
        Elternteil.Eins,
        Variante.Basis,
        ungeplanterLebensmonat,
      );

      expect(lebensmonate[1]).toBeDefined();
      expectOption(lebensmonate, 1, Elternteil.Eins).toBe(Variante.Basis);
    });

    it.each([1, 2, 5, 16] as const)(
      "choses also the following Lebensmonat if %d is the first Partnerschaftsbonus Lebensmonat",
      (lebensmonatszahl) => {
        const lebensmonate = waehleOption(
          {},
          lebensmonatszahl,
          Elternteil.Eins,
          Variante.Bonus,
          ANY_UNGEPLANTER_LEBENSMONAT,
        );

        const lebensmonat = lebensmonate[lebensmonatszahl];
        const nachfolgenderLebensmonat =
          lebensmonate[(lebensmonatszahl + 1) as Lebensmonatszahl];

        expect(lebensmonat?.[Elternteil.Eins].gewaehlteOption).toBe(
          Variante.Bonus,
        );
        expect(
          nachfolgenderLebensmonat?.[Elternteil.Eins].gewaehlteOption,
        ).toBe(Variante.Bonus);
      },
    );

    it("choses also the preceeding Lebensmonat if chosing Partnerschaftsbonus the first time in the last Lebensmonat", () => {
      const lebensmonate = waehleOption(
        {},
        LetzteLebensmonatszahl,
        Elternteil.Eins,
        Variante.Bonus,
        ANY_UNGEPLANTER_LEBENSMONAT,
      );

      const letzterLebensmonat = lebensmonate[LetzteLebensmonatszahl];
      const vorletzterLebensmonat =
        lebensmonate[(LetzteLebensmonatszahl - 1) as Lebensmonatszahl];

      expect(vorletzterLebensmonat?.[Elternteil.Eins].gewaehlteOption).toBe(
        Variante.Bonus,
      );
      expect(letzterLebensmonat?.[Elternteil.Eins].gewaehlteOption).toBe(
        Variante.Bonus,
      );
    });

    it("resets all three Lebensmonate if Partnerschaftsbonus two of three is unchosen", () => {
      const lebensmonateVorher = {
        5: LEBENSMONAT_MIT_BONUS,
        6: LEBENSMONAT_MIT_BONUS,
        7: LEBENSMONAT_MIT_BONUS,
      };

      const lebensmonate = waehleOption<Elternteil>(
        lebensmonateVorher,
        6,
        Elternteil.Eins,
        Variante.Plus,
        ANY_UNGEPLANTER_LEBENSMONAT,
      );

      expectOption(lebensmonate, 5, Elternteil.Eins).toBeUndefined();
      expectOption(lebensmonate, 5, Elternteil.Zwei).toBeUndefined();
      expectOption(lebensmonate, 6, Elternteil.Eins).toBe(Variante.Plus);
      expectOption(lebensmonate, 6, Elternteil.Zwei).toBeUndefined();
      expectOption(lebensmonate, 7, Elternteil.Eins).toBeUndefined();
      expectOption(lebensmonate, 7, Elternteil.Zwei).toBeUndefined();
    });

    it("resets the first and second Lebensmonat if Partnerschaftsbonus two of four is unchosen", () => {
      const lebensmonateVorher = {
        5: LEBENSMONAT_MIT_BONUS,
        6: LEBENSMONAT_MIT_BONUS,
        7: LEBENSMONAT_MIT_BONUS,
        8: LEBENSMONAT_MIT_BONUS,
      };

      const lebensmonate = waehleOption<Elternteil>(
        lebensmonateVorher,
        6,
        Elternteil.Eins,
        Variante.Plus,
        ANY_UNGEPLANTER_LEBENSMONAT,
      );

      expectOption(lebensmonate, 5, Elternteil.Eins).toBeUndefined();
      expectOption(lebensmonate, 5, Elternteil.Zwei).toBeUndefined();
      expectOption(lebensmonate, 6, Elternteil.Eins).toBe(Variante.Plus);
      expectOption(lebensmonate, 6, Elternteil.Zwei).toBeUndefined();
      expectOption(lebensmonate, 7, Elternteil.Eins).toBe(Variante.Bonus);
      expectOption(lebensmonate, 7, Elternteil.Zwei).toBe(Variante.Bonus);
      expectOption(lebensmonate, 8, Elternteil.Eins).toBe(Variante.Bonus);
      expectOption(lebensmonate, 8, Elternteil.Zwei).toBe(Variante.Bonus);
    });

    it("resets the third and fourth Lebensmonat if Partnerschaftsbonus three of four is unchosen", () => {
      const lebensmonateVorher = {
        5: LEBENSMONAT_MIT_BONUS,
        6: LEBENSMONAT_MIT_BONUS,
        7: LEBENSMONAT_MIT_BONUS,
        8: LEBENSMONAT_MIT_BONUS,
      };

      const lebensmonate = waehleOption<Elternteil>(
        lebensmonateVorher,
        7,
        Elternteil.Eins,
        Variante.Plus,
        ANY_UNGEPLANTER_LEBENSMONAT,
      );

      expectOption(lebensmonate, 5, Elternteil.Eins).toBe(Variante.Bonus);
      expectOption(lebensmonate, 5, Elternteil.Zwei).toBe(Variante.Bonus);
      expectOption(lebensmonate, 6, Elternteil.Eins).toBe(Variante.Bonus);
      expectOption(lebensmonate, 6, Elternteil.Zwei).toBe(Variante.Bonus);
      expectOption(lebensmonate, 7, Elternteil.Eins).toBe(Variante.Plus);
      expectOption(lebensmonate, 7, Elternteil.Zwei).toBeUndefined();
      expectOption(lebensmonate, 8, Elternteil.Eins).toBeUndefined();
      expectOption(lebensmonate, 8, Elternteil.Zwei).toBeUndefined();
    });

    function monat(gewaehlteOption?: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }

    const ANY_UNGEPLANTER_LEBENSMONAT = {
      [Elternteil.Eins]: monat(undefined),
      [Elternteil.Zwei]: monat(undefined),
    };

    const LEBENSMONAT_MIT_BONUS = {
      [Elternteil.Eins]: monat(Variante.Bonus),
      [Elternteil.Zwei]: monat(Variante.Bonus),
    };

    function expectOption<E extends Elternteil>(
      lebensmonate: Lebensmonate<E>,
      lebensmonatszahl: Lebensmonatszahl,
      elternteil: E,
    ) {
      return expect(
        lebensmonate[lebensmonatszahl]?.[elternteil].gewaehlteOption,
      );
    }
  });
}
