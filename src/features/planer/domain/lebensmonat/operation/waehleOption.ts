import { compose } from "@/features/planer/domain/common/compose";
import type { ElterngeldbezeugeProElternteil } from "@/features/planer/domain/Elterngeldbezuege";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Elternteil } from "@/features/planer/domain/Elternteil";
import {
  type Lebensmonat,
  AlleElternteileHabenBonusGewaehlt,
  setzeLebensmonatZurueck,
} from "@/features/planer/domain/lebensmonat";
import { waehleOption as waehleOptionInMonat } from "@/features/planer/domain/monat";
import { Variante } from "@/features/planer/domain/Variante";

export function waehleOption<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  elternteil: E,
  option: Auswahloption,
  elterngeldbezuege: ElterngeldbezeugeProElternteil<E>,
): Lebensmonat<E> {
  const parameters = { elternteil, option, elterngeldbezuege };
  const moechteBonusWaehlen = option === Variante.Bonus;
  const bonusIstAusgewaehlt =
    AlleElternteileHabenBonusGewaehlt.asPredicate(lebensmonat);
  const mussMonateDerAnderenElternteileZuruecksetzen =
    bonusIstAusgewaehlt && !moechteBonusWaehlen;

  if (moechteBonusWaehlen) {
    return waehleBonusFuerAlleElternteile(lebensmonat, parameters);
  } else if (mussMonateDerAnderenElternteileZuruecksetzen) {
    return setzeLebensmonatZurueckUndWaehleOption(lebensmonat, parameters);
  } else {
    return waehleOptionDirekt(parameters, undefined, lebensmonat);
  }
}

function waehleBonusFuerAlleElternteile<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  parameters: BindingParameters<E>,
): Lebensmonat<E> {
  const bonusParameters = { ...parameters, option: Variante.Bonus };
  const waehleBonus = (waehleOptionDirekt<E>).bind(null, bonusParameters);
  const elternteile = Object.keys(lebensmonat) as E[];
  return compose(
    ...elternteile.map((elternteil) => waehleBonus.bind(null, { elternteil })),
  )(lebensmonat);
}

function setzeLebensmonatZurueckUndWaehleOption<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  parameters: BindingParameters<E>,
): Lebensmonat<E> {
  const waehleOption = (waehleOptionDirekt<E>).bind(
    null,
    parameters,
    undefined,
  );

  return compose(setzeLebensmonatZurueck, waehleOption)(lebensmonat);
}

/**
 * Fulfills the purpose of choosing the option straight without any further
 * logic to do additional things (see main function).
 * Furthermore the signature of this function is written in a way that allows to
 * create bound/curried instances of this function that can be composed to
 * create more advanced behaviors.
 */
function waehleOptionDirekt<E extends Elternteil>(
  parameters: BindingParameters<E>,
  overrideParameters: Partial<BindingParameters<E>> | undefined,
  lebensmonat: Lebensmonat<E>,
): Lebensmonat<E> {
  const { elternteil, option, elterngeldbezuege } = {
    ...parameters,
    ...overrideParameters,
  };

  const monat = lebensmonat[elternteil];
  const elterngeldbezug = elterngeldbezuege[elternteil];
  const gewaehlterMonat = waehleOptionInMonat(monat, option, elterngeldbezug);
  return { ...lebensmonat, [elternteil]: gewaehlterMonat };
}

type BindingParameters<E extends Elternteil> = {
  elternteil: E;
  option: Auswahloption;
  elterngeldbezuege: ElterngeldbezeugeProElternteil<E>;
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wähle Option in Lebensmona", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");

    it("sets the gewählte Option of the correct Elternteil with matching Elterngeldbezug", () => {
      const lebensmonatVorher = {
        [Elternteil.Eins]: monat(undefined, undefined),
        [Elternteil.Zwei]: monat(undefined, undefined),
      };

      const elterngeldbezuege = {
        [Elternteil.Eins]: bezuege(11, 12, 13),
        [Elternteil.Zwei]: bezuege(21, 22, 23),
      };

      const lebensmonat = waehleOption<Elternteil>(
        lebensmonatVorher,
        Elternteil.Zwei,
        Variante.Plus,
        elterngeldbezuege,
      );

      expect(lebensmonat[Elternteil.Eins].gewaehlteOption).toBeUndefined();
      expect(lebensmonat[Elternteil.Eins].elterngeldbezug).toBeUndefined();
      expect(lebensmonat[Elternteil.Zwei].gewaehlteOption).toBe(Variante.Plus);
      expect(lebensmonat[Elternteil.Zwei].elterngeldbezug).toBe(22);
    });

    it("also chooses Partnerschaftsbonus for the other Elternteile automatically", () => {
      const lebensmonatVorher = {
        [Elternteil.Eins]: monat(Variante.Plus),
        [Elternteil.Zwei]: monat(Variante.Basis),
      };

      const lebensmonat = waehleOption<Elternteil>(
        lebensmonatVorher,
        Elternteil.Eins,
        Variante.Bonus,
        ANY_ELTERNGELDBEZUEGE,
      );

      expect(lebensmonat[Elternteil.Eins].gewaehlteOption).toBe(Variante.Bonus);
      expect(lebensmonat[Elternteil.Zwei].gewaehlteOption).toBe(Variante.Bonus);
    });

    it("also sets back the other Elternteil to no choice, if one Elternteil changes from Partnerschaftsbonus", () => {
      const lebensmonatVorher = {
        [Elternteil.Eins]: monat(Variante.Bonus),
        [Elternteil.Zwei]: monat(Variante.Bonus),
      };

      const lebensmonat = waehleOption<Elternteil>(
        lebensmonatVorher,
        Elternteil.Eins,
        Variante.Basis,
        ANY_ELTERNGELDBEZUEGE,
      );

      expect(lebensmonat[Elternteil.Eins].gewaehlteOption).toBe(Variante.Basis);
      expect(lebensmonat[Elternteil.Zwei].gewaehlteOption).toBeUndefined();
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

    const ANY_ELTERNGELDBEZUEGE = {
      [Elternteil.Eins]: bezuege(0, 0, 0),
      [Elternteil.Zwei]: bezuege(0, 0, 0),
    };
  });
}
