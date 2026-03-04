import { formatiereBemessungszeitraum } from "@/application/features/abfrageteil-next/domain/formatiereBemessungszeitraum";
import { Ausklammerung, Zeitraum } from "@/bemessungszeitraumrechner";

type BemessungszeitraumBoxProps = {
  readonly bemessungszeitraum: Zeitraum[];
  readonly ausklammerungen: Ausklammerung[];
  readonly taetigkeitenFlow: "Selbstaendig" | "Nicht-Selbstaendig";
};

export function BemessungszeitraumBox({
  bemessungszeitraum,
  ausklammerungen,
  taetigkeitenFlow,
}: BemessungszeitraumBoxProps) {
  const bemessungszeitraumUeberschrift = () => {
    if (taetigkeitenFlow === "Selbstaendig") {
      return `Kalenderjahr ${bemessungszeitraum[0]?.von.year}`;
    }
    return formatiereBemessungszeitraum(bemessungszeitraum);
  };

  const ausklammerungGrund = (grund: string) => {
    const texte: Record<string, string> = {
      mutterschutz: "Mutterschutz für dieses Kind",
      mutterschutzGeschwisterkind: "Mutterschutz für ein älteres Kind",
      elterngeldGeschwisterkind: "Elterngeld für ein älteres Kind",
      erkrankungSchwangerschaft: "Krankheit wegen der Schwangerschaft",
    };

    return texte[grund] || grund;
  };

  return (
    <div className="mt-20">
      {bemessungszeitraum.length > 0 && (
        <div className="rounded bg-grey-light py-10">
          <span className="text-18 px-20 font-bold">
            Bemessungszeitraum: {bemessungszeitraumUeberschrift()}
          </span>
        </div>
      )}

      {ausklammerungen.length > 0 && (
        <div
          className={`rounded-b border-x border-b border-dashed border-grey p-20 ${bemessungszeitraum.length > 0 ? "border-t-0" : "border-t"}`}
        >
          <h5 className="font-semibold text-14">
            {ausklammerungen.length > 1
              ? "Übersprungene Zeiträume"
              : "Übersprungener Zeitraum"}
            :
          </h5>
          <ul className="ml-32 mt-4 list-disc text-14">
            {ausklammerungen.map((ausklammerung, index) => (
              <li
                key={`${ausklammerung.von.toString()}-${index}`}
                className="m-0"
              >
                <span className="font-medium">
                  {ausklammerungGrund(ausklammerung.grund)}
                </span>{" "}
                {ausklammerung.von.toLocaleString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                bis{" "}
                {ausklammerung.bis.toLocaleString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
