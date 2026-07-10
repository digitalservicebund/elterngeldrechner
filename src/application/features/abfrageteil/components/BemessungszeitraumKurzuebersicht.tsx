import { formatiereBemessungszeitraum } from "@/application/features/abfrageteil/domain/formatiereBemessungszeitraum";
import { Zeitraum } from "@/bemessungszeitraumrechner";

type BemessungszeitraumKurzuebersichtProps = {
  readonly bemessungszeitraum: Zeitraum[];
  readonly taetigkeitenFlow: "Selbstaendig" | "Nicht-Selbstaendig";
};

export function BemessungszeitraumKurzuebersicht({
  bemessungszeitraum,
  taetigkeitenFlow,
}: BemessungszeitraumKurzuebersichtProps) {
  return (
    <div>
      {taetigkeitenFlow === "Selbstaendig" ? (
        <p className="font-bold">
          Bemessungzeitraum Kalenderjahr {bemessungszeitraum[0]?.von.year}
        </p>
      ) : (
        <>
          <p className="font-bold">Bemessungszeitraum:</p>
          <ul>
            {formatiereBemessungszeitraum(bemessungszeitraum).map(
              (zeitraum, index) => (
                <li key={index} className="font-bold">
                  {zeitraum}
                </li>
              ),
            )}
          </ul>
        </>
      )}
    </div>
  );
}
