import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import classNames from "classnames";
import type { ReactNode } from "react";
import { Geldbetrag } from "@/application/components";
import type { SummeFuerElternteil } from "@/monatsplaner";

type Props = {
  readonly pseudonym: string | undefined;
  readonly summe: SummeFuerElternteil;
  readonly showSumme: boolean;
  readonly className?: string;
};

export function ElterngeldFuerElternteil({
  pseudonym,
  summe,
  showSumme,
  className,
}: Props): ReactNode {
  const { anzahlMonateMitBezug, elterngeldbezug } = summe;

  const formattedAnzahlMonateMitBezug = `${anzahlMonateMitBezug} Monat${anzahlMonateMitBezug == 1 ? "" : "e"}`;

  return (
    <div className={classNames("flex flex-col items-center", className)}>
      <span className="font-bold">
        {pseudonym ? (
          <>
            <PersonIcon /> {pseudonym}{" "}
          </>
        ) : (
          "Elterngeld"
        )}
      </span>

      {!!showSumme && (
        <span>
          <Geldbetrag betrag={elterngeldbezug} /> für{" "}
          {formattedAnzahlMonateMitBezug}
        </span>
      )}
    </div>
  );
}
