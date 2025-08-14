import CloseIcon from "@digitalservicebund/icons/Close";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import classNames from "classnames";
import type { ReactNode } from "react";
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
  listeLebensmonateAuf,
} from "@/monatsplaner";
import { getRecordEntriesWithStringKeys } from "@/monatsplaner/common/type-safe-records";

type Props = {
  readonly beispiel: Beispiel<Ausgangslage>;
};

function renderDistribution(
  distribution: Partial<Record<BeispielVariante, number>>,
) {
  type VariantenConfiguration = { classnames: string; content: ReactNode };

  const variantenConfig: Record<BeispielVariante, VariantenConfiguration> = {
    Basiselterngeld: {
      classnames: "bg-Basis text-white",
      content: <p style={{ fontSize: "14px" }}>B</p>,
    },
    ElterngeldPlus: {
      classnames: "bg-Plus",
      content: <p style={{ fontSize: "14px" }}>P</p>,
    },
    [KeinElterngeld]: {
      classnames: "bg-gray-400 border-solid border-2 border-grey",
      content: <CloseIcon fontSize={14} />,
    },
  };

  const classnames = "flex items-center justify-center text-sm font-bold";

  const records = getRecordEntriesWithStringKeys(
    distribution,
    isBeispielVariante,
  );

  return (
    <div className="flex h-[24px]">
      {records.map(([key, count]) => (
        <div
          key={key}
          className={classNames(classnames, variantenConfig[key].classnames)}
          style={{ flexGrow: count, flexBasis: 0 }}
        >
          {variantenConfig[key].content}
        </div>
      ))}
    </div>
  );
}

function keineAuswahlAlsKeinElterngeld(
  option: Variante | typeof KeinElterngeld | undefined,
): Variante | typeof KeinElterngeld {
  return option === undefined ? KeinElterngeld : option;
}

function calculateDistribution<E extends Elternteil>(
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

function calculateDistributionSum(
  distribution: Partial<Record<BeispielVariante, number>>,
) {
  return (
    (distribution.Basiselterngeld ?? 0) + (distribution.ElterngeldPlus ?? 0)
  );
}

export function BeispielVisualisierung({ beispiel }: Props): ReactNode {
  const lebensmonate = listeLebensmonateAuf(beispiel.plan.lebensmonate);
  if (beispiel.plan.ausgangslage.anzahlElternteile == 1) {
    const distribution = calculateDistribution(lebensmonate, Elternteil.Eins);

    return <div>{renderDistribution(distribution)}</div>;
  } else {
    const ausgangslage = beispiel.plan.ausgangslage;

    const distributionLeft = calculateDistribution(
      lebensmonate,
      Elternteil.Eins,
    );
    const distributionRight = calculateDistribution(
      lebensmonate,
      Elternteil.Zwei,
    );

    const nameLeft = ausgangslage.pseudonymeDerElternteile[Elternteil.Eins];
    const nameRight = ausgangslage.pseudonymeDerElternteile[Elternteil.Zwei];

    const sumLeft = calculateDistributionSum(distributionLeft);
    const sumRight = calculateDistributionSum(distributionRight);

    return (
      <div>
        <p>
          <PersonIcon className="mr-4" />
          {nameLeft} {sumLeft} Monate
        </p>

        <div>{renderDistribution(distributionLeft)}</div>

        <p>
          <PersonIcon className="mr-4" />
          {nameRight} {sumRight} Monate
        </p>

        <div>{renderDistribution(distributionRight)}</div>
      </div>
    );
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  type LebensmonateEinElternteil = Lebensmonate<
    ElternteileByAusgangslage<AusgangslageFuerEinElternteil>
  >;

  describe("calculateDistributionSum", () => {
    it("calculates correctly even with missing variants", () => {
      const distribution: Partial<Record<BeispielVariante, number>> = {
        [Variante.Basis]: 5,
      };

      const distributionSum = calculateDistributionSum(distribution);

      expect(distributionSum).toEqual(5);
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

      const distribution = calculateDistribution(
        listeLebensmonateAuf(lebensmonate),
        Elternteil.Eins,
      );

      expect(distribution).toEqual({ "kein Elterngeld": 1 });
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

      const distribution = calculateDistribution(
        listeLebensmonateAuf(lebensmonate),
        Elternteil.Eins,
      );

      expect(distribution).toEqual({ Basiselterngeld: 1 });
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

      const distribution = calculateDistribution(
        listeLebensmonateAuf(lebensmonate),
        Elternteil.Eins,
      );

      expect(distribution).toEqual({ Basiselterngeld: 2, ElterngeldPlus: 3 });
    });
  });
}
