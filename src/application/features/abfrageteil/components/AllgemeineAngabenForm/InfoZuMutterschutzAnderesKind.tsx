import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuMutterschutzAnderesKind(): ReactNode {
  return (
    <InfoText
      question="Was bedeutet Mutterschutz für ein älteres Kind?"
      answer={
        <>
          <p>
            Bei der Berechnung des Elterngelds, können auch die Monate des
            Mutterschutzes für ein älteres Kind aus dem Bemessungszeitraum
            herausgerechnet werden. Diesen Zeitraum können Sie aus der
            Bescheinigung Ihres Arbeitgebers oder Ihrer Krankenkasse ablesen.
          </p>
        </>
      }
    />
  );
}
