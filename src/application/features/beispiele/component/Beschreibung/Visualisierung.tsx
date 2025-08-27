import AccessTime from "@digitalservicebund/icons/AccessTime";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import type { ReactNode } from "react";
import { Monatsverteilung } from "./Monatsverteilung";
import { Beispiel } from "@/application/features/beispiele/hooks/erstelleBeispiele";
import { getRecordEntriesWithStringKeys } from "@/application/utilities";
import { Lebensmonatszahl } from "@/lebensmonatrechner/Lebensmonatszahl";
import {
  Ausgangslage,
  AusgangslageFuerEinElternteil,
  Auswahloption,
  Elternteil,
  ElternteileByAusgangslage,
  KeinElterngeld,
  Lebensmonat,
  Lebensmonate,
  Variante,
  listeElternteileFuerAusgangslageAuf,
  listeLebensmonateAuf,
} from "@/monatsplaner";
import { isAuswahloption } from "@/monatsplaner/Auswahloption";

type Props = {
  readonly beispiel: Beispiel<Ausgangslage>;
  readonly className?: string;
};

export function Visualisierung({ beispiel, className }: Props): ReactNode {
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

          <Monatsverteilung monatsverteilung={monatsverteilung} />
        </div>
      );
    },
  );

  return <div className={className}>{balken}</div>;
}

function errechneMonatsverteilung<E extends Elternteil>(
  lebensmonate: [Lebensmonatszahl, Lebensmonat<E>][],
  elternteil: E,
) {
  return lebensmonate
    .map(([_, lebensmonat]) => lebensmonat[elternteil].gewaehlteOption)
    .map((option) => (option === undefined ? KeinElterngeld : option))
    .reduce(
      (counts, key) => ((counts[key] = (counts[key] ?? 0) + 1), counts),
      {} as Partial<Record<Auswahloption, number>>,
    );
}

function summiereMonatsverteilung(
  monatsverteilung: Partial<Record<Auswahloption, number>>,
) {
  return getRecordEntriesWithStringKeys(monatsverteilung, isAuswahloption)
    .filter(([variante, _]) => variante !== KeinElterngeld)
    .map(([_, anzahl]) => anzahl)
    .reduce((acc, curr) => acc + (curr ?? 0), 0);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  type LebensmonateEinElternteil = Lebensmonate<
    ElternteileByAusgangslage<AusgangslageFuerEinElternteil>
  >;

  describe("summiereMonatsverteilung", () => {
    it("ignoriert die option kein Elterngeld zur korrekten Summenbildung", () => {
      const monatsverteilung: Partial<Record<Auswahloption, number>> = {
        [Variante.Basis]: 5,
        [KeinElterngeld]: 2,
      };

      const summeGeplanteMonate = summiereMonatsverteilung(monatsverteilung);

      expect(summeGeplanteMonate).toEqual(5);
    });
  });

  describe("errechneMonatsverteilung", () => {
    it("ersetzt leere Monate mit kein Elterngeld fuer die Visualisierung", () => {
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

    it("errechnet die monatsverteilung nach option", () => {
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
