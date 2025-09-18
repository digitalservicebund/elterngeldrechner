import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuKrankheit(): ReactNode {
  return (
    <InfoText
      question="Was bedeutet Krankheit in der Schwangerschaft?"
      answer={
        <>
          <p>
            Sie können Zeiten übersprigen, in denen Sie aufgrund der
            Schwangerschaft krank waren und weniger verdient haben.
          </p>
        </>
      }
    />
  );
}
