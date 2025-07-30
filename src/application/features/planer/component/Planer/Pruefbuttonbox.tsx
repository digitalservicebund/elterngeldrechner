import CheckIcon from "@digitalservicebund/icons/Check";
import SaveAltIcon from "@digitalservicebund/icons/SaveAlt";
import classNames from "classnames";
import { type ReactNode, useCallback, useEffect, useId, useState } from "react";
import { Prueftippbox } from "./Prueftippbox";
import { Validierungsfehlerbox } from "./Validierungsfehlerbox";
import { Button } from "@/application/components/Button";
import {
  type PlanMitBeliebigenElternteilen,
  type Result,
  Variante,
  bestimmeVerfuegbaresKontingent,
  zaehleVerplantesKontingent,
} from "@/monatsplaner";
import type { SpecificationViolation } from "@/monatsplaner/common/specification";

type Props = {
  readonly className?: string;
  readonly plan: PlanMitBeliebigenElternteilen;
  readonly ueberpruefePlanung: () => Result<void, SpecificationViolation[]>;
  readonly planInAntragUebernehmen: () => void;
  readonly bonusFreischalten?: () => void;
  readonly onPlanungDrucken?: () => void;
};

export function Pruefbuttonbox({
  className,
  plan,
  ueberpruefePlanung,
  planInAntragUebernehmen,
  bonusFreischalten,
  onPlanungDrucken,
}: Props): ReactNode {
  const headingIdentifier = useId();
  const planungDrucken = () => {
    window.print();
    onPlanungDrucken?.();
  };

  const [validierungsergebnis, setValidierungsergebnis] = useState<Result<
    void,
    SpecificationViolation[]
  > | null>(null);

  const istPlanungUeberprueft = validierungsergebnis !== null;

  const istPlanungGueltig =
    validierungsergebnis?.mapOrElse(
      () => true,
      () => false,
    ) ?? false;

  const validierungsfehler: string[] =
    validierungsergebnis?.mapOrElse(
      () => [],
      (violations) => violations.map((violation) => violation.message),
    ) ?? [];

  const [tips, setTips] = useState<Tips>({
    normalTips: [],
    hasSpecialBonusTip: false,
  });

  const ueberpruefePlanungCallback = useCallback(() => {
    setValidierungsergebnis(ueberpruefePlanung());
    setTips(generateTips(plan));
  }, [ueberpruefePlanung, plan]);

  useEffect(() => {
    setValidierungsergebnis(null);
    setTips({ normalTips: [], hasSpecialBonusTip: false });
  }, [plan.lebensmonate]);

  return (
    <section
      className={classNames("flex flex-col items-center gap-16", className)}
      aria-labelledby={headingIdentifier}
    >
      <h4 id={headingIdentifier} className="sr-only">
        Prüfbuttonbox
      </h4>
      {!istPlanungUeberprueft ? (
        <Button type="button" onClick={ueberpruefePlanungCallback}>
          Planung überprüfen
        </Button>
      ) : istPlanungGueltig ? (
        <>
          <div className="flex w-full flex-col items-center gap-16 bg-Bonus-light p-40">
            <h5>
              <CheckIcon /> Super. Ihre Planung ist gültig.
            </h5>

            <Prueftippbox tips={tips} onBonusFreischalten={bonusFreischalten} />

            <span>
              Sie können Ihre Planung in den Antrag auf Elterngeld übernehmen
              oder herunterladen.
            </span>

            <Button
              type="button"
              onClick={planInAntragUebernehmen}
              className="my-10"
            >
              Planung in den Antrag übernehmen
            </Button>

            <div className="flex flex-wrap justify-center print:hidden">
              <Button type="button" buttonStyle="link" onClick={planungDrucken}>
                <SaveAltIcon className="mr-8" /> Drucken der Planung
              </Button>

              <p className="mt-8">
                Um Ihre Planung zu speichern, wählen Sie in der Druckvorschau
                „als PDF speichern“ aus.
              </p>
            </div>
          </div>
        </>
      ) : (
        <Validierungsfehlerbox validierungsfehler={validierungsfehler} />
      )}
    </section>
  );
}

function generateTips(plan: PlanMitBeliebigenElternteilen): Tips {
  const verfuegbaresKontingent = bestimmeVerfuegbaresKontingent(
    plan.ausgangslage,
  );
  const verplantesKontingent = zaehleVerplantesKontingent(plan.lebensmonate);

  const remainingBasis =
    verfuegbaresKontingent[Variante.Basis] -
    verplantesKontingent[Variante.Basis];
  const remainingPlus =
    verfuegbaresKontingent[Variante.Plus] - verplantesKontingent[Variante.Plus];
  const remainingBonus =
    verfuegbaresKontingent[Variante.Bonus] -
    verplantesKontingent[Variante.Bonus];

  const availableBonus = verfuegbaresKontingent[Variante.Bonus];

  const hasBasisLeft = remainingBasis > 0.5;
  const hasPlusLeft = remainingPlus > 0;
  const hasBonusLeft = remainingBonus > 0;

  if (hasBasisLeft || hasPlusLeft) {
    const tips = [];

    if (hasBasisLeft && hasPlusLeft) {
      tips.push(
        `Sie können noch ${remainingBasis === 1 ? "ein Monat" : `${remainingBasis} Monate`} Basiselterngeld oder noch ${remainingPlus === 1 ? "ein Monat" : `${remainingPlus} Monate`} ElterngeldPlus verteilen`,
      );
    } else {
      if (hasBasisLeft) {
        tips.push(
          `Sie können noch ${remainingBasis === 1 ? "ein Monat" : `${remainingBasis} Monate`} Basiselterngeld verteilen.`,
        );
      }

      if (hasPlusLeft) {
        tips.push(
          `Sie können noch ${remainingPlus === 1 ? "ein Monat" : `${remainingPlus} Monate`} ElterngeldPlus verteilen.`,
        );
      }
    }

    if (hasBonusLeft) {
      tips.push(
        `Jeder von Ihnen kann noch ${remainingBonus === 2 ? "ein Monat" : `${remainingBonus / 2} Monate`} Partnerschaftsbonus verteilen`,
      );
    }

    return { normalTips: tips, hasSpecialBonusTip: false };
  } else if (availableBonus > 0 && remainingBonus === availableBonus) {
    return { normalTips: [], hasSpecialBonusTip: true };
  } else if (remainingBonus > 0) {
    return {
      normalTips: [
        `Jeder von Ihnen kann noch ${remainingBonus === 2 ? "ein Monat" : `${remainingBonus / 2} Monate`} Partnerschaftsbonus verteilen`,
      ],
      hasSpecialBonusTip: false,
    };
  } else {
    return { normalTips: [], hasSpecialBonusTip: false };
  }
}

export type Tips = {
  normalTips: string[];
  hasSpecialBonusTip: boolean;
};
