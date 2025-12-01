import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuET(): ReactNode {
  return (
    <InfoText
      question="Was ist der errechnete Entbindungstermin?"
      answer={
        <>
          <p>
            Den errechneten Entbindungstermin finden Sie in Ihrem Mutterpass
            unter dem Abschnitt &quot;Voraussichtlicher Entbindungstermin&quot;
            oder auf den Ultraschallberichten.
          </p>
        </>
      }
    />
  );
}
