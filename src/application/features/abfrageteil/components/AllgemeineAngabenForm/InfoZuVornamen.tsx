import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuVornamen(): ReactNode {
  return (
    <InfoText
      question="Warum soll ich einen Vornamen angeben?"
      answer={
        <p>
          Wir fragen nach Ihrem Vornamen, damit Sie bei der Planung einen guten
          Überblick haben. Er ist außerdem entscheidend für die korrekte
          Zuordnung Ihrer Daten, falls Sie sich entscheiden, diese direkt in den
          Antrag zu übertragen.
        </p>
      }
    />
  );
}
