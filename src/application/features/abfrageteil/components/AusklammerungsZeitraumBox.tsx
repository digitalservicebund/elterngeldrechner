import { mappeAusklammerungGrund } from "@/application/features/abfrageteil/domain/mappeAusklammerungGrund";
import { Ausklammerung } from "@/bemessungszeitraumrechner";

type AusklammerungsZeitraumBoxProps = {
  readonly ausklammerungen: Ausklammerung[];
};

export function AusklammerungsZeitraumBox({
  ausklammerungen,
}: AusklammerungsZeitraumBoxProps) {
  return (
    <div className="mt-20">
      {ausklammerungen.length > 0 && (
        <div className="rounded-b border border-dashed border-grey p-20">
          <p className="font-bold">
            {ausklammerungen.length > 1
              ? "Übersprungene Zeiträume"
              : "Übersprungener Zeitraum"}
            :
          </p>
          <ul className="ml-32 mt-4 list-disc">
            {ausklammerungen.map((ausklammerung, index) => (
              <li
                key={`${ausklammerung.von.toString()}-${index}`}
                className="m-0"
              >
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
