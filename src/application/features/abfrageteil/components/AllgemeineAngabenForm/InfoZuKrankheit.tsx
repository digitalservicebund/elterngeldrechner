import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuKrankheit(): ReactNode {
  return (
    <InfoText
      question="Was bedeutet Krankheit in der Schwangerschaft?"
      answer={
        <>
          <p>
            Wenn Sie wegen Ihrer Schwangerschaft krank waren, können diese
            Monate auch ausgeklammert werden. Diesen Zeitraum müssen Sie durch
            ein ärztliches Attest nachweisen.
          </p>
        </>
      }
    />
  );
}
