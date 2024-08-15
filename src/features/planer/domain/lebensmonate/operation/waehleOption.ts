import { compose } from "@/features/planer/domain/common/compose";
import type { Elterngeldbezuege } from "@/features/planer/domain/Elterngeldbezuege";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Elternteil } from "@/features/planer/domain/Elternteil";
import {
  Lebensmonatszahl,
  LetzteLebensmonatszahl,
} from "@/features/planer/domain/Lebensmonatszahl";
import {
  type Lebensmonate,
  zaehleVerplantesKontingent,
} from "@/features/planer/domain/lebensmonate";
import {
  waehleOption as waehleOptionInLebensmonat,
  type Lebensmonat,
} from "@/features/planer/domain/lebensmonat";
import { Variante } from "@/features/planer/domain/Variante";

export function waehleOption<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: E,
  option: Auswahloption,
  elterngeldbezuege: Elterngeldbezuege<E>,
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
    elterngeldbezuege,
    ungeplanterLebensmonat,
  };

  if (moechteBonusWaehlen && nochKeinBonusWurdeGewaehlt) {
    return waehleZweiLebensmonateBonus(lebensmonate, parameters);
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
  const {
    lebensmonatszahl,
    elternteil,
    option,
    elterngeldbezuege,
    ungeplanterLebensmonat,
  } = { ...parameters, ...overrideParameters };

  const lebensmonat = lebensmonate[lebensmonatszahl] ?? ungeplanterLebensmonat;
  const gewaehlterLebensmonat = waehleOptionInLebensmonat(
    lebensmonat,
    elternteil,
    option,
    elterngeldbezuege[lebensmonatszahl],
  );
  return { ...lebensmonate, [lebensmonatszahl]: gewaehlterLebensmonat };
}

type BindingParameters<E extends Elternteil> = {
  lebensmonatszahl: Lebensmonatszahl;
  elternteil: E;
  option: Auswahloption;
  elterngeldbezuege: Elterngeldbezuege<E>;
  ungeplanterLebensmonat: Lebensmonat<E>;
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wähle Option in Lebensmonaten", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { Lebensmonatszahlen, LetzteLebensmonatszahl } = await import(
      "@/features/planer/domain/Lebensmonatszahl"
    );

    it("sets the Auswahloption and Elterngeldbezug for the correct Lebensmonat and Elternteil", () => {
      const lebensmonateVorher = {
        1: {
          [Elternteil.Eins]: monat(undefined, undefined),
          [Elternteil.Zwei]: monat(undefined, undefined),
        },
        2: {
          [Elternteil.Eins]: monat(undefined, undefined),
          [Elternteil.Zwei]: monat(undefined, undefined),
        },
      };

      const elterngeldbezuege = {
        ...ANY_ELTERNGELDBEZUEGE,
        1: {
          [Elternteil.Eins]: bezuege(111, 112, 113),
          [Elternteil.Zwei]: bezuege(121, 122, 123),
        },
        2: {
          [Elternteil.Eins]: bezuege(211, 212, 213),
          [Elternteil.Zwei]: bezuege(221, 222, 223),
        },
      };

      const lebensmonate = waehleOption<Elternteil>(
        lebensmonateVorher,
        1,
        Elternteil.Zwei,
        Variante.Plus,
        elterngeldbezuege,
        ANY_UNGEPLANTER_LEBENSMONAT,
      );

      expect(lebensmonate[1]![Elternteil.Eins].gewaehlteOption).toBeUndefined();
      expect(lebensmonate[1]![Elternteil.Eins].elterngeldbezug).toBeUndefined();
      expect(lebensmonate[1]![Elternteil.Zwei].gewaehlteOption).toBe(
        Variante.Plus,
      );
      expect(lebensmonate[1]![Elternteil.Zwei].elterngeldbezug).toBe(122);
      expect(lebensmonate[2]![Elternteil.Eins].gewaehlteOption).toBeUndefined();
      expect(lebensmonate[2]![Elternteil.Eins].elterngeldbezug).toBeUndefined();
      expect(lebensmonate[2]![Elternteil.Zwei].gewaehlteOption).toBeUndefined();
      expect(lebensmonate[2]![Elternteil.Zwei].elterngeldbezug).toBeUndefined();
    });

    it("can set the Auswahloption for a not yet initialized Lebensmonat", () => {
      const ungeplanterLebensmonat = {
        [Elternteil.Eins]: monat(undefined, undefined),
      };

      const lebensmonate = waehleOption<Elternteil.Eins>(
        {},
        1,
        Elternteil.Eins,
        Variante.Basis,
        ANY_ELTERNGELDBEZUEGE,
        ungeplanterLebensmonat,
      );

      expect(lebensmonate[1]).toBeDefined();
      expect(lebensmonate[1]?.[Elternteil.Eins].gewaehlteOption).toBe(
        Variante.Basis,
      );
      expect(lebensmonate[1]?.[Elternteil.Eins].elterngeldbezug).toBeDefined();
    });

    it.each([1, 2, 5, 16] as const)(
      "choses also the following Lebensmonat if %d is the first Partnerschaftsbonus Lebensmonat",
      (lebensmonatszahl) => {
        const lebensmonate = waehleOption(
          {},
          lebensmonatszahl,
          Elternteil.Eins,
          Variante.Bonus,
          ANY_ELTERNGELDBEZUEGE,
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
        ANY_ELTERNGELDBEZUEGE,
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

    const monat = function (
      gewaehlteOption?: Auswahloption,
      elterngeldbezug = undefined,
    ) {
      return {
        gewaehlteOption,
        elterngeldbezug,
        imMutterschutz: false as const,
      };
    };

    const bezuege = function (basis: number, plus: number, bonus: number) {
      return {
        [Variante.Basis]: basis,
        [Variante.Plus]: plus,
        [Variante.Bonus]: bonus,
      };
    };

    const ANY_UNGEPLANTER_LEBENSMONAT = {
      [Elternteil.Eins]: monat(undefined, undefined),
      [Elternteil.Zwei]: monat(undefined, undefined),
    };

    const ANY_ELTERNGELDBEZUEGE_PRO_ELTERNTEIL = {
      [Elternteil.Eins]: bezuege(0, 0, 0),
      [Elternteil.Zwei]: bezuege(0, 0, 0),
    };

    const ANY_ELTERNGELDBEZUEGE = Object.fromEntries(
      Lebensmonatszahlen.map((lebensmonatszahl) => [
        lebensmonatszahl,
        ANY_ELTERNGELDBEZUEGE_PRO_ELTERNTEIL,
      ]),
    ) as Elterngeldbezuege<Elternteil>;
  });
}
