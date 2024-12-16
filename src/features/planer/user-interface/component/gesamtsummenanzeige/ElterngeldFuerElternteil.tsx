import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import type { ReactNode } from "react";
import classNames from "classnames";
import type { SummeFuerElternteil } from "@/features/planer/domain";
import { formatAsCurrency } from "@/utils/formatAsCurrency";

type Props = {
  readonly pseudonym: string | undefined;
  readonly summe: SummeFuerElternteil;
  readonly className?: string;
};

export function ElterngeldFuerElternteil({
  pseudonym,
  summe,
  className,
}: Props): ReactNode {
  const { anzahlMonateMitBezug, elterngeldbezug } = summe;

  const formattedAnzahlMonateMitBezug = `${anzahlMonateMitBezug} Monat${anzahlMonateMitBezug == 1 ? "" : "e"}`;

  const formattedElterngeldbezuege = formatAsCurrency(elterngeldbezug);

  return (
    <div className={classNames("flex flex-col items-center", className)}>
      <span className="font-bold">
        {!!pseudonym && (
          <>
            <PersonIcon /> {pseudonym}:{" "}
          </>
        )}
        Elterngeld
      </span>

      <span>
        {formattedElterngeldbezuege} für {formattedAnzahlMonateMitBezug}
      </span>
    </div>
  );
}
