import AccessTime from "@digitalservicebund/icons/AccessTime";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import type { ReactNode } from "react";
import { erstelleMonatsverteilung } from "./erstelleMonatsverteilung";
import { Beispiel } from "@/application/features/beispiele";
import { AuswahloptionPlakette } from "@/application/features/beispiele/component/Erklaerung/AuswahloptionPlakette";
import {
  Ausgangslage,
  listeElternteileFuerAusgangslageAuf,
  listeLebensmonateAuf,
} from "@/monatsplaner";

type Props = {
  readonly beispiel: Beispiel<Ausgangslage>;
  readonly className?: string;
};

export function Visualisierung({ beispiel, className }: Props): ReactNode {
  const ausgangslage = beispiel.plan.ausgangslage;

  const balken = listeElternteileFuerAusgangslageAuf(ausgangslage).map(
    (elternteil) => {
      const lebensmonate = listeLebensmonateAuf(beispiel.plan.lebensmonate);

      const {
        monatsverteilung,
        summe: summeGeplanteMonate,
        beschreibung: beschreibungMonatsverteilung,
      } = erstelleMonatsverteilung(lebensmonate, elternteil);

      const pseudonym = ausgangslage.pseudonymeDerElternteile?.[elternteil];
      const isEinElternteil = !pseudonym;

      return (
        <div key={elternteil}>
          <p className="pb-4 pt-16">
            {isEinElternteil ? (
              <AccessTime className="mr-4" />
            ) : (
              <PersonIcon className="mr-4" />
            )}
            {isEinElternteil ? "Summe" : pseudonym} {summeGeplanteMonate} Monate
          </p>
          <div
            className="flex h-[24px]"
            role="img"
            aria-label={beschreibungMonatsverteilung}
          >
            {monatsverteilung.map(([key, count], index) => (
              <AuswahloptionPlakette
                key={`${key}-${index}`}
                auswahloption={key}
                className="text-sm flex items-center justify-center font-bold"
                style={{ flexGrow: count, flexBasis: 0, fontSize: 14 }}
              />
            ))}
          </div>
        </div>
      );
    },
  );

  return <div className={className}>{balken}</div>;
}
