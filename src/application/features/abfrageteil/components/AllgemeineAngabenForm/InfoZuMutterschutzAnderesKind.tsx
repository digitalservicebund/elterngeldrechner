import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuMutterschutzAnderesKind(): ReactNode {
  return (
    <InfoText
      question="Was bedeutet Mutterschutz für ein älteres Kind?"
      answer={
        <>
          <p>
            Sie können Zeiten übersprigen, in denen Sie im Mutterschutz für ein
            älteres Kind waren.
          </p>
        </>
      }
    />
  );
}
