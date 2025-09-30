import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuRVPflicht(): ReactNode {
  return (
    <InfoText
      question="Was bedeutet das?"
      answer={
        <>
          <p>
            Mit einer selbstständigen Tätigkeit sind Sie in der Regel nicht in
            der gesetzlichen Rentenversicherung pflichtversichert.Sie leisten
            nur dann Pflichtbeiträge, wenn Sie zu einer der wenigen
            Berufsgruppen gehören, die rentenversicherungspflichtig sind – zum
            Beispiel Lehrer:innen, Pflegepersonen, Künstler:innen oder
            Handwerker:innen.
          </p>
        </>
      }
    />
  );
}
