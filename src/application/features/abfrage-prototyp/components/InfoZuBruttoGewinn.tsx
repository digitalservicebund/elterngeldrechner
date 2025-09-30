import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuBruttoGewinn(): ReactNode {
  return (
    <InfoText
      question="Wo finde ich diese Information?"
      answer={
        <>
          <p>
            Brutto heißt: alle Einnahmen im Jahr, ohne Abzüge. Dazu gehören alle
            Rechnungen, Honorare oder Verkäufe, die Kunden bezahlt haben.
            Kosten, zum Beispiel Material, Miete, Versicherungen, Steuern,
            werden hier nicht abgezogen.
          </p>
          <p className="pt-20">
            Bruttoeinnahmen finden sich in der Regel in der
            Einnahmen-Überschuss-Rechnung (EÜR). Dort bei den gesamten
            Betriebseinnahmen. Oder bei Bilanzen in der Gewinn- und
            Verlustrechnung bei den Umsatzerlösen.
          </p>
          <p className="pt-20">
            Im Einkommensteuerbescheid steht normalerweise nur der Gewinn, nicht
            die Brutto-Einnahmen.
          </p>
        </>
      }
    />
  );
}
