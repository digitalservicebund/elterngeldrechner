import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuElternzeitAnderesKind(): ReactNode {
  return (
    <InfoText
      question="Was bedeutet Elterngeld für ein älteres Kind?"
      answer={
        <>
          <p>
            Sie können Zeiten übersprigen, in denen Sie Elterngeld für ein
            älteres Kind in seinen ersten 14 Lebensmonaten bekommen haben.
          </p>
        </>
      }
    />
  );
}
