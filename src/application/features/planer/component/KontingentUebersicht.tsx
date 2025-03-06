import SquareIcon from "@digitalservicebund/icons/SquareRounded";
import classNames from "classnames";
import { ReactNode, useId, useMemo } from "react";
import {
  type PlanMitBeliebigenElternteilen,
  Variante,
  bestimmeVerfuegbaresKontingent,
  listeKontingentAuf,
  zaehleVerplantesKontingent,
} from "@/monatsplaner";

type Props = {
  readonly plan: PlanMitBeliebigenElternteilen;
  readonly className?: string;
};

export function KontingentUebersicht({ plan, className }: Props): ReactNode {
  const headingIdentifier = useId();

  const verfuegbaresKontingent = useMemo(
    () => bestimmeVerfuegbaresKontingent(plan.ausgangslage),
    [plan.ausgangslage],
  );

  const verplantesKontingent = useMemo(
    () => zaehleVerplantesKontingent(plan.lebensmonate),
    [plan.lebensmonate],
  );

  return (
    <section
      className={classNames(
        "flex flex-wrap justify-evenly gap-16 px-8",
        className,
      )}
      aria-labelledby={headingIdentifier}
    >
      <h4 id={headingIdentifier} className="sr-only">
        Kontingentübersicht
      </h4>

      {listeKontingentAuf(verfuegbaresKontingent, true)
        .filter(([, maximum]) => maximum > 0)
        .map(([option, maximum]) => {
          const nochVerfuegbar =
            maximum - Math.ceil(verplantesKontingent[option]);

          return (
            <div key={option} className="text-center">
              <SquareIcon className={COLOR_CLASS_NAME[option]} />{" "}
              <span className="font-bold">{option}</span>
              <br />
              {nochVerfuegbar} von {maximum} verfügbar
            </div>
          );
        })}
    </section>
  );
}

const COLOR_CLASS_NAME: Record<Variante, string> = {
  [Variante.Basis]: "text-Basis",
  [Variante.Plus]: "text-Plus",
  [Variante.Bonus]: "text-Bonus",
};
