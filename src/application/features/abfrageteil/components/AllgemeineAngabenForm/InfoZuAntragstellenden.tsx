import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuAntragstellenden(): ReactNode {
  return (
    <InfoText
      question="Welchen Vorteil hat es, wenn beide Elternteile Elterngeld bekommen?"
      answer={
        <>
          <p>
            Wenn beide Elternteile Elterngeld bekommen, gibt es mehr und länger
            Elterngeld. Beide Eltern können sich die Betreuung ihres Kindes
            untereinander aufteilen.
          </p>
        </>
      }
    />
  );
}
