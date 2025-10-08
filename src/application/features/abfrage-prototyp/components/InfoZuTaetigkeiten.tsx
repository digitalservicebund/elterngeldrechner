import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuTaetigkeiten(): ReactNode {
  return (
    <InfoText
      question="Was sind weitere Tätigkeiten?"
      answer={
        <>
          <p>
            Geben Sie hier an, ob Sie im Bemessungszeitraum mehr als einen Job
            oder eine zusätzliche Tätigkeit hatten – zum Beispiel eine
            Nebentätigkeit oder einen Minijob.
          </p>
          <p>
            Diese Informationen helfen dabei, Ihr Einkommen vollständig zu
            erfassen und das Elterngeld richtig zu berechnen.
          </p>
        </>
      }
    />
  );
}
