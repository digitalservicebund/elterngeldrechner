import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuMiniJobs(): ReactNode {
  return (
    <InfoText
      question="Was ist ein Minijob?"
      answer={
        <>
          <p>
            Ein Minijob ist eine Arbeit, bei der man höchstens 556 Euro im Monat
            verdient. Dafür muss man keine oder nur wenige Steuern und
            Sozialabgaben zahlen. Minijobs sind oft neben der Schule,
            Ausbildung, Studium oder Hauptarbeit.
          </p>
        </>
      }
    />
  );
}
