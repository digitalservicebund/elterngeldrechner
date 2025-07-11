import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuVornamen(): ReactNode {
  return (
    <InfoText
      question="Warum soll ich einen Vornamen angeben?"
      answer={
        <p>
          Wir fragen nach Ihrem Vornamen, damit Sie bei der Planung einen guten
          Überblick haben. Und falls Sie sich entscheiden, Ihre Daten in den
          Antrag zu übertragen, können wir Sie darin zuordnen.
        </p>
      }
    />
  );
}
