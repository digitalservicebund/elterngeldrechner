import { ReactNode, useId } from "react";
import classNames from "classnames";
import { ElterngeldFuerElternteil } from "./ElterngeldFuerElternteil";
import { Geldbetrag } from "@/features/planer/user-interface/component/Geldbetrag";
import { EinkommenFuerElternteil } from "@/features/planer/user-interface/component/gesamtsummenanzeige/EinkommenFuerElternteil";
import {
  listeElternteileFuerAusgangslageAuf,
  type Ausgangslage,
  type ElternteileByAusgangslage,
  type Gesamtsumme,
} from "@/features/planer/domain";

type Props<A extends Ausgangslage> = {
  readonly gesamtsumme: Gesamtsumme<ElternteileByAusgangslage<A>>;
  readonly ausgangslage: A;
  readonly className?: string;
};

export function Gesamtsummenanzeige<A extends Ausgangslage>({
  gesamtsumme,
  ausgangslage,
  className,
}: Props<A>): ReactNode {
  const headingIdentifier = useId();
  const hasMultipleElternteile = ausgangslage.anzahlElternteile > 1;
  const jemandHatEinkommen = listeElternteileFuerAusgangslageAuf(ausgangslage)
    .map((elternteil) => gesamtsumme.proElternteil[elternteil].bruttoeinkommen)
    .reduce((sum, bruttoeinkommen) => sum + (bruttoeinkommen ?? 0), 0);

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

      {listeElternteileFuerAusgangslageAuf(ausgangslage).map((elternteil) => (
        <ElterngeldFuerElternteil
          className="basis-[40ch]"
          key={elternteil}
          pseudonym={ausgangslage.pseudonymeDerElternteile?.[elternteil]}
          summe={gesamtsumme.proElternteil[elternteil]}
        />
      ))}

      {!!hasMultipleElternteile && (
        <span className="basis-full font-bold">
          Gesamtsumme Elterngeld:{" "}
          <Geldbetrag betrag={gesamtsumme.elterngeldbezug} />
        </span>
      )}

      {!!jemandHatEinkommen &&
        listeElternteileFuerAusgangslageAuf(ausgangslage).map((elternteil) => (
          <EinkommenFuerElternteil
            className="basis-[40ch]"
            key={elternteil}
            pseudonym={ausgangslage.pseudonymeDerElternteile?.[elternteil]}
            summe={gesamtsumme.proElternteil[elternteil]}
          />
        ))}

      <span className="basis-full text-14">
        Hinweis: Mutterschaftsleistungen werden nicht in der Summe
        berücksichtigt.
      </span>
    </section>
  );
}
