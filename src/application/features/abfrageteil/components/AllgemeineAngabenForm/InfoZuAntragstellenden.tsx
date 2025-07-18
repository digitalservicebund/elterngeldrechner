import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuAntragstellenden(): ReactNode {
  return (
    <InfoText
      question="Warum fragen wir das?"
      answer={
        <p>
          Planen Sie Ihr Elterngeld möglichst gemeinsam, um mehr und länger
          Elterngeld zu bekommen. Aber manchmal möchte ein Elternteil kein
          Elterngeld bekommen, zum Beispiel weil das zweite Einkommen gebraucht
          wird.
        </p>
      }
    />
  );
}
