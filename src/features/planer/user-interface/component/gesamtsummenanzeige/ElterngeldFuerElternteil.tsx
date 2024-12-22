import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import type { ReactNode } from "react";
import classNames from "classnames";
import { Geldbetrag } from "@/features/planer/user-interface/component/Geldbetrag";
import type { SummeFuerElternteil } from "@/features/planer/domain";

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
