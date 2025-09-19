import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuTaetigkeiten(): ReactNode {
  return (
    <InfoText
      question="Was sind weitere Tätigkeiten?"
      answer={
        <>
          <p>
            Während des Mutterschutzes erhalten Sie Mutterschaftsleistungen, zum
            Beispiel:
          </p>
          <ul className="list-inside list-disc ml-10">
            <li>das Mutterschaftsgeld der gesetzlichen Krankenkassen</li>
            <li>den Arbeitgeber-Zuschuss zum Mutterschaftsgeld</li>
            <li>die Bezüge für Beamtinnen während des Mutterschutzes</li>
          </ul>
          <p>
            Diese werden – wenn ein Anspruch darauf besteht – normalerweise in
            den ersten acht Wochen nach der Geburt gezahlt.
          </p>
        </>
      }
    />
  );
}
