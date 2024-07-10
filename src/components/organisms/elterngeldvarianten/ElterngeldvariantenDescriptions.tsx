import { ReactNode } from "react";
import { DetailsElterngeldvariante } from "./DetailsElterngeldvariante";
import { Example } from "./Example";
import { FurtherInformation } from "./FurtherInformation";

export function ElterngeldvariantenDescriptions(): ReactNode {
  return (
    <>
      <DetailsElterngeldvariante
        summaryTitle="Basiselterngeld"
        summaryClassName="bg-Basis text-white"
      >
        <ul className="mb-24 list-disc pl-24">
          <li>
            Als Basiselterngeld bekommen Sie normalerweise 65 Prozent des
            Nettoeinkommens, dass Sie vor der Geburt Ihres Kindes hatten und das
            nach der Geburt wegfällt
          </li>
          <li>
            Basiselterngeld beträgt mindestens 300 Euro und höchstens 1.800 Euro
            monatlich
          </li>
        </ul>

        <h5 className="text-base">Für Paare und getrennt Erziehende gilt:</h5>

        <ul className="mb-24 list-disc pl-24">
          <li>
            die 14 Basiselterngeldmonate können Sie untereinander aufteilen
          </li>
          <li>
            Voraussetzung: mindestens einer von Ihnen hat in 2 Lebensmonaten
            nach der Geburt weniger Einkommen als davor
          </li>
          <li>
            zwei Einschränkungen gibt es:
            <ul className="list-disc pl-24">
              <li>
                Jeder Elternteil kann maximal 12 Monate Basiselterngeld bekommen
              </li>
              <li>
                Gleichzeitiger Bezug von Basiselterngeld mit Ihrem Partner oder
                Ihrer Partnerin ist nur maximal einen Monat in den ersten 12
                Lebensmonaten Ihres Kindes möglich
              </li>
            </ul>
          </li>
        </ul>

        <h5 className="text-base">Für Alleinerziehende gilt:</h5>

        <ul className="mb-24 list-disc pl-24">
          <li>14 Monate Basiselterngeld können beantragt werden</li>
        </ul>

        <h5 className="text-base">Ausnahmen:</h5>

        <p className="p-0">
          Basiselterngeld kann für mehr als einen Monat gleichzeitig bezogen
          werden, wenn einer der folgenden Sachverhalte auf Sie zutrifft:
        </p>

        <ul className="mb-32 list-disc pl-24">
          <li>
            Sie sind Eltern von besonders früh geborenen Kindern, die mindestens
            sechs Wochen vor dem errechneten Geburtstermin geboren wurden
          </li>
          <li>
            Sie sind Eltern von Zwillingen, Drillingen und weiteren Mehrlingen
          </li>
          <li>
            Sie haben ein neugeborenes Kind mit Behinderung oder ein
            Geschwisterkind mit Behinderung
          </li>
        </ul>

        <h5 className="text-base">
          Beispiele für Paare und getrennt Erziehende:
        </h5>

        <p className="mb-20 p-0">
          Elternteil 1 beantragt in den Lebensmonaten 1 bis 7 Basiselterngeld
          und Elternteil 2 in den Lebensmonaten 7 bis 13. Im Lebensmonat 7
          planen Sie einen Monat parallel.
        </p>

        <div className="mb-16">
          <Example
            title="Elternteil 1"
            months={[
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ]}
          />
        </div>
        <div className="mb-32">
          <Example
            title="Elternteil 2"
            months={[
              null,
              null,
              null,
              null,
              null,
              null,
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              null,
            ]}
          />
        </div>

        <p className="mb-20 p-0">
          Elternteil 1 beantragt in den Lebensmonaten 1 bis 10 Basiselterngeld.
          Elternteil 2 beantragt in den Lebensmonaten 11 bis 14 Basiselterngeld.
          Damit haben die Eltern ihren Anspruch auf 14 Monate Basiselterngeld
          ausgeschöpft.
        </p>

        <div className="mb-16">
          <Example
            title="Elternteil 1"
            months={[
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              null,
              null,
              null,
              null,
            ]}
          />
        </div>
        <div className="mb-32">
          <Example
            title="Elternteil 2"
            months={[
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              "Basis",
              "Basis",
              "Basis",
              "Basis",
            ]}
          />
        </div>

        <FurtherInformation />
      </DetailsElterngeldvariante>

      <DetailsElterngeldvariante
        summaryTitle="ElterngeldPlus"
        summaryClassName="bg-Plus text-black"
      >
        <ul className="mb-24 list-disc pl-24">
          <li>
            Statt eines Lebensmonats Basiselterngeld können Sie 2 Lebensmonate
            ElterngeldPlus bekommen – das heißt, halb so hoch wie
            Basiselterngeld, aber doppelter Zeitraum
          </li>
          <li>
            ElterngeldPlus kann auch nach dem 14. Lebensmonat bezogen werden, ab
            dann darf der Elterngeldbezug nicht mehr unterbrochen werden
          </li>
          <li>
            Besonders lohnend, wenn Eltern nach der Geburt in Teilzeit arbeiten
          </li>
        </ul>

        <h5 className="text-base">Für Paare und getrennt Erziehende gilt:</h5>

        <ul className="mb-24 list-disc pl-24">
          <li>
            Basiselterngeld und ElterngeldPlus können Sie miteinander
            kombinieren und abwechseln
          </li>
        </ul>

        <h5 className="text-base">Für Alleinerziehende gilt:</h5>

        <ul className="mb-32 list-disc pl-24">
          <li>28 Monate ElterngeldPlus können beantragt werden</li>
        </ul>

        <h5 className="text-base">
          Beispiele für Paare und getrennt Erziehende:
        </h5>

        <p className="mb-20 p-0">
          Elternteil 1 bekommt Basiselterngeld in den ersten 4 Lebensmonaten,
          Elternteil 2 in den Lebensmonaten 5 und 6. Beide Eltern bekommen
          ElterngeldPlus in den Lebensmonaten 7 bis 14. Damit haben die Eltern 6
          Monate Basiselterngeld und 16 Monate ElterngeldPlus (8 Monate
          ElterngeldPlus pro Elternteil) verbraucht; das entspricht 14 Monaten
          Basiselterngeld.
        </p>

        <div className="mb-16">
          <Example
            title="Elternteil 1"
            months={[
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              null,
              null,
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
            ]}
          />
        </div>
        <div className="mb-32">
          <Example
            title="Elternteil 2"
            months={[
              null,
              null,
              null,
              null,
              "Basis",
              "Basis",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
            ]}
          />
        </div>

        <p className="mb-20 p-0">
          Elternteil 1 bekommt Basiselterngeld in den Lebensmonaten 1 bis 6.
          Parallel bezieht der Elternteil 2 in Lebensmonat 1 Basiselterngeld und
          in den Lebensmonaten 2 und 3 ElterngeldPlus. In den Lebensmonaten 7
          bis 10 beziehen beide Elternteile ElterngeldPlus. Elternteil 2 bekommt
          in den Lebensmonaten 11 und 12 ElterngeldPlus und in Lebensmonat 13
          Basiselterngeld. Damit haben die Eltern ihren Anspruch auf 14 Monate
          Basiselterngeld ausgeschöpft.
        </p>

        <div className="mb-16">
          <Example
            title="Elternteil 1"
            months={[
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              null,
              null,
              null,
              null,
            ]}
          />
        </div>
        <div className="mb-32">
          <Example
            title="Elternteil 2"
            months={[
              "Basis",
              "Plus",
              "Plus",
              null,
              null,
              null,
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Basis",
              null,
            ]}
          />
        </div>

        <FurtherInformation />
      </DetailsElterngeldvariante>
      <DetailsElterngeldvariante
        summaryTitle="+ Partnerschaftsbonus"
        summaryClassName="bg-Bonus text-black"
      >
        <ul className="mb-24 list-disc pl-24">
          <li>
            Zusätzliche 2, 3 oder 4 Monate ElterngeldPlus – direkt aufeinander
            folgend
          </li>
          <li>
            Für den Partnerschaftsbonus muss man 24 bis 32 Stunden pro Woche in
            Teilzeit arbeiten
          </li>
        </ul>

        <h5 className="text-base">Für Paare und getrennt Erziehende gilt:</h5>

        <ul className="mb-24 list-disc pl-24">
          <li>Beide Elternteile nutzen den Partnerschaftsbonus gleichzeitig</li>
        </ul>

        <h5 className="text-base">Für Alleinerziehende gilt:</h5>

        <ul className="mb-32 list-disc pl-24">
          <li>Der Partnerschaftsbonus kann auch allein beantragt werden</li>
        </ul>

        <h5 className="text-base">
          Beispiele für Paare und getrennt Erziehende:
        </h5>

        <p className="mb-20 p-0">
          Das Elternteil 1 bezieht in den ersten 6 Lebensmonaten
          Basiselterngeld. Vom Lebensmonat 7 bis 10 bezieht der Elternteil 2
          Basiselterngeld. Die Elternteile beziehen parallel ElterngeldPlus in
          den Lebensmonaten 11 bis 14. In den Lebensmonaten 15 bis 18 nutzen die
          Elternteile den Partnerschaftsbonus.
        </p>

        <div className="mb-16">
          <Example
            title="Elternteil 1"
            months={[
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              null,
              null,
              null,
              null,
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Bonus",
              "Bonus",
              "Bonus",
              "Bonus",
            ]}
          />
        </div>
        <div className="mb-32">
          <Example
            title="Elternteil 2"
            months={[
              null,
              null,
              null,
              null,
              null,
              null,
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Bonus",
              "Bonus",
              "Bonus",
              "Bonus",
            ]}
          />
        </div>

        <h5 className="text-base">Ein Beispiel für Alleinerziehende:</h5>

        <p className="mb-20 p-0">
          Das alleinerziehende Elternteil bezieht in den ersten 8 Lebensmonaten
          Basiselterngeld. Danach bezieht es für 2 Monate kein Elterngeld. Im
          Lebensmonat 11 bis 16 bezieht es ElterngeldPlus, vom Lebensmonat 17
          bis 20 den Partnerschaftsbonus und vom Lebensmonat 21 bis 26 nochmals
          ElterngeldPlus.
        </p>

        <div className="mb-32">
          <Example
            title="Elternteil"
            months={[
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              "Basis",
              null,
              null,
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Bonus",
              "Bonus",
              "Bonus",
              "Bonus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
              "Plus",
            ]}
          />
        </div>

        <FurtherInformation />
      </DetailsElterngeldvariante>
    </>
  );
}
