import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

type Props = {
  readonly selbststaendig?: boolean;
};

export function InfoZuRVPflicht({ selbststaendig }: Props): ReactNode {
  return (
    <InfoText
      question="Was bedeutet das?"
      answer={
        <>
          {selbststaendig ? (
            <p>
              Mit einer selbstständigen Tätigkeit sind Sie in der Regel nicht in
              der gesetzlichen Rentenversicherung pflichtversichert.Sie leisten
              nur dann Pflichtbeiträge, wenn Sie zu einer der wenigen
              Berufsgruppen gehören, die rentenversicherungspflichtig sind – zum
              Beispiel Lehrer:innen, Pflegepersonen, Künstler:innen oder
              Handwerker:innen.
            </p>
          ) : (
            <>
              <p>
                Wenn Sie angestellt sind, zahlen Sie in der Regel automatisch
                Pflichtbeiträge zur gesetzlichen Rentenversicherung.
              </p>
              <p className="pt-20">
                Sie wählen „Nein“, wenn Sie keine Pflichtbeiträge zahlen, zum
                Beispiel weil Sie:
              </p>
              <ul className="list-inside list-disc ml-10">
                <li>verbeamtet sind,</li>
                <li>selbstständig tätig sind,</li>
                <li>
                  geringfügig beschäftigt (Minijob ohne
                  Rentenversicherungspflicht) sind,
                </li>
                <li>
                  oder aus anderen Gründen von der Versicherungspflicht befreit
                  wurden.
                </li>
              </ul>
            </>
          )}
        </>
      }
    />
  );
}
