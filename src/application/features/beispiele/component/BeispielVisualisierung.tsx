import AccessTime from "@digitalservicebund/icons/AccessTime";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import type { ReactNode } from "react";
import { BeispielMonatsverteilung } from "./BeispielMonatsverteilung";
import { Beispiel } from "@/application/features/beispiele/hooks/erstelleBeispiele";
import {
  BeispielVariante,
  isBeispielVariante,
} from "@/application/features/beispiele/types";
import { Lebensmonatszahl } from "@/lebensmonatrechner/Lebensmonatszahl";
import {
  Ausgangslage,
  AusgangslageFuerEinElternteil,
  Elternteil,
  ElternteileByAusgangslage,
  KeinElterngeld,
  Lebensmonat,
  Lebensmonate,
  Variante,
  listeElternteileFuerAusgangslageAuf,
  listeLebensmonateAuf,
} from "@/monatsplaner";

type Props = {
  readonly beispiel: Beispiel<Ausgangslage>;
  readonly className?: string;
};

function keineAuswahlAlsKeinElterngeld(
  option: Variante | typeof KeinElterngeld | undefined,
): Variante | typeof KeinElterngeld {
  return option === undefined ? KeinElterngeld : option;
}

function errechneMonatsverteilung<E extends Elternteil>(
  lebensmonate: [Lebensmonatszahl, Lebensmonat<E>][],
  elternteil: E,
) {
  return lebensmonate
    .map(([_, lebensmonat]) => lebensmonat[elternteil].gewaehlteOption)
    .map((option) => keineAuswahlAlsKeinElterngeld(option))
    .filter((option) => isBeispielVariante(option))
    .reduce(
      (counts, key) => ((counts[key] = (counts[key] ?? 0) + 1), counts),
      {} as Partial<Record<BeispielVariante, number>>,
    );
}

function summiereMonatsverteilung(
  distribution: Partial<Record<BeispielVariante, number>>,
) {
  return (
    (distribution.Basiselterngeld ?? 0) + (distribution.ElterngeldPlus ?? 0)
  );
}

export function BeispielVisualisierung({
  beispiel,
  className,
}: Props): ReactNode {
  const ausgangslage = beispiel.plan.ausgangslage;

  const balken = listeElternteileFuerAusgangslageAuf(ausgangslage).map(
    (elternteil) => {
      const lebensmonate = listeLebensmonateAuf(beispiel.plan.lebensmonate);
      const monatsverteilung = errechneMonatsverteilung(
        lebensmonate,
        elternteil,
      );

      const pseudonym = ausgangslage.pseudonymeDerElternteile?.[elternteil];
      const summeGeplanteMonate = summiereMonatsverteilung(monatsverteilung);

      const isEinElternteil = !pseudonym;

      return (
        <div key={elternteil}>
          <p className="pb-4 pt-16">
            {isEinElternteil ? (
              <AccessTime className="mr-4" />
            ) : (
              <PersonIcon className="mr-4" />
            )}
            <span className="mr-4">
              {isEinElternteil ? "Summe" : pseudonym}
            </span>
            {summeGeplanteMonate} Monate
          </p>

          <BeispielMonatsverteilung monatsverteilung={monatsverteilung} />
        </div>
      );
    },
  );

  return <div className={className}>{balken}</div>;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  type LebensmonateEinElternteil = Lebensmonate<
    ElternteileByAusgangslage<AusgangslageFuerEinElternteil>
  >;

  describe("summiereMonatsverteilung", () => {
    it("calculates correctly even with missing variants", () => {
      const distribution: Partial<Record<BeispielVariante, number>> = {
        [Variante.Basis]: 5,
      };

      const summeGeplanteMonate = summiereMonatsverteilung(distribution);

      expect(summeGeplanteMonate).toEqual(5);
    });
  });

  describe("calculateDistribution", () => {
    it("maps undefined options to kein elterngeld", () => {
      const lebensmonate: LebensmonateEinElternteil = {
        1: {
          [Elternteil.Eins]: {
            gewaehlteOption: undefined,
            imMutterschutz: false,
          },
        },
      };

      const monatsverteilung = errechneMonatsverteilung(
        listeLebensmonateAuf(lebensmonate),
        Elternteil.Eins,
      );

      expect(monatsverteilung).toEqual({ "kein Elterngeld": 1 });
    });

    // The Beispiele never contains Bonus months in order to
    // generate Lebensmonate wich are valid right away and the
    // user has a good experience once moved on to the Planer
    it("removes bonus items from the distribution", () => {
      const lebensmonate: LebensmonateEinElternteil = {
        1: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            imMutterschutz: false,
          },
        },
        2: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Bonus,
            imMutterschutz: false,
          },
        },
      };

      const monatsverteilung = errechneMonatsverteilung(
        listeLebensmonateAuf(lebensmonate),
        Elternteil.Eins,
      );

      expect(monatsverteilung).toEqual({ Basiselterngeld: 1 });
    });

    it("counts distribution per option", () => {
      const lebensmonate: LebensmonateEinElternteil = {
        1: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            imMutterschutz: false,
          },
        },
        2: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            imMutterschutz: false,
          },
        },

        3: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Plus,
            imMutterschutz: false,
          },
        },
        4: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Plus,
            imMutterschutz: false,
          },
        },
        5: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Plus,
            imMutterschutz: false,
          },
        },
      };

      const monatsverteilung = errechneMonatsverteilung(
        listeLebensmonateAuf(lebensmonate),
        Elternteil.Eins,
      );

      expect(monatsverteilung).toEqual({
        Basiselterngeld: 2,
        ElterngeldPlus: 3,
      });
    });
  });
}
