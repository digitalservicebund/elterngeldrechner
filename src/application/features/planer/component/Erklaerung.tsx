import CloseIcon from "@digitalservicebund/icons/Close";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import { ReactNode } from "react";
import { Example } from "./Example";
import { Legende } from "./Legende";
import { Button } from "@/application/components";

type Props = {
  readonly onClose: () => void;
};

export function Erklaerung({ onClose }: Props): ReactNode {
  const closeButton = (
    <Button
      onClick={onClose}
      iconBefore={<CloseIcon />}
      label="Informationen schließen"
    />
  );

  return (
    <div>
      <div className="my-32">{closeButton}</div>
      <div>
        <div className="flex flex-col gap-y-80">
          <div className="flex flex-col gap-y-56">
            <p>
              Nutzen Sie die folgenden Erklärungen und Beispiele, um Ihr
              Elterngeld zu planen. Im nächsten Schritt entscheiden Sie, welches
              Elterngeld für Sie passt.
            </p>

            <ul className="flex flex-col gap-y-16">
              {content.map((content) => {
                const onClick = () => {
                  const contentEl = document.getElementById(content.id);
                  if (contentEl) {
                    contentEl.scrollIntoView();
                  }
                };
                return (
                  <li key={content.id}>
                    <Button
                      buttonStyle="link"
                      iconBefore={<ExpandMoreIcon />}
                      onClick={onClick}
                      label={content.headline}
                      className="text-left !text-base !text-black"
                    />
                  </li>
                );
              })}
            </ul>

            <div>
              <p>
                Ihr Elterngeld planen Sie Lebensmonat für Lebensmonat.
                <br />
                Der 1. Lebensmonat beginnt mit der Geburt von Ihrem Kind.
                <br />
                Zum Beispiel:
                <br />
                Ihr Kind wird am 10. März geboren.
                <br />
                Der 1. Lebensmonat ist der 10. März bis zum 09. April
                <br />
                Der 2. Lebensmonat ist der 10. April bis zum 09. Mai
                <br />
                Der 3. Lebensmonat ist der 10. Mai bis zum 09. Juni
              </p>
            </div>
          </div>

          {content.map((content) => {
            return (
              <div key={content.id} id={content.id} className="scroll-mt-160">
                <h3>{content.headline}</h3>

                {content.content}
              </div>
            );
          })}
          <p>
            Sie möchten mehr über Elterngeld erfahren?
            <br />
            Dann besuchen Sie die{" "}
            <a
              href="https://familienportal.de/familienportal/familienleistungen/elterngeld"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Seite über Elterngeld im Familienportal
            </a>
          </p>
        </div>
      </div>
      <div className="my-24">{closeButton}</div>
    </div>
  );
}

