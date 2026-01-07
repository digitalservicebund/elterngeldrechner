import CheckIcon from "@digitalservicebund/icons/Check";
import SaveAltIcon from "@digitalservicebund/icons/SaveAlt";
import classNames from "classnames";
import {
  type ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";
import { Prueftippbox } from "./Prueftippbox";
import { Validierungsfehlerbox } from "./Validierungsfehlerbox";
import { type Tips, generateTips } from "./generateTips";
import { Button } from "@/application/components/Button";
import {
  type PlanMitBeliebigenElternteilen,
  type Result,
} from "@/monatsplaner";
import type { SpecificationViolation } from "@/monatsplaner/common/specification";

type Props = {
  readonly className?: string;
  readonly plan: PlanMitBeliebigenElternteilen;
  readonly ueberpruefePlanung: () => Result<void, SpecificationViolation[]>;
  readonly planInAntragUebernehmen: () => void;
  readonly bonusFreischalten?: (event: SyntheticEvent) => void;
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
          <div className="flex w-full flex-col items-center gap-16 bg-Bonus-light p-32">
            <h5>
              <CheckIcon /> Super. Ihre Planung ist gültig.
            </h5>

            <Prueftippbox
              tips={tips}
              alleinerziehend={plan.ausgangslage.istAlleinerziehend}
              onBonusFreischalten={bonusFreischalten}
            />

            <Button
              type="button"
              onClick={planInAntragUebernehmen}
              className="my-20"
            >
              Planung in den Papierantrag übernehmen
            </Button>

            <div className="flex flex-col text-center print:hidden">
              <Button type="button" buttonStyle="link" onClick={planungDrucken}>
                <SaveAltIcon className="mr-8" />
                Planung als PDF drucken oder speichern
              </Button>

              <p className="mt-8">Sie können Ihre Planung ausdrucken.</p>
              <p className="max-w-none">
                Um Ihre Planung zu speichern, wählen Sie in der Druckvorschau
                „Als PDF speichern“ aus.
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
