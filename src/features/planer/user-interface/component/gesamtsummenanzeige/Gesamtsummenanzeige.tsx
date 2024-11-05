import { ReactNode, useId } from "react";
import classNames from "classnames";
import { ElterngeldFuerElternteil } from "./ElterngeldFuerElternteil";
import {
  Elternteil,
  type Gesamtsumme,
  type PseudonymeDerElternteile,
  listePseudonymeAuf,
} from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/formatAsCurrency";
import { EinkommenFuerElternteil } from "@/features/planer/user-interface/component/gesamtsummenanzeige/EinkommenFuerElternteil";

type Props<E extends Elternteil> = {
  readonly pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
  readonly gesamtsumme: Gesamtsumme<E>;
  readonly className?: string;
};

export function Gesamtsummenanzeige<E extends Elternteil>({
  pseudonymeDerElternteile,
  gesamtsumme,
  className,
}: Props<E>): ReactNode {
  const headingIdentifier = useId();

  const hasMultipleElternteile =
    Object.keys(pseudonymeDerElternteile).length > 1;

  const gesamtsummeElterngeld = `Gesamtsumme Elterngeld: ${formatAsCurrency(gesamtsumme.elterngeldbezug)}`;
  const beideHabenEinkommen =
    (gesamtsumme.proElternteil[Elternteil.Eins as E]?.bruttoeinkommen ?? 0) +
      (gesamtsumme.proElternteil[Elternteil.Zwei as E]?.bruttoeinkommen ?? 0) >
    0;

  return (
    <section
      className={classNames(
        "flex flex-wrap justify-evenly gap-y-16 text-center",
        className,
      )}
      aria-labelledby={headingIdentifier}
    >
      <h3 id={headingIdentifier} className="sr-only">
        Gesamtsumme
      </h3>

      {listePseudonymeAuf(pseudonymeDerElternteile, true).map(
        ([elternteil, pseudonym]) => {
          const summeFuerElternteil = gesamtsumme.proElternteil[elternteil];

          return (
            <ElterngeldFuerElternteil
              className="basis-[40ch]"
              key={elternteil}
              pseudonum={pseudonym}
              summe={summeFuerElternteil}
            />
          );
        },
      )}

      {!!hasMultipleElternteile && (
        <span className="basis-full font-bold">{gesamtsummeElterngeld}</span>
      )}

      {beideHabenEinkommen
        ? listePseudonymeAuf(pseudonymeDerElternteile, true).map(
            ([elternteil, pseudonym]) => {
              const summeFuerElternteil = gesamtsumme.proElternteil[elternteil];

              return (
                <EinkommenFuerElternteil
                  className="basis-[40ch]"
                  key={elternteil}
                  pseudonum={pseudonym}
                  summe={summeFuerElternteil}
                />
              );
            },
          )
        : null}

      <span className="basis-full text-14">
        Hinweis: Mutterschaftsleistungen werden nicht in der Summe
        berücksichtigt.
        <br />
        Sie bekommen Elterngeld in der Höhe, die angegeben ist, ohne dass etwas
        abgezogen wird. Auf das angezeigte Einkommen müssen noch Steuern
        entrichtet werden.
      </span>
    </section>
  );
}
