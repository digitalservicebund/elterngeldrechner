import CloseIcon from "@digitalservicebund/icons/Close";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import { ReactNode } from "react";
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
    content: <div className="">TODO</div>,
  },
  {
    id: "wie-lange",
    headline: "Wie lange bekommen Sie Elterngeld?",
    content: <div className="">TODO</div>,
  },
  {
    id: "elterngeld",
    headline: "Wann lohnt sich welches Elterngeld für Sie?",
    content: <div className="">TODO</div>,
  },
  {
    id: "aufteilung",
    headline: "Wie teilen Sie Elterngeld auf?",
    content: <div className="">TODO</div>,
  },
  {
    id: "bonus",
    headline: "Mit dem Partnerschaftsbonus zusätzlich Elterngeld bekommen",
    content: <div className="">TODO</div>,
  },
];
