import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuKVPflicht(): ReactNode {
  return (
    <InfoText
      question="Was bedeutet das?"
      answer={
        <>
          <p>
            Mit einer selbstständigen Tätigkeit sind Sie in der Regel nicht
            automatisch gesetzlich pflichtversichert.
          </p>
          <p className="pt-20">Sie wählen „Nein“, wenn Sie</p>
          <ul className="list-inside list-disc ml-10">
            <li>freiwillig gesetzlich versichert,</li>
            <li>familienversichert,</li>
            <li>privat versichert,</li>
            <li>nicht (in Deutschland) krankenversichert sind.</li>
          </ul>
          <p>
            Hinweis: In diesem Fall müssen Sie entsprechende Beiträge für Ihre
            Krankenversicherung selber einplanen, da sie nicht automatisch
            berücksichtigt werden.
          </p>
        </>
      }
    />
  );
}
