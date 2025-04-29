import { setzeGewaehlteOptionenZurueck } from "./setzeGewaehlteOptionenZurueck";
import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type { Elternteil } from "@/monatsplaner/Elternteil";
import {
  AlleElternteileHabenBonusGewaehlt,
  type Lebensmonat,
} from "@/monatsplaner/Lebensmonat";
import { waehleOption as waehleOptionInMonat } from "@/monatsplaner/Monat";
import { Variante } from "@/monatsplaner/Variante";
import { compose } from "@/monatsplaner/common/compose";

export function waehleOption<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  elternteil: E,
  option: Auswahloption | undefined,
): Lebensmonat<E> {
  const parameters = { elternteil, option };
  const moechteBonusWaehlen = option === Variante.Bonus;
  const bonusIstAusgewaehlt =
    AlleElternteileHabenBonusGewaehlt.asPredicate(lebensmonat);
  const mussMonateDerAnderenElternteileZuruecksetzen =
    bonusIstAusgewaehlt && !moechteBonusWaehlen;

  if (moechteBonusWaehlen) {
    return waehleBonusFuerAlleElternteile(lebensmonat, parameters);
  } else if (mussMonateDerAnderenElternteileZuruecksetzen) {
    return setzeGewaehlteOptionenZurueckUndWaehleOption(
      lebensmonat,
      parameters,
    );
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

function setzeGewaehlteOptionenZurueckUndWaehleOption<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  parameters: BindingParameters<E>,
): Lebensmonat<E> {
  const waehleOption = (waehleOptionDirekt<E>).bind(
    null,
    parameters,
    undefined,
  );

  return compose(setzeGewaehlteOptionenZurueck, waehleOption)(lebensmonat);
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
  const { elternteil, option } = { ...parameters, ...overrideParameters };

  const monat = lebensmonat[elternteil];
  const gewaehlterMonat = waehleOptionInMonat(monat, option);
  return { ...lebensmonat, [elternteil]: gewaehlterMonat };
}

type BindingParameters<E extends Elternteil> = {
  elternteil: E;
  option: Auswahloption | undefined;
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wähle Option in Lebensmonat", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");

    it("sets the gewählte Option of the correct Elternteil", () => {
      const lebensmonatVorher = {
        [Elternteil.Eins]: monat(undefined),
        [Elternteil.Zwei]: monat(undefined),
      };

      const lebensmonat = waehleOption<Elternteil>(
        lebensmonatVorher,
        Elternteil.Zwei,
        Variante.Plus,
      );

      expect(lebensmonat[Elternteil.Eins].gewaehlteOption).toBeUndefined();
      expect(lebensmonat[Elternteil.Zwei].gewaehlteOption).toBe(Variante.Plus);
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
      );

      expect(lebensmonat[Elternteil.Eins].gewaehlteOption).toBe(Variante.Basis);
      expect(lebensmonat[Elternteil.Zwei].gewaehlteOption).toBeUndefined();
    });

    it("allows to reset a chosen Option for one Elternteil", () => {
      const lebensmonatVorher = {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(Variante.Plus),
      };

      const lebensmonat = waehleOption<Elternteil>(
        lebensmonatVorher,
        Elternteil.Eins,
        undefined,
      );

      expect(lebensmonat[Elternteil.Eins].gewaehlteOption).toBeUndefined();
      expect(lebensmonat[Elternteil.Zwei].gewaehlteOption).toBe(Variante.Plus);
    });

    function monat(gewaehlteOption?: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }
  });
}
