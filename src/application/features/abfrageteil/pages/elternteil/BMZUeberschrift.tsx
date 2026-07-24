import { Zeitraum } from "@/bemessungszeitraumrechner";
import { formatiereBemessungszeitraum } from "@/application/features/abfrageteil/domain/formatiereBemessungszeitraum";
import { ReactNode } from "react";

type BMZUeberschriftProps = {
  readonly taetigkeitenFlow: "Selbstaendig" | "Nicht-Selbstaendig";
  readonly vorname: string;
  readonly bemessungszeitraum: Zeitraum[];
  readonly anzahlBeruecksichtigteAusklammerungen: number;
};

export function BMZUeberschrift({
  taetigkeitenFlow,
  vorname,
  bemessungszeitraum,
  anzahlBeruecksichtigteAusklammerungen,
}: BMZUeberschriftProps): ReactNode {
  const anfangUeberschrift =
    anzahlBeruecksichtigteAusklammerungen > 0
      ? `Bemessungszeitraum von ${vorname}:`
      : "Ihr Bemessungszeitraum:";

  if (taetigkeitenFlow === "Selbstaendig") {
    return (
      <h3>
        {anfangUeberschrift} Kalenderjahr {bemessungszeitraum[0]?.von.year}
      </h3>
    );
  }

  const formatierterBemessungszeitraum =
    formatiereBemessungszeitraum(bemessungszeitraum);

  if (anzahlBeruecksichtigteAusklammerungen === 0) {
    return (
      <h3>
        {anfangUeberschrift} {formatierterBemessungszeitraum}
      </h3>
    );
  }

  return (
    <h3>
      <span>{anfangUeberschrift}</span>
      <ul>
        {formatierterBemessungszeitraum.map((zeitraum, index) => (
          <li key={index}>{zeitraum}</li>
        ))}
      </ul>
    </h3>
  );
}
