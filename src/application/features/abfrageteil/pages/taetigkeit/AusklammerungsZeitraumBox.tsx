import { mappeAusklammerungGrund } from "@/application/features/abfrageteil/domain/mappeAusklammerungGrund";
import { Ausklammerung } from "@/bemessungszeitraumrechner";

type AusklammerungsZeitraumBoxProps = {
  readonly ausklammerungen: Ausklammerung[];
};

export function AusklammerungsZeitraumBox({
  ausklammerungen,
}: AusklammerungsZeitraumBoxProps) {
  return (
    <div>
      {ausklammerungen.length > 0 && (
        <div className="rounded-b border border-dashed border-grey p-20 pt-0">
          <p className="font-bold">
            {ausklammerungen.length > 1
              ? "Übersprungene Zeiträume"
              : "Übersprungener Zeitraum"}
            :
          </p>
          <ul>
            {ausklammerungen.map((ausklammerung, index) => (
              <li key={`${ausklammerung.von.toString()}-${index}`}>
                {mappeAusklammerungGrund(ausklammerung.grund)}{" "}
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
