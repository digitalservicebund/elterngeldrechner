import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import classNames from "classnames";
import type { ReactNode } from "react";
import type { SummeFuerElternteil } from "./berechneGesamtsumme";
import { Geldbetrag } from "@/features/planer/user-interface/component/Geldbetrag";

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
        <Geldbetrag betrag={elterngeldbezug} /> für{" "}
        {formattedAnzahlMonateMitBezug}
      </span>
    </div>
  );
}
