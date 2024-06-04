import { ReactNode } from "react";
import { DetailsElterngeldvariante } from "./DetailsElterngeldvariante";
import { Example } from "./Example";
import { FurtherInformation } from "./FurtherInformation";
import { usePayoutAmounts } from "./usePayoutAmounts";
import { PayoutAmountsForParent, PayoutAmoutForVariant } from "./types";
import { Spinner } from "@/components/atoms";

export function ElterngeldvariantenDescriptions(): ReactNode {
  const payoutAmounts = usePayoutAmounts();

  if (payoutAmounts === undefined) {
    return <Spinner />;
  } else {
    return (
      <>
        <DetailsElterngeldvariante
          summaryTitle="Basiselterngeld - 100% Elterngeld"
          summaryClassName="bg-Basis text-white"
          monthsAvailable={14}
          payoutAmounts={pickAmountsOfVariant(payoutAmounts, "basiselterngeld")}
        >
          <ul className="mb-24 list-disc pl-24">
            <li>
              Als Basiselterngeld bekommen Sie normalerweise 65 Prozent des
              Nettoeinkommens, dass Sie vor der Geburt Ihres Kindes hatten und
              das nach der Geburt wegfällt
            </li>
            <li>
              Basiselterngeld beträgt mindestens 300 Euro und höchstens 1.800
              Euro monatlich
            </li>
          </ul>

          <div>
            <strong>Für Paare und getrennt Erziehende gilt:</strong>
          </div>

          <ul className="mb-24 list-disc pl-24">
            <li>
              Basiselterngeld können Sie für bis zu 12 Lebensmonate bekommen
            </li>
            <li>
              2 zusätzliche Monate sind möglich, wenn beide Elternteile
              Elterngeld beantragen und mindestens ein Elternteil nach der
              Geburt weniger Einkommen hat – in diesem Fall gibt es 14 Monate
              Basiselterngeld
            </li>
            <li>
              die Basiselterngeld-Monate können Sie untereinander aufteilen
            </li>
            <li>
              Sie können nur maximal einen Monat in den ersten 12 Lebensmonaten
              ihres Kindes gleichzeitig mit Ihrem Partner oder Ihrer Partnerin
              Basiselterngeld beziehen
            </li>
          </ul>

          <div>
            <strong>Für Alleinerziehende gilt:</strong>
          </div>

          <ul className="mb-24 list-disc pl-24">
            <li>14 Monate Basiselterngeld können beantragt werden</li>
          </ul>

          <div>
            <strong>Ausnahmen:</strong>
          </div>

          <p className="p-0">
            Basiselterngeld kann für mehr als einen Monat gleichzeitig bezogen
            werden, wenn einer der folgenden Sachverhalte auf Sie zutrifft:
          </p>

          <ul className="mb-32 list-disc pl-24">
            <li>
              Sie sind Eltern von besonders früh geborenen Kindern, die
              mindestens sechs Wochen vor dem errechneten Geburtstermin geboren
              wurden
            </li>
            <li>
              Sie sind Eltern von Zwillingen, Drillingen und weiteren Mehrlingen
            </li>
            <li>
              Sie haben ein neugeborenes Kind mit Behinderung oder ein
              Geschwisterkind mit Behinderung
            </li>
          </ul>

          <div>
            <strong>Beispiele für Paare und getrennt Erziehende:</strong>
          </div>

          <p className="mb-20 p-0">
            Elternteil 1 und Elternteil 2 beantragen jeweils 7 Monate
            Basiselterngeld. In den ersten 12 Monaten planen Sie einen Monat
            parallel.
          </p>

          <div className="mb-16">
            <Example title="Elternteil 1" months={[]} />
          </div>
          <div className="mb-32">
            <Example title="Elternteil 2" months={[]} />
          </div>

          <p className="mb-20 p-0">
            Elternteil 1 beantragt in den Lebensmonaten 1 bis 10
            Basiselterngeld. Elternteil 2 beantragt in den Lebensmonaten 11 bis
            14 Basiselterngeld. Damit haben die Eltern ihren Anspruch auf 14
            Monate Basiselterngeld ausgeschöpft.
          </p>

          <div className="mb-16">
            <Example title="Elternteil 1" months={[]} />
          </div>
          <div className="mb-32">
            <Example title="Elternteil 2" months={[]} />
          </div>

          <FurtherInformation />
        </DetailsElterngeldvariante>
        <DetailsElterngeldvariante
          summaryTitle="ElterngeldPlus - 50% Elterngeld"
          summaryClassName="bg-Plus text-black"
          monthsAvailable={28}
          payoutAmounts={pickAmountsOfVariant(payoutAmounts, "elterngeldplus")}
        >
          <ul className="mb-24 list-disc pl-24">
            <li>
              Statt eines Lebensmonats Basiselterngeld können Sie 2 Lebensmonate
              ElterngeldPlus bekommen – das heißt, halb so hoch wie
              Basiselterngeld, aber doppelter Zeitraum
            </li>
            <li>
              ElterngeldPlus kann auch nach dem 14. Lebensmonat bezogen werden,
              ab dann darf der Elterngeldbezug nicht mehr unterbrochen werden
            </li>
            <li>
              Besonders lohnend, wenn Eltern nach der Geburt in Teilzeit
              arbeiten
            </li>
          </ul>

          <div>
            <strong>Für Paare und getrennt Erziehende gilt:</strong>
          </div>

          <ul className="mb-24 list-disc pl-24">
            <li>
              Basiselterngeld und ElterngeldPlus können Sie miteinander
              kombinieren und abwechseln
            </li>
          </ul>

          <div>
            <strong>Für Alleinerziehende gilt:</strong>
          </div>

          <ul className="mb-32 list-disc pl-24">
            <li>28 Monate ElterngeldPlus können beantragt werden</li>
          </ul>

          <div>
            <strong>Beispiele für Paare und getrennt Erziehende:</strong>
          </div>

          <p className="mb-20 p-0">
            Elternteil 1 bekommt Basiselterngeld in den ersten 4 Lebensmonaten,
            Elternteil 2 in den Lebensmonaten 5 und 6. Beide Eltern bekommen
            ElterngeldPlus in den Lebensmonaten 7 bis 14. Damit haben die Eltern
            6 Monate Basiselterngeld und 16 Monate ElterngeldPlus (8 Monate
            ElterngeldPlus pro Elternteil) verbraucht; das entspricht 14 Monaten
            Basiselterngeld.
          </p>

          <div className="mb-16">
            <Example title="Elternteil 1" months={[]} />
          </div>
          <div className="mb-32">
            <Example title="Elternteil 2" months={[]} />
          </div>

          <p className="mb-20 p-0">
            Elternteil 1 bekommt Basiselterngeld in den Lebensmonaten 1 bis 6.
            Parallel bezieht der Elternteil 2 in Lebensmonat 1 Basiselterngeld
            und in den Lebensmonaten 2 und 3 ElterngeldPlus. In den
            Lebensmonaten 7 bis 10 beziehen beide Elternteile ElterngeldPlus.
            Elternteil 2 bekommt in den Lebensmonaten 11 und 12 ElterngeldPlus
            und in Lebensmonat 13 Basiselterngeld. Damit haben die Eltern ihren
            Anspruch auf 14 Monate Basiselterngeld ausgeschöpft.
          </p>

          <div className="mb-16">
            <Example title="Elternteil 1" months={[]} />
          </div>
          <div className="mb-32">
            <Example title="Elternteil 2" months={[]} />
          </div>

          <FurtherInformation />
        </DetailsElterngeldvariante>
        <DetailsElterngeldvariante
          summaryTitle="+ Partnerschaftsbonus"
          summaryClassName="bg-Bonus text-black"
          monthsAvailable={4}
          payoutAmounts={pickAmountsOfVariant(
            payoutAmounts,
            "partnerschaftsbonus",
          )}
        >
          <ul className="mb-24 list-disc pl-24">
            <li>
              Zusätzliche 2, 3 oder 4 Monate ElterngeldPlus – direkt aufeinander
              folgend
            </li>
            <li>
              Für den Partnerschaftsbonus muss man 24 bis 32 Stunden pro Woche
              in Teilzeit arbeiten
            </li>
          </ul>

          <div>
            <strong>Für Paare und getrennt Erziehende gilt:</strong>
          </div>

          <ul className="mb-24 list-disc pl-24">
            <li>
              Beide Elternteile nutzen den Partnerschaftsbonus gleichzeitig
            </li>
          </ul>

          <div>
            <strong>Für Alleinerziehende gilt:</strong>
          </div>

          <ul className="mb-32 list-disc pl-24">
            <li>Der Partnerschaftsbonus kann auch allein beantragt werden</li>
          </ul>

          <div>
            <strong>Beispiele für Paare und getrennt Erziehende:</strong>
          </div>

          <p className="mb-20 p-0">
            Das Elternteil 1 bezieht in den ersten 6 Lebensmonaten
            Basiselterngeld. Vom Lebensmonat 7 bis zum 10 bezieht der Elternteil
            2 Basiselterngeld. Die Elternteile beziehen parallel ElterngeldPlus
            in den Lebensmonaten 11 bis 14. In den Lebensmonaten 15 bis 18
            nutzen die Elternteile den Partnerschaftsbonus.
          </p>

          <div className="mb-16">
            <Example title="Elternteil 1" months={[]} />
          </div>
          <div className="mb-32">
            <Example title="Elternteil 2" months={[]} />
          </div>

          <div>
            <strong>Ein Beispiel für Alleinerziehende:</strong>
          </div>

          <p className="mb-20 p-0">
            Das alleinerziehende Elternteil bezieht in den ersten 8
            Lebensmonaten Basiselterngeld. Danach bezieht es für 2 Monate kein
            Elterngeld. Im Lebensmonat 11 bis 16 bezieht es ElterngeldPlus, vom
            Lebensmonat 17 bis 20 den Partnerschaftsbonus und vom Lebensmonat 21
            bis 26 nochmals ElterngeldPlus.
          </p>

          <div className="mb-32">
            <Example title="Elternteil" months={[]} />
          </div>

          <FurtherInformation />
        </DetailsElterngeldvariante>
      </>
    );
  }
}

function pickAmountsOfVariant(
  payoutAmounts: PayoutAmountsForParent[],
  variant: "basiselterngeld" | "elterngeldplus" | "partnerschaftsbonus",
): PayoutAmoutForVariant[] {
  return payoutAmounts.map((entry) => ({
    name: entry.name,
    amount: entry[variant],
  }));
}
