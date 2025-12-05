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
                Für Selbstständige ist der Brutto-Gewinn der Betrag, der übrig
                bleibt, wenn Sie von Ihren gesamten Einnahmen alle Kosten und
                Ausgaben (Betriebsausgaben) abgezogen haben.
              </p>
              <ul className="ml-10 list-inside list-disc">
                <li>Es ist nicht Ihr gesamter Umsatz (alle Einnahmen).</li>
                <li>
                  Es ist Ihr tatsächlicher Gewinn, bevor Sie Ihre persönliche
                  Einkommensteuer dafür bezahlen. Im Steuerrecht spricht man vom
                  steuerpflichtigen Gewinn.
                </li>
                <li>
                  Einkünfte aus Vermietung und Verpachtung oder aus
                  Kapitalvermögen werden zwar im Steuerbescheid berücksichtigt,
                  sind aber für die Berechnung des Elterngeldes nicht relevant
                  und müssen von Ihnen rausgerechnet werden.
                </li>
              </ul>
              <p className="pt-20">
                Sie finden diese Angabe in Ihren Unterlagen zur Steuererklärung:
              </p>
              <ul className="ml-10 list-inside list-disc">
                <li>
                  Im Einkommensteuerbescheid: Der Betrag ist dort als
                  &quot;Gewinn aus selbstständiger Arbeit&quot; oder &quot;Summe
                  der positiven Einkünfte&quot; aufgeführt.
                </li>
                <li>
                  In der Einnahmen-Überschuss-Rechnung (EÜR): Es ist die
                  Endsumme Ihrer EÜR.
                </li>
              </ul>
              <p>
                Bitte tragen Sie hier den endgültigen Wert ein, der auch Ihrem
                Finanzamt gemeldet wurde.
              </p>
              <p className="pt-20">
                Wenn der aktuelle Einkommensteuerbescheid noch nicht vorliegt,
                geben Sie einen geschätzten Brutto-Gewinn an. Beachten Sie, dass
                das Ergebnis der Elterngeldberechnung dadurch abweichen kann.
              </p>
            </>
          ) : (
            <>
              <p>Auf Ihrer Gehaltsabrechnung:</p>
              <ul className="ml-10 list-inside list-disc">
                <li>Oben oder in den ersten Zeilen steht das Bruttogehalt.</li>
              </ul>
              <p>In Ihrem Arbeitsvertrag:</p>
              <ul className="ml-10 list-inside list-disc">
                <li>Dort steht, wie viel Sie jeden Monat brutto bekommen.</li>
              </ul>
              <p>Auf Ihrer Lohnsteuerbescheinigung (am Ende des Jahres):</p>
              <ul className="ml-10 list-inside list-disc">
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