const content = [
  {
    id: "wie-viel",
    headline: "Wie viel Elterngeld bekommen Sie?",
    content: (
      <div>
        <p>
          Wie viel Elterngeld Sie bekommen, hängt vor allem von Ihrem Einkommen
          ab und davon, welches Elterngeld Sie wählen.
        </p>
        <h4>Basiselterngeld:</h4>
        <ul className="list-inside list-disc">
          <li>
            Sie bekommen normalerweise 65 Prozent vom Netto-Einkommen, das Sie
            vor der Geburt hatten.
          </li>
          <li>
            Sie bekommen je nach Einkommen mindestens 300 Euro und höchstens
            1800 Euro im Lebensmonat.
          </li>
        </ul>
        <h4>ElterngeldPlus:</h4>
        <ul className="list-inside list-disc">
          <li>ElterngeldPlus ist halb so hoch wie das Basiselterngeld.</li>
          <li>
            Das heißt, Sie bekommen mindestens 150 Euro und höchstens 900 Euro
            im Lebensmonat.
          </li>
        </ul>
        <h4>
          Elterngeld pro Lebensmonat, wenn Sie in den Lebensmonaten kein
          Einkommen haben
        </h4>

        <p className="flex h-[400px] items-center justify-center bg-grey">
          TODO Tabelle
        </p>

        <p>
          Wenn Sie schon Kinder haben oder Mehrlinge erwarten, können Sie mehr
          Elterngeld bekommen.
        </p>
        <p>
          Sie bekommen auch Elterngeld, wenn Sie nach der Geburt arbeiten. Durch
          das Einkommen ist Ihr Elterngeld dann niedriger. Sie dürfen bis zu 32
          Stunden in der Woche arbeiten.
        </p>
      </div>
    ),
  },
  {
    id: "wie-lange",
    headline: "Wie lange bekommen Sie Elterngeld?",
    content: (
      <div>
        <p>
          Basiselterngeld und ElterngeldPlus können Sie für unterschiedlich
          lange Zeiträume bekommen. In diesen Zeiträumen können Sie auswählen,
          wann Sie es nehmen. Sie können es auch unterbrechen.
        </p>
        <h4>Basiselterngeld:</h4>
        <ul className="list-inside list-disc">
          <li>Sie können es bis zum 14. Lebensmonat nehmen.</li>
        </ul>
        <h4>ElterngeldPlus:</h4>
        <ul className="list-inside list-disc">
          <li>Sie können es bis zum 32. Lebensmonat nehmen.</li>
          <li>
            Ab dem 15. Lebensmonat müssen Sie es ohne Unterbrechung nehmen. Sie
            können sich dann mit dem anderen Elternteil abwechseln.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "elterngeld",
    headline: "Wann lohnt sich welches Elterngeld für Sie?",
    content: (
      <div>
        <h4>Basiselterngeld:</h4>
        <p>Es lohnt sich, wenn</p>
        <ul className="list-inside list-disc">
          <li>Sie eine Zeit lang nicht arbeiten.</li>
          <li>Sie die größte finanzielle Unterstützung brauchen.</li>
        </ul>
        <h4>ElterngeldPlus:</h4>
        <p>Es lohnt sich, wenn</p>
        <ul className="list-inside list-disc">
          <li>
            Sie nach der Geburt nicht mehr als 32 Stunden in der Woche arbeiten.
          </li>
          <li>Sie Elterngeld über längere Zeit bekommen wollen.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "aufteilung",
    headline: "Wie teilen Sie Elterngeld auf?",
    content: (
      <div>
        <h4>Basiselterngeld:</h4>
        <p>Wenn Sie gemeinsam ein Kind erziehen:</p>
        <ul className="list-inside list-disc">
          <li>Sie können bis zu 14 Lebensmonate Basiselterngeld aufteilen.</li>
          <li>
            Ein Elternteil kann maximal 12 Lebensmonate Basiselterngeld
            bekommen.
          </li>
          <li>
            Jeder Elternteil muss mindestens 2 Lebensmonate Basiselterngeld
            nehmen.
          </li>
          <li>
            Sie können in der Regel bis Lebensmonat 12 einen Lebensmonat
            gleichzeitig Basiselterngeld nehmen.
          </li>
        </ul>
        <p>
          Wenn Sie alleinerziehend sind, können Sie bis zu 14 Lebensmonate
          Basiselterngeld bekommen.
        </p>

        <div className="bg-off-white p-24">
          <p>
            <strong>
              Beispiele für die Aufteilung von 14 Lebensmonaten Basiselterngeld:
            </strong>
          </p>
          <ul className="mb-24 list-inside list-disc">
            <li>
              Elternteil 1 nimmt in den Lebensmonaten 1 bis 7 Basiselterngeld.
            </li>
            <li>
              Elternteil 2 nimmt in den Lebensmonaten 7 bis 13 Basiselterngeld.
            </li>
            <li>In Lebensmonat 7 nehmen beide Basiselterngeld.</li>
          </ul>
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
          <Legende showBasis showKeinElterngeld />
        </div>

        <h4>ElterngeldPlus:</h4>
        <p>Wenn Sie Ihr Kind gemeinsam oder allein erziehen:</p>
        <ul className="list-inside list-disc">
          <li>
            Sie können jeden Lebensmonat Basiselterngeld in 2 Lebensmonate
            ElterngeldPlus tauschen. Das gilt nicht für die Lebensmonate, die
            Sie im Mutterschutz sind.
          </li>
          <li>Sie können dann doppelt so lange ElterngeldPlus bekommen.</li>
        </ul>
        <p>
          Elternteile können im selben Lebensmonat unterschiedliches Elterngeld
          bekommen.
        </p>

        <div className="bg-off-white p-24">
          <p>
            <strong>
              Beispiel für die Aufteilung von Basiselterngeld und
              ElterngeldPlus:
            </strong>
          </p>
          <ul className="mb-24 list-inside list-disc">
            <li>
              Elternteil 1 nimmt Basiselterngeld in den Lebensmonaten 1 bis 6.
            </li>
            <li>
              Zur gleichen Zeit nimmt Elternteil 2 in Lebensmonat 1
              Basiselterngeld und in den Lebensmonaten 2 und 3 ElterngeldPlus.
            </li>
            <li>
              In den Lebensmonaten 7 bis 10 nehmen beide Elternteile
              ElterngeldPlus
            </li>
            <li>
              Elternteil 2 nimmt in den Lebensmonaten 11 und 12 ElterngeldPlus
              und in Lebensmonat 13 Basiselterngeld.
            </li>
          </ul>
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
          <Legende showBasis showPlus showKeinElterngeld />
        </div>
      </div>
    ),
  },
  {
    id: "bonus",
    headline: "Mit dem Partnerschaftsbonus zusätzlich Elterngeld bekommen",
    content: (
      <div>
        <p>
          Der Partnerschaftsbonus ist zusätzliches Elterngeld.
          <br />
          Sie bekommen mindestens 150 Euro im Lebensmonat.
        </p>
        <p>
          Sie können ihn bekommen, wenn Ihre Arbeitszeit nach der Geburt
          durchschnittlich
        </p>
        <ul className="list-inside list-disc">
          <li>nicht weniger als 24 Stunden in der Woche.</li>
          <li>und nicht mehr als 32 Stunden in der Woche ist.</li>
        </ul>
        <p>
          Wenn Sie Ihr Kind gemeinsam erziehen, müssen beide Elternteile ihn
          gleichzeitig nehmen.
        </p>
        <p>
          Sie können den Partnerschaftsbonus für mindestens 2 und höchstens 4
          Lebensmonate nehmen. Sie sollen ihn nicht unterbrechen.
        </p>
        <p>
          Sie können den Partnerschaftsbonus bis zum 32. Lebensmonat bekommen.
        </p>

        <div className="bg-off-white p-24">
          <p>
            <strong>
              Beispiel für Aufteilung von Basiselterngeld, ElterngeldPlus und
              Partnerschaftsbonus:
            </strong>
          </p>
          <ul className="mb-24 list-inside list-disc">
            <li>
              Elternteil 1 nimmt in den ersten 6 Lebensmonaten Basiselterngeld.
            </li>
            <li>
              Elternteil 2 nimmt von Lebensmonat 7 bis 10 Basiselterngeld.
            </li>
            <li>
              In den Lebensmonaten 11 bis 14 nehmen beide Elternteile
              ElterngeldPlus.
            </li>
            <li>
              In den Lebensmonaten 15 bis 18 nehmen beide Elternteile den
              Partnerschaftsbonus.
            </li>
          </ul>
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
          <div className="mb-40">
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
          <Legende showBasis showPlus showBonus showKeinElterngeld />
        </div>
      </div>
    ),
  },
];
