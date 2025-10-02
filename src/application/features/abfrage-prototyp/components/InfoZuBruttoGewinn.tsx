import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

type Props = {
  readonly selbststaendig?: boolean;
};

export function InfoZuBruttoGewinn({ selbststaendig }: Props): ReactNode {
  return (
    <InfoText
      question="Wo finde ich diese Information?"
      answer={
        <>
          {selbststaendig ? (
            <>
              <p>
                Brutto heißt: alle Einnahmen im Jahr, ohne Abzüge. Dazu gehören
                alle Rechnungen, Honorare oder Verkäufe, die Kunden bezahlt
                haben. Kosten, zum Beispiel Material, Miete, Versicherungen,
                Steuern, werden hier nicht abgezogen.
              </p>
              <p className="pt-20">
                Bruttoeinnahmen finden sich in der Regel in der
                Einnahmen-Überschuss-Rechnung (EÜR). Dort bei den gesamten
                Betriebseinnahmen. Oder bei Bilanzen in der Gewinn- und
                Verlustrechnung bei den Umsatzerlösen.
              </p>
              <p className="pt-20">
                Im Einkommensteuerbescheid steht normalerweise nur der Gewinn,
                nicht die Brutto-Einnahmen.
              </p>
            </>
          ) : (
            <>
              <p>Auf Ihrer Gehaltsabrechnung:</p>
              <ul className="list-inside list-disc ml-10">
                <li>Oben oder in den ersten Zeilen steht das Bruttogehalt.</li>
              </ul>
              <p>In Ihrem Arbeitsvertrag:</p>
              <ul className="list-inside list-disc ml-10">
                <li>Dort steht, wie viel Sie jeden Monat brutto bekommen.</li>
              </ul>
              <p>Auf Ihrer Lohnsteuerbescheinigung (am Ende des Jahres):</p>
              <ul className="list-inside list-disc ml-10">
                <li>Dort steht das Jahresbruttogehalt.</li>
                <li>
                  Um den Monatswert zu wissen, können Sie diesen Betrag durch 12
                  teilen, wenn Sie jeden Monat gleich viel verdient haben.
                </li>
              </ul>
            </>
          )}
        </>
      }
    />
  );
}
