import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZurGesetzlichenKrankenversicherung(): ReactNode {
  return (
    <InfoText
      className="pt-8"
      question="Was bedeutet das?"
      answer={
        <>
          <p>Sie wählen „Nein“, wenn Sie</p>
          <ul className="list-inside list-disc">
            <li>freiwillig gesetzlich versichert,</li>
            <li>familienversichert,</li>
            <li>privat versichert,</li>
            <li>in der freien Heilfürsorge oder</li>
            <li>nicht (in Deutschland) krankenversichert sind.</li>
          </ul>
        </>
      }
    />
  );
}
