import type { ReactNode } from "react";
import { InfoText } from "@/application/features/components";
import { MinijobGrenzeErklaerung } from "./MinijobGrenzeErklaerung";

type Props = {
  readonly question: string;
  readonly finalParagraphAddition?: string;
};

export function InfoTextMinijobEinkommen({
  question,
  finalParagraphAddition,
}: Props): ReactNode {
  return (
    <InfoText
      question={question}
      answer={
        <>
          <p>
            Für einen Minijob erhalten Sie eine eigene Abrechnung von Ihrem
            Arbeitgeber. Sie finden den Betrag auf dieser Gehaltsabrechnung
            (meist als „Brutto-Bezug“ oder „Gesamtbrutto“ bezeichnet).
          </p>
          <p>
            <strong>Gut zu wissen: </strong>Beim Minijob fallen meist keine
            Steuern und Sozialabgaben an. Deshalb wird dieses Einkommen beim
            Elterngeld in der Regel in voller Höhe berücksichtigt.
          </p>
          <MinijobGrenzeErklaerung />
          <p className="font-bold">
            Wichtig – Sonderzahlungen zählen nicht mit.
          </p>
          <p>
            Für die Berechnung des Elterngeldes werden keine Einmalzahlungen{" "}
            berücksichtigt. Bitte lassen Sie folgende Zahlungen außer Acht, zum
            Beispiel:
          </p>
          <ul>
            <li>
              Weihnachtsgeld, Urlaubsgeld oder ein 13. oder 14. Monatsgehalt
            </li>
            <li>Einmalige Boni, Provisionen, Tantiemen oder Abfindungen</li>
          </ul>
          <p>
            <span>{finalParagraphAddition} </span>Tragen Sie nur das feste,
            monatliche Gehalt ein.
          </p>
        </>
      }
    />
  );
}
