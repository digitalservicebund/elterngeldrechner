import { ReactNode, useId } from "react";
import SquareIcon from "@digitalservicebund/icons/SquareRounded";
import classNames from "classnames";
import {
  listeKontingentAuf,
  Variante,
  type VerfuegbaresKontingent,
  type VerplantesKontingent,
} from "@/features/planer/user-interface/service";

type Props = {
  readonly verfuegbaresKontingent: VerfuegbaresKontingent;
  readonly verplantesKontingent: VerplantesKontingent;
  readonly className?: string;
};

export function KontingentUebersicht({
  verfuegbaresKontingent,
  verplantesKontingent,
  className,
}: Props): ReactNode {
  const headingIdentifier = useId();

  return (
    <section
      className={classNames(
        "flex flex-wrap justify-evenly gap-16 px-8",
        className,
      )}
      aria-labelledby={headingIdentifier}
    >
      <h3 id={headingIdentifier} className="sr-only">
        Kontingentübersicht
      </h3>

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
