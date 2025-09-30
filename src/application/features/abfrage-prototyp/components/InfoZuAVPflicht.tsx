import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuAVPflicht(): ReactNode {
  return (
    <InfoText
      question="Was bedeutet das?"
      answer={
        <>
          <p>
            Mit einer selbstständigen Tätigkeit sind Sie in der Regel nicht in
            der gesetzlichen Arbeitslosenversicherung pflichtversichert. Sie
            zahlen keine Pflichtbeiträge und sind nur dann versichert, wenn Sie
            eine freiwillige Versicherung abgeschlossen haben – das ist jedoch
            eher die Ausnahme.
          </p>
        </>
      }
    />
  );
}
