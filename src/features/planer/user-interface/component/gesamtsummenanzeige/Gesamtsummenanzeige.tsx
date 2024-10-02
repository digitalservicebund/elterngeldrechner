import { ReactNode, useId } from "react";
import classNames from "classnames";
import { SummenanzeigeFuerElternteil } from "./SummensanzeigeFuerElternteil";
import {
  Elternteil,
  type Gesamtsumme,
  type PseudonymeDerElternteile,
  listePseudonymeAuf,
} from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/formatAsCurrency";

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

  return (
    <section
      className={classNames(
        "flex flex-wrap justify-evenly gap-y-16 text-center",
        className,
      )}
      aria-labelledby={headingIdentifier}
    >
      <h4 id={headingIdentifier} className="sr-only">
        Gesamtsumme
      </h4>

      {listePseudonymeAuf(pseudonymeDerElternteile, true).map(
        ([elternteil, pseudonym]) => {
          const gesamtsummeFuerElternteil =
            gesamtsumme.summeProElternteil[elternteil];

          return (
            <SummenanzeigeFuerElternteil
              className="basis-[30ch]"
              key={elternteil}
              pseudonum={pseudonym}
              summe={gesamtsummeFuerElternteil}
            />
          );
        },
      )}

      {!!hasMultipleElternteile && (
        <span className="basis-full font-bold">
          Gesamtsumme der Planung: {formatAsCurrency(gesamtsumme.summe)}
        </span>
      )}

      <span className="basis-full text-14">
        Hinweis: Mutterschaftsleistungen werden nicht in der Summe
        berücksichtigt
      </span>
    </section>
  );
}
