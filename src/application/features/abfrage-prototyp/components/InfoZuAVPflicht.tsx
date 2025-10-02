import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

type Props = {
  readonly selbststaendig?: boolean;
};

export function InfoZuAVPflicht({ selbststaendig }: Props): ReactNode {
  return (
    <InfoText
      question="Was bedeutet das?"
      answer={
        <>
          {selbststaendig ? (
            <p>
              Mit einer selbstständigen Tätigkeit sind Sie in der Regel nicht in
              der gesetzlichen Arbeitslosenversicherung pflichtversichert. Sie
              zahlen keine Pflichtbeiträge und sind nur dann versichert, wenn
              Sie eine freiwillige Versicherung abgeschlossen haben – das ist
              jedoch eher die Ausnahme.
            </p>
          ) : (
            <>
              <p>
                Wenn Sie angestellt sind, zahlen Sie in der Regel automatisch
                Pflichtbeiträge zur gesetzlichen Arbeitslosenversicherung.
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
