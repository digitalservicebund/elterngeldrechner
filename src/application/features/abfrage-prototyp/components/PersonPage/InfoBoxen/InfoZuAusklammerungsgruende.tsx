import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuAusklammerungsgruende(): ReactNode {
  return (
    <InfoText
      question="Warum fragen wir das?"
      answer={
        <>
          <p>
            Wenn Sie hier etwas auswählen, kann für die Berechnung Ihres
            Elterngeldes ein anderer Monat genommen werden. Und zwar der Monat,
            in dem Sie mehr verdient haben.
          </p>
        </>
      }
    />
  );
}
