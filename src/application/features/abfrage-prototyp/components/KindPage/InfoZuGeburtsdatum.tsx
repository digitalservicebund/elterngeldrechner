import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuGeburtsdatum(): ReactNode {
  return (
    <InfoText
      question="Was ist das tatsächliche Geburtsdatum?"
      answer={
        <>
          <p>
            Das tatsächliche Geburtsdatum Ihres Kindes ist das Datum, dass in
            die Geburtsurkunde eingetragen wird. Meistens werden Kinder aber
            nicht genau am errechneten Termin geboren.
          </p>
        </>
      }
    />
  );
}
