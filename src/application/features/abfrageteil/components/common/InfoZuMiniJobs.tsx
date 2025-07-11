import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuMiniJobs(): ReactNode {
  return (
    <InfoText
      question="Was ist ein Mini-Job?"
      answer={
        <>
          <span>Mini-Job</span>
          <ul className="list-inside list-disc">
            <li>geringfügige Beschäftigung bis maximal 556 Euro monatlich</li>
            <li>vor dem 01.01.2025: bis maximal 538 Euro monatlich </li>
            <li>vor dem 01.01.2024: bis maximal 520 Euro monatlich </li>
            <li>vor dem 01.10.2022: bis maximal 450 Euro monatlich</li>
          </ul>
        </>
      }
    />
  );
}
