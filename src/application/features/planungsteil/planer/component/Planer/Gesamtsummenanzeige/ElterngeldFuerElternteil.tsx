import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import classNames from "classnames";
import type { ReactNode } from "react";
import { Geldbetrag } from "@/application/features/components";
import type { SummeFuerElternteil } from "@/monatsplaner";

type Props = {
  readonly name: string | undefined;
  readonly summe: SummeFuerElternteil;
  readonly showSumme: boolean;
  readonly className?: string;
};

export function ElterngeldFuerElternteil({
  name,
  summe,
  showSumme,
  className,
}: Props): ReactNode {
  const { anzahlMonateMitBezug, elterngeldbezug } = summe;

  const formattedAnzahlMonateMitBezug = `${anzahlMonateMitBezug} Monat${anzahlMonateMitBezug == 1 ? "" : "e"}`;

  return (
    <div className={classNames("flex flex-col", className)}>
      <span className="font-bold">
        {name ? (
          <>
            <PersonIcon /> {name}{" "}
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
