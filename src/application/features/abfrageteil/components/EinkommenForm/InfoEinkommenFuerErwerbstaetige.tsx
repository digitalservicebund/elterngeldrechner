import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoEinkommenFuerErwerbstaetige(): ReactNode {
  return (
    <InfoText
      question="Welches Einkommen zählt für das Elterngeld?"
      answer={
        <>
          <p>
            Als Einkommen werden alle Einkünfte aus Ihrer nicht-selbständigen
            Tätigkeit im Bemessungszeitraum berücksichtigt.
          </p>

          <p>Nicht berücksichtigt werden:</p>

          <ul className="list-inside list-disc">
            <li>sonstige Bezüge, z.B. Abfindungen</li>
            <li>Leistungsprämien</li>
            <li>Provisionen</li>
            <li>13. Monatsgehälter</li>
            <li>
              Steuerfreie Einnahmen werden ebenfalls nicht berücksichtigt, zum
              Beispiel: Trinkgelder, steuerfreie Zuschläge, Krankengeld,
              Kurzarbeitergeld, ALG II
            </li>
          </ul>
        </>
      }
    />
  );
}
