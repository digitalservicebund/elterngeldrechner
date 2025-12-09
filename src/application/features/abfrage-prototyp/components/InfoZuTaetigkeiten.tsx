import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuTaetigkeiten(): ReactNode {
  return (
    <InfoText
      question="Warum fragen wir das?"
      answer={
        <>
          <p>
            Ihre Angaben helfen uns, den Bemessungszeitraum für Ihr Elterngeld
            festzulegen. Der Bemessungszeitraum ist die Zeit vor der Geburt, in
            der Ihr Einkommen geprüft wird. Daraus wird die Höhe Ihres
            Elterngeldes berechnet.
          </p>
        </>
      }
    />
  );
}
