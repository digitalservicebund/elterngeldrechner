import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuWeitereTaetigkeiten(): ReactNode {
  return (
    <InfoText
      question="Was sind weitere Tätigkeiten?"
      answer={
        <>
          <p>
            Hier sind alle zusätzlichen Tätigkeiten gemeint, aus denen Sie im
            Bemessungszeitraum Einkommen bezogen haben.
          </p>
          <p>Dazu zählen:</p>
          <ul className="ml-10 list-inside list-disc">
            <li>Angestelltentätigkeiten (auch Teilzeit oder Minijobs)</li>
            <li>Weiteres Einkommen durch Selbstständigkeit</li>
          </ul>
        </>
      }
    />
  );
}
