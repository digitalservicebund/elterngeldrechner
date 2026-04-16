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
    <div className="mt-20">
      {taetigkeitenFlow === "Selbstaendig" ? (
        <p>
          Wir fragen nun nacheinander Ihre Tätigkeit oder Tätigkeiten ab für den
          Bemessungzeitraum{" "}
          <strong>Kalenderjahr {bemessungszeitraum[0]?.von.year}</strong>.
        </p>
      ) : (
        <>
          <p>
            Wir fragen nun nacheinander Ihre Tätigkeit oder Tätigkeiten ab für
            den <strong>Bemessungszeitraum</strong>:
          </p>
          <ul>
            {formatiereBemessungszeitraum(bemessungszeitraum).map(
              (zeitraum, index) => (
                <li key={index} className="list ml-32 list-disc font-bold">
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
